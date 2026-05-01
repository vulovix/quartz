/* ── Photo Gallery (lightbox) ─────────────────────── */
(function () {
  var lightbox, lbTitle, lbSubtitle, lbDesc, lbImgWrap;
  var LIGHTBOX_CONFIG = {
    portraitMaxWidthPx: 620,
    portraitHeightExpr: "70vh - 5rem",
    portraitFallbackMaxWidthPx: 460,
  };

  function parseAspect(aspectValue) {
    if (!aspectValue) return null;
    var parts = aspectValue.split("/");
    var w = parseFloat(parts[0]);
    var h = parseFloat(parts[1]);
    if (!w || !h) return null;
    return { w: w, h: h, isPortrait: h > w };
  }

  function portraitLightboxMaxWidth(ratio) {
    return "min(" + LIGHTBOX_CONFIG.portraitMaxWidthPx + "px, calc((" + LIGHTBOX_CONFIG.portraitHeightExpr + ") * " + ratio + "))";
  }

  function applyPortraitClass(card) {
    if (!card) return;
    var img = card.querySelector(".photo-card-img-wrap img");
    if (!img) return;

    function syncOrientation() {
      if (!img.naturalWidth || !img.naturalHeight) return;
      if (img.naturalHeight > img.naturalWidth) {
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

    // Constrain lightbox width for portrait/square ratios
    var lbInner = lightbox.querySelector(".lightbox-inner");
    var aspect = card.dataset.aspect;
    var parsedAspect = parseAspect(aspect);
    var isPortraitCard = card.classList.contains("photo-card-portrait");
    if (parsedAspect) {
      if (parsedAspect.isPortrait) {
        // portrait: keep image clearly below full-screen height on foldables/tablets
        lbInner.style.maxWidth = portraitLightboxMaxWidth(parsedAspect.w / parsedAspect.h);
      } else {
        lbInner.style.maxWidth = "";
      }
    } else if (isPortraitCard) {
      lbInner.style.maxWidth = LIGHTBOX_CONFIG.portraitFallbackMaxWidthPx + "px";
    } else {
      lbInner.style.maxWidth = "";
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
