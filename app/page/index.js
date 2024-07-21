import AutoGUI, { multiplyHexColor } from "@silver-zepp/autogui";
import { log } from "@zos/utils";
import { readFileSync } from "@zos/fs";
import VisLog from "@silver-zepp/vis-log";
import { COLOR_GREEN, COLOR_WHITE } from "../libs/colors";
import * as appService from "@zos/app-service";
import { queryPermission, requestPermission } from "@zos/app";
import { BasePage } from "@zeppos/zml/base-page";
import BGFetcher from "../libs/bg-fetcher";
import { setStatusBarVisible } from "@zos/ui";

const logger = log.getLogger("mini-app.page");
const serviceFile = "app-service/index";
const permissions = ["device:os.bg_service"];

const vis = new VisLog("GlucoApp");
const gui = new AutoGUI();

class IndexPage {
  pageGui = {};
  textCurrentBg = "";
  constructor(bgFetcher) {
    // Step 1: Accept bgFetcher as an argument
    this.bgFetcher = bgFetcher; // Store bgFetcher for use within IndexPage
    this.updateBG = this.updateBG.bind(this);
  }
  init() {
    setStatusBarVisible(false);
    this.drawGUI();
    this.readBGFromFile();
    this.initVIS(); // logger should be init after the GUI was drawn
    this.updateBG();
  }

  initVIS() {
    // set up logger: 1. logs from the to p; 2. limit the line count
    vis.updateSettings({ log_from_top: true, line_count: 2 });
  }

  drawGUI() {
    AutoGUI.SetPadding(10);
    // create a group that will contain a big app name text surrounded with a rectangle
    gui.startGroup();
    gui.strokeRect(0x666666, { line_width: 8, radius: 10 });
    this.pageGui.line1 = gui.text("Nightscout App", { text_size: 40 });
    gui.endGroup();

    // goto the second row
    gui.newRow();

    // this is your REUSABLE textfield
    this.pageGui.line2 = gui.text("Refreshing...");

    // goto the third row
    gui.newRow();

    this.pageGui.line3 = gui.button("Refresh", this.updateBG, { text_size: 40, normal_color: 0x666666, radius: 10 });
    // render the GUI
    gui.render();
  }

  readBGFromFile() {
    logger.log("Reading gluco from file...");

    try {
      const file_name = "glucose.txt";

      const strBgData = readFileSync({
        path: file_name,
        options: {
          encoding: "utf8",
        },
      });

      const data = JSON.parse(strBgData);

      this.textCurrentBg = data.bg.val || "No data available";
      logger.log("done");
      logger.log(`Gluco: ${this.textCurrentBg}`);
      this.pageGui.line1.update({ text: this.textCurrentBg });
      const currentTime = new Date().getTime(); // Get current time in milliseconds
      const bgTime = data.bg.time; // BG time in UTC milliseconds
      const minutesAgo = Math.floor((currentTime - bgTime) / 60000); // Calculate difference in minutes
      this.pageGui.line2.update({ text: `${minutesAgo} mins ago` }); // Update line2 with the calculated time difference
    } catch (error) {
      logger.log("readBGFromFile failed", error);
      //no need to warn on screen, probably just means it's never been run before
      // vis.warn("readBGFromFile failed", error.message);
    }
  }

