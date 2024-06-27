import {ALARM_UPDATE_INTERVAL} from "./constants";

export const NIGHTSCOUT_APP_ID = "1051061";


 export const WF_DIR = "/storage/js_apps/data/nightscout";
 export const WF_INFO_FILE = WF_DIR + "/info.json";
 export const WF_CONFIG_FILE = WF_DIR + "/config.json";

export const NIGHTSCOUT_SETTINGS_DEFAULTS = {
    disableUpdates: false,
};

export const NIGHTSCOUT_ALARM_SETTINGS_DEFAULTS = {
    fetchInterval: ALARM_UPDATE_INTERVAL,
};