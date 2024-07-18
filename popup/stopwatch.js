const time = document.getElementById("time");
const btns = document.getElementById("btns");
const lapBox = document.getElementById("lapBox");

const back = document.getElementById("back");

back.addEventListener("click", () => {
  chrome.storage.local.set({ lastPage: "popup.html" });
  window.location.href = "popup.html";
});

chrome.storage.local.get(
  ["stopWatchButtons", "stopWatchButtonsStyle", "stopWatchTime"],
  (response) => {
    btns.innerHTML =
      response.stopWatchButtons ||
      '<button class="glassmorphic-button" id="start">Start</button>';
    btns.setAttribute(
      "style",
      response.stopWatchButtonsStyle || "grid-template-columns:100px"
    );
    time.innerHTML = fancyTimeFormat(response.stopWatchTime);
    attachEventListeners();
  }
);

chrome.storage.onChanged.addListener((changes, namespace) => {
  chrome.storage.local.get(["stopWatchTime"], (response) => {
    time.innerHTML = fancyTimeFormat(response.stopWatchTime);
  });
});

const attachEventListeners = () => {
  const start = document.getElementById("start");
  const stop = document.getElementById("stop");
  const resume = document.getElementById("resume");
  const reset = document.getElementById("reset");
  const lap = document.getElementById("lap");

  if (start) {
    start.addEventListener("click", () => {
      btns.innerHTML =
        '<button class="glassmorphic-button" id="stop">Stop</button><button class="glassmorphic-button" id="lap">Lap</button>';
      btns.setAttribute("style", "grid-template-columns: 100px 100px");
      console.log(btns.innerHTM);
      chrome.storage.local.set({
        stopWatchRunning: true,
        stopWatchButtons: btns.innerHTML,
        stopWatchButtonsStyle: btns.getAttribute("style"),
      });

      attachEventListeners();
    });
  }

  if (stop) {
    stop.addEventListener("click", () => {
      btns.innerHTML =
        '<button class="glassmorphic-button" id="resume">Resume</button><button class="glassmorphic-button" id="reset">Reset</button>';
      chrome.storage.local.set({
        stopWatchRunning: false,
        stopWatchButtons: btns.innerHTML,
        stopWatchButtonsStyle: btns.getAttribute("style"),
      });
      attachEventListeners();
    });
  }

  if (resume) {
    resume.addEventListener("click", () => {
      btns.innerHTML =
        '<button class="glassmorphic-button" id="stop">Stop</button><button class="glassmorphic-button" id="lap">Lap</button>';
      chrome.storage.local.set({
        stopWatchRunning: true,
        stopWatchButtons: btns.innerHTML,
        stopWatchButtonsStyle: btns.getAttribute("style"),
      });
      attachEventListeners();
    });
  }

  if (reset) {
    reset.addEventListener("click", () => {
      chrome.storage.local.set({ stopWatchRunning: false });
      chrome.storage.local.set({ stopWatchTime: 0 });
      time.innerHTML = "00:00";
      btns.innerHTML =
        '<button class="glassmorphic-button" id="start">Start</button>';
      btns.setAttribute("style", "grid-template-columns:100px");
      lapBox.innerHTML = "";
      chrome.storage.local.set({
        stopWatchTime: 0,
        stopWatchRunning: false,
        stopWatchButtons: btns.innerHTML,
        stopWatchButtonsStyle: btns.getAttribute("style"),
      });
      attachEventListeners();
    });
  }
  if (lap) {
    lap.addEventListener("click", async () => {
      lapBox.innerHTML = await chrome.storage.local
        .get(["stopWatchTime"])
        .then((result) => {
          return result.stopWatchTime || 10;
        });
    });
  }
};

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
