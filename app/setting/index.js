// settings.js
import { gettext } from 'i18n';

const DEFAULT_SETTINGS = {
  urlConfig: '',
  accessToken: '',
  updateInterval: 3, // Default interval in minutes
  disableUpdates: false,
};

AppSettingsPage({
  state: {
    settings: {}
  },
  // Initialize settings with default or stored values
  initSettings() {
    this.state.settings = {
      urlConfig: this.getUrlConfig(),
      accessToken: this.getAccessToken(),
      updateInterval: this.getUpdateInterval(),
      disableUpdates: this.getDisableUpdates(),
    };
  },
  // Retrieve URL Configuration from storage or use default
  getUrlConfig() {
    const storedUrlConfig = this.state.props.settingsStorage.getItem('urlConfig');
    return storedUrlConfig ? JSON.parse(storedUrlConfig) : DEFAULT_SETTINGS.urlConfig;
  },
  // Retrieve URL Configuration from storage or use default
  getAccessToken() {
    const storedAccessToken = this.state.props.settingsStorage.getItem('accessToken');
    return storedAccessToken ? JSON.parse(storedAccessToken) : DEFAULT_SETTINGS.accessToken;
  },
  // Update URL Configuration
  setUrlConfig(value) {
    this.state.settings.urlConfig = value;
    this.state.props.settingsStorage.setItem('urlConfig', JSON.stringify(value));
  },
  // Update access token Configuration
  setAccessToken(value) {
    this.state.settings.accessToken = value;
    this.state.props.settingsStorage.setItem('accessToken', JSON.stringify(value));
  },  
  // Retrieve Update Interval from storage or use default
  getUpdateInterval() {
    const storedUpdateInterval = this.state.props.settingsStorage.getItem('updateInterval');
    return storedUpdateInterval ? JSON.parse(storedUpdateInterval) : DEFAULT_SETTINGS.updateInterval;
  },
  // Update Update Interval
  setUpdateInterval(value) {
    this.state.settings.updateInterval = value;
    this.state.props.settingsStorage.setItem('updateInterval', JSON.stringify(value));
  },
  getDisableUpdates() {
    const storedDisableUpdates = this.state.props.settingsStorage.getItem('disableUpdates');
    return storedDisableUpdates ? JSON.parse(storedDisableUpdates) : DEFAULT_SETTINGS.disableUpdates;
  },
  // Update Disable Updates
  setDisableUpdates(value) {
    this.state.settings.disableUpdates = value;
    this.state.props.settingsStorage.setItem('disableUpdates', JSON.stringify(value));
  },
  // Component initialization
  build(props) {
    this.state.props = props;
    this.initSettings();

    return View(
      {
        style: {
          padding: '12px 20px'
        }
      },
      [
        Text({
          style: {
            paddingBottom: "20px",
            fontWeight: "bold",
            fontSize: "20px"
          }
        },"Nightscout Settings"),
        Text({
          paragraph: true,
          style: {
            paddingBottom: "20px",
          }
        },"Tap a setting to change it"),
        TextInput({
          label: gettext('Nightscout Server URL'),
          placeholder: 'https://my.nightscoutserver.com',
          value: this.state.settings.urlConfig,
          labelStyle: {
            fontWeight: "bold"
          },
          subStyle: {
            minHeight: "30px",  
            textDecoration: "underline",
            marginBottom: "10px",
            padding: "5px",
            margin: "5px",
            border: "1px solid #cccccc",
            borderRadius: "5px"
          },
          onChange: (val) => {
            this.setUrlConfig(val);
          }
        }),
        TextInput({
          label: gettext('Access token'),
          placeholder: 'tokenname-7d4770f5493dcf43',
          value: this.state.settings.accessToken,
          labelStyle: {
            fontWeight: "bold"
          },
          subStyle: {
            minHeight: "30px", 
            textDecoration: "underline",
            marginBottom: "10px",
            padding: "5px",
            margin: "5px",
            border: "1px solid #cccccc",
            borderRadius: "5px"
          },
          onChange: (val) => {
            this.setAccessToken(val);
          }
        }),        
        TextInput({
          minHeight: "30px", 
          label: gettext('Update Interval (minutes)'),
          value: String(this.state.settings.updateInterval),
          labelStyle: {
            fontWeight: "bold"
          },
          subStyle: {
            textDecoration: "underline",
            marginBottom: "10px",
            padding: "5px",
            margin: "5px",
            border: "1px solid #cccccc",
            borderRadius: "5px"
          },
          onChange: (val) => {
            const interval = parseInt(val, 10);
            if (!isNaN(interval) && interval > 0) {
              this.setUpdateInterval(interval);
            } else {
              console.log("Invalid interval. It must be a positive number.");
            }
          }
        }),
        Toggle({
          label: 'Disable updates',
          value: this.state.settings.disableUpdates,
          onChange: (val) => {
            this.setDisableUpdates(val);
          }
        }),      
        Text({
          paragraph: true,
          style: {
            paddingTop: "20px",
            paddingBottom: "10px",
            fontSize: "12px"
          }
        },"ZeppOS Nightscout app by Adam Dinneen 2024"),
        Link({
          source: "https://github.com/adamd9/zeppos3-nightscout",
        },"GitHub Project"),
        Text({
          paragraph: false,
          style: {
          }
        }," | "),
        Link({
          source: "mailto:adam@greatmachineinthesky.com?subject=Nightscout%20ZeppOS%20Watchface%20-%20Report%20an%20Issue&body=Nightscout%20URL:%20+%20nightscoutUrl%0APlease%20provide%20a%20description%20of%20the%20issue.%20Leaving%20your%20Nightscout%20URL%20included%20means%20that%20the%20developer%20can%20replicate%20the%20issue%20and%20fix%20it.%0A%0ADescription%20of%20issue:%20",
        },"Report an issue"),
      ]
    );
  }
});
