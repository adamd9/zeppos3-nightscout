import VisLog from "../libs/vis-log";
import { COMPANION_APP_ID, BG_DATA_FILE } from "../libs/constants";

const vis = new VisLog("watchface");
const logger = DeviceRuntimeCore.HmLogger.getLogger("wf-nightscout-z3");
const time = hmSensor.createSensor(hmSensor.id.TIME);
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

WatchFace({
  build() {
    this.init();
  },

  init() {
    let wfTitleText, wfDateText, wfDateBackground, bgWidget, bgWidgetButton;
    // Set padding (if applicable, otherwise you can set margins individually for elements)
    const padding = 20;

    // Create the big app name text
    wfTitleText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: padding,
      y: padding,
      w: 300,
      h: 120,
      text: "10:09",
      text_size: 100,
      color: 0x07d570,
    });

    //create date text significantly smaller that titletext
    wfDateText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: padding,
      y: padding + 130,
      w: 200,
      h: 40,
      text: "Monday 5",
      text_size: 30,
      color: 0x07d570,
    });

    // Create the rectangle background
    wfDateBackground = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
      x: padding,
      y: 220,
      w: 200,
      h: 100,
      color: 0x07d570,
      radius: 10,
    });

    //create text inside the dimension of the wfDateBackground
    bgWidget = hmUI.createWidget(hmUI.widget.TEXT, {
      x: padding + 20,
      y: 230,
      w: 260,
      h: 80,
      text: "5.4 ↑",
      text_size: 50,
      color: 0xffffff,
    });

    //create button on top of wfDateBackground (same dimensions) that opens openApp
    bgWidgetButton = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: padding,
      y: 220,
      w: 280,
      h: 100,
      // normal_color: 0x666666,
      normal_src: "280x230-00000000.png",
      press_src: "280x230-0000007f.png",
      radius: 10,
      click_func: () => {
        console.log("Open app");
        hmApp.startApp({ appid: COMPANION_APP_ID, url: "page/index" });
      },
    });

    function read() {
      logger.log("reading...");

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
        console.log("Error: ", error);
        // vis.warn("Nightscout Companion App not running")
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
      try {
        bgData = JSON.parse(str_result);
        const bgVal = bgData.bg.val;
        const bgTrend = trendStringToAscii(bgData.bg.trend);
        const bgTimeStamp = bgData.bg.time;
        bgWidget.setProperty(hmUI.prop.MORE, { text: `${bgVal} ${bgTrend}` });
        const currentTime = new Date().getTime(); // Get current time in milliseconds
        if (currentTime - bgTimeStamp > 360000) {
          // Change the colour to orange
          bgWidget.setProperty(hmUI.prop.MORE, { color: 0xffa500 });
        } else {
          bgWidget.setProperty(hmUI.prop.MORE, { color: 0xffffff });
        }
      } catch (error) {
        logger.log("Error: ", error.message);
        console.log("Error: ", error.message);
      }
    }

    const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
      resume_call: function () {
        console.log("ui resume");

        console.log("updating existing UI elements");
        wfTitleText.setProperty(hmUI.prop.MORE, {
          text: `${time.hour % 12 || 12}:${time.minute.toString().padStart(2, "0")}`,
        });
        //update wfDate
        wfDateText.setProperty(hmUI.prop.MORE, {
          text: `${time.day} ${monthNumToString(time.month)}`,
        });

        read();
      },
      pause_call: function () {
        console.log("ui pause");
      },
    });
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
