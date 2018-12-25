// External Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { remote } from 'electron';
import config from 'api/configuration';
import { access } from 'fs';
import path from 'path';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import fs from 'fs';
import googleanalytics from 'scripts/googleanalytics';
import styled from '@emotion/styled';

// Internal Global Dependencies
import { GetSettings, SaveSettings } from 'api/settings';
import * as RPC from 'scripts/rpc';
import * as TYPE from 'actions/actiontypes';
import ContextMenuBuilder from 'contextmenu';
import plusimg from 'images/plus.svg';
import * as FlagFile from 'images/LanguageFlags';
import { remote as dialog } from 'electron';
import SettingsField from 'components/SettingsField';
import Button from 'components/Button';
import TextField from 'components/TextField';
import Select from 'components/Select';
import Switch from 'components/Switch';

// Internal Local Dependencies
import styles from './style.css';

const AppSettings = styled.div({
  maxWidth: 750,
  margin: '0 auto',
});

const fiatCurrencies = [
  { value: 'AUD', display: 'Australian Dollar' },
  { value: 'BRL', display: 'Brazilian Real' },
  { value: 'GPB', display: 'British Pound' },
  { value: 'CAD', display: 'Canadian Dollar' },
  { value: 'CLP', display: 'Chilean Peso' },
  { value: 'CNY', display: 'Chinese Yuan' },
  { value: 'CZK', display: 'Czeck Koruna' },
  { value: 'EUR', display: 'Euro' },
  { value: 'HKD', display: 'Hong Kong Dollar' },
  { value: 'INR', display: 'Israeli Shekel' },
  { value: 'JPY', display: 'Japanese Yen' },
  { value: 'KRW', display: 'Korean Won' },
  { value: 'MYR', display: 'Malaysian Ringgit' },
  { value: 'MXN', display: 'Mexican Peso' },
  { value: 'NZD', display: 'New Zealand Dollar' },
  { value: 'PKR', display: 'Pakistan Rupee' },
  { value: 'RUB', display: 'Russian Ruble' },
  { value: 'SAR', display: 'Saudi Riyal' },
  { value: 'SGD', display: 'Singapore Dollar' },
  { value: 'ZAR', display: 'South African Rand' },
  { value: 'CHF', display: 'Swiss Franc' },
  { value: 'TWD', display: 'Taiwan Dollar' },
  { value: 'AED', display: 'United Arab Emirates Dirham' },
  { value: 'USD', display: 'United States Dollar' },
];

// React-Redux mandatory methods
const mapStateToProps = state => {
  return {
    ...state.common,
    ...state.sendRecieve,
    ...state.settings,
    ...state.intl,
    ...state.overview,
  };
};
const mapDispatchToProps = dispatch => ({
  OpenModal2: type => {
    dispatch({ type: TYPE.SHOW_MODAL2, payload: type });
  },
  CloseModal2: type => {
    dispatch({ type: TYPE.HIDE_MODAL2, payload: type });
  },
  OpenModal: type => {
    dispatch({ type: TYPE.SHOW_MODAL, payload: type });
  },
  CloseModal: () => dispatch({ type: TYPE.HIDE_MODAL }),
  setSettings: settings =>
    dispatch({ type: TYPE.GET_SETTINGS, payload: settings }),
  setFiatCurrency: inValue => {
    dispatch({ type: TYPE.SET_FIAT_CURRENCY, payload: inValue });
  },
  OpenModal3: type => {
    dispatch({ type: TYPE.SHOW_MODAL3, payload: type });
  },
  OpenModal4: type => {
    dispatch({ type: TYPE.SHOW_MODAL4, payload: type });
  },
  CloseModal4: type => {
    dispatch({ type: TYPE.HIDE_MODAL4, payload: type });
  },
  CloseModal3: type => {
    dispatch({ type: TYPE.HIDE_MODAL3, payload: type });
  },
  localeChange: returnSelectedLocale => {
    dispatch({ type: TYPE.SWITCH_LOCALES, payload: returnSelectedLocale });
  },
  SwitchLocale: locale => {
    dispatch({ type: TYPE.UPDATE_LOCALES, payload: locale });
  },
  SwitchMessages: messages => {
    dispatch({ type: TYPE.SWITCH_MESSAGES, payload: messages });
  },
  SeeFolder: Folder => {
    dispatch({ type: TYPE.SEE_FOLDER, payload: Folder });
  },
  SetMinimumConfirmationsNumber: inValue => {
    dispatch({ type: TYPE.SET_MIN_CONFIRMATIONS, payload: inValue });
  },
  OpenErrorModal: type => {
    dispatch({ type: TYPE.SHOW_ERROR_MODAL, payload: type });
  },
  CloseErrorModal: type => {
    dispatch({ type: TYPE.HIDE_ERROR_MODAL, payload: type });
  },
});

