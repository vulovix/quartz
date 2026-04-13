/* ── Album Player ─────────────────────────────────── */
(function () {
  var albumData = [];
  var audio = new Audio();
  audio.preload = "none";

  var activeAlbumId = null;
  var activeIndex = -1;

  function fmt(s) {
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function getPlayer(albumId) {
    return document.querySelector('.mini-player[data-album="' + albumId + '"]');
  }

  function getAllTrackRows(albumId) {
    return Array.from(document.querySelectorAll('.track-row[data-album="' + albumId + '"]'));
  }

  function updateTrackRowStates(albumId, playingIndex, isPlaying) {
    getAllTrackRows(albumId).forEach(function (row, i) {
      var numEl = row.querySelector(".track-num");
      var playEl = row.querySelector(".track-play-icon");
      var pauseEl = row.querySelector(".track-pause-icon");
      var isThis = i === playingIndex;

      numEl.classList.toggle("hidden", isThis);
      playEl.classList.toggle("hidden", !(isThis && !isPlaying));
      pauseEl.classList.toggle("hidden", !(isThis && isPlaying));
      row.classList.toggle("track-active", isThis);
    });
  }

  function updatePlayerUI(albumId, trackTitle, isPlaying) {
    var player = getPlayer(albumId);
    if (!player) return;
    player.classList.remove("hidden");
    player.querySelector(".mini-player-title").textContent = trackTitle;
    var iconPlay = player.querySelector(".icon-play");
    var iconPause = player.querySelector(".icon-pause");
    iconPlay.classList.toggle("hidden", isPlaying);
    iconPause.classList.toggle("hidden", !isPlaying);
  }

  function playTrack(albumId, index) {
    var album = albumData.find(function (a) {
      return a.id === albumId;
    });
    if (!album) return;
    var track = album.tracks[index];
    if (!track) return;

    if (activeAlbumId && activeAlbumId !== albumId) {
      var prevPlayer = getPlayer(activeAlbumId);
      if (prevPlayer) prevPlayer.classList.add("hidden");
      updateTrackRowStates(activeAlbumId, -1, false);
    }

    activeAlbumId = albumId;
    activeIndex = index;
    audio.src = track.src;
    audio.play();
    updateTrackRowStates(albumId, index, true);
    updatePlayerUI(albumId, track.title, true);
  }

  function togglePause(albumId) {
    if (activeAlbumId !== albumId) return;
    var album = albumData.find(function (a) {
      return a.id === albumId;
    });
    if (!album) return;
    if (audio.paused) {
      audio.play();
      updateTrackRowStates(albumId, activeIndex, true);
      updatePlayerUI(albumId, album.tracks[activeIndex].title, true);
    } else {
      audio.pause();
      updateTrackRowStates(albumId, activeIndex, false);
      updatePlayerUI(albumId, album.tracks[activeIndex].title, false);
    }
  }

  audio.addEventListener("ended", function () {
    if (!activeAlbumId) return;
    var album = albumData.find(function (a) {
      return a.id === activeAlbumId;
    });
    if (!album) return;
    var next = activeIndex + 1;
    if (next < album.tracks.length) {
      playTrack(activeAlbumId, next);
    } else {
      updateTrackRowStates(activeAlbumId, -1, false);
      var player = getPlayer(activeAlbumId);
      if (player) {
        player.querySelector(".icon-play").classList.remove("hidden");
        player.querySelector(".icon-pause").classList.add("hidden");
      }
      activeIndex = -1;
    }
  });

  audio.addEventListener("timeupdate", function () {
    if (!activeAlbumId) return;
    var player = getPlayer(activeAlbumId);
    if (!player) return;
    var fill = player.querySelector(".mini-progress-fill");
    var cur = player.querySelector(".mini-time-current");
    var tot = player.querySelector(".mini-time-total");
    var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    fill.style.width = pct + "%";
    cur.textContent = fmt(audio.currentTime);
    tot.textContent = audio.duration ? fmt(audio.duration) : "0:00";
  });

  function initAlbumPlayer() {
    document.querySelectorAll(".list-container[data-album]").forEach(function (container) {
      if (container._albumDataLoaded) return;
      container._albumDataLoaded = true;
      var jsonScript = container.querySelector(".album-tracks-data");
      if (jsonScript) {
        albumData.push({
          id: container.dataset.album,
          tracks: JSON.parse(jsonScript.textContent),
        });
      }
    });

    document.querySelectorAll(".mini-progress-bar").forEach(function (bar) {
      if (bar._albumBound) return;
      bar._albumBound = true;
      bar.addEventListener("click", function (e) {
        var rect = bar.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        if (audio.duration) audio.currentTime = pct * audio.duration;
      });
    });

    document.querySelectorAll(".track-row").forEach(function (row) {
      if (row._albumBound) return;
      row._albumBound = true;
      row.addEventListener("click", function () {
        var albumId = row.dataset.album;
        var index = parseInt(row.dataset.index, 10);
        if (activeAlbumId === albumId && activeIndex === index) {
          togglePause(albumId);
        } else {
          playTrack(albumId, index);
        }
      });
    });

    document.querySelectorAll(".mini-player").forEach(function (player) {
      if (player._albumBound) return;
      player._albumBound = true;
      var albumId = player.dataset.album;

      var ppBtn = player.querySelector(".mini-playpause");
      if (ppBtn)
        ppBtn.addEventListener("click", function () {
          togglePause(albumId);
        });

      var prevBtn = player.querySelector(".mini-prev");
      if (prevBtn)
        prevBtn.addEventListener("click", function () {
          if (activeAlbumId !== albumId) return;
          var prev = activeIndex - 1;
          if (prev >= 0) playTrack(albumId, prev);
        });

      var nextBtn = player.querySelector(".mini-next");
      if (nextBtn)
        nextBtn.addEventListener("click", function () {
          if (activeAlbumId !== albumId) return;
          var album = albumData.find(function (a) {
            return a.id === albumId;
          });
          var next = activeIndex + 1;
          if (album && next < album.tracks.length) playTrack(albumId, next);
        });
    });
  }

  initAlbumPlayer();
  window.initAlbumPlayer = initAlbumPlayer;
})();
