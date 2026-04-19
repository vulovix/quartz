/* ── Track Player (single-track card) ────────────── */
(function () {
  var audio = new Audio();
  audio.preload = "metadata";

  var activeCard = null;

  function fmt(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function setPlaying(card, playing) {
    var iconPlay = card.querySelector(".track-card-icon-play");
    var iconPause = card.querySelector(".track-card-icon-pause");
    iconPlay.classList.toggle("hidden", playing);
    iconPause.classList.toggle("hidden", !playing);
    card.classList.toggle("track-card-active", playing);
  }

  function play(card) {
    var src = card.dataset.src;
    if (!src) return;

    if (activeCard && activeCard !== card) {
      setPlaying(activeCard, false);
    }

    activeCard = card;

    // Show progress section on first play
    var progress = card.querySelector(".track-card-progress");
    if (progress) progress.classList.remove("hidden");

    if (audio.getAttribute("data-card-id") !== card.dataset.trackId) {
      audio.src = src;
      audio.setAttribute("data-card-id", card.dataset.trackId);
    }
    audio.play();
    setPlaying(card, true);
  }

  function pause(card) {
    audio.pause();
    setPlaying(card, false);
  }

  function toggle(card) {
    if (activeCard === card && !audio.paused) {
      pause(card);
    } else {
      play(card);
    }
  }

  audio.addEventListener("timeupdate", function () {
    if (!activeCard) return;
    var fill = activeCard.querySelector(".track-card-progress-fill");
    var cur = activeCard.querySelector(".track-card-time-current");
    var tot = activeCard.querySelector(".track-card-time-total");
    var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = pct + "%";
    cur.textContent = fmt(audio.currentTime);
    tot.textContent = audio.duration ? fmt(audio.duration) : "0:00";
  });

  audio.addEventListener("loadedmetadata", function () {
    if (!activeCard) return;
    var tot = activeCard.querySelector(".track-card-time-total");
    if (tot) tot.textContent = audio.duration ? fmt(audio.duration) : "0:00";
  });

  audio.addEventListener("ended", function () {
    if (!activeCard) return;
    setPlaying(activeCard, false);
    var fill = activeCard.querySelector(".track-card-progress-fill");
    fill.style.width = "0%";
    activeCard.querySelector(".track-card-time-current").textContent = "0:00";
  });

  function initTrackPlayer() {
    document.querySelectorAll(".track-card[data-track-id]").forEach(function (card) {
      if (card._trackBound) return;
      card._trackBound = true;

      var playBtn = card.querySelector(".track-card-playpause");
      if (playBtn) {
        playBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          toggle(card);
        });
      }

      var bar = card.querySelector(".track-card-progress-bar");
      if (bar) {
        bar.addEventListener("click", function (e) {
          e.stopPropagation();
          var rect = bar.getBoundingClientRect();
          var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

          if (activeCard !== card) {
            // Start playing, then seek once duration is known
            play(card);
            var onMeta = function () {
              audio.removeEventListener("loadedmetadata", onMeta);
              audio.currentTime = pct * audio.duration;
            };
            if (audio.duration) {
              audio.currentTime = pct * audio.duration;
            } else {
              audio.addEventListener("loadedmetadata", onMeta);
            }
            return;
          }

          // Already active — seek directly
          if (audio.duration) {
            audio.currentTime = pct * audio.duration;
            // Resume if paused
            if (audio.paused) {
              audio.play();
              setPlaying(card, true);
            }
          }
        });
      }
        });
      }
    });
  }

  initTrackPlayer();
  window.initTrackPlayer = initTrackPlayer;
})();
