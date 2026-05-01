// ── Carousel ─────────────────────────────────────────
// Swipeable image carousel with dots, prev/next buttons,
// mouse/touch drag, and rubber-band edges.

function initCarousel(carousel) {
  if (carousel._carouselCleanup) carousel._carouselCleanup();

  var track = carousel.querySelector(".carousel-track");
  var dots = carousel.querySelector(".carousel-dots");
  if (!track) return;

  var total = track.querySelectorAll("img").length;
  if (!total) return;

  var current = 0;
  function w() {
    return carousel.getBoundingClientRect().width;
  }

  track.style.transition = "none";
  track.style.transform = "translateX(0)";

  function wrapIndex(i) {
    return ((i % total) + total) % total;
  }

  function syncDots() {
    if (!dots) return;
    dots.querySelectorAll(".carousel-dot").forEach(function (d, j) {
      d.classList.toggle("active", j === current);
    });
  }

  function goTo(i) {
    var prev = current;
    var next = wrapIndex(i);
    var isForwardWrap = prev === total - 1 && next === 0 && i > prev;
    var isBackwardWrap = prev === 0 && next === total - 1 && i < prev;

    current = next;

    // Avoid long cross-track animation when wrapping around ends.
    track.style.transition = isForwardWrap || isBackwardWrap ? "none" : "transform 0.35s ease";
    track.style.transform = "translateX(" + -current * 100 + "%)";
    syncDots();
  }

  // Dots
  if (dots) {
    dots.innerHTML = "";
    for (var i = 0; i < total; i++) {
      (function (idx) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot" + (idx === 0 ? " active" : "");
        dot.setAttribute("aria-label", "Slide " + (idx + 1));
        dot.addEventListener("click", function (e) {
          e.stopPropagation();
          goTo(idx);
        });
        dots.appendChild(dot);
      })(i);
    }
  }

  // Prev / Next
  function addNavBtn(cls, points, offset) {
    var btn = document.createElement("button");
    btn.className = "carousel-btn " + cls;
    btn.innerHTML =
      '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="' +
      points +
      '"/></svg>';
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      goTo(current + offset);
    });
    carousel.appendChild(btn);
  }
  addNavBtn("prev", "15 18 9 12 15 6", -1);
  addNavBtn("next", "9 18 15 12 9 6", +1);

  // Drag / Swipe
  var startX = 0,
    deltaX = 0,
    dragging = false;
  var ac = new AbortController();
  var signal = ac.signal;
  carousel._carouselCleanup = function () {
    ac.abort();
  };

  function dragStart(x) {
    startX = x;
    dragging = true;
    deltaX = 0;
    track.style.transition = "none";
  }

  function dragMove(x) {
    if (!dragging) return;
    deltaX = x - startX;
    track.style.transform = "translateX(calc(" + -current * 100 + "% + " + deltaX + "px))";
  }

  function dragEnd() {
    if (!dragging) return;
    dragging = false;
    var threshold = w() * 0.2;
    if (deltaX > threshold) goTo(current - 1);
    else if (deltaX < -threshold) goTo(current + 1);
    else goTo(current);
    deltaX = 0;
  }

  carousel.addEventListener(
    "mousedown",
    function (e) {
      dragStart(e.clientX);
    },
    { signal: signal },
  );
  window.addEventListener(
    "mousemove",
    function (e) {
      dragMove(e.clientX);
    },
    { signal: signal },
  );
  window.addEventListener("mouseup", dragEnd, { signal: signal });
  carousel.addEventListener(
    "dragstart",
    function (e) {
      e.preventDefault();
    },
    { signal: signal },
  );

  carousel.addEventListener(
    "touchstart",
    function (e) {
      dragStart(e.touches[0].clientX);
    },
    { passive: true, signal: signal },
  );
  carousel.addEventListener(
    "touchmove",
    function (e) {
      dragMove(e.touches[0].clientX);
    },
    { passive: true, signal: signal },
  );
  carousel.addEventListener("touchend", dragEnd, { signal: signal });
}

function initCarouselsIn(container) {
  container.querySelectorAll("[data-carousel]").forEach(initCarousel);
}
