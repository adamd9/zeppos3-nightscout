import {MINUTE_IN_MS, SECOND_IN_MS} from "../../shared/date";

// new code by oakeley
/* export const DATA_TIMER_UPDATE_INTERVAL_MS = SECOND_IN_MS * 5;
export const DATA_UPDATE_INTERVAL_MS = SECOND_IN_MS * 20;

export const DATA_AOD_TIMER_UPDATE_INTERVAL_MS = SECOND_IN_MS * 5;
export const DATA_AOD_UPDATE_INTERVAL_MS = SECOND_IN_MS * 20; */

// old code
export const DATA_TIMER_UPDATE_INTERVAL_MS = SECOND_IN_MS * 30;
export const DATA_UPDATE_INTERVAL_MS = MINUTE_IN_MS * 5;

export const DATA_AOD_TIMER_UPDATE_INTERVAL_MS = SECOND_IN_MS * 30;
export const DATA_AOD_UPDATE_INTERVAL_MS = MINUTE_IN_MS * 5;

export const DATA_STALE_TIME_MS = SECOND_IN_MS * 10;

// usually 5 minutes, 1 minute for libre3 for whatever it is good
export const NIGHTSCOUT_UPDATE_INTERVAL_MS = MINUTE_IN_MS * 5;

export const FILES_DIR = "/storage/nightscout/";

export const Commands = {
    getInfo: "CMD_GET_INFO",
    getImg: "CMD_GET_IMG",
};

export const PROGRESS_UPDATE_INTERVAL_MS = 100;
export const PROGRESS_ANGLE_INC = 30;

export const Colors = {
    default:0xfc6950,
    defaultTransparent:0xababab,
    white:0xffffff,
    black:0x000000,
    bgHigh:0xffa0a0,
    bgLow:0x8bbbff,
    //accent:0xffbeff37,
    accent:0xff99cc33,
};

/*set to true on wf creation*/
export const TEST_DATA = false;
