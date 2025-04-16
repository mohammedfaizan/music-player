document.addEventListener("DOMContentLoaded", function () {
  const songs = [
    {
      title: "Drive breakbeat",
      duration: "1:49",
      thumbnail: "./data/preview-img-1.jpg",
      src: "./data/track1.mp3",
      artist: "Rockot",
      year: 2023,
      isVerfied: true,
      followers: 1371245,
      monthlyListeners: 12346313,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Titanium",
      duration: "1:46",
      thumbnail: "./data/preview-img-2.jpg",
      src: "./data/track2.mp3",
      artist: "AlisiaBeats",
      year: 2023,
      isVerfied: true,
      followers: 50,
      monthlyListeners: 20,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Science Documentory",
      duration: "2:07",
      thumbnail: "./data/preview-img-3.jpg",
      src: "./data/track3.mp3",
      artist: "Lexin_Music",
      year: 2023,
      isVerfied: false,
      followers: 80,
      monthlyListeners: 10,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
    {
      title: "Once In Paris",
      duration: "2:12",
      thumbnail: "./data/preview-img-4.jpg",
      src: "./data/track4.mp3",
      artist: "Pumpupthemind",
      year: 2023,
      isVerfied: false,
      followers: 12,
      monthlyListeners: 45,
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    },
  ];

  const songList = document.getElementById("song-list");
  const thumbnailContainer = document.getElementById("thumbnail-container");
  const thumbnail = document.getElementById("thumbnail");
  const playPauseBtn = document.getElementById("play-pause");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const progress = document.getElementById("progress");
  const currTime = document.getElementById("current-time");
  const volumeControl = document.getElementById("volume");
  const leftTime = document.getElementById("time-left");
  const shuffleBtn = document.getElementById("shuffle");
  const repeatBtn = document.getElementById("repeat");
  const trackTitle = document.getElementById("player-title");
  const trackDescription = document.getElementById("player-description");
  const playbackDropdown = document.getElementById("playback-dropdown");
  const dropdownItems = document.querySelectorAll(".playback-dropdown-item");
  const shuffleImg = document.getElementById("shuffle-img");
  const loopImg = document.getElementById("loop-img");

  let isShuffleMode = true;
  let isRepeatMode = false;
  let currentSongIndex = 0;
  let audio = new Audio();
  loadSong(currentSongIndex);

  function updatePlayPauseButton(paused) {
    playPauseBtn.innerHTML = paused
      ? '<img src="./assets/icons/play-button.svg" />'
      : '<img src="./assets/icons/pause-button.svg" />';
  }

  function playPause() {
    if (audio.paused) {
      audio.play();
      updatePlayPauseButton(false);
    } else {
      audio.pause();
      updatePlayPauseButton(true);
    }
  }

  function updateCurrentSongHighlight() {
    // Remove highlight from all titles
    const titleElements = document.querySelectorAll(".track-title");
    titleElements.forEach((element) => {
      element.classList.remove("current-song");
    });

    // Add highlight to the title of the currently playing song
    const currentSongTitleElement = document.querySelector(
      `.item-container[data-index="${currentSongIndex}"] .track-title`
    );

    if (currentSongTitleElement) {
      currentSongTitleElement.classList.add("current-song");
    }
  }

  function loadSong(index) {
    const currentSong = songs[index];
    audio.src = currentSong.src;
    thumbnail.src = currentSong.thumbnail;
    trackTitle.innerText = currentSong.title;
    trackDescription.innerText = currentSong.artist;
    leftTime.textContent = "00:00";
    audio.addEventListener("loadedmetadata", function () {
      progress.max = audio.duration;
    });
    updateCurrentSongHighlight(index);
  }

  function prevSong() {
    currentSongIndex = currentSongIndex - 1;
    loadSong(currentSongIndex);
    audio.play();
  }

  function getRandomIndex() {
    const lastIndex = songs.length - 1;
    const randomIndex = Math.floor(Math.random() * (lastIndex + 1));
    return randomIndex;
  }

  function nextSong(isBtnClicked) {
    if (isShuffleMode) {
      const randomIndex = getRandomIndex();
      currentSongIndex = randomIndex;
      loadSong(currentSongIndex);
      audio.play();
    } else if (isBtnClicked) {
      currentSongIndex = currentSongIndex + 1;
      loadSong(currentSongIndex);
      audio.play();
    } else {
      audio.currentTime = 0;
      progress.value = 0;
      audio.play();
    }
  }

  function padZero(number) {
    return (number < 10 ? "0" : "") + number;
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${padZero(minutes)}:${padZero(seconds)}`;
  }

  function updateProgress() {
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    const remainingTime = duration - currentTime;
    progress.value = currentTime;
    currTime.textContent = `${formatTime(currentTime)}`;
    leftTime.textContent = `${
      "-" + (remainingTime >= 0 ? formatTime(remainingTime) : "00:00")
    }`;

    throttledUpdateProgress = null;
  }

  function updateVolume() {
    audio.volume = volumeControl.value;
  }

  function renderSongList() {
    songList.innerHTML = "";

    songs.forEach((song, index) => {
      const itemContainer = document.createElement("div");
      const itemImg = document.createElement("div");
      const imgElement = document.createElement("img");
      const thumbnailImg = document.createElement("img");
      const trackDataContainer = document.createElement("div");
      const trackTitle = document.createElement("p");
      const trackArtist = document.createElement("p");
      const trackDurationContainer = document.createElement("div");
      const trackDuration = document.createElement("p");
      const trackYear = document.createElement("p");

      itemContainer.classList.add("item-container");
      thumbnailImg.classList.add("list-thumbnail");
      itemContainer.setAttribute("data-index", index);
      itemImg.classList.add("item-img");
      trackDataContainer.classList.add("track-data-container");
      trackTitle.classList.add("track-title");
      trackArtist.classList.add("track-artist");
      trackDurationContainer.classList.add("track-duration-container");
      trackDuration.classList.add("track-duration");
      trackYear.classList.add("track-year");

      itemContainer.addEventListener("click", () => {
        currentSongIndex = index;
        loadSong(currentSongIndex);
        audio.play();
        updatePlayPauseButton();
      });

      imgElement.src = "./assets/icons/outline.svg";
      thumbnailImg.src = song.thumbnail;
      trackTitle.textContent = song.title;
      trackArtist.textContent = song.artist || "Unknown Artist";
      trackDuration.textContent = song.duration;
      trackYear.textContent = song.year || "Unknown Year";

      itemImg.appendChild(imgElement);
      itemImg.appendChild(thumbnailImg);
      trackDataContainer.appendChild(trackTitle);
      trackDataContainer.appendChild(trackArtist);
      trackDurationContainer.appendChild(trackDuration);
      trackDurationContainer.appendChild(trackYear);

      itemContainer.appendChild(itemImg);
      itemContainer.appendChild(trackDataContainer);
      itemContainer.appendChild(trackDurationContainer);

      songList.appendChild(itemContainer);
      updateCurrentSongHighlight(currentSongIndex);
    });
  }

  renderSongList();

  function updateButtonState(button, isActive) {
    if (isActive) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  }

  function toggleShuffleMode() {
    isShuffleMode = true;
    isRepeatMode = false;
    shuffleImg.src = "./assets/icons/shuffle-highlighted.svg";
    loopImg.src = "./assets/icons/loop.svg";
    updateButtonState(shuffleBtn, isShuffleMode);
  }

  function toggleRepeatMode() {
    isRepeatMode = true;
    isShuffleMode = false;
    shuffleImg.src = "./assets/icons/shuffle.svg";
    loopImg.src = "./assets/icons/loop-highlighted.svg";
    updateButtonState(repeatBtn, isRepeatMode);
  }

  dropdownItems.forEach(function (item) {
    item.addEventListener("click", function () {
      const selectedVal = this.getAttribute("data-value");
      audio.playbackRate = parseFloat(selectedVal);
      dropdownItems.forEach(function (item) {
        item.classList.remove("selected-speed");
      });
      this.classList.add("selected-speed");
    });
  });

  function openPreviewModal() {
    const currentTrack = songs[currentSongIndex];
    previewModal.style.display = "flex";
    previewImage.src = currentTrack.thumbnail;
    previewArtist.innerText = currentTrack.artist;
    followCount.innerText = currentTrack.followers;
    listenerCount.innerText = currentTrack.monthlyListeners;
    previewDescription.innerText = currentTrack.description;
    if (!currentTrack.isVerfied) {
      document.getElementById("verified").style.display = "none";
    } else {
      document.getElementById("verified").style.display = "flex";
    }
  }

  function closePreviewModal() {
    previewModal.style.display = "none";
  }

  closeModal.addEventListener("click", closePreviewModal);

  window.addEventListener("click", function (event) {
    if (event.target === previewModal) {
      closePreviewModal();
    }
  });

  playPauseBtn.addEventListener("click", playPause);
  prevBtn.addEventListener("click", prevSong);
  nextBtn.addEventListener("click", () => nextSong(true));
  progress.addEventListener("input", function () {
    audio.currentTime = progress.value;
  });
  volumeControl.addEventListener("input", updateVolume);
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => nextSong(false));
  audio.addEventListener("play", () => updatePlayPauseButton(false));
  audio.addEventListener("pause", () => updatePlayPauseButton(true));
  shuffleBtn.addEventListener("click", toggleShuffleMode);
  repeatBtn.addEventListener("click", toggleRepeatMode);
  playbackDropdown.addEventListener("click", toggleDropdown);
  thumbnailContainer.addEventListener("click", openPreviewModal);

  // Event listner to close a dropdown on outside click
  window.addEventListener("click", function (event) {
    if (!event.target.matches(".playback-dropdown-selected")) {
      const itemsContainer = playbackDropdown.querySelector(
        ".playback-dropdown-items"
      );
      itemsContainer.style.display = "none";
      document.getElementById("dropdown-arrow").classList.remove("rotate-270");
    }
  });
});
