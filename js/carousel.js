// ── Carousel ─────────────────────────────────────────
// Swipeable image carousel with dots, prev/next buttons,
// mouse/touch drag, and rubber-band edges.

function initCarousel(carousel) {
  if (carousel._carouselCleanup) carousel._carouselCleanup();

  var track = carousel.querySelector(".carousel-track");
  var dots = carousel.querySelector(".carousel-dots");
  if (!track) return;

  carousel.querySelectorAll(".carousel-btn").forEach(function (btn) {
    btn.remove();
  });

  var originals = Array.from(track.querySelectorAll("img:not([data-carousel-clone])"));
  if (!originals.length) {
    originals = Array.from(track.querySelectorAll("img"));
  }

  var total = originals.length;
  if (!total) return;

  var firstClone = originals[0].cloneNode(true);
  firstClone.setAttribute("data-carousel-clone", "true");
  var lastClone = originals[total - 1].cloneNode(true);
  lastClone.setAttribute("data-carousel-clone", "true");

  track.innerHTML = "";
  track.appendChild(lastClone);
  originals.forEach(function (img) {
    img.removeAttribute("data-carousel-clone");
    track.appendChild(img);
  });
  track.appendChild(firstClone);

  var current = 0;
  var visualIndex = 1;
  var draggingBaseIndex = 1;

  function w() {
    return carousel.getBoundingClientRect().width;
  }

  function setTrackPosition(index, animated) {
    track.style.transition = animated ? "transform 0.35s ease" : "none";
    track.style.transform = "translateX(" + -index * 100 + "%)";
  }

  setTrackPosition(visualIndex, false);

  function wrapIndex(i) {
    return ((i % total) + total) % total;
  }

  function syncDots() {
    if (!dots) return;
    dots.querySelectorAll(".carousel-dot").forEach(function (d, j) {
      d.classList.toggle("active", j === current);
    });
  }

  function goToReal(i) {
    current = wrapIndex(i);
    visualIndex = current + 1;
    setTrackPosition(visualIndex, true);
    syncDots();
  }

  function goNext() {
    current = wrapIndex(current + 1);
    visualIndex += 1;
    setTrackPosition(visualIndex, true);
    syncDots();
  }

  function goPrev() {
    current = wrapIndex(current - 1);
    visualIndex -= 1;
    setTrackPosition(visualIndex, true);
    syncDots();
  }

  function settleIfNeeded() {
    if (visualIndex === total + 1) {
      visualIndex = 1;
      setTrackPosition(visualIndex, false);
    } else if (visualIndex === 0) {
      visualIndex = total;
      setTrackPosition(visualIndex, false);
    }
  }

  var ac = new AbortController();
  var signal = ac.signal;
  track.addEventListener(
    "transitionend",
    function (e) {
      if (e.propertyName !== "transform") return;
      settleIfNeeded();
    },
    { signal: signal },
  );

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
          goToReal(idx);
        });
        dots.appendChild(dot);
      })(i);
    }
  }

  if (total === 1) {
    return;
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
      if (offset > 0) goNext();
      else goPrev();
    });
    carousel.appendChild(btn);
  }
  addNavBtn("prev", "15 18 9 12 15 6", -1);
  addNavBtn("next", "9 18 15 12 9 6", +1);

  // Drag / Swipe
  var startX = 0,
    deltaX = 0,
    dragging = false;

  carousel._carouselCleanup = function () {
    ac.abort();
  };

  function dragStart(x) {
    startX = x;
    dragging = true;
    deltaX = 0;
    draggingBaseIndex = visualIndex;
    track.style.transition = "none";
  }

  function dragMove(x) {
    if (!dragging) return;
    deltaX = x - startX;
    track.style.transform = "translateX(calc(" + -draggingBaseIndex * 100 + "% + " + deltaX + "px))";
  }

  function dragEnd() {
    if (!dragging) return;
    dragging = false;
    var threshold = w() * 0.2;
    if (deltaX > threshold) goPrev();
    else if (deltaX < -threshold) goNext();
    else setTrackPosition(visualIndex, true);
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
