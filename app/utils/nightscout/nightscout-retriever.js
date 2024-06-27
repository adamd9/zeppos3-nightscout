import {
    Commands
} from "../config/constants";

import {
    NIGHTSCOUT_ALARM_SETTINGS_DEFAULTS,
} from "../config/global-constants";

const logger = DeviceRuntimeCore.HmLogger.getLogger("nightscout_app");

const {messageBuilder} = getApp()._options.globalData;

export class NightscoutRetriever {
    constructor() {
        this.lastInfoUpdate = null;
        this.lastUpdateSucessful = false;
    }

    fetchInfo(callback) {
        try {
            logger.log("fetchInfoRetriever")

            this.resetLastUpdate();
            if (messageBuilder.connectStatus() === false) {
                logger.log("No BT Connection");
                if (isDisplay) {
                    //this.showMessage(getText("status_no_bt"));
                } else {
                }
                callback({error: true, message: "No BT Connection"})
            }
    
            logger.log('fetchInfoRetriever: building message')
            messageBuilder.request({
                    method: Commands.getInfo
                }, { timeout: 5000 })
                .then((data) => {
                    logger.log("fetchInfoRetriever: retriever received data from side-service", data);
                    let { result: info = {} } = data;
    
                    try {
                        if (info.error) {
                            logger.log("fetchInfoRetriever: Error");
                            logger.log(info);
                            callback({error: true, message: info.message})
                        }    
                        callback(info)
                    } catch (e) {
                        logger.log("fetchInfoRetriever: error:" + e);
                    }
                })
                .catch((error) => {
                    logger.log("fetchInfoRetriever: fetch error:" + error);
                })
                .finally(() => {
    
                });            
        } catch (error) {
            callback({error: true, message: error})
        }

    }

    // Placeholder methods for those called within fetchInfo
    resetLastUpdate() {
        // implementation needed
    }



}
