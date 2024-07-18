document.addEventListener("DOMContentLoaded", () => {
  const stopwatch = document.getElementById("stopwatch");
  const timer = document.getElementById("timer");

  chrome.storage.local.get(["lastPage"], (response) => {
    if (response.lastPage === "stopwatch.html") {
      stopwatchPath();
    } else if (response.lastPage === "timer.html") {
      timerPath();
    }
  });

  stopwatch.addEventListener("click", stopwatchPath);

  timer.addEventListener("click", timerPath);
});

const stopwatchPath = () => {
  chrome.storage.local.set({ lastPage: "stopwatch.html" });
  window.location.href = "stopwatch.html";
};

const timerPath = () => {
  chrome.storage.local.set({ lastPage: "timer.html" });
  window.location.href = "timer.html";
};