var currentBackupLocation = ''; //Might redo to use redux but this is only used to replace using json reader every render;

class SettingsApp extends Component {
  // React Method (Life cycle hook)
  constructor(props) {
    super(props);
    // Set initial settings
    // This is a temporary fix for the current setting state mechanism
    // Ideally this should be managed via Redux states & actions
    const settings = GetSettings();
    this.initialValues = {
      minimizeToTray: !!settings.minimizeToTray,
      googlesetting: !!settings.googlesetting,
      devmode: !!settings.devmode,
      minConf: settings.minConf !== undefined ? settings.minConf : 3,
      txFee: props.paytxfee,
    };
  }

  componentDidMount() {
    if (this.refs.backupInputField) {
      this.refs.backupInputField.webkitdirectory = true;
      this.refs.backupInputField.directory = true;
    }
  }
  // React Method (Life cycle hook)
  componentWillUnmount() {
    this.props.setSettings(GetSettings());
  }

  updateBackupLocation(event) {
    var el = event.target;
    var settingsObj = GetSettings();

    let incomingPath = el.files[0].path;

    settingsObj.backupLocation = incomingPath;

    SaveSettings(settingsObj);
  }

  updateAutoStart(event) {
    var el = event.target;
    var settingsObj = GetSettings();

    settingsObj.autostart = el.checked;

    SaveSettings(settingsObj);

    //This is the code that will create a reg to have the OS auto start the app
    var AutoLaunch = require('auto-launch');
    // Change Name when we need to
    var autolaunchsettings = new AutoLaunch({
      name: 'Nexus',
      path: path.dirname(app.getPath('exe')),
    });
    //No need for a path as it will be set automaticly

    //Check selector
    if (el.checked == true) {
      autolaunchsettings.enable();
      autolaunchsettings
        .isEnabled()
        .then(function(isEnabled) {
          if (isEnabled) {
            return;
          }
          autolaunchsettings.enable();
        })
        .catch(function(err) {
          // handle error
        });
    } else {
      // Will Remove the property that makes it auto play
      autolaunchsettings.disable();
    }
  }

  updateMinimizeToTray(event) {
    var el = event.target;
    var settingsObj = GetSettings();

    settingsObj.minimizeToTray = el.checked;

    SaveSettings(settingsObj);
  }

  updateGoogleAnalytics(event) {
    var el = event.target;
    var settingsObj = GetSettings();

    settingsObj.googleAnalytics = el.checked;

    if (el.checked == true) {
      googleanalytics.EnableAnalytics();

      googleanalytics.SendEvent('Settings', 'Analytics', 'Enabled', 1);
    } else {
      googleanalytics.SendEvent('Settings', 'Analytics', 'Disabled', 1);
      googleanalytics.DisableAnalytics();
    }

    SaveSettings(settingsObj);
  }

  updateOptionalTransactionFee(event) {
    var el = event.target;
    var settingsObj = GetSettings();
    settingsObj.optionalTransactionFee = el.value;

    SaveSettings(settingsObj);
  }