  updateBG() {
    logger.log("updateBG: Reading gluco...");
    logger.log("fetchData: starting fetch");
    this.pageGui.line2.update({ text: `Refreshing...` });
    // Timeout promise function
    function timeout(ms) {
      return new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout: Unable to reach phone")), ms));
    }

    this.bgFetcher
      .fetchBG()
      .then((response) => {
        const data = response.result;
        logger.log("receive data", data);
        if (!data) {
          logger.log("No response body:", JSON.stringify(response));
          if (response.status === "ERROR") {
            this.pageGui.line2.update({ text: `Error: ${response.message}` });
          } else {
            this.pageGui.line2.update({ text: `Error: No response received` });
          }
          return;
        }
        if (data.error) {
          if (data.message.includes("Only absolute URLs are supported") || data.message.includes("unsupported URL")) {
            this.pageGui.line2.update({ text: `No app settings found!` });
            return;
          }
          this.pageGui.line2.update({ text: `Error: ${data.message}` });
          return;
        }
        // Assuming result.bg.val is the value you're interested in
        this.textCurrentBg = data.bg.val || "No data available";
        logger.log("done");
        logger.log(`Gluco: ${this.textCurrentBg}`);
        this.pageGui.line1.update({ text: this.textCurrentBg });
        const currentTime = new Date().getTime(); // Get current time in milliseconds
        const bgTime = data.bg.time; // BG time in UTC milliseconds
        const minutesAgo = Math.floor((currentTime - bgTime) / 60000); // Calculate difference in minutes
        this.pageGui.line2.update({ text: `${minutesAgo} mins ago` }); // Update line2 with the calculated time difference
      })
      .catch((errorResult) => {
        logger.log("updateBG: fetch data failed", JSON.stringify(errorResult.message));
        vis.warn("updateBG: fetch data failed", JSON.stringify(errorResult.message));
        if (errorResult.message === "Only absolute URLs are supported") {
          this.pageGui.line2.update({ text: `Nightscout settings not configured on Zepp Phone App` });
        } else {
          this.pageGui.line2.update({ text: `Error: ${errorResult.message}` });
        }
      });

    // Race the fetchBG promise against the timeout
    Promise.race([this.bgFetcher.fetchBG(), timeout(10000)])
      .then((response) => {
        const data = response.result;
        logger.log("receive data", data);
        // Handle success as before
      })
      .catch((error) => {
        if (error.message === "Request timed out") {
          // Handle timeout specific logic here
          logger.log("fetchBG: request timed out");
          this.pageGui.line2.update({ text: `Request timed out` });
        } else {
          // Handle other errors as before
        }
      });
  }

  quit() {
    // clean up
  }
}
Page(
  BasePage({
    state: {},
    build() {
      // set up AutoGUI before creating the page
      AutoGUI.SetColor(multiplyHexColor(COLOR_WHITE, 0.2));
      AutoGUI.SetTextColor(COLOR_GREEN);
      this.bgFetcher = new BGFetcher(this);

      this.index = new IndexPage(this.bgFetcher);

      this.index.init();

      const vm = this;
      let services = appService.getAllAppServices();
      vm.state.running = services.includes(serviceFile);
      logger.log("running", vm.state.running);
      if (!vm.state.running) {
        permissionRequest(vm);
      }
    },

    onDestroy() {
      this.index.quit();
    },
  })
);

//********************************//
//**          HELPERS           **//
//********************************//
function str2ab(str) {
  var buf = new ArrayBuffer(str.length);
  var buf_view = new Uint8Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    buf_view[i] = str.charCodeAt(i);
  }
  return buf;
}

function permissionRequest(vm) {
  const [result2] = queryPermission({
    permissions,
  });

  logger.log("permissionRequest", result2);
  if (result2 === 0) {
    requestPermission({
      permissions,
      callback([result2]) {
        logger.log("permissionRequestAfter", result2);
        if (result2 === 2) {
          startTimeService(vm);
        }
      },
    });
  } else if (result2 === 2) {
    startTimeService(vm);
  }
}

function startTimeService(vm) {
  logger.log(`=== start service: ${serviceFile} ===`);
  const result = appService.start({
    url: serviceFile,
    param: `service=${serviceFile}&action=start`,
    complete_func: (info) => {
      logger.log(`startService result: ` + JSON.stringify(info));
      // refresh for button status

      if (info.result) {
        vm.state.running = true;
        logger.log("running", info.result);
      }
    },
  });

  if (result) {
    logger.log("startService result: ", result);
  }
}
