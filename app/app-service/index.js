import { BasePage } from "@zeppos/zml/base-page";
import { Time } from "@zos/sensor";
import { log } from "@zos/utils";
import BGFetcher from "../libs/bg-fetcher";

const timeSensor = new Time();
const logger = log.getLogger("mini-app.app-service");
let bgFetcher;

AppService(
  BasePage({
    onEvent(e) {
      logger.log(`service onEvent(${e})`);
      let result = parseQuery(e);
      if (result.action === "exit") {
        appServiceMgr.exit();
      }
    },
    onInit(_) {
      bgFetcher = new BGFetcher(this);
      timeSensor.onPerMinute(() => {
        // Run every 5 minutes
        // var shouldRun = timeSensor.getMinutes() % 1 == 0;
        // if (!shouldRun) {
        //   return;
        // }

        bgFetcher.fetchBG();
      });
    }
  })
);
