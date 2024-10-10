const unsplashAccessKey = "cVVIUjVQQOt5cLOw7wccQ6QvrrxYrDME7afAwLY504k";

let isAutoSwitchActive = false;
let time = 100;
let timerId;
let loadingCount = 4;
let currentActiveIndex = 0;

function updateTimer() {
  if (isAutoSwitchActive) {
    timerId = setTimeout(updateTimer, 20);
    time -= 0.1;
    if (time <= 0) {
      switchActive();
      time = 100;
    }
    document.querySelector(".progress").style.width = time + "%";
  } else {
    time = 100;
    document.querySelector(".progress").style.width = time + "%";
  }
}

function reloadImage(width = 300, height = 200) {
  loadingCount = 4;
  clearTimeout(timerId);
  fetch(
    "https://api.unsplash.com/photos/random?client_id=" +
      unsplashAccessKey +
      "&count=4&w=" +
      width +
      "&h=" +
      height
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const images = document.querySelectorAll(".imageContainer img");
      const previewImage = document.querySelector(
        ".previewContainer .preview img"
      );
      const authorElement = document.querySelector(".previewContainer .author");
      data.forEach((image, i) => {
        images[i].src = image.urls.regular;
        images[i].dataset.authorName = image.user.name;
        images[i].addEventListener("load", loaded);
      });
      previewImage.src = data[0].urls.regular;
      previewImage.alt = `Photo by ${data[0].user.name}`;
      authorElement.textContent = data[0].user.name;

      const overlayElements = document.querySelectorAll(".overlay");
      overlayElements.forEach((element) => {
        element.classList.remove("active");
      });
      overlayElements[0].classList.add("active");
      currentActiveIndex = 0;
      showPreview();
    })
    .catch((error) => {
      console.error("Ошибка при получении картинок:", error);
    });
}

function switchActive() {
  const activeElement = document.querySelector(".active");
  const overlayElements = document.querySelectorAll(".overlay");

  if (activeElement) {
    activeElement.classList.remove("active");
  }

  currentActiveIndex = (currentActiveIndex + 1) % overlayElements.length;
  overlayElements[currentActiveIndex].classList.add("active");
  showPreview();
  if (currentActiveIndex === 0) {
    reloadImage();
  }
}

function togglePreview(event) {
  if (event.target.tagName === "IMG") {
    const parent = event.target.parentElement;
    const activeElements = document.querySelectorAll(".active");
    activeElements.forEach((element) => {
      element.classList.remove("active");
    });
    parent.classList.add("active");
    currentActiveIndex = Array.from(parent.parentElement.children).indexOf(
      parent
    );
    showPreview();
  }
}

function showPreview() {
  const activeImg = document.querySelector(".active img");
  if (activeImg) {
    const previewContainer = document.querySelector(".previewContainer");
    const preview = document.querySelector(".preview");
    const previewImg = document.createElement("img");
    const authorElement = previewContainer.querySelector(".author");

    previewImg.src = activeImg.src;
    previewImg.alt = `Photo by ${activeImg.dataset.authorName}`;
    preview.innerHTML = "";
    preview.appendChild(previewImg);
    authorElement.textContent = activeImg.dataset.authorName;
  }
}

function loaded(event) {
  loadingCount -= 1;
  if (loadingCount === 0) {
    updateTimer();
  }
  event.target.classList.remove("loading");
}

function toggleAutoSwitch() {
  const pauseButton = document.querySelector(".stop button");
  if (isAutoSwitchActive) {
    pauseButton.textContent = "Play";
    isAutoSwitchActive = false;
    updateTimer();
  } else {
    pauseButton.textContent = "Stop";
    isAutoSwitchActive = true;
    updateTimer();
  }
}

function init() {
  const buttonReload = document.querySelector(".reload button");
  buttonReload.addEventListener("click", reloadImage);
  const pauseButton = document.querySelector(".stop button");
  pauseButton.addEventListener("click", toggleAutoSwitch);
  reloadImage();

  const overlayElements = document.querySelectorAll(".overlay");
  overlayElements.forEach((element) => {
    element.classList.remove("active");
  });
  overlayElements[0].classList.add("active");
  currentActiveIndex = 0;
  showPreview();

  const images = document.querySelectorAll(".imageContainer .overlay img");
  images.forEach((image) => {
    image.addEventListener("load", loaded);
  });

  const imageContainers = document.querySelectorAll(".imageContainer .overlay");
  imageContainers.forEach((container) => {
    container.addEventListener("click", togglePreview);
  });
}

window.addEventListener("DOMContentLoaded", init);
