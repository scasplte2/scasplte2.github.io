/* James Aman — site interactions: theme toggle, scroll reveal, active nav */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---- theme toggle (initial theme is set inline in <head>) ---- */
  var toggle = document.getElementById("themeToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---- de-obfuscate email links (kept out of raw HTML to deter scrapers) ---- */
  try {
    var emails = document.querySelectorAll(".js-email");
    for (var i = 0; i < emails.length; i++) {
      var el = emails[i];
      var addr = atob(el.getAttribute("data-e"));
      el.setAttribute("href", "mailto:" + addr);
      el.removeAttribute("data-e");
      var label = el.querySelector(".js-email-text");
      // display the clean address (strip the +tag); the mailto keeps it for tracking
      if (label) label.textContent = addr.replace(/\+[^@]+(?=@)/, "");
    }
  } catch (e) {}

  /* ---- current year in footer ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- nav: border on scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- scroll reveal ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealables = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---- active nav link based on section in view ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav-links a[href^='#']"));
  var map = {};
  links.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var sec = document.getElementById(id);
    if (sec) map[id] = a;
  });
  var sections = Object.keys(map).map(function (id) { return document.getElementById(id); });
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          links.forEach(function (a) { a.classList.remove("active"); });
          var active = map[e.target.id];
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
