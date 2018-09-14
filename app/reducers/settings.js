import * as TYPE from "../actions/actiontypes";

const initialState = {
  settings: {
    manualDaemon: true,
    acceptedagreement: false,
    experimentalWarning: true,
    windowWidth: 1600,
    windowHeight: 1388,
    devMode: false
  },
  customStyling: {
    MC1: "#111111",
    MC2: "#0ca4fb",
    MC3: "#556070",
    MC4: "#34495e",
    MC5: "#ffffff",
    NXSlogo: "hue-rotate(0deg) brightness(100%) grayscale(0%) saturate(100%)",
    iconMenu: "hue-rotate(0deg) brightness(100%) grayscale(0%)",
    footer: "hue-rotate(0deg) grayscale(100%) brightness(200%)",
    footerHover: "hue-rotate(0deg) grayscale(0%) brightness(100%)",
    footerActive: "hue-rotate(0deg) grayscale(0%) brightness(100%)"
  },
  NXSlogoRGB: "rgb(0,174,239)",
  footerRGB: "rgb(0,174,239)",
  footerActiveRGB: "rgb(0,174,239)",
  footerHoverRGB: "rgb(0,174,239)",
  iconMenuRGB: "rgb(0,174,239)",
  ignoreEncryptionWarningFlag: false,
  experimentalOpen: true,
  saveSettings: false,
  styleChangeFlag: false,
  selectedColorProp: "MC1"
};

export default (state = initialState, action) => {
  switch (action.type) {
    case TYPE.GET_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
      break;
    case TYPE.SET_EXPERIMENTAL_WARNING:
      if (action.payload) {
        return {
          ...state,
          settings: {
            ...state.settings,
            experimentalWarning: false
          },
          saveSettingsFlag: true
        };
      } else {
        return {
          ...state,
          experimentalOpen: false
        };
      }
      break;
    case TYPE.IGNORE_ENCRYPTION_WARNING:
      return {
        ...state,
        ignoreEncryptionWarningFlag: true
      };
      break;
    case TYPE.ACCEPT_MIT:
      return {
        ...state,
        settings: {
          ...state.settings,
          acceptedagreement: true
        },
        saveSettingsFlag: true
      };
      break;
    case TYPE.TOGGLE_SAVE_SETTINGS_FLAG:
      return {
        ...state,
        saveSettingsFlag: false
      };
      break;
    case TYPE.CHANGE_COLOR_1:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          MC1: action.payload
        },
        styleChangeFlag: true
      };
      break;
    case TYPE.CHANGE_COLOR_2:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          MC2: action.payload
        },
        styleChangeFlag: true
      };
      break;
    case TYPE.CHANGE_COLOR_3:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          MC3: action.payload
        },
        styleChangeFlag: true
      };
      break;
    case TYPE.CHANGE_COLOR_4:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          MC4: action.payload
        },
        styleChangeFlag: true
      };
      break;
    case TYPE.CHANGE_COLOR_5:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          MC5: action.payload
        },
        styleChangeFlag: true
      };
      break;
    case TYPE.SET_SELECTED_COLOR_PROP:
      return {
        ...state,
        selectedColorProp: action.payload
      };
      break;
    case TYPE.SET_NEXUS_LOGO_COLOR:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          NXSlogo: action.payload.setting
        },
        NXSlogoRGB: action.payload.hex
      };
    case TYPE.SET_FOOTER_COLOR:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          footer: action.payload.setting
        },
        footerRGB: action.payload.hex
      };
    case TYPE.SET_FOOTER_ACTIVE_COLOR:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          footerActive: action.payload.setting
        },
        footerActiveRGB: action.payload.hex
      };
    case TYPE.SET_FOOTER_HOVER_COLOR:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          footerHover: action.payload.setting
        },
        footerHoverRGB: action.payload.hex
      };
    case TYPE.SET_ICON_MENU_COLOR:
      return {
        ...state,
        customStyling: {
          ...state.customStyling,
          iconMenu: action.payload.setting
        },
        iconMenuRGB: action.payload.hex
      };
    case TYPE.RESET_CUSTOM_STYLING:
      return {
        ...state,
        customStyling: initialState.customStyling,
        NXSlogoRGB: initialState.NXSlogoRGB
      };
      break;
    case TYPE.UNSET_STYLE_FLAG:
      return {
        ...state,
        styleChangeFlag: false
      };
      break;
    default:
      return state;
  }
};
