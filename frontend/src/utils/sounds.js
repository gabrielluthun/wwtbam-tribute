// Gestionnaire audio : beds q_tier1 / q6..q15, finaux final-answer-q*-* (fenêtre glissante),
// jingles win-q* / lose-q*, Let's Play (Q6–15) pour l’overlay de transition.
// Q6+ : au clic « question suivante », le bed de la question suivante démarre puis les one-shots
// (win / let’s play encore actifs) sont coupés net — pas de chevauchement type fondu avec le stinger.
// Plafond 6 s sur win-q1-5 et sur toutes les lose.

import bed_tier1 from '../asset/sounds/q_tier1.mp3';
import bed_q6 from '../asset/sounds/q6.mp3';
import bed_q7 from '../asset/sounds/q7.mp3';
import bed_q8 from '../asset/sounds/q8.mp3';
import bed_q9 from '../asset/sounds/q9.mp3';
import bed_q10 from '../asset/sounds/q10.mp3';
import bed_q11 from '../asset/sounds/q11.mp3';
import bed_q12 from '../asset/sounds/q12.mp3';
import bed_q13 from '../asset/sounds/q13.mp3';
import bed_q14 from '../asset/sounds/q14.mp3';
import bed_q15 from '../asset/sounds/q15.mp3';

import final_answer_q6_11 from '../asset/sounds/final-answer-q6-11.mp3';
import final_answer_q7_12 from '../asset/sounds/final-answer-q7-12.mp3';
import final_answer_q8_13 from '../asset/sounds/final-answer-q8-13.mp3';
import final_answer_q9_14 from '../asset/sounds/final-answer-q9-14.mp3';
import final_answer_q10_15 from '../asset/sounds/final-answer-q10-15.mp3';

import win_q1_5 from '../asset/sounds/win-q1-5.mp3';
import win_q5 from '../asset/sounds/win-q5.mp3';
import win_q6 from '../asset/sounds/win-q6.mp3';
import win_q7 from '../asset/sounds/win-q7.mp3';
import win_q8 from '../asset/sounds/win-q8.mp3';
import win_q9 from '../asset/sounds/win-q9.mp3';
import win_q10 from '../asset/sounds/win-q10.mp3';
import win_q11 from '../asset/sounds/win-q11.mp3';
import win_q12 from '../asset/sounds/win-q12.mp3';
import win_q13 from '../asset/sounds/win-q13.mp3';
import win_q14 from '../asset/sounds/win-q14.mp3';
import win_q15 from '../asset/sounds/win-q15.mp3';

import lose_q1_5 from '../asset/sounds/lose-q1-5.mp3';
import lose_q6 from '../asset/sounds/lose-q6.mp3';
import lose_q7 from '../asset/sounds/lose-q7.mp3';
import lose_q8 from '../asset/sounds/lose-q8.mp3';
import lose_q9 from '../asset/sounds/lose-q9.mp3';
import lose_q10 from '../asset/sounds/lose-q10.mp3';
import lose_q11 from '../asset/sounds/lose-q11.mp3';
import lose_q12 from '../asset/sounds/lose-q12.mp3';
import lose_q13 from '../asset/sounds/lose-q13.mp3';
import lose_q14 from '../asset/sounds/lose-q14.mp3';
import lose_q15 from '../asset/sounds/lose-q15.mp3';

import fifty_fifty_sfx from '../asset/sounds/fifty_fifty.mp3';
import phone_friend_sfx from '../asset/sounds/phone_friend.mp3';
import ask_audience_sfx from '../asset/sounds/ask_audience.mp3';
import time_up from '../asset/sounds/time_up.mp3';
import goodbye from '../asset/sounds/goodbye.mp3';

import lets_play_q6 from "../asset/sounds/13 Let's Play €3,000.mp3";
import lets_play_q7 from "../asset/sounds/18 Let's Play €6,000.mp3";
import lets_play_q8 from "../asset/sounds/23 Let's Play €12,000.mp3";
import lets_play_q9 from "../asset/sounds/28 Let's Play €24,000.mp3";
import lets_play_q10 from "../asset/sounds/33 Let's Play €48,000.mp3";
import lets_play_q11 from "../asset/sounds/38 Let's Play €72,000.mp3";
import lets_play_q12 from "../asset/sounds/43 Let's Play €100,000.mp3";
import lets_play_q13 from "../asset/sounds/48 Let's Play €150,000.mp3";
import lets_play_q14 from "../asset/sounds/53 Let's Play €300,000.mp3";
import lets_play_q15 from "../asset/sounds/58 Let's Play €1,000,000.mp3";