  setTxFee() {
    let TxFee = document.getElementById('optionalTransactionFee').value;
    if (parseFloat(TxFee) > 0) {
      RPC.PROMISE('settxfee', [parseFloat(TxFee)]);
      this.props.OpenModal('Transaction Fee Set');
    } else {
      this.props.OpenErrorModal('Invalid Transaction Fee');
    }
  }

  updateDefaultUnitAmount(event) {
    var el = event.target;
    var settingsObj = GetSettings();

    settingsObj.defaultUnitAmount = el.options[el.selectedIndex].value;

    SaveSettings(settingsObj);
  }

  updateDeveloperMode(event) {
    var el = event.target;
    var settingsObj = GetSettings();

    settingsObj.devMode = el.checked;

    SaveSettings(settingsObj);
  }

  updateMinimumConfirmations(event) {
    var el = event.target;
    var settings = require('api/settings.js');
    var settingsObj = settings.GetSettings();

    if (el.value <= 0) {
      el.value = 1;
    }
    if (Number.isInteger(el.value) == false) {
      el.value = parseInt(el.value);
    }

    settingsObj.minimumconfirmations = el.value;
    settings.SaveSettings(settingsObj);
    this.props.SetMinimumConfirmationsNumber(el.value);
  }

  returnCurrentBackupLocation() {
    let currentLocation = GetSettings();
    //set state for currentlocation and return it

    return 'Current Location: ' + currentLocation.backupLocation;
  }

