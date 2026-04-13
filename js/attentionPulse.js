// ── Attention Pulse ──────────────────────────────────
// IntersectionObserver animation that plays once when
// an element scrolls into view.

(function () {
  function playRipple(el) {
    if (getComputedStyle(el).position === "static") el.style.position = "relative";
    var prevOverflow = el.style.overflow;
    el.style.overflow = "hidden";

    var rect = el.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;

    var dot = document.createElement("span");
    dot.style.cssText =
      "position:absolute;left:calc(50% - " +
      size / 2 +
      "px);top:calc(50% - " +
      size / 2 +
      "px);" +
      "width:" +
      size +
      "px;height:" +
      size +
      "px;border-radius:50%;background:currentColor;" +
      "pointer-events:none;animation:attention-ripple 700ms ease forwards";

    el.appendChild(dot);
    setTimeout(function () {
      dot.remove();
      el.style.overflow = prevOverflow;
    }, 750);
  }

  function attentionPulse(el, opts, onDone) {
    opts = opts || {};
    var childSelector = opts.childSelector;
    var observeTarget = opts.observeTarget;
    var threshold = opts.threshold || 1.0;
    var duration = opts.duration || 1600;
    var hintStyle = opts.hintStyle;

    var child = childSelector ? el.querySelector(childSelector) : null;
    var fired = false;

    var observer = new IntersectionObserver(
      function (entries) {
        if (
          fired ||
          !entries.some(function (e) {
            return e.isIntersecting;
          })
        )
          return;
        fired = true;
        observer.disconnect();

        el.style.animation = "none";
        el.getBoundingClientRect(); // force reflow
        el.style.animation = "attention-pulse " + duration + "ms ease forwards";
        if (child) child.style.animation = "attention-pulse-child " + duration + "ms ease forwards";

        setTimeout(function () {
          el.style.animation = "";
          if (child) child.style.animation = "";
          if (hintStyle === "ripple") playRipple(el);
          if (onDone) onDone();
        }, duration);
      },
      { threshold: threshold },
    );

    observer.observe(observeTarget || el);
  }

  var STORAGE_KEY = "seen-pulses";

  function getSeenPulses() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function markSeen(id) {
    var seen = getSeenPulses();
    seen[id] = true;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seen));
    } catch (e) {}
  }

  function pulseOnce(el, opts) {
    if (!el || el._pulseInit) return;
    el._pulseInit = true;
    var id = el.id || opts._pulseId;
    if (id && getSeenPulses()[id]) return;
    attentionPulse(el, opts, function () {
      if (id) markSeen(id);
    });
  }

  // ── Auto-init via data attributes ────────────────────
  // Usage:  data-pulse                     — basic pulse
  //         data-pulse-child=".icon"       — also animate a child
  //         data-pulse-style="ripple"      — play ripple after pulse
  //         data-pulse-observe="#wrapper"   — observe a parent instead
  //         data-pulse-first               — pulse only the first child match
  //
  // Examples:
  //   <div data-pulse data-pulse-child=".expand-icon" data-pulse-style="ripple">
  //   <div id="grid" data-pulse-first=".company-cell" data-pulse-child=".company-logo" data-pulse-style="ripple">

  function initPulses() {
    document.querySelectorAll("[data-pulse]").forEach(function (el, i) {
      pulseOnce(el, {
        _pulseId: "pulse-" + i,
        childSelector: el.dataset.pulseChild || null,
        hintStyle: el.dataset.pulseStyle || null,
      });
    });

    document.querySelectorAll("[data-pulse-first]").forEach(function (el, i) {
      var selector = el.dataset.pulseFirst;
      var child = selector ? el.querySelector(selector) : null;
      if (child) {
        pulseOnce(child, {
          _pulseId: el.id || "pulse-first-" + i,
          childSelector: el.dataset.pulseChild || null,
          observeTarget: el,
          hintStyle: el.dataset.pulseStyle || null,
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPulses);
  } else {
    initPulses();
  }

  window.initPulses = initPulses;
})();
