const logger = DeviceRuntimeCore.HmLogger.getLogger('wf-nightscout')

App({
  globalData: {
    logger: logger,
    nightscout: { }
  },
  onCreate(options) {
    logger.log('Nightscout watchface on create invoke')
  },

  onDestroy(options) {
    logger.log('Nightscout watchface on destroy invoke')
  }
})