/** Final answer : plage [start,end] ; on prend celle avec le plus grand start contenant le niveau (montée progressive). */
const FINAL_ANSWER_BY_LEVEL = (() => {
  const clips = [
    { start: 6, end: 11, src: final_answer_q6_11 },
    { start: 7, end: 12, src: final_answer_q7_12 },
    { start: 8, end: 13, src: final_answer_q8_13 },
    { start: 9, end: 14, src: final_answer_q9_14 },
    { start: 10, end: 15, src: final_answer_q10_15 },
  ];
  const map = {};
  for (let level = 6; level <= 15; level += 1) {
    let best = null;
    let bestStart = -1;
    clips.forEach(({ start, end, src }) => {
      if (level >= start && level <= end && start > bestStart) {
        bestStart = start;
        best = src;
      }
    });
    map[level] = best;
  }
  return map;
})();

/** Si la duree du fichier depasse ce seuil (secondes), on resout la promesse a ce moment (win-q1-5 / lose uniquement). */
const OUTCOME_STINGER_CAP_SEC = 6;

const LEVEL_SOUNDS = {
  1: { letsPlay: null, bed: bed_tier1, final: null, win: win_q1_5, lose: lose_q1_5 },
  2: { letsPlay: null, bed: bed_tier1, final: null, win: win_q1_5, lose: lose_q1_5 },
  3: { letsPlay: null, bed: bed_tier1, final: null, win: win_q1_5, lose: lose_q1_5 },
  4: { letsPlay: null, bed: bed_tier1, final: null, win: win_q1_5, lose: lose_q1_5 },
  5: { letsPlay: null, bed: bed_tier1, final: null, win: win_q5, lose: lose_q1_5 },
  6: { letsPlay: lets_play_q6, bed: bed_q6, final: FINAL_ANSWER_BY_LEVEL[6], win: win_q6, lose: lose_q6 },
  7: { letsPlay: lets_play_q7, bed: bed_q7, final: FINAL_ANSWER_BY_LEVEL[7], win: win_q7, lose: lose_q7 },
  8: { letsPlay: lets_play_q8, bed: bed_q8, final: FINAL_ANSWER_BY_LEVEL[8], win: win_q8, lose: lose_q8 },
  9: { letsPlay: lets_play_q9, bed: bed_q9, final: FINAL_ANSWER_BY_LEVEL[9], win: win_q9, lose: lose_q9 },
  10: { letsPlay: lets_play_q10, bed: bed_q10, final: FINAL_ANSWER_BY_LEVEL[10], win: win_q10, lose: lose_q10 },
  11: { letsPlay: lets_play_q11, bed: bed_q11, final: FINAL_ANSWER_BY_LEVEL[11], win: win_q11, lose: lose_q11 },
  12: { letsPlay: lets_play_q12, bed: bed_q12, final: FINAL_ANSWER_BY_LEVEL[12], win: win_q12, lose: lose_q12 },
  13: { letsPlay: lets_play_q13, bed: bed_q13, final: FINAL_ANSWER_BY_LEVEL[13], win: win_q13, lose: lose_q13 },
  14: { letsPlay: lets_play_q14, bed: bed_q14, final: FINAL_ANSWER_BY_LEVEL[14], win: win_q14, lose: lose_q14 },
  15: { letsPlay: lets_play_q15, bed: bed_q15, final: FINAL_ANSWER_BY_LEVEL[15], win: win_q15, lose: lose_q15 },
};

const SFX = {
  fiftyFifty: fifty_fifty_sfx,
  phoneFriend: phone_friend_sfx,
  askAudience: ask_audience_sfx,
  timeUp: time_up,
  goodbye,
};

class SoundManager {
  constructor() {
    this.bed = null;
    this.bedSrc = null;
    this.oneshots = new Set();
    this.oneShotCache = new Map();
    this.isMuted = false;
    this.volume = 0.7;
    this.bedVolume = 0.35;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this._preloadOneShots();
  }

  _preloadOneShots() {
    const sources = new Set();

    Object.values(FINAL_ANSWER_BY_LEVEL).forEach((src) => {
      if (src) sources.add(src);
    });

    Object.values(LEVEL_SOUNDS).forEach((conf) => {
      if (conf?.letsPlay) sources.add(conf.letsPlay);
      if (conf?.final) sources.add(conf.final);
      if (conf?.win) sources.add(conf.win);
      if (conf?.lose) sources.add(conf.lose);
    });

    Object.values(SFX).forEach((src) => {
      if (src) sources.add(src);
    });

    sources.forEach((src) => {
      try {
        const audio = new Audio(src);
        audio.preload = 'auto';
        audio.load();
        this.oneShotCache.set(src, audio);
      } catch (_) { /* ignore */ }
    });
  }

