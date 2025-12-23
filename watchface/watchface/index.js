import { COMPANION_APP_ID, BG_DATA_FILE } from "../libs/constants";
import * as hmUI from "@zos/ui";
import { log } from "@zos/utils";
import { Time } from "@zos/sensor";
import { launchApp } from "@zos/router";
import { openSync, readSync, closeSync, O_RDONLY } from "@zos/fs";
const logger = log.getLogger("wf-nightscout-z3");
const time = new Time();
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
    let aodTitleText, aodDateText, aodDateBackground, aodBgText;
    // Set padding (if applicable, otherwise you can set margins individually for elements)
    const padding = 20;
    const aodColor = 0x777777;

    // Create the big app name text
    wfTitleText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: padding,
      y: padding,
      w: 300,
      h: 120,
      text: "10:09",
      text_size: 100,
      color: 0x07d570,
      show_level: hmUI.show_level.ONLY_NORMAL,
    });

    aodTitleText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: padding,
      y: padding,
      w: 300,
      h: 120,
      text: "10:09",
      text_size: 100,
      color: aodColor,
      show_level: hmUI.show_level.ONAL_AOD,
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
      show_level: hmUI.show_level.ONLY_NORMAL,
    });

    aodDateText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: padding,
      y: padding + 130,
      w: 200,
      h: 40,
      text: "Monday 5",
      text_size: 30,
      color: aodColor,
      show_level: hmUI.show_level.ONAL_AOD,
    });

    // Create the rectangle background
    wfDateBackground = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
      x: padding,
      y: 220,
      w: 200,
      h: 100,
      color: 0x07d570,
      radius: 10,
      show_level: hmUI.show_level.ONLY_NORMAL,
    });

    aodDateBackground = hmUI.createWidget(hmUI.widget.STROKE_RECT, {
      x: padding,
      y: 220,
      w: 200,
      h: 100,
      color: aodColor,
      radius: 10,
      show_level: hmUI.show_level.ONAL_AOD,
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
      show_level: hmUI.show_level.ONLY_NORMAL,
    });

    aodBgText = hmUI.createWidget(hmUI.widget.TEXT, {
      x: padding + 20,
      y: 230,
      w: 260,
      h: 80,
      text: "--",
      text_size: 50,
      color: aodColor,
      show_level: hmUI.show_level.ONAL_AOD,
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
      show_level: hmUI.show_level.ONLY_NORMAL,
      click_func: () => {
        console.log("Open app");
        launchApp({ appId: COMPANION_APP_ID, url: "page/index" });
      },
    });

    function read() {
      logger.log("reading...");

      let str_result = "";
      try {
        const fh = openSync({
          path: BG_DATA_FILE,
          flag: O_RDONLY,
          options: {
            appId: COMPANION_APP_ID,
          },
        });

        const len = 1024;
        const array_buffer = new ArrayBuffer(len);
        readSync({ fd: fh, buffer: array_buffer });
        closeSync({ fd: fh });

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
        aodBgText.setProperty(hmUI.prop.MORE, { text: `${bgVal} ${bgTrend}` });
        const currentTime = new Date().getTime(); // Get current time in milliseconds
        if (currentTime - bgTimeStamp > 360000) {
          // Change the colour to orange
          bgWidget.setProperty(hmUI.prop.MORE, { color: 0xffa500 });
          aodBgText.setProperty(hmUI.prop.MORE, { color: aodColor });
        } else {
          bgWidget.setProperty(hmUI.prop.MORE, { color: 0xffffff });
          aodBgText.setProperty(hmUI.prop.MORE, { color: aodColor });
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
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const timeText = `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")}`;
        wfTitleText.setProperty(hmUI.prop.MORE, {
          text: timeText,
        });
        aodTitleText.setProperty(hmUI.prop.MORE, { text: timeText });
        //update wfDate
        const dateText = `${time.getDate()} ${monthNumToString(time.getMonth())}`;
        wfDateText.setProperty(hmUI.prop.MORE, { text: dateText });
        aodDateText.setProperty(hmUI.prop.MORE, { text: dateText });

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
