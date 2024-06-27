import "./shared/device-polyfill";
import { MessageBuilder } from "./shared/message";
import { NIGHTSCOUT_APP_ID } from "./utils/config/global-constants";

const appId = NIGHTSCOUT_APP_ID;
const messageBuilder = new MessageBuilder({ appId });
App({
  globalData: {
    messageBuilder: messageBuilder,
  },
  onCreate(options) {
    console.log("Nightscout app on create invoke");
    messageBuilder.connect();
  },

  onDestroy(options) {
    console.log("Nightscout app on destroy invoke");
    messageBuilder.disConnect();
  },
});