  saveEmail() {
    var settingsObj = GetSettings();
    let emailFeild = document.getElementById('emailAddress');
    let emailregex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailregex.test(emailFeild.value)) {
      settingsObj.email = emailFeild.value;
      SaveSettings(settingsObj);
    } else alert('Invalid Email');
  }

  backupWallet(e) {
    e.preventDefault();
    let now = new Date()
      .toString()
      .slice(0, 24)
      .split(' ')
      .reduce((a, b) => {
        return a + '_' + b;
      })
      .replace(/:/g, '_');

    let BackupDir = process.env.HOME + '/NexusBackups';
    if (process.platform === 'win32') {
      BackupDir = process.env.USERPROFILE + '/NexusBackups';
      BackupDir = BackupDir.replace(/\\/g, '/');
    }
    if (this.props.settings.Folder !== BackupDir) {
      BackupDir = this.props.settings.Folder;
    }

    let ifBackupDirExists = fs.existsSync(BackupDir);
    if (ifBackupDirExists == undefined || ifBackupDirExists == false) {
      fs.mkdirSync(BackupDir);
    }

    RPC.PROMISE('backupwallet', [
      BackupDir + '/NexusBackup_' + now + '.dat',
    ]).then(payload => {
      this.props.CloseModal4();
      this.props.OpenModal('Wallet Backup');
    });
    console.log(this.props.settings.Folder);
  }

  OnFiatCurrencyChange(value) {
    this.props.setFiatCurrency(value);
    let settings = GetSettings();
    settings.fiatCurrency = value;
    this.props.setSettings(settings);
    SaveSettings(settings);
  }

  getFolder(folderPaths) {
    dialog.showOpenDialog(
      {
        title: 'Select a folder',
        properties: ['openDirectory'],
      },
      folderPaths => {
        if (folderPaths === undefined) {
          console.log('No destination folder selected');
          return;
        } else {
          let settings = GetSettings();
          settings.Folder = folderPaths.toString();
          this.props.SeeFolder(folderPaths[0]);

          this.props.setSettings(settings);
          SaveSettings(settings);
        }
      }
    );
  }

  changeLocale(locale) {
    let settings = require('api/settings.js').GetSettings();
    settings.locale = locale;
    this.props.setSettings(settings);
    this.props.SwitchLocale(locale);
    let messages = {};
    if (process.env.NODE_ENV === 'development') {
      messages = JSON.parse(fs.readFileSync(`app/translations/${locale}.json`));
    } else {
      messages = JSON.parse(
        fs.readFileSync(
          path.join(
            config.GetAppResourceDir(),
            'translations',
            `${locale}.json`
          )
        )
      );
    }

    this.props.SwitchMessages(messages);
    SaveSettings(settings);
  }

  // Mandatory React method
  render() {
    var settingsObj = GetSettings();
    return (
      <AppSettings>
        <Modal
          center
          classNames={{ modal: 'custom-modal2', overlay: 'custom-overlay' }}
          showCloseIcon={false}
          open={this.props.openSecondModal}
          onClose={this.props.CloseModal2}
        >
          <div>
            <h2>
              <FormattedMessage
                id="Settings.SetFee"
                defaultMessage="Set Transaction Fee?"
              />
            </h2>
            <FormattedMessage id="Settings.Yes">
              {yes => (
                <input
                  value={yes}
                  type="button"
                  className="button primary"
                  onClick={() => {
                    this.setTxFee();
                    this.props.CloseModal2();
                  }}
                />
              )}
            </FormattedMessage>
            <div id="no-button">
              <FormattedMessage id="Settings.No">
                {no => (
                  <input
                    value={no}
                    type="button"
                    className="button primary"
                    onClick={() => {
                      this.props.CloseModal2();
                    }}
                  />
                )}
              </FormattedMessage>
            </div>
          </div>
        </Modal>
        <Modal
          center
          classNames={{ modal: 'custom-modal2', overlay: 'custom-overlay' }}
          showCloseIcon={false}
          open={this.props.openFourthModal}
          onClose={this.props.CloseModal4}
        >
          <div>
            <h2>
              <FormattedMessage
                id="Settings.BackupWallet"
                defaultMessage="Backup Wallet?"
              />
            </h2>
            <FormattedMessage id="Settings.Yes">
              {yes => (
                <input
                  value={yes}
                  type="button"
                  className="button primary"
                  onClick={e => {
                    if (this.props.connections !== undefined) {
                      this.backupWallet(e);
                    } else {
                      this.props.OpenErrorModal(
                        'Please wait for Daemon to load'
                      );
                    }
                  }}
                />
              )}
            </FormattedMessage>
            <div id="no-button">
              <FormattedMessage id="Settings.No">
                {no => (
                  <input
                    value={no}
                    type="button"
                    className="button primary"
                    onClick={() => {
                      this.props.CloseModal4();
                    }}
                  />
                )}
              </FormattedMessage>
            </div>
          </div>
        </Modal>

        <Modal
          center
          classNames={{ modal: 'custom-modal5' }}
          showCloseIcon={true}
          open={this.props.openThirdModal}
          onClose={e => {
            e.preventDefault();
            this.props.CloseModal3();
          }}
        >
          <ul className="langList">
            {/* ENGLISH */}
            <li className="LanguageTranslation">
              &emsp;
              <input
                id="English"
                name="radio-group"
                type="radio"
                value="en"
                checked={this.props.settings.locale === 'en'}
                onChange={
                  e => this.changeLocale(e.target.value) // onClick={() => this.changeLocale('en')}
                }
              />
              &emsp;
              <label htmlFor="English">
                <FormattedMessage id="Lang.English" defaultMessage="English" />
              </label>
              &emsp; &emsp; &emsp;
              <span className="langTag">
                <img src={FlagFile.America} />
                (English, US) &emsp;
              </span>
            </li>

            {/* RUSSIAN */}
            <li className="LanguageTranslation">
              &emsp;
              <input
                id="Russian"
                name="radio-group"
                type="radio"
                value="ru"
                checked={this.props.settings.locale === 'ru'}
                onChange={e => this.changeLocale(e.target.value)}
              />
              &emsp;
              <label htmlFor="Russian">
                <FormattedMessage id="Lang.Russian" defaultMessage="Russian" />
              </label>
              &emsp; &emsp; &emsp;
              <span className="langTag">
                <img src={FlagFile.Russia} />
                (Pусский) &emsp;
              </span>
            </li>

            {/* SPANISH */}
            <li className="LanguageTranslation">
              &emsp;
              <input
                id="Spanish"
                name="radio-group"
                type="radio"
                value="es"
                checked={this.props.settings.locale === 'es'}
                onChange={e => this.changeLocale(e.target.value)}
              />
              &emsp;
              <label htmlFor="Spanish">
                <FormattedMessage id="Lang.Spanish" defaultMessage="Spanish" />
              </label>
              &emsp; &emsp; &emsp;
              <span className="langTag">
                <img src={FlagFile.Spain} />
                (Español) &emsp;
              </span>
            </li>

            {/* KOREAN */}
            <li className="LanguageTranslation">
              &emsp;
              <input
                id="Korean"
                name="radio-group"
                type="radio"
                value="ko"
                checked={this.props.settings.locale === 'ko'}
                onChange={e => this.changeLocale(e.target.value)}
              />
              &emsp;
              <label htmlFor="Korean">
                <FormattedMessage id="Lang.Korean" defaultMessage="Korean" />
              </label>
              &emsp; &emsp; &emsp;
              <span className="langTag">
                <img src={FlagFile.Korea} />
                (한국어) &emsp;
              </span>
            </li>

            {/* GERMAN */}
            <li className="LanguageTranslation">
              &emsp;
              <input
                id="German"
                name="radio-group"
                type="radio"
                value="de"
                checked={this.props.settings.locale === 'de'}
                onChange={e => this.changeLocale(e.target.value)}
              />
              &emsp;
              <label htmlFor="German">
                <FormattedMessage id="Lang.German" defaultMessage="German" />
              </label>
              &emsp; &emsp; &emsp;
              <span className="langTag">
                <img src={FlagFile.Germany} />
                (Deutsch) &emsp;
              </span>
            </li>

            {/* JAPANESE */}
            <li className="LanguageTranslation">
              &emsp;
              <input
                id="Japanese"
                name="radio-group"
                type="radio"
                value="ja"
                checked={this.props.settings.locale === 'ja'}
                onChange={e => this.changeLocale(e.target.value)}
              />
              &emsp;
              <label htmlFor="Japanese">
                <FormattedMessage
                  id="Lang.Japanese"
                  defaultMessage="Japanese"
                />
              </label>
              &emsp; &emsp; &emsp;
              <span className="langTag">
                <img src={FlagFile.Japan} />
                (日本人) &emsp;
              </span>
            </li>

            {/* FRENCH */}
            <li className="LanguageTranslation">
              &emsp;
              <input
                id="French"
                name="radio-group"
                type="radio"
                value="fr"
                checked={this.props.settings.locale === 'fr'}
                onChange={e => this.changeLocale(e.target.value)}
              />
              &emsp;
              <label htmlFor="French">
                <FormattedMessage id="Lang.French" defaultMessage="French" />
              </label>
              &emsp; &emsp; &emsp;
              <span className="langTag">
                <img src={FlagFile.France} />
                (Français) &emsp;
              </span>
            </li>
          </ul>
          <div className="langsetter" />
        </Modal>

        <form>
          <SettingsField
            label={
              <FormattedMessage
                id="Settings.Language"
                defaultMesage="Language"
              />
            }
          >
            <div className="langSet">
              <span className="flag-icon-background flag-icon-gr" />
              <Button
                style={{ height: '2.25em' }}
                onClick={() => this.props.OpenModal3()}
              >
                <FormattedMessage
                  id="Settings.LangButton"
                  defaultMesage="English"
                />
              </Button>
            </div>
          </SettingsField>

          <SettingsField
            connectLabel
            label={
              <FormattedMessage
                id="Settings.MinimizeClose"
                defaultMessage="Minimize On Close"
              />
            }
            subLabel={
              <FormattedMessage
                id="ToolTip.MinimizeOnClose"
                defaultMessage="Minimize the wallet when closing the window instead of closing it"
              />
            }
          >
            <Switch
              defaultChecked={this.initialValues.minimizeToTray}
              onChange={this.updateMinimizeToTray}
            />
          </SettingsField>

          <SettingsField
            connectLabel
            label={
              <FormattedMessage
                id="Settings.UsageData"
                defaultMessage="Send anonymous usage data"
              />
            }
            subLabel={
              <FormattedMessage
                id="ToolTip.Usage"
                defaultMessage="Send anonymous usage data to allow the Nexus developers to improve the wallet"
              />
            }
          >
            <Switch
              defaultChecked={this.initialValues.googlesettings}
              onChange={this.updateGoogleAnalytics}
            />
          </SettingsField>

          <SettingsField
            connectLabel
            label={
              <FormattedMessage
                id="Settings.Fiat"
                defaultMessage="Fiat Currency"
              />
            }
          >
            <Select
              value={this.props.settings.fiatCurrency}
              onChange={e => this.OnFiatCurrencyChange(e)}
              style={{ maxWidth: 260 }}
              options={fiatCurrencies}
            />
          </SettingsField>

          <SettingsField
            connectLabel
            label={
              <FormattedMessage
                id="Settings.MinimumConfirmations"
                defaultMessage="Minimum Confirmations"
              />
            }
            subLabel={
              <FormattedMessage
                id="ToolTip.MinimumConfirmations"
                defaultMessage="Minimum amount of confirmations before a block is accepted. Local Only."
              />
            }
          >
            <TextField
              type="number"
              defaultValue={this.initialValues.minConf}
              style={{ width: 75 }}
              step="1"
              min="1"
              onChange={this.updateMinimumConfirmations.bind(this)}
              onKeyPress={e => {
                e.preventDefault();
              }}
            />
          </SettingsField>

          {/*File */}
          <SettingsField
            connectLabel
            label={
              <FormattedMessage
                id="Settings.Folder"
                defaultMessage="Backup Directory"
              />
            }
          >
            <TextField
              value={this.props.settings.Folder}
              onChange={e => this.props.SeeFolder(e.target.value)}
              onClick={e => {
                e.preventDefault();
                this.getFolder(this.props.settings.Folder[0]);
              }}
            />
          </SettingsField>

          {/* NEXUS FEE */}
          <SettingsField
            label={
              <FormattedMessage
                id="Settings.OptionalFee"
                defaultMessage="Optional transaction fee (NXS)"
              />
            }
            subLabel={
              <FormattedMessage
                id="ToolTip.OptionalFee"
                defaultMessage="Optional transaction fee to include on transactions. Higher amounts will allow transactions to be processed faster, lower may cause additional transaction processing"
              />
            }
          >
            <div className="flex stretch">
              <TextField
                type="number"
                defaultValue={this.initialValues.txFee}
                step="0.01"
                min="0"
                style={{ width: 100 }}
              />
              <Button
                fitHeight
                onClick={this.props.OpenModal2}
                style={{ marginLeft: '1em' }}
              >
                Set
              </Button>
            </div>
          </SettingsField>

          <SettingsField
            connectLabel
            label={
              <FormattedMessage
                id="Settings.DeveloperMode"
                defaultMessage="Developer Mode"
              />
            }
            subLabel={
              <FormattedMessage
                id="ToolTip.DevMode"
                defaultMessage="Development mode enables advanced features to aid in development. After enabling the wallet must be closed and reopened to enable those features"
              />
            }
          >
            <Switch
              defaultChecked={this.initialValues.devmode}
              onChange={this.updateDeveloperMode}
            />
          </SettingsField>

          <Button
            disabled={!this.props.connections}
            style={{ marginTop: '2em' }}
            onClick={e => {
              e.preventDefault();
              this.props.OpenModal4();
            }}
          >
            <FormattedMessage
              id="Settings.BackupWallet"
              defaultMessage="Backup Wallet"
            />
          </Button>
        </form>
      </AppSettings>
    );
  }
}

// Mandatory React-Redux method
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsApp);
