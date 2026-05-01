/* ── Photo Gallery (lightbox) ─────────────────────── */
(function () {
  var lightbox, lbTitle, lbSubtitle, lbDesc, lbImgWrap;
  var LIGHTBOX_CONFIG = {
    maxWidthPx: 860,
    maxHeightExpr: "78dvh - 3.25rem",
    minRatio: 0.6,
    maxRatio: 1.8,
    squareTolerance: 0.08,
    portraitFallbackMaxWidthPx: 460,
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function orientationFromRatio(ratio) {
    if (Math.abs(ratio - 1) <= LIGHTBOX_CONFIG.squareTolerance) return "square";
    return ratio < 1 ? "portrait" : "landscape";
  }

  function parseAspect(aspectValue) {
    if (!aspectValue) return null;
    var parts = aspectValue.split("/");
    var w = parseFloat(parts[0]);
    var h = parseFloat(parts[1]);
    if (!w || !h) return null;
    var ratio = w / h;
    return {
      w: w,
      h: h,
      ratio: ratio,
      orientation: orientationFromRatio(ratio),
    };
  }

  function lightboxMaxWidthForRatio(ratio) {
    var safeRatio = clamp(ratio, LIGHTBOX_CONFIG.minRatio, LIGHTBOX_CONFIG.maxRatio);
    return "min(" + LIGHTBOX_CONFIG.maxWidthPx + "px, calc((" + LIGHTBOX_CONFIG.maxHeightExpr + ") * " + safeRatio + "))";
  }

  function applyPortraitClass(card) {
    if (!card) return;
    var img = card.querySelector(".photo-card-img-wrap img");
    if (!img) return;

    function syncOrientation() {
      if (!img.naturalWidth || !img.naturalHeight) return;
      var ratio = img.naturalWidth / img.naturalHeight;
      card.dataset.photoRatio = String(ratio);
      card.dataset.photoOrientation = orientationFromRatio(ratio);
      if (ratio < 1) {
        card.classList.add("photo-card-portrait");
      }
    }

    if (img.complete) {
      syncOrientation();
      return;
    }

    img.addEventListener("load", syncOrientation, { once: true });
  }

  function ensureLightbox() {
    if (lightbox) return;
    lightbox = document.createElement("div");
    lightbox.className = "lightbox hidden";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.innerHTML =
      '<button class="lightbox-close pressable" aria-label="Close">\u2715</button>' +
      '<div class="lightbox-inner">' +
      '<div class="lightbox-img-wrap"></div>' +
      '<div class="lightbox-caption">' +
      '<div><span class="lb-title"></span><span class="lb-subtitle"></span></div>' +
      '<p class="lb-desc"></p>' +
      "</div>" +
      "</div>";
    document.body.appendChild(lightbox);

    lbTitle = lightbox.querySelector(".lb-title");
    lbSubtitle = lightbox.querySelector(".lb-subtitle");
    lbDesc = lightbox.querySelector(".lb-desc");
    lbImgWrap = lightbox.querySelector(".lightbox-img-wrap");

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox || lightbox.classList.contains("hidden")) return;
      if (e.key === "Escape") closeLightbox();
    });
  }

  function openLightbox(card) {
    ensureLightbox();
    var slides = card.querySelector(".photo-card-slides");
    if (!slides) return;

    lbImgWrap.innerHTML = "";
    var clone = slides.querySelector(".carousel").cloneNode(true);
    lbImgWrap.appendChild(clone);
    if (typeof window.initCarousel === "function") {
      window.initCarousel(clone);
    }

    lbTitle.textContent = card.dataset.title || "";
    lbSubtitle.textContent = card.dataset.subtitle || "";
    lbDesc.textContent = card.dataset.description || "";

    // Constrain lightbox width for portrait fallback cases.
    var lbInner = lightbox.querySelector(".lightbox-inner");
    var aspect = card.dataset.aspect;
    var parsedAspect = parseAspect(aspect);
    var fallbackRatio = parseFloat(card.dataset.photoRatio || "");
    var fallbackOrientation = card.dataset.photoOrientation || "";
    var isPortraitCard = card.classList.contains("photo-card-portrait");

    lightbox.classList.remove("lightbox-ratio-portrait", "lightbox-ratio-square", "lightbox-ratio-landscape", "lightbox-has-explicit-aspect");

    if (parsedAspect) {
      // Respect explicit aspect while keeping the image as large as possible in viewport.
      lbInner.style.maxWidth = lightboxMaxWidthForRatio(parsedAspect.ratio);
      lightbox.classList.add("lightbox-ratio-" + parsedAspect.orientation);
      lightbox.classList.add("lightbox-has-explicit-aspect");
    } else if (fallbackRatio) {
      var computedOrientation = fallbackOrientation || orientationFromRatio(fallbackRatio);
      if (computedOrientation === "portrait") {
        lbInner.style.maxWidth = lightboxMaxWidthForRatio(fallbackRatio);
      } else {
        lbInner.style.maxWidth = "";
      }
      lightbox.classList.add("lightbox-ratio-" + computedOrientation);
    } else if (isPortraitCard) {
      lbInner.style.maxWidth = LIGHTBOX_CONFIG.portraitFallbackMaxWidthPx + "px";
      lightbox.classList.add("lightbox-ratio-portrait");
    } else {
      lbInner.style.maxWidth = "";
      lightbox.classList.add("lightbox-ratio-landscape");
    }

    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function initPhotoGallery() {
    document.querySelectorAll(".photo-card").forEach(function (card) {
      applyPortraitClass(card);
      if (card._galleryBound) return;
      card._galleryBound = true;
      card.addEventListener("click", function () {
        openLightbox(card);
      });
    });
  }

  initPhotoGallery();
  window.initPhotoGallery = initPhotoGallery;
})();
