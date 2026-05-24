import { BaseSideService } from "@zeppos/zml/base-side";

NS_API_ENDPOINT = "api/v2/properties?token=";
const GLUROO_HOST_RE = /(^|\.)gluroo\.com$/i;
const GLURU_HOST_RE = /(^|\.)gluru\.com$/i;
const NIGHTSCOUT_TOKEN_RE = /^[A-Za-z0-9_-]+(?:-[A-Za-z0-9_-]+)*$/;
const CONTROL_CHARS_RE = /[\u0000-\u001f\u007f-\u009f]/g;

const DEFAULT_SETTINGS = {
  urlConfig: "",
  accessToken: "",
  bgUnits: "mgdl",
  updateInterval: 3, // Default interval in minutes
  disableUpdates: false,
};

function normalizeBgUnits(value) {
  const raw = String(value || "").trim().toLowerCase();
  if (raw === "mmol" || raw === "mmol/l" || raw === "mmoll") {
    return "mmol";
  }
  return "mgdl";
}

function getBgUnits() {
  return settings.settingsStorage.getItem("bgUnits")
    ? normalizeBgUnits(JSON.parse(settings.settingsStorage.getItem("bgUnits")))
    : DEFAULT_SETTINGS.bgUnits;
}

function toDisplayBgValue(mgdlValue, units) {
  const n = Number(mgdlValue);
  if (!Number.isFinite(n)) {
    return String(mgdlValue);
  }
  if (units === "mmol") {
    return (Math.round((n / 18) * 10) / 10).toFixed(1);
  }
  return Math.round(n).toString();
}

function toDisplayDeltaValue(mgdlDelta, units) {
  const n = Number(mgdlDelta);
  if (!Number.isFinite(n)) {
    return mgdlDelta;
  }
  if (units === "mmol") {
    return Math.round((n / 18) * 10) / 10;
  }
  return Math.round(n);
}

function sanitizeToken(token) {
  if (token === undefined || token === null) {
    return "";
  }
  return String(token).replace(CONTROL_CHARS_RE, "");
}

function getHostname(url) {
  if (!url) {
    return "";
  }
  const clean = String(url).trim().toLowerCase().replace(/^[a-z]+:\/\//i, "");
  const hostWithPath = clean.split("/")[0] || "";
  return hostWithPath.split(":")[0] || "";
}

function isGlurooDomain(url) {
  const host = getHostname(url);
  return GLUROO_HOST_RE.test(host) || GLURU_HOST_RE.test(host);
}

function isValidNightscoutToken(token) {
  if (!token) {
    return true;
  }
  return NIGHTSCOUT_TOKEN_RE.test(token);
}

function parseObjectPayload(data) {
  const units = getBgUnits();
  if (data && data.bgnow && data.bgnow.sgvs && data.bgnow.sgvs[0]) {
    const sgv = data.bgnow.sgvs[0];
    const sourceVal = sgv.mgdl !== undefined ? sgv.mgdl : sgv.scaled;
    const sourceDelta = data.delta && data.delta.mgdl !== undefined
      ? data.delta.mgdl
      : (data.delta ? data.delta.scaled : undefined);
    return {
      bg: {
        val: toDisplayBgValue(sourceVal, units),
        delta: toDisplayDeltaValue(sourceDelta, units),
        trend: sgv.direction,
        isHigh: false,
        isLow: false,
        time: data.bgnow.mills,
        isStale: Boolean(data.delta && data.delta.elapsedMins > 10),
      },
      status: {
        isMgdl: units === "mgdl",
      },
      settings: {
        updateInterval: getUpdateInterval(),
        bgUnits: units,
      },
    };
  }

  const source = Array.isArray(data) ? data[0] : data;
  if (!source || typeof source !== "object") {
    throw new Error("Unsupported BG payload format");
  }

  const val = source.sgv || source.bg || source.glucose || source.value || source.mgdl;
  if (val === undefined || val === null) {
    throw new Error("Unsupported BG payload format");
  }

  const ts = Number(source.mills || source.date || source.datetime || source.timestamp) || Date.now();

  return {
    bg: {
      val: toDisplayBgValue(val, units),
      delta: source.delta,
      trend: source.direction || source.trend || source.trendArrow || source.arrow || "NOT COMPUTABLE",
      isHigh: false,
      isLow: false,
      time: ts,
      isStale: false,
    },
    status: {
      isMgdl: units === "mgdl",
    },
    settings: {
      updateInterval: getUpdateInterval(),
      bgUnits: units,
    },
  };
}

function parseTabDelimitedPayload(text) {
  const units = getBgUnits();
  const line = String(text)
    .split(/\r?\n/)
    .map((x) => x.trim())
    .filter(Boolean)[0];

  if (!line) {
    throw new Error("No Data");
  }

  const cols = line.split("\t");
  const val = cols[0] ? cols[0].trim() : "";
  if (!val) {
    throw new Error("Unsupported BG payload format");
  }

  const trend = cols[1] ? cols[1].trim() : "NOT COMPUTABLE";
  const tsRaw = Number(cols[2]);
  const ts = Number.isFinite(tsRaw)
    ? (tsRaw < 1e12 ? tsRaw * 1000 : tsRaw)
    : Date.now();

  return {
    bg: {
      val: toDisplayBgValue(val, units),
      delta: undefined,
      trend: trend,
      isHigh: false,
      isLow: false,
      time: ts,
      isStale: false,
    },
    status: {
      isMgdl: units === "mgdl",
    },
    settings: {
      updateInterval: getUpdateInterval(),
      bgUnits: units,
    },
  };
}

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
          bgUnits: settings.settingsStorage.getItem("bgUnits"),
          updateInterval: settings.settingsStorage.getItem("updateInterval"),
          disableUpdates: settings.settingsStorage.getItem("disableUpdates"),
        });
      }
      if (req.method === "GET_BG") {
        let url = getUrlConfig();

        if (!url.endsWith("/")) {
          url += "/";
        }

        const token = sanitizeToken(getAccessToken());

        if (!isGlurooDomain(url) && !isValidNightscoutToken(token)) {
          res(null, { data: { result: { error: true, message: "Invalid access token format for Nightscout endpoint" } } });
          return;
        }

        this.fetchInfo(url + NS_API_ENDPOINT + encodeURIComponent(token)).then((response) => {
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
              let transformedInfo;
              if (typeof data === "string") {
                try {
                  transformedInfo = parseObjectPayload(JSON.parse(data));
                } catch (_jsonError) {
                  transformedInfo = parseTabDelimitedPayload(data);
                }
              } else {
                transformedInfo = parseObjectPayload(data);
              }
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
