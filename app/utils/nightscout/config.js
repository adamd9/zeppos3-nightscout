import {NIGHTSCOUT_ALARM_SETTINGS_DEFAULTS, NIGHTSCOUT_SETTINGS_DEFAULTS, WF_CONFIG_FILE,} from "../config/global-constants";

import * as fs from "./../../shared/fs";
import {Path} from "../path";

let file;
export class WatchdripConfig {
    constructor() {
        file = new Path("full", WF_CONFIG_FILE);

        this.alarmSettings = NIGHTSCOUT_ALARM_SETTINGS_DEFAULTS;
        this.settings = NIGHTSCOUT_SETTINGS_DEFAULTS;
        this.settingsTime = 0;
        this.infoLastUpd= 0;
        this.infoLastUpdAttempt = 0;
        this.infoLastUpdSucess = false

        this.alarm_id = '-1';
        this.read();
    }

    read() {
        let parsed = file.fetchJSON();
        if (parsed) {
            parsed.nightscoutConfig = {...NIGHTSCOUT_SETTINGS_DEFAULTS, ...parsed.nightscoutConfig};
            parsed.nightscoutAlarmConfig = {...NIGHTSCOUT_ALARM_SETTINGS_DEFAULTS, ...parsed.nightscoutAlarmConfig};
            Object.assign(this, parsed);
        }
    }

    save() {
        file.overrideWithJSON(this);
    }
}