import { BaseSideService } from "@zeppos/zml/base-side";

NS_API_ENDPOINT = "api/v2/properties?token=";

const DEFAULT_SETTINGS = {
  urlConfig: "",
  updateInterval: 3, // Default interval in minutes
  disableUpdates: false,
};

function getUrlConfig() {
  return settings.settingsStorage.getItem("urlConfig")
    ? JSON.parse(settings.settingsStorage.getItem("urlConfig"))
    : DEFAULT_SETTINGS.urlConfig;
}

function getAccessToken() {
  return settings.settingsStorage.getItem("accessToken")
    ? JSON.parse(settings.settingsStorage.getItem("accessToken"))
    : DEFAULT_SETTINGS.accessToken;
}

function getUpdateInterval() {
  return settings.settingsStorage.getItem("updateInterval")
    ? JSON.parse(settings.settingsStorage.getItem("updateInterval"))
    : DEFAULT_SETTINGS.updateInterval;
}

function getDisableUpdates() {
  return settings.settingsStorage.getItem("disableUpdates")
    ? JSON.parse(settings.settingsStorage.getItem("disableUpdates"))
    : DEFAULT_SETTINGS.disableUpdates;
}

AppSideService(
  BaseSideService({
    onInit() {
      console.log("AppSideService onInit");
    },

    onRequest(req, res) {
      console.log("=====>,", req.method);
      if (req.method === "GET_SETTINGS") {
        res(null, {
          urlConfig: JSON.parse(settings.settingsStorage.getItem("urlConfig")),
          accessToken: JSON.parse(settings.settingsStorage.getItem("accessToken")),
          updateInterval: settings.settingsStorage.getItem("updateInterval"),
          disableUpdates: settings.settingsStorage.getItem("disableUpdates"),
        });
      }
      if (req.method === "GET_BG") {
        let url = getUrlConfig();

        if (!url.endsWith("/")) {
          url += "/";
        }

        let token = getAccessToken();
        this.fetchInfo(url + NS_API_ENDPOINT + token).then((response) => {
          console.log("App side-service - response", response);
          res(null, response);
        });
      }
    },

    fetchInfo(url) {
      return new Promise((resolve, reject) => {
        console.log("App side-service - running fetchInfo");
        let resp = {};
        if (getDisableUpdates() === true) {
          resp = { error: true, message: "Updates disabled in Phone ZeppOS App" };
          resolve({ data: { result: resp } });
          return;
        }
        console.log("App-side: Fetching data");
        fetch({
          url: url,
          method: "GET",
        })
          .then((response) => {
            if (!response.body) throw new Error("No Data");
            return response.body;
          })
          .then((data) => {
            try {
              console.log("log", data);
              const transformedInfo = {
                bg: {
                  val:
                    typeof data.bgnow.sgvs[0].scaled === "number"
                      ? data.bgnow.sgvs[0].scaled.toString()
                      : data.bgnow.sgvs[0].scaled,
                  delta: data.delta.scaled,
                  trend: data.bgnow.sgvs[0].direction,
                  isHigh: false,
                  isLow: false,
                  time: data.bgnow.mills,
                  isStale: data.delta.elapsedMins > 10,
                },
                status: {
                  isMgdl:
                    data.bgnow.sgvs[0].scaled && data.bgnow.sgvs[0].mgdl
                      ? data.bgnow.sgvs[0].scaled === data.bgnow.sgvs[0].mgdl
                      : null,
                },
                settings: {
                  updateInterval: getUpdateInterval(),
                },
              };
              resp = transformedInfo;
              resolve({ data: { result: resp } });
            } catch (error) {
              reject(error);
            }
          })
          .catch((error) => {
            console.log("ERROR", error);
            resp = { error: true, message: error.message };
            resolve({ data: { result: resp } }); // Use resolve to send error object in case of failure
          });
      });
    },

    onRun() {},

    onDestroy() {},
  })
);
