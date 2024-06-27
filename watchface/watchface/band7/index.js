import { BG_IMG, BG_FILL_RECT } from "../../utils/config/styles_global";
import { NIGHTSCOUT_APP_ID } from "../../utils/config/global-constants";
import {
  DIGITAL_TIME,
  DIGITAL_TIME_AOD,
  WEEK_DAYS_IMG,
  DATE_TEXT_IMG,
  IMG_STATUS_BT_DISCONNECTED,
  BG_VALUE_TEXT_IMG,
  BG_VALUE_TEXT_IMG_AOD,
  BG_TIME_TEXT,
  BG_TREND_IMAGE,
} from "./styles";
import { str2json } from "../../shared/data";

const logger = getApp()._options.globalData.logger;

let bgValTextImgWidget, bgTrendImageWidget, bgAdditionalTextButtonWidget;
let timerLastUpdated, currTime;

function mergeStyles(styleObj1, styleObj2, styleObj3 = {}) {
  return Object.assign({}, styleObj1, styleObj2, styleObj3);
}

WatchFace({
  onInit() {
    logger.log("Nightscout watchface index page.js on init invoke");
  },

  build() {
    logger.log("Nightscout watchface index page.js on build invoke");
    this.initView();
  },

  initView() {
    var self = this;
    const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
      resume_call: function () {
        console.log("ui resume");
        self.checkAlarmStatus();
        self.updateValues();
      },
      pause_call: function () {
        console.log("ui pause");
      },
    });

    screenType = hmSetting.getScreenType();
    if (screenType === hmSetting.screen_type.AOD) {
      const digitalClock = hmUI.createWidget(hmUI.widget.IMG_TIME, mergeStyles(DIGITAL_TIME, DIGITAL_TIME_AOD));
    } else {
      const digitalClock = hmUI.createWidget(hmUI.widget.IMG_TIME, DIGITAL_TIME);
    }

    const daysImg = hmUI.createWidget(hmUI.widget.IMG_WEEK, WEEK_DAYS_IMG);
    const dateTextImg = hmUI.createWidget(hmUI.widget.IMG_DATE, DATE_TEXT_IMG);
    const btDisconnected = hmUI.createWidget(hmUI.widget.IMG_STATUS, IMG_STATUS_BT_DISCONNECTED);

    if (screenType === hmSetting.screen_type.AOD) {
      //removed mergstyles to see if it fixes
      bgValTextImgWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, BG_VALUE_TEXT_IMG_AOD);
    } else {
      bgValTextImgWidget = hmUI.createWidget(hmUI.widget.TEXT_IMG, BG_VALUE_TEXT_IMG);
    }

    //   if (screenType === hmSetting.screen_type.AOD) {
    //     logger.log("IS_AOD_TRUE");
    //     if (this.intervalTimer !== null) return; //already started

    //     const interval = 180000

    //     logger.log("startTimerDataUpdates, interval: " + interval);

    //     this.intervalTimer = this.getGlobal().setInterval(() => {
    //       logger.log("updating AOD")
    //         this.updateValues();
    //     }, interval);
    // }
    bgAdditionalTextButtonWidget = hmUI.createWidget(hmUI.widget.BUTTON, {
      x: 42,
      y: 300,
      w: 120,
      h: 40,
      radius: 12,
      normal_color: 0x808080,
      press_color: 0xb0b0b0,
      text: "...",
      show_level: hmUI.show_level.ONLY_NORMAL,
      click_func: () => {
        logger.log("Button pressed");
        hmApp.startApp({
          appid: NIGHTSCOUT_APP_ID,
          url: "page/index",
          param: "main",
        });
      },
    });
    bgTrendImageWidget = hmUI.createWidget(hmUI.widget.IMG, BG_TREND_IMAGE);
  },

  onDestroy() {
    logger.log("Nightscout watchface index page.js on destroy invoke");
  },

  updateValues() {
    logger.log("updating values");
    const fsLatestInfo = hmFS.SysProGetChars("fs_last_info");
    logger.log("got latest info from FS", fsLatestInfo);
    let dataInfo;
    if (fsLatestInfo) {
      dataInfo = str2json(fsLatestInfo);
      logger.log("dataInfo", dataInfo);
    }
    if (dataInfo && !dataInfo.error) {
      bgValTextImgWidget.setProperty(hmUI.prop.VISIBLE, true);
      bgValTextImgWidget.setProperty(hmUI.prop.TEXT, dataInfo.bg.val);
      let bgTimeInMinutes;

      if (dataInfo && dataInfo.bg && typeof dataInfo.bg.time === "number") {
        const currentTime = Date.now(); // Current time in milliseconds
        const differenceInMillis = currentTime - dataInfo.bg.time; // Difference in milliseconds

        // Convert milliseconds to minutes
        bgTimeInMinutes = Math.round(differenceInMillis / 60000);
      } else {
        // Handle cases where bg or bg.time is not available or not a valid timestamp
        console.error("Invalid or missing bg.time value");
      }
      bgAdditionalTextButtonWidget.setProperty(hmUI.prop.VISIBLE, false);
      bgAdditionalTextButtonWidget.setProperty(hmUI.prop.TEXT, bgTimeInMinutes.toString() + " min");
      bgAdditionalTextButtonWidget.setProperty(hmUI.prop.VISIBLE, true);

      bgTrendImageWidget.setProperty(hmUI.prop.VISIBLE, false);
      bgTrendImageWidget.setProperty(hmUI.prop.SRC, this.getArrowResource(dataInfo.bg.trend));
      bgTrendImageWidget.setProperty(hmUI.prop.VISIBLE, true);
    } else {
      logger.log("latest info is an error", dataInfo);
      bgValTextImgWidget.setProperty(hmUI.prop.VISIBLE, true);
      bgValTextImgWidget.setProperty(hmUI.prop.TEXT, "...");

      bgTrendImageWidget.setProperty(hmUI.prop.SRC, "None");

      bgAdditionalTextButtonWidget.setProperty(hmUI.prop.VISIBLE, false);
      bgAdditionalTextButtonWidget.setProperty(hmUI.prop.TEXT, dataInfo.message);
      bgAdditionalTextButtonWidget.setProperty(hmUI.prop.VISIBLE, true);
    }
  },

  getArrowResource(trend) {
    let fileName = trend;
    if (fileName === undefined || fileName === "") {
      fileName = "None";
    }
    return `nightscout/arrows/${fileName}.png`;
  },

  onShow() {
    logger.log("index.js on show");
  },

  onHide() {
    logger.log("index.js on hide");
  },

  checkAlarmStatus() {
    const fs_last_start_app_wf_page = hmFS.SysProGetChars("fs_last_start_app_wf_page");
    const recentlyStartedAppWfPage = fs_last_start_app_wf_page ? Date.now() - fs_last_start_app_wf_page < 900000 : false;

    const fs_last_wf_alarm = hmFS.SysProGetChars("fs_last_wf_alarm");
    const fs_last_wf_alarm_interval = hmFS.SysProGetChars("fs_last_wf_alarm_interval");

    if (recentlyStartedAppWfPage) {
      logger.log("fsLastAlarm recently started App WF page");
      if (!fs_last_wf_alarm || !fs_last_wf_alarm_interval) {
        logger.log(
          "fsLastAlarm tried to autostart retriever app page and no alarm details found, so must be old ver 1.0.1. Not retrying"
        );
      } else {
        const alarmIsStale = Date.now() - fs_last_wf_alarm > fs_last_wf_alarm_interval + 30000;
        if (alarmIsStale) {
          logger.log("fsLastAlarm Alarm is older than interval setting, starting retriever app page");
          hmFS.SysProSetChars("fs_last_start_app_wf_page", Date.now());
          hmApp.startApp({ appid: NIGHTSCOUT_APP_ID, url: "page/wf-page" });
        } else {
          logger.log("fsLastAlarm Alarm is active.");
        }
      }
    } else {
      logger.log("fsLastAlarm Starting retriever app page");
      hmFS.SysProSetChars("fs_last_start_app_wf_page", Date.now());
      hmApp.startApp({ appid: NIGHTSCOUT_APP_ID, url: "page/wf-page" });
    }    
  },
});
