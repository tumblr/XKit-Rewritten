import { keyToCss } from '../util/css_map.js';
import { getPreferences } from '../util/preferences.js';
import { pageModifications } from '../util/mutations.js';

let trackInfoSelector;

let defaultVolume;

const excludeClass = 'xkit-vanilla-audio-done';

const addAudioControls = nativePlayers => nativePlayers.forEach(nativePlayer => {
  if (nativePlayer.classList.contains(excludeClass)) return;
  nativePlayer.classList.add(excludeClass);

  const audio = nativePlayer.querySelector('audio');
  if (audio === null) return;

  const trackInfo = nativePlayer.querySelector(trackInfoSelector);
  trackInfo?.classList.add('trackInfo');

  const audioClone = audio.cloneNode(true);
  audioClone.controls = true;
  audioClone.volume = defaultVolume / 100;
  nativePlayer.parentNode.appendChild(audioClone);
});

export const onStorageChanged = async function (changes, areaName) {
  const {
    'vanilla_audio.preferences.defaultVolume': defaultVolumeChanges
  } = changes;

  if (defaultVolumeChanges && defaultVolumeChanges.oldValue !== undefined) {
    ({ newValue: defaultVolume } = defaultVolumeChanges);
  }
};

export const main = async function () {
  trackInfoSelector = await keyToCss('trackInfo');
  ({ defaultVolume } = await getPreferences('vanilla_audio'));

  const nativePlayerSelector = await keyToCss('nativePlayer');
  pageModifications.register(nativePlayerSelector, addAudioControls);
};

export const clean = async function () {
  pageModifications.unregister(addAudioControls);
  $(`.${excludeClass} + audio[controls]`).remove();
  $(`.${excludeClass}`).removeClass(excludeClass);
};

export const stylesheet = true;