  _stopAllOneshots() {
    this.oneshots.forEach((a) => {
      try {
        a.pause();
        a.currentTime = 0;
      } catch (_) { /* ignore */ }
    });
    this.oneshots.clear();
  }

  /**
   * Stinger : promesse resolue a la fin du fichier ou sur erreur.
   * outcomeCapSec : si la duree metadata est strictement superieure a ce seuil,
   * la lecture est arretee et la promesse resolue a outcomeCapSec secondes.
   */
  _playOnce(src, { volume, stopOthers = false, outcomeCapSec = null } = {}) {
    return new Promise((resolve) => {
      if (!src || this.isMuted) return resolve();
      try {
        if (stopOthers) this._stopAllOneshots();
        let audio = this.oneShotCache.get(src);
        if (!audio) {
          audio = new Audio(src);
          audio.preload = 'auto';
          this.oneShotCache.set(src, audio);
        }
        audio.currentTime = 0;
        audio.volume = typeof volume === 'number' ? volume : this.volume;

        let settled = false;
        let capTimer = null;

        const cleanup = () => {
          if (settled) return;
          settled = true;
          if (capTimer != null) {
            clearTimeout(capTimer);
            capTimer = null;
          }
          this.oneshots.delete(audio);
          resolve();
        };

        const armCapIfNeeded = () => {
          if (outcomeCapSec == null) return;
          const d = audio.duration;
          if (!Number.isFinite(d) || d <= outcomeCapSec) return;
          capTimer = window.setTimeout(() => {
            try {
              audio.pause();
              audio.currentTime = 0;
            } catch (_) { /* ignore */ }
            cleanup();
          }, outcomeCapSec * 1000);
        };

        audio.addEventListener('loadedmetadata', armCapIfNeeded, { once: true });
        audio.addEventListener('ended', cleanup, { once: true });
        audio.addEventListener('error', cleanup, { once: true });
        this.oneshots.add(audio);
        audio.play()
          .then(() => { armCapIfNeeded(); })
          .catch(() => cleanup());
      } catch (_) {
        resolve();
      }
    });
  }

  playBed(level) {
    if (this.isMuted) return;
    const conf = LEVEL_SOUNDS[level];
    if (!conf?.bed) return;
    if (this.bed && this.bedSrc === conf.bed && !this.bed.paused) return;
    this.stopBed();
    try {
      const audio = new Audio(conf.bed);
      audio.loop = true;
      audio.volume = this.volume * this.bedVolume;
      audio.play().catch(() => {});
      this.bed = audio;
      this.bedSrc = conf.bed;
    } catch (_) { /* ignore */ }
  }

  stopBed() {
    if (this.bed) {
      try {
        this.bed.pause();
        this.bed.currentTime = 0;
      } catch (_) { /* ignore */ }
      this.bed = null;
      this.bedSrc = null;
    }
  }

  /**
   * Q6+ : clic « question suivante » — démarre le bed de la question cible,
   * puis coupe net tout stinger encore en lecture (win long, let’s play, etc.).
   */
  startQuestionBedAfterTransition(level) {
    this.playBed(level);
    this._stopAllOneshots();
  }

  playLetsPlay(level) {
    if (level >= 6) this.stopBed();
    const conf = LEVEL_SOUNDS[level];
    return this._playOnce(conf?.letsPlay);
  }

  playFinalAnswer(level) {
    if (level >= 6) this.stopBed();
    const conf = LEVEL_SOUNDS[level];
    return this._playOnce(conf?.final, { stopOthers: true });
  }

  playCorrect(level) {
    if (level >= 6) this.stopBed();
    const conf = LEVEL_SOUNDS[level];
    const winSrc = conf?.win;
    const useCap = winSrc === win_q1_5;
    return this._playOnce(winSrc, {
      stopOthers: true,
      outcomeCapSec: useCap ? OUTCOME_STINGER_CAP_SEC : null,
    });
  }

  playWrong(level) {
    this.stopBed();
    const conf = LEVEL_SOUNDS[level];
    return this._playOnce(conf?.lose, {
      stopOthers: true,
      outcomeCapSec: OUTCOME_STINGER_CAP_SEC,
    });
  }

  playFiftyFifty()   { return this._playOnce(SFX.fiftyFifty); }
  playPhoneFriend()  { return this._playOnce(SFX.phoneFriend); }
  stopPhoneFriend()  { this._stopAllOneshots(); }
  playAskAudience()  { return this._playOnce(SFX.askAudience); }
  stopAskAudience()  { this._stopAllOneshots(); }
  playTimeUp()       { this.stopBed(); return this._playOnce(SFX.timeUp, { stopOthers: true }); }
  playGoodbye()      { return this._playOnce(SFX.goodbye); }

  stopBackground()      { this.stopBed(); }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopBed();
      this._stopAllOneshots();
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
