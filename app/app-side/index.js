import { MessageBuilder } from "../shared/message";
import { Commands, SERVER_INFO_URL } from "../utils/config/constants";

// const logger = DeviceRuntimeCore.HmLogger.getLogger("nightscout_side");
const messageBuilder = new MessageBuilder();

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

const fetchInfo = async (ctx, url) => {
    console.log("App side-service - running fetchInfo")
  let resp = {};
  if (getDisableUpdates() === true) {
    resp = { error: true, message: "Updates disabled in Phone ZeppOS App" };
    const jsonDisabledResp = { data: { result: resp } };
    if (ctx !== false) {
      ctx.response(jsonDisabledResp);
    } else {
      return jsonDisabledResp;
    }
  }
  console.log("App-side: Fetching data");
  await fetch({
    url: url,
    method: "GET",
  })
    .then((response) => {
      if (!response.body) throw Error("No Data");

      return response.body;
    })
    .then((data) => {
      try {
        console.log("log", data);
        const transformedInfo = {
          bg: {
            val: data.bgnow.sgvs[0].scaled,
            delta: data.delta.scaled,
            trend: data.bgnow.sgvs[0].direction,
            isHigh: false,
            isLow: false,
            time: data.bgnow.mills,
            isStale: data.delta.elapsedMins > 10,
          },
          status: {
            now: (new Date(data.upbat.min.timestamp)).getTime(),
            isMgdl: false,
            bat: new Date().getMinutes(), //data.upbat.level
          },
          treatment: {
            insulin: "",
            carbs: "",
            time: "",
            predictIOB: "",
            predictBWP: "",
          },
          pump: {
            reservoir: data.pump.data.reservoir.display,
            iob: data.pump.loop.iob.iob,
            bat: 100,
          },
          settings: {
            updateInterval: getUpdateInterval(),
          },
        };

        resp = transformedInfo;
      } catch (error) {
        throw Error(error.message);
      }
    })
    .catch(function (error) {
      resp = { error: true, message: error.message };
    })
    .finally(() => {
      const jsonResp = { data: { result: resp } };
      if (ctx !== false) {
        ctx.response(jsonResp);
      } else {
        return jsonResp;
      }
    });
};

AppSideService({
  onInit() {
    messageBuilder.listen(() => {});
    messageBuilder.on("request", (ctx) => {
      const jsonRpc = messageBuilder.buf2Json(ctx.request.payload);
      const { params = {} } = jsonRpc;
      let url = getUrlConfig();

      if (!url.endsWith("/")) {
        url += "/";
      }

      let token = getAccessToken();

      switch (jsonRpc.method) {
        case Commands.getInfo:
          return fetchInfo(ctx, url + SERVER_INFO_URL + token);
        case "GET_SETTINGS":
          ctx.response({
            data: {
              result: {
                urlConfig: getUrlConfig(),
                updateInterval: getUpdateInterval(),
                disableUpdates: getDisableUpdates(),
              },
            },
          });
        default:
          break;
      }
    });
  },

  onRun() {},
  onDestroy() {},
});
