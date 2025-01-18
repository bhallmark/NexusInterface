/**
 * Important note - This file is imported into module_preload.js, either directly or
 * indirectly, and will be a part of the preload script for modules, therefore:
 * - Be picky with importing stuffs into this file, especially for big
 * files and libraries. The bigger the preload scripts get, the slower the modules
 * will load.
 * - Don't assign anything to `global` variable because it will be passed
 * into modules' execution environment.
 * - Make sure this note also presents in other files which are imported here.
 */

export const newUID = (function () {
  let counter = 1;
  return () => `uid-${counter++}`;
})();

// https://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711
export function escapeRegExp(s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function passRef(el, ref) {
  if (typeof ref === 'function') {
    ref(el);
  } else if (ref) {
    ref.current = el;
  }
}

export function refs(...list) {
  return (el) => {
    list.forEach((ref) => {
      passRef(el, ref);
    });
  };
}

export async function showDesktopNotif(title, message) {
  const result = await Notification.requestPermission();
  if (result === 'granted') {
    new Notification(title, { body: message });
  }
}

export function timeToText(timeSpan) {
  let string = '';
  let seconds = timeSpan;

  const days = Math.floor(seconds / 86400);
  if (days) {
    string += __('%{smart_count} day |||| %{smart_count} days', days) + ' ';
  }
  seconds %= 86400;

  const hours = Math.floor(seconds / 3600);
  if (hours) {
    string += __('%{smart_count} hour |||| %{smart_count} hours', hours) + ' ';
  }
  seconds %= 3600;

  const minutes = Math.floor(seconds / 60);
  if (minutes) {
    string +=
      __('%{smart_count} minute |||| %{smart_count} minutes', minutes) + ' ';
  }

  seconds %= 60;
  if (seconds) {
    string +=
      __('%{smart_count} second |||| %{smart_count} seconds', seconds) + ' ';
  }

  if (days || minutes || hours) {
    string += `(${__(
      '%{smart_count} second |||| %{smart_count} seconds',
      timeSpan
    )})`;
  }
  return string;
}

export function timeToObject(timeSpan) {
  let seconds = timeSpan;

  const days = Math.floor(seconds / 86400);
  seconds %= 86400;

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;

  const minutes = Math.floor(seconds / 60);
  seconds %= 60;

  return { days, hours, minutes, seconds };
}
