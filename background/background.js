chrome.storage.local.get(
  [
    "lastPage",
    "stopWatchRunning",
    "stopWatchTime",
    "stopWatchButtons",
    "stopWatchButtonsStyle",
    "timerTime",
    "timerRunning",
    "timerTImeDisplay",
    "timerButtons",
    "timerInputs",
    "timerButtonsStyle",
    "timerFinished",
  ],
  (result) => {
    const lastPage = result.lastPage || "popup.html";
    const stopWatchTime = result.stopWatchTime || 0;
    const stopWatchButtons = result.stopWatchButtons || "";
    const stopWatchButtonsStyle = result.stopWatchButtonsStyle || "";
    const stopWatchRunning = result.stopWatchRunning || false;
    const timerTime = result.timerTime || 0;
    const timerRunning = result.timerRunning || false;
    const timerFinished = result.timerButtons || false;
    const timerTimeDisplay = result.timerTimeDisplay || "";
    const timerButtons = result.timerButtons || "";
    const timerInputs = result.timerInputs || "";
    const timerButtonsStyle = result.timerButtonsStyle || "";

    chrome.storage.local.set({
      lastPage: lastPage,
      stopWatchTime: stopWatchTime,
      stopWatchRunning: stopWatchRunning,
      stopWatchButtons: stopWatchButtons,
      stopWatchButtonsStyle: stopWatchButtonsStyle,
      timerTime: timerTime,
      timerRunning: timerRunning,
      timerFinished: timerFinished,
      timerTimeDisplay: timerTimeDisplay,
      timerButtons: timerButtons,
      timerInputs: timerInputs,
      timerButtonsStyle: timerButtonsStyle,
    });
    // window.location.href = lastPage;
  }
);

chrome.alarms.create("loop", {
  periodInMinutes: 1 / 60,
});

chrome.alarms.onAlarm.addListener((alarms) => updateStatus());

function updateStatus() {
  chrome.storage.local.get(
    [
      "lastPage",
      "stopWatchRunning",
      "stopWatchTime",
      "timerTime",
      "timerRunning",
      "timerFinished",
    ],
    (result) => {
      if (result.stopWatchRunning) {
        result.stopWatchTime += 1;
        chrome.storage.local.set({ stopWatchTime: result.stopWatchTime });
        console.log(result.stopWatchTime);
      }
      // else {
      //     console.log("stopwatch not running");
      //   }
      if (result.timerRunning) {
        result.timerTime -= 1;
        if (result.timerTime > 0)
          chrome.storage.local.set({ timerTime: result.timerTime });
        else {
          chrome.storage.local.set({
            timerFinished: true,
            timerTime: 0,
            timerTimeDisplay: "00:00",
            timerButtons:
              "<button class='glassmorphic-button' id='start'>Start</button>",
            timerInputs:
              '<input required type="number" max="60" id="hour" placeholder="Hour"></input><input required type="number" max="60" id="minute" placeholder="Minute"></input><input required type="number" max="60" id="second" placeholder="Second"></input>',
          });
        }
      }
      //   else {
      //     console.log("timer not running");
      //   }
    }
  );
}
