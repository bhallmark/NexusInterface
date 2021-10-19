// Core
export const START_CORE_AUTO_CONNECT = 'START_CORE_AUTO_CONNECT';
export const STOP_CORE_AUTO_CONNECT = 'STOP_CORE_AUTO_CONNECT';
export const SET_CORE_CONFIG = 'SET_CORE_CONFIG';

export const GET_INFO = 'GET_INFO';
export const SET_SYSTEM_INFO = 'SET_SYSTEM_INFO';
export const SET_STAKE_INFO = 'SET_STAKE_INFO';
export const SET_LEDGER_INFO = 'SET_LEDGER_INFO';
export const SET_BALANCES = 'SET_BALANCES';
export const DISCONNECT_CORE = 'DISCONNECT_CORE';
export const CLEAR_STAKE_INFO = 'CLEAR_STAKE_INFO';
export const CLEAR_LEDGER_INFO = 'CLEAR_LEDGER_INFO';
export const CLEAR_BALANCES = 'CLEAR_BALANCES';

// Overview
export const GET_DIFFICULTY = 'GET_DIFFICULTY';

// Trust
export const GET_TRUST_LIST = 'GET_TRUST_LIST';
export const TOGGLE_SORT_DIRECTION = 'TOGGLE_SORT_DIRECTION';

// Market

// Transactions Page
export const SET_TXS_ACCOUNT_FILTER = 'SET_TXS_ACCOUNT_FILTER';
export const SET_TXS_ADDRESS_QUERY = 'SET_TXS_ADDRESS_QUERY';
export const SET_TXS_CATEGORY_FILTER = 'SET_TXS_CATEGORY_FILTER';
export const SET_TXS_MIN_AMOUNT_FILTER = 'SET_TXS_MIN_AMOUNT_FILTER';
export const SET_TXS_TIME_FILTER = 'SET_TXS_TIME_FILTER';

export const UPDATE_TRANSACTIONS_FILTER = 'UPDATE_TRANSACTIONS_FILTER';
export const SET_TXS_ACCOUNT_QUERY = 'SET_TXS_ACCOUNT_QUERY';
export const SET_TXS_TOKEN_QUERY = 'SET_TXS_TOKEN_QUERY';
export const SET_TXS_NAME_QUERY = 'SET_TXS_NAME_QUERY';
export const SET_TXS_OP_FILTER = 'SET_TXS_OP_FILTER';
export const SET_TXS_PAGE = 'SET_TXS_PAGE';
export const START_FETCHING_TXS = 'START_FETCHING_TXS';
export const FETCH_TXS_RESULT = 'FETCH_TXS_RESULT';
export const FETCH_TXS_ERROR = 'FETCH_TXS_ERROR';

export const LOAD_TRANSACTIONS = 'LOAD_TRANSACTIONS';
export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS';
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';

export const LOAD_TRITIUM_TRANSACTIONS = 'LOAD_TRITIUM_TRANSACTIONS';
export const ADD_TRITIUM_TRANSACTIONS = 'ADD_TRITIUM_TRANSACTIONS';
export const UPDATE_TRITIUM_TRANSACTION = 'UPDATE_TRITIUM_TRANSACTION';

// Common
export const LOCK = 'LOCK';
export const UPDATE_BLOCK_DATE = 'UPDATE_BLOCK_DATE';
export const SHOW_ENCRYPTION_MODAL = 'SHOW_ENCRYPTION_MODAL';
export const SET_MARKET_DATA = 'SET_MARKET_DATA';
export const SET_TOTAL_SUPPLY = 'SET_TOTAL_SUPPLY';

// Send
export const SELECT_CONTACT = 'SELECT_CONTACT';

// Exchange
export const AVAILABLE_COINS = 'AVAILABLE_COINS';
export const FROM_SETTER = 'FROM_SETTER';
export const TO_SETTER = 'TO_SETTER';
export const MARKET_PAIR_DATA = 'MARKET_PAIR_DATA';
export const UPDATE_EXCHANGE_AMMOUNT = 'UPDATE_EXCHANGE_AMMOUNT';
export const TOGGLE_WITHIN_TRADE_BOUNDS = 'TOGGLE_WITHIN_TRADE_BOUNDS';
export const SET_REFUND_ADDRESS = 'SET_REFUND_ADDRESS';
export const SET_TO_ADDRESS = 'SET_TO_ADDRESS';
export const AVAILABLE_PAIR_FLAG = 'AVAILABLE_PAIR_FLAG';
export const SET_QUOTE = 'SET_QUOTE';
export const GREENLIGHT_TRANSACTION = 'GREENLIGHT_TRANSACTION';
export const TRANSACTION_MODAL_ACTIVATE = 'TRANSACTION_MODAL_ACTIVATE';
export const CLEAR_TRANSACTION = 'CLEAR_TRANSACTION';
export const SET_EMAIL = 'SET_EMAIL';
export const CLEAR_QUOTE = 'CLEAR_QUOTE';
export const TOGGLE_ACYNC_BUTTONS = 'TOGGLE_ACYNC_BUTTONS';

