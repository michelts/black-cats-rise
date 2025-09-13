import music1 from "./assets/music1";
import { Audio } from "./audio";

const key = "bcr-MUSIC";
let musicEnabled = window.localStorage.getItem(key) !== "off";
let music: Audio;

export async function toggleMusic(value?: boolean) {
  await initMusic();
  if (value !== undefined) {
    musicEnabled = !value;
  }
  if (!musicEnabled) {
    musicEnabled = true;
    music.play();
  } else {
    musicEnabled = false;
    music.stop();
  }
  return musicEnabled;
}

async function initMusic() {
  if (!music) {
    music = new Audio();
    await music.init(music1, true);
  }
}

export async function stopMusic() {
  music.stop();
}

export async function possiblyPlayMusic() {
  await initMusic();
  if (musicEnabled && !music.isPlaying()) {
    music.play();
  }
}
