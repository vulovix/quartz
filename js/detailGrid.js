// ── Detail Grid ──────────────────────────────────────
// Delegated click/keyboard on [data-slug] cells inside
// a .detail-grid. Opens a sliding detail panel.

(function () {
  var activeSlug = null;

  // Auto-wrap .detail-grid in a .detail-grid-wrapper,
  // inject the sliding detail panel, and wire up pulse attrs.
  function initDetailGrids() {
    document.querySelectorAll(".detail-grid").forEach(function (grid) {
      var wrapper = document.createElement("div");
      wrapper.className = "detail-grid-wrapper";
      grid.parentNode.insertBefore(wrapper, grid);
      wrapper.appendChild(grid);

      var detail = document.createElement("div");
      detail.className = "detail-grid-detail";
      detail.innerHTML =
        '<div class="detail-grid-detail-inner"><div class="detail-grid-detail-content">' +
        '<p class="detail-grid-detail-name"></p><div class="detail-grid-detail-text"></div>' +
        "</div></div>";
      wrapper.appendChild(detail);

      grid.dataset.pulseFirst = ".detail-grid-cell";
      grid.dataset.pulseChild = ".detail-grid-logo";
      grid.dataset.pulseStyle = "ripple";

      var openCell = grid.querySelector('.detail-grid-cell[data-open="true"]');
      if (openCell) {
        setTimeout(function () {
          handleCellClick(openCell);
        }, 0);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDetailGrids);
  } else {
    initDetailGrids();
  }

  window.initDetailGrids = initDetailGrids;

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function parseBlurb(raw) {
    return raw
      .split(/\n{2,}/)
      .map(function (para) {
        return (
          "<p>" +
          para
            .trim()
            .split("\n")
            .map(function (line) {
              return line.replace(/`([^`]+)`/g, function (_, code) {
                return "<code>" + escapeHtml(code) + "</code>";
              });
            })
            .join("<br>") +
          "</p>"
        );
      })
      .join("");
  }

  function handleCellClick(cell) {
    var grid = cell.closest(".detail-grid");
    if (!grid) return;

    var detail = grid.parentElement.querySelector(".detail-grid-detail");
    var detailName = detail ? detail.querySelector(".detail-grid-detail-name") : null;
    var detailText = detail ? detail.querySelector(".detail-grid-detail-text") : null;
    if (!detail || !detailName || !detailText) return;

    var slug = cell.dataset.slug;

    if (activeSlug === slug) {
      activeSlug = null;
      detail.classList.remove("open");
      grid.querySelectorAll(".detail-grid-cell").forEach(function (c) {
        c.classList.remove("active");
      });
      return;
    }

    activeSlug = slug;
    detailName.textContent = cell.dataset.name;
    detailText.innerHTML = parseBlurb(cell.dataset.blurb);
    grid.querySelectorAll(".detail-grid-cell").forEach(function (c) {
      c.classList.remove("active");
    });
    cell.classList.add("active");
    detail.classList.add("open");
  }

  document.addEventListener("click", function (e) {
    var cell = e.target.closest("[data-slug]");
    if (cell) handleCellClick(cell);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var cell = e.target.closest("[data-slug]");
    if (!cell) return;
    e.preventDefault();
    cell.click();
  });
})();
