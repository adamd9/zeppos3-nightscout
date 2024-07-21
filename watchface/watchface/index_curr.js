import { COMPANION_APP_ID, BG_DATA_FILE } from "../libs/constants";
import VisLog from "../libs/vis-log";
import AutoGUI from "@silver-zepp/autogui";

const time = hmSensor.createSensor(hmSensor.id.TIME);
const vis = new VisLog("Nightscout Watchface");
const gui = new AutoGUI();
const arrowChars = {
  DoubleDown: "↓↓",
  DoubleUp: "↑↑",
  Flat: "→",
  FortyFiveDown: "↘",
  FortyFiveUp: "↗",
  None: " ",
  SingleDown: "↓",
  SingleUp: "↑",
};

class IndexPageWF {
  watchFaceGui = {};

  init() {
    const self = this;
    const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
      resume_call: function () {
        console.log("ui resume");
        if (self.watchFaceGui) {
          console.log("updating existing UI elements")
          self.watchFaceGui.wfTitle.update({
            text: `${time.hour % 12 || 12}:${time.minute.toString().padStart(2, "0")} ${time.hour < 12 ? "AM" : "PM"}`,
          });
          //update wfDate
          self.watchFaceGui.wfDate.update({
            text: `${time.day} ${monthNumToString(time.month)}`,
          });

        }
        self.read();
      },
      pause_call: function () {
        console.log("ui pause");
      },
    });
    this.drawGUI();
    this.initVIS(); // logger should be init after the GUI was drawn
  }

  initVIS() {
    vis.updateSettings({ log_from_top: true, line_count: 3, visual_log_enabled: false });
  }

  drawGUI() {
    AutoGUI.SetPadding(10);
    // create a group that will contain a big app name text surrounded with a rectangle
    gui.startGroup();
    this.watchFaceGui.wfTitle = gui.text("00:00", { text_size: 60 });
    gui.endGroup();

    gui.newLine();

    // this is your REUSABLE textfield
    gui.startGroup();
    this.watchFaceGui.bgWidget = gui.button("...", this.openApp, { text_size: 40, normal_color: 0x666666, radius: 10 });
    gui.endGroup();

    gui.startGroup();
    gui.fillRect(0x666666, { radius: 10 });
    this.watchFaceGui.wfDate = gui.text(".. ...", { text_size: 20 });
    gui.endGroup();

    // render the GUI
    gui.render();

  }

  openApp() {
    console.log("Open app");
    hmApp.startApp({ appid: COMPANION_APP_ID, url: "page/index" });
  }

  read() {
    vis.log("reading...");

    let str_result = "";
    try {
      const fh = hmFS.open(BG_DATA_FILE, hmFS.O_RDONLY, {
        appid: COMPANION_APP_ID,
      });

      const len = 1024;
      let array_buffer = new ArrayBuffer(len);
      hmFS.read(fh, array_buffer, 0, len);
      hmFS.close(fh);

      str_result = ab2str(array_buffer);
    } catch (error) {
      console.log("Error: ", error.message);
      return;
    }

    let bgData;
    try {
      //strip trailing spaces or nulls from string
      str_result = str_result.replace(/\0/g, "");
      bgData = JSON.parse(str_result);      
    } catch (error) {
      console.log("No valid data in file", error.message);
      return;      
    }

    // change the text
    console.log("Read glucose: " + str_result);
    vis.clear();
    try {
      bgData = JSON.parse(str_result);
      const bgVal = bgData.bg.val;
      const bgTrend = trendStringToAscii(bgData.bg.trend);
      const bgTimeStamp = bgData.bg.time;
      this.watchFaceGui.bgWidget.update({ text: `${bgVal} ${bgTrend}` });
      const currentTime = new Date().getTime(); // Get current time in milliseconds
      if (currentTime - bgTimeStamp > 360000) {
        // Change the colour to orange
        this.watchFaceGui.bgWidget.update({ color: 0xffa500 });
      } else {
        this.watchFaceGui.bgWidget.update({ color: 0xffffff });
      }
    } catch (error) {
      vis.log("Error: ", error.message);
      console.log("Error: ", error.message);
    }
  }

  quit() {
    // clean up
  }
}

WatchFace({
  build() {
    this.indexWF = new IndexPageWF();
    this.indexWF.init();
  },

  onDestroy() {
    console.log("Watchface destroyed");
    // this.indexWF.quit();
  },
});

//********************************//
//**          HELPERS           **//
//********************************//

function trendStringToAscii(trendString) {
  return arrowChars[trendString] || "⚠️";
}
function monthNumToString(monthNum) {
  //shorthand month like Jan
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthNum - 1];
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
