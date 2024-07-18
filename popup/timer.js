const error = document.getElementById("error");

const btns = document.getElementById("btns");
const inputs = document.getElementById("inputs");
const time = document.getElementById("time");
const back = document.getElementById("back");

// const timerStorage = JSON.parse(localStorage.getItem("timer"));

back.addEventListener("click", () => {
  chrome.storage.local.set({ lastPage: "popup.html" });
  window.location.href = "popup.html";
});

// let counter = 10;
// let paused = true;
// interval = setInterval(func, 1000);

// function func() {
//   console.log("here");
//   if (!paused && counter > 0) {
//     counter -= 1;
//     time.innerHTML = fancyTimeFormat(counter);
//     inputs.innerHTML = "";
//     // btns.style.gridTemplateColumns = `repeat(1, 100px)`;
//   }
// }
chrome.storage.local.get(
  ["timerButtons", "timerButtonsStyle", "timerInputs", "timerTime"],
  (response) => {
    btns.innerHTML =
      response.timerButtons ||
      "<button class='glassmorphic-button' id='start'>Start</button>";
    btns.setAttribute(
      "style",
      response.timerButtonsStyle || "repeat(1, 100px)"
    );
    inputs.innerHTML = response.timerInputs;
    time.innerHTML =
      response.timerTime != 0 ? fancyTimeFormat(response.timerTime) : "";
    attachEventListeners();
  }
);

chrome.storage.onChanged.addListener((changes, namespace) => {
  chrome.storage.local.get(
    ["timerTime", "timerButtons", "timerInputs", "timerFinished"],
    (response) => {
      time.innerHTML =
        response.timerTime != 0 ? fancyTimeFormat(response.timerTime) : "";
      if (response.timerFinished === true) {
        btns.style.gridTemplateColumns = `repeat(1, 100px)`;
        btns.innerHTML = response.timerButtons;
        inputs.innerHTML = response.timerInputs;
        attachEventListeners();
      }
    }
  );
});

error_counter = 0;
function attachEventListeners() {
  const start = document.getElementById("start");
  const pause = document.getElementById("pause");
  const cancel = document.getElementById("cancel");
  const resume = document.getElementById("resume");

  let hour = document.getElementById("hour");
  let minute = document.getElementById("minute");
  let second = document.getElementById("second");

  if (start) {
    start.addEventListener("click", () => {
      if (hour.value || minute.value || second.value) {
        // if (!interval) {
        //   console.log("hereeeee");
        //   interval = setInterval(func, 1000);
        // }
        // paused = false;

        btns.style.gridTemplateColumns = `repeat(2, 100px)`;
        btns.innerHTML =
          "<button class='glassmorphic-button' id='pause'>Pause</button><button class='glassmorphic-button' id='cancel'>Cancel</button>";
        error.innerHTML = "";
        inputs.innerHTML = "";

        counter = hour.value * 3600 + minute.value * 60 + second.value * 1;
        chrome.storage.local.set({
          timerTime: counter,
          timerFinished: false,
          timerRunning: true,
          timerButtons: btns.innerHTML,
          timerButtonsStyle: btns.getAttribute("style"),
          timerInputs: "",
        });
      } else {
        error.innerHTML = "<p>Please set the timer.</p>";
        error_counter += 1;
      }
      attachEventListeners();
    });
  }

  if (cancel) {
    cancel.addEventListener("click", () => {
      //   clearInterval(interval);
      time.innerHTML = "";
      inputs.innerHTML =
        '<input required type="number" max="60" id="hour" placeholder="Hour"></input><input required type="number" max="60" id="minute" placeholder="Minute"></input><input required type="number" max="60" id="second" placeholder="Second"></input>';
      btns.style.gridTemplateColumns = `repeat(1, 100px)`;
      btns.innerHTML =
        "<button class='glassmorphic-button' id='start'>Start</button>";

      chrome.storage.local.set({
        timerTime: 0,
        timerFinished: false,
        timerRunning: false,
        timerButtons: btns.innerHTML,
        timerButtonsStyle: btns.getAttribute("style"),
        timerInputs: inputs.innerHTML,
      });

      attachEventListeners();
    });
  }

  if (pause) {
    pause.addEventListener("click", () => {
      btns.style.gridTemplateColumns = `repeat(2, 100px)`;
      btns.innerHTML =
        "<button class='glassmorphic-button' id='resume'>Resume</button><button class='glassmorphic-button' id='cancel'>Cancel</button>";

      chrome.storage.local.set({
        timerRunning: false,
        timerFinished: false,
        timerButtons: btns.innerHTML,
        timerButtonsStyle: btns.getAttribute("style"),
        timerInputs: "",
      });
      attachEventListeners();
    });
  }

  if (resume) {
    resume.addEventListener("click", () => {
      btns.style.gridTemplateColumns = `repeat(2, 100px)`;
      btns.innerHTML =
        "<button class='glassmorphic-button' id='pause'>Pause</button><button class='glassmorphic-button' id='cancel'>Cancel</button>";

      chrome.storage.local.set({
        timerRunning: true,
        timerFinished: false,
        timerButtons: btns.innerHTML,
        timerButtonsStyle: btns.getAttribute("style"),
        timerInputs: "",
      });
      attachEventListeners();
    });
  }
}

attachEventListeners();

function fancyTimeFormat(duration) {
  const hrs = Math.floor(duration / 3600);
  const mins = Math.floor((duration % 3600) / 60);
  const secs = duration % 60;

  let ret = "";

  if (hrs > 0) {
    ret += `${hrs}:${mins < 10 ? "0" : ""}`;
  }

  ret += `${mins}:${secs < 10 ? "0" : ""}${secs}`;

  return ret;
}
