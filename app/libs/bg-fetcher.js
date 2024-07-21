import { log } from "@zos/utils";
import { writeFileSync } from "@zos/fs";

const logger = log.getLogger("mini-app.bg-fetcher");
const file_name = "glucose.txt";

class BGFetcher {
  constructor(vm) {
    this.vm = vm;
  }

  fetchBG() {
    // Assuming settings are passed directly to fetchBG now
    return this.vm
      .request({
        method: "GET_BG",
      })
      .then((response) => {

        const data = response.data.result;
        logger.log("BG data", data);

        writeDataToFile(data);

        return {
          status: "OK",
          result: data,
        };
      })
      .catch((error) => {
        logger.log("ERROR", error);
        return {
          status: "ERROR",
          message: error.message,
        };
      });
  }

}

function writeDataToFile(data) {
  writeFileSync({
    path: file_name,
    data: typeof data === "string" ? data : JSON.stringify(data),
    options: {
      encoding: "utf8",
    },
  });
  logger.log("Glucose data written to file");
}

export default BGFetcher;
