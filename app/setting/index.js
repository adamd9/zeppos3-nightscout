// settings.js
import { gettext } from 'i18n';

const DEFAULT_SETTINGS = {
  urlConfig: '',
  accessToken: '',
  bgUnits: 'mgdl',
  updateInterval: 3, // Default interval in minutes
  disableUpdates: false,
};

const PROJECT_URL = 'https://github.com/adamd9/zeppos3-nightscout';
const ISSUES_URL = `${PROJECT_URL}/issues`;
const SUPPORT_EMAIL = 'adam@greatmachineinthesky.com';
const EMAIL_SUPPORT_URL = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Nightscout ZeppOS Watchface - Support request')}`;

AppSettingsPage({
  state: {
    settings: {}
  },
  // Initialize settings with default or stored values
  initSettings() {
    this.state.settings = {
      urlConfig: this.getUrlConfig(),
      accessToken: this.getAccessToken(),
      bgUnits: this.getBgUnits(),
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
  getBgUnits() {
    const storedBgUnits = this.state.props.settingsStorage.getItem('bgUnits');
    if (!storedBgUnits) {
      return DEFAULT_SETTINGS.bgUnits;
    }

    const parsed = String(JSON.parse(storedBgUnits)).toLowerCase();
    return parsed === 'mmol' || parsed === 'mmol/l' || parsed === 'mmoll'
      ? 'mmol'
      : 'mgdl';
  },
  setBgUnits(value) {
    const parsed = String(value || '').toLowerCase();
    const normalized = parsed === 'mmol' || parsed === 'mmol/l' || parsed === 'mmoll'
      ? 'mmol'
      : 'mgdl';
    this.state.settings.bgUnits = normalized;
    this.state.props.settingsStorage.setItem('bgUnits', JSON.stringify(normalized));
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
        Toggle({
          label: 'Use mmol/L units',
          value: this.state.settings.bgUnits === 'mmol',
          onChange: (val) => {
            this.setBgUnits(val ? 'mmol' : 'mgdl');
          }
        }),
        Text({
          paragraph: true,
          style: {
            paddingBottom: "8px",
            fontSize: "11px"
          }
        },"Default OFF = mg/dL, ON = mmol/L"),
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
          source: PROJECT_URL,
        },"GitHub Project"),
        Text({
          paragraph: false,
          style: {
          }
        }," | "),
        Link({
          source: ISSUES_URL,
        },"Report an issue"),
        Text({
          paragraph: false,
          style: {
          }
        }," | "),
        Link({
          source: EMAIL_SUPPORT_URL,
        },"Email support"),
        Text({
          paragraph: true,
          style: {
            paddingTop: "6px",
            fontSize: "11px"
          }
        },`Support email: ${SUPPORT_EMAIL}`),
      ]
    );
  }
});
