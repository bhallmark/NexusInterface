import { atom } from 'jotai';
import { store, subscribe } from 'lib/store';
import memoize from 'utils/memoize';
import defaultSettings from './defaultSettings';
import { readSettings, writeSettings } from './universal';

const initialUserSettings = readSettings();
const userSettingsAtom = atom(initialUserSettings);

const mergeWithDefault = memoize((userSettings) => ({
  ...defaultSettings,
  ...userSettings,
}));
export const settingsAtom = atom((get) =>
  mergeWithDefault(get(userSettingsAtom))
);

const timerId = null;
subscribe(userSettingsAtom, (settings) => {
  clearTimeout(timerId);
  // Write to file asynchronously to batch multiple consecutive updates into one disk write
  setTimeout(() => {
    writeSettings(settings);
  }, 0);
});

export const settingKeys = Object.keys(defaultSettings);
export const settingAtoms = Object.fromEntries(
  settingKeys.map((key) => [
    key,
    atom(
      (get) => get(settingsAtom)?.[key],
      (get, set, value) => {
        const userSettings = get(userSettingsAtom);
        if (userSettings?.[key] === value) return;
        const updatedUserSettings = {
          ...userSettings,
          [key]: value,
        };
        set(userSettingsAtom, updatedUserSettings);
      }
    ),
  ])
);

export function updateSettings(updates) {
  const userSettings = store.get(userSettingsAtom);
  store.set(userSettingsAtom, {
    ...userSettings,
    ...updates,
  });
}
