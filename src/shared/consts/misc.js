import settings from 'data/initialSettings';

export const webGLAvailable = (() => {
  try {
    var canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (err) {
    return false;
  }
})();

export const legacyMode = settings.legacyMode === false ? false : true;

// https://github.com/sindresorhus/semver-regex
export const semverRegex =
  /(?<=^v?|\sv?)(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:[1-9]\d*|[\da-z-]*[a-z-][\da-z-]*)(?:\.(?:[1-9]\d*|[\da-z-]*[a-z-][\da-z-]*))*)?(?:\+[\da-z-]+(?:\.[\da-z-]+)*)?(?=$|\s)/gi;

export const userIdRegex = /^[\da-f]+$/;

export const addressRegex = /^[1-9A-HJ-NP-Za-km-z]{51}$/;

export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const assetNumberTypes = [
  'uint8',
  'uint16',
  'uint32',
  'uint64',
  'uint256',
  'uint512',
  'uint1024',
];
