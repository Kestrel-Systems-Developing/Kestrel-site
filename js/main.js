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

/* ---- Art-direction layer: header, systems index, solutions tabs ---- */
(function () {
  "use strict";
  var doc = document, reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = doc.querySelector(".site-header");
  var stick = function () { if (header) header.classList.toggle("is-stuck", scrollY > 8); };
  addEventListener("scroll", stick, { passive: true }); stick();

  /* Systems index: one row open at a time; the open row is always visible */
  var rows = [].slice.call(doc.querySelectorAll(".index .row"));
  rows.forEach(function (r) {
    var b = r.querySelector(".row__bar");
    b.addEventListener("click", function () {
      rows.forEach(function (x) { x.classList.remove("is-open"); x.querySelector(".row__bar").setAttribute("aria-expanded", "false"); });
      r.classList.add("is-open"); b.setAttribute("aria-expanded", "true");
    });
  });

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
    addEventListener("hashchange", function () { var h = location.hash.slice(1); if (names[h]) show(h, true); });
    var h0 = location.hash.slice(1);
    show(names[h0] ? h0 : "lms", false);
    if (names[h0]) setTimeout(function () { show(h0, true); }, 60);
  }
})();