// AddressBook
export const DELETE_CONTACT = 'DELETE_CONTACT';
export const LOAD_ADDRESS_BOOK = 'LOAD_ADDRESS_BOOK';
export const ADD_NEW_CONTACT = 'ADD_NEW_CONTACT';
export const UPDATE_CONTACT = 'UPDATE_CONTACT';
export const MY_ACCOUNTS_LIST = 'MY_ACCOUNTS_LIST';
export const UPDATE_MY_ACCOUNTS = 'UPDATE_MY_ACCOUNTS';

// Terminal
export const SET_COMMAND_LIST = 'SET_COMMAND_LIST';
export const SET_CONSOLE_INPUT = 'SET_CONSOLE_INPUT';
export const COMMAND_HISTORY_UP = 'COMMAND_HISTORY_UP';
export const COMMAND_HISTORY_DOWN = 'COMMAND_HISTORY_DOWN';
export const EXECUTE_COMMAND = 'EXECUTE_COMMAND';
export const PRINT_COMMAND_OUTPUT = 'PRINT_COMMAND_OUTPUT';
export const PRINT_COMMAND_ERROR = 'PRINT_COMMAND_ERROR';
export const RESET_CONSOLE = 'RESET_CONSOLE';
export const PRINT_CORE_OUTPUT = 'PRINT_CORE_OUTPUT';
export const PAUSE_CORE_OUTPUT = 'PAUSE_CORE_OUTPUT';
export const UNPAUSE_CORE_OUTPUT = 'UNPAUSE_CORE_OUTPUT';
export const CLEAR_CORE_OUTPUT = 'CLEAR_CORE_OUTPUT';

// Settings
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export const SET_THEME = 'SET_THEME';
export const UPDATE_THEME = 'UPDATE_THEME';

// UI
export const CONTACT_SEARCH = 'CONTACT_SEARCH';
export const SWITCH_SETTINGS_TAB = 'SWITCH_SETTINGS_TAB';
export const SWITCH_CONSOLE_TAB = 'SWITCH_CONSOLE_TAB';
export const SWITCH_USER_TAB = 'SWITCH_USER_TAB';
export const SET_CORE_SETTINGS_RESTART = 'SET_CORE_SETTINGS_RESTART';
export const CLOSE_WALLET = 'CLOSE_WALLET';

export const CREATE_MODAL = 'CREATE_MODAL';
export const REMOVE_MODAL = 'REMOVE_MODAL';
export const CREATE_NOTIFICATION = 'CREATE_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const CREATE_BACKGROUND_TASK = 'CREATE_BACKGROUND_TASK';
export const REMOVE_BACKGROUND_TASK = 'REMOVE_BACKGROUND_TASK';

// Modules
export const LOAD_MODULES = 'LOAD_MODULES';
export const ADD_DEV_MODULE = 'ADD_DEV_MODULE';
export const UPDATE_MODULES_LATEST = 'UPDATE_MODULES_LATEST';
export const LOAD_MODULES_FAILED = 'LOAD_MODULES_FAILED';
export const UPDATE_MODULE_STATE = 'UPDATE_MODULE_STATE';

// Updater
export const SET_UPDATER_STATE = 'SET_UPDATER_STATE';

// Others
export const SET_ACTIVE_APP_MODULE = 'SET_ACTIVE_APP_MODULE';
export const UNSET_ACTIVE_APP_MODULE = 'UNSET_ACTIVE_APP_MODULE';
export const BOOTSTRAP_STATUS = 'BOOTSTRAP_STATUS';

//Tritium
export const SET_USER_STATUS = 'SET_USER_STATUS';
export const SET_TRITIUM_ACCOUNTS = 'SET_TRITIUM_ACCOUNTS';
export const SET_NAME_RECORDS = 'SET_NAME_RECORDS';
export const SET_NAMESPACES = 'SET_NAMESPACES';
export const SET_ASSETS = 'SET_ASSETS';
export const SET_ASSET_SCHEMA = 'SET_ASSET_SCHEMA';
export const CLEAR_USER = 'CLEAR_USER';
export const SET_USER_OWNED_TOKENS = 'SET_USER_OWNED_TOKENS';
export const USERS_BALANCE_DISPLAY_FIAT = 'USERS_BALANCE_DISPLAY_FIAT';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SWITCH_USER = 'SWITCH_USER';
export const ASK_START_STAKING = 'ASK_START_STAKING';
export const SET_TRANSACTIONS_LOADEDALL = 'SET_TRANSACTIONS_LOADEDALL';
