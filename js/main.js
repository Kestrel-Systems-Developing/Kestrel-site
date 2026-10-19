/* Kestrel Systems — site behaviour. No dependencies, no backend. */
(function () {
  "use strict";
  var doc = document;

  /* ---- Mobile navigation ---- */
  var toggle = doc.querySelector(".nav-toggle");
  var nav = doc.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Footer year ---- */
  var yr = doc.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Pricing: values come from js/pricing.js (single place to edit) ---- */
  var P = window.KESTREL_PRICING;
  function money(v) { return P.currency + Number(v).toLocaleString("en-US"); }
  function lookup(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? o : o[k]; }, P);
  }
  if (P) {
    doc.querySelectorAll("[data-price]").forEach(function (el) {
      var v = lookup(el.getAttribute("data-price"));
      if (typeof v === "number") el.textContent = money(v);
    });

    /* SMS monthly / yearly toggle */
    var billingButtons = doc.querySelectorAll("[data-billing]");
    var setBilling = function (mode) {
      billingButtons.forEach(function (b) {
        b.setAttribute("aria-pressed", String(b.getAttribute("data-billing") === mode));
      });
      doc.querySelectorAll("[data-sms-tier]").forEach(function (card) {
        var t = P.sms[card.getAttribute("data-sms-tier")];
        var amt = card.querySelector(".js-amt");
        var unit = card.querySelector(".js-unit");
        var save = card.querySelector(".js-save");
        var link = card.querySelector("a.btn");
        if (mode === "yearly") {
          amt.textContent = money(t.yearly);
          unit.textContent = "/year";
          save.textContent = "Save " + money(t.monthly * 12 - t.yearly) + " vs monthly";
        } else {
          amt.textContent = money(t.monthly);
          unit.textContent = "/month";
          save.textContent = "";
        }
        if (link) {
          var u = new URL(link.getAttribute("href"), location.href);
          u.searchParams.set("billing", mode);
          link.setAttribute("href", u.pathname.split("/").pop() + u.search);
        }
      });
    };
    if (billingButtons.length) {
      billingButtons.forEach(function (b) {
        b.addEventListener("click", function () { setBilling(b.getAttribute("data-billing")); });
      });
      setBilling("monthly");
    }
  }

  /* ---- Marketplace filter (all / self-hosted / SaaS) ---- */
  var chips = doc.querySelectorAll("[data-filter]");
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        doc.querySelectorAll("[data-deploy]").forEach(function (card) {
          var tokens = card.getAttribute("data-deploy").split(" ");
          card.hidden = !(f === "all" || tokens.indexOf(f) !== -1);
        });
      });
    });
  }

  /* ---- Contact form ----
     With no backend, the form opens the visitor's email app with the message
     prefilled. To switch to a real endpoint later, replace the body of
     sendMessage() with a fetch() to your form service (Formspree, Netlify
     Forms, your own API) — nothing else on the page needs to change. */
  var form = doc.getElementById("contact-form");
  if (form) {
    var params = new URLSearchParams(location.search);
    var fill = function (id, v) { var el = doc.getElementById(id); if (el && v) el.value = v; };
    fill("interest", params.get("product"));
    fill("plan", params.get("plan"));
    if (params.get("billing")) {
      var plan = doc.getElementById("plan");
      if (plan && plan.value) plan.value += " (" + params.get("billing") + ")";
    }

    var status = doc.getElementById("form-status");
    var TO = form.getAttribute("data-to");

    var sendMessage = function (data) {
      var subject = "Enquiry: " + (data.interest || "General") + (data.plan ? " – " + data.plan : "");
      var body = [
        "Name: " + data.name,
        "Company: " + data.company,
        "Email: " + data.email,
        "Phone / WhatsApp: " + data.phone,
        "Interested in: " + data.interest,
        "Plan: " + data.plan,
        "",
        data.message
      ].join("\n");
      window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      return body;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      var body = sendMessage(data);
      status.hidden = false;
      status.innerHTML = "Your email app should now open with the message ready to send to <strong>" + TO +
        "</strong>. If nothing opens, <button type=\"button\" class=\"btn btn--outline btn--sm\" id=\"copy-msg\">copy the message</button> and email it to us, or reach us on WhatsApp.";
      var copy = doc.getElementById("copy-msg");
      copy.addEventListener("click", function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(body).then(function () { copy.textContent = "Copied"; });
        }
      });
    });
  }

  /* ---- Scroll reveal (content stays visible if JS or IntersectionObserver is unavailable) ---- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    doc.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }
})();

/* ---- Creative layer: progress bar, focus spotlight, tilt, tabs, timeline ---- */
(function () {
  "use strict";
  var doc = document, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var bar = doc.createElement("div"); bar.className = "scroll-bar"; doc.body.appendChild(bar);
  var header = doc.querySelector(".site-header");
  var onScroll = function () {
    var h = doc.documentElement.scrollHeight - innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? scrollY / h : 0) + ")";
    if (header) header.classList.toggle("is-stuck", scrollY > 8);
  };
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  if (!reduce) {
    var hero = doc.querySelector(".hero");
    if (hero) hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--mx", (e.clientX - r.left) + "px");
      hero.style.setProperty("--my", (e.clientY - r.top) + "px");
    });
    var mock = doc.querySelector(".hero .mock");
    if (mock) {
      mock.parentNode.classList.add("mock-wrap-float");
      mock.addEventListener("pointermove", function (e) {
        var r = mock.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        mock.style.transform = "rotateY(" + (x * 14) + "deg) rotateX(" + (-y * 10) + "deg)";
      });
      mock.addEventListener("pointerleave", function () { mock.style.transform = ""; });
    }
    doc.querySelectorAll(".pcard").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty("--px", (e.clientX - r.left) + "px");
        c.style.setProperty("--py", (e.clientY - r.top) + "px");
      });
    });
  }

  /* Timeline draws when it scrolls into view */
  var tl = doc.querySelector(".timeline");
  if (tl && "IntersectionObserver" in window) {
    new IntersectionObserver(function (en, o) {
      if (en[0].isIntersecting) { tl.style.setProperty("--draw", 1); o.disconnect(); }
    }, { threshold: .3 }).observe(tl);
  } else if (tl) tl.style.setProperty("--draw", 1);

  /* Solutions: one product's plans at a time, deep-linkable (#lms, #qrms, #sms) */
  var blocks = [].slice.call(doc.querySelectorAll(".price-block"));
  if (blocks.length > 1) {
    var names = { lms: "Kestrel LMS", qrms: "Kestrel QRMS", sms: "Kestrel SMS" };
    var tabs = doc.createElement("div"); tabs.className = "product-tabs"; tabs.setAttribute("role", "tablist");
    blocks.forEach(function (b) {
      var t = doc.createElement("button"); t.type = "button"; t.setAttribute("role", "tab");
      t.textContent = names[b.id] || b.id; t.dataset.target = b.id; tabs.appendChild(t);
    });
    blocks[0].parentNode.insertBefore(tabs, blocks[0]);
    var show = function (id, scroll) {
      if (!names[id]) id = "lms";
      blocks.forEach(function (b) { b.hidden = b.id !== id; });
      tabs.querySelectorAll("button").forEach(function (t) { t.setAttribute("aria-selected", String(t.dataset.target === id)); });
      blocks.filter(function (b) { return b.id === id; })[0].querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
      if (scroll) doc.getElementById("pricing").scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    };
    tabs.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      history.replaceState(null, "", "#" + t.dataset.target); show(t.dataset.target, false);
    });
    var fromHash = function (scroll) { var h = location.hash.slice(1); if (names[h]) show(h, scroll); };
    addEventListener("hashchange", function () { fromHash(true); });
    show(names[location.hash.slice(1)] ? location.hash.slice(1) : "lms", false);
    if (names[location.hash.slice(1)]) setTimeout(function () { fromHash(true); }, 60);
  }
})();
