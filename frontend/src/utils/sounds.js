// Gestionnaire audio utilisant les vrais assets musicaux de l'emission
// "Qui Veut Gagner Des Millions" (version UK originale remappee sur 15 niveaux).
//
// Les niveaux 1 a 5 partagent un meme bed musical ("tier 1"), le niveau 5
// (checkpoint 1 000 EUR) beneficie d'un jingle special. Les niveaux 6 a 15
// ont chacun leur propre set : lets_play / question bed / final answer /
// win / lose.

import intro_rules from '../asset/sounds/intro_rules.mp3';

// Tier 1 - niveaux 1 a 5
import q_tier1 from '../asset/sounds/q_tier1.mp3';
import win_tier1 from '../asset/sounds/win_tier1.mp3';
import lose_tier1 from '../asset/sounds/lose_tier1.mp3';
import checkpoint_1k_win from '../asset/sounds/checkpoint_1k_win.mp3';

// Niveau 6 (2 000 EUR)
import lets_play_L06 from '../asset/sounds/lets_play_L06.mp3';
import q_L06 from '../asset/sounds/q_L06.mp3';
import final_L06 from '../asset/sounds/final_L06.mp3';
import lose_L06 from '../asset/sounds/lose_L06.mp3';
import win_L06 from '../asset/sounds/win_L06.mp3';

// Niveau 7 (4 000 EUR)
import lets_play_L07 from '../asset/sounds/lets_play_L07.mp3';
import q_L07 from '../asset/sounds/q_L07.mp3';
import final_L07 from '../asset/sounds/final_L07.mp3';
import lose_L07 from '../asset/sounds/lose_L07.mp3';
import win_L07 from '../asset/sounds/win_L07.mp3';

// Niveau 8 (8 000 EUR)
import lets_play_L08 from '../asset/sounds/lets_play_L08.mp3';
import q_L08 from '../asset/sounds/q_L08.mp3';
import final_L08 from '../asset/sounds/final_L08.mp3';
import lose_L08 from '../asset/sounds/lose_L08.mp3';
import win_L08 from '../asset/sounds/win_L08.mp3';

// Niveau 9 (12 000 EUR)
import lets_play_L09 from '../asset/sounds/lets_play_L09.mp3';
import q_L09 from '../asset/sounds/q_L09.mp3';
import final_L09 from '../asset/sounds/final_L09.mp3';
import lose_L09 from '../asset/sounds/lose_L09.mp3';
import win_L09 from '../asset/sounds/win_L09.mp3';

// Niveau 10 (24 000 EUR - checkpoint)
import lets_play_L10 from '../asset/sounds/lets_play_L10.mp3';
import q_L10 from '../asset/sounds/q_L10.mp3';
import final_L10 from '../asset/sounds/final_L10.mp3';
import lose_L10 from '../asset/sounds/lose_L10.mp3';
import win_L10 from '../asset/sounds/win_L10.mp3';

// Niveau 11 (48 000 EUR)
import lets_play_L11 from '../asset/sounds/lets_play_L11.mp3';
import q_L11 from '../asset/sounds/q_L11.mp3';
import final_L11 from '../asset/sounds/final_L11.mp3';
import lose_L11 from '../asset/sounds/lose_L11.mp3';
import win_L11 from '../asset/sounds/win_L11.mp3';

// Niveau 12 (72 000 EUR)
import lets_play_L12 from '../asset/sounds/lets_play_L12.mp3';
import q_L12 from '../asset/sounds/q_L12.mp3';
import final_L12 from '../asset/sounds/final_L12.mp3';
import lose_L12 from '../asset/sounds/lose_L12.mp3';
import win_L12 from '../asset/sounds/win_L12.mp3';

// Niveau 13 (100 000 EUR)
import lets_play_L13 from '../asset/sounds/lets_play_L13.mp3';
import q_L13 from '../asset/sounds/q_L13.mp3';
import final_L13 from '../asset/sounds/final_L13.mp3';
import lose_L13 from '../asset/sounds/lose_L13.mp3';
import win_L13 from '../asset/sounds/win_L13.mp3';

// Niveau 14 (300 000 EUR)
import lets_play_L14 from '../asset/sounds/lets_play_L14.mp3';
import q_L14 from '../asset/sounds/q_L14.mp3';
import final_L14 from '../asset/sounds/final_L14.mp3';
import lose_L14 from '../asset/sounds/lose_L14.mp3';
import win_L14 from '../asset/sounds/win_L14.mp3';

// Niveau 15 (1 000 000 EUR - MILLION !)
import lets_play_L15 from '../asset/sounds/lets_play_L15.mp3';
import q_L15 from '../asset/sounds/q_L15.mp3';
import final_L15 from '../asset/sounds/final_L15.mp3';
import lose_L15 from '../asset/sounds/lose_L15.mp3';
import win_L15 from '../asset/sounds/win_L15.mp3';

// Jokers & divers
import fifty_fifty_sfx from '../asset/sounds/fifty_fifty.mp3';
import phone_friend_sfx from '../asset/sounds/phone_friend.mp3';
import ask_audience_sfx from '../asset/sounds/ask_audience.mp3';
import lifeline_ping from '../asset/sounds/lifeline_ping.mp3';
import time_up from '../asset/sounds/time_up.mp3';
import goodbye from '../asset/sounds/goodbye.mp3';

// Mapping niveau -> sons
// letsPlay/final sont null pour les niveaux 1-4 (partageaient le meme bed a la TV)
const LEVEL_SOUNDS = {
  1: { letsPlay: null, bed: q_tier1, final: null, win: win_tier1, lose: lose_tier1 },
  2: { letsPlay: null, bed: q_tier1, final: null, win: win_tier1, lose: lose_tier1 },
  3: { letsPlay: null, bed: q_tier1, final: null, win: win_tier1, lose: lose_tier1 },
  4: { letsPlay: null, bed: q_tier1, final: null, win: win_tier1, lose: lose_tier1 },
  // Palier 1 000 EUR : jingle de checkpoint dedie a la victoire
  5: { letsPlay: null, bed: q_tier1, final: null, win: checkpoint_1k_win, lose: lose_tier1 },
  6:  { letsPlay: lets_play_L06, bed: q_L06, final: final_L06, win: win_L06, lose: lose_L06 },
  7:  { letsPlay: lets_play_L07, bed: q_L07, final: final_L07, win: win_L07, lose: lose_L07 },
  8:  { letsPlay: lets_play_L08, bed: q_L08, final: final_L08, win: win_L08, lose: lose_L08 },
  9:  { letsPlay: lets_play_L09, bed: q_L09, final: final_L09, win: win_L09, lose: lose_L09 },
  10: { letsPlay: lets_play_L10, bed: q_L10, final: final_L10, win: win_L10, lose: lose_L10 },
  11: { letsPlay: lets_play_L11, bed: q_L11, final: final_L11, win: win_L11, lose: lose_L11 },
  12: { letsPlay: lets_play_L12, bed: q_L12, final: final_L12, win: win_L12, lose: lose_L12 },
  13: { letsPlay: lets_play_L13, bed: q_L13, final: final_L13, win: win_L13, lose: lose_L13 },
  14: { letsPlay: lets_play_L14, bed: q_L14, final: final_L14, win: win_L14, lose: lose_L14 },
  15: { letsPlay: lets_play_L15, bed: q_L15, final: final_L15, win: win_L15, lose: lose_L15 },
};

const SFX = {
  intro: intro_rules,
  fiftyFifty: fifty_fifty_sfx,
  phoneFriend: phone_friend_sfx,
  askAudience: ask_audience_sfx,
  lifeline: lifeline_ping,
  timeUp: time_up,
  goodbye,
};

class SoundManager {
  constructor() {
    this.bed = null;           // Audio en cours pour le fond de question (loop)
    this.bedSrc = null;        // Source du bed en cours (pour eviter les redemarrages inutiles)
    this.oneshots = new Set(); // Stingers en cours (pour pouvoir tout couper)
    this.oneShotCache = new Map(); // Cache d'instances Audio pour reduire la latence au declenchement
    this.isMuted = false;
    this.volume = 0.7;         // Volume general
    this.bedVolume = 0.35;     // Ratio volume musique de fond
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;
    this._preloadOneShots();
  }

  _preloadOneShots() {
    const sources = new Set();

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
      } catch (_) { }
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

  // Joue un son court (stinger). Retourne une Promise resolue a la fin.
  _playOnce(src, { volume, stopOthers = false } = {}) {
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
        const cleanup = () => {
          this.oneshots.delete(audio);
          resolve();
        };
        audio.addEventListener('ended', cleanup, { once: true });
        audio.addEventListener('error', cleanup, { once: true });
        this.oneshots.add(audio);
        audio.play().catch(() => cleanup());
      } catch (_) {
        resolve();
      }
    });
  }

  // --- Musique de fond (bed) ------------------------------------------------
  playBed(level) {
    if (this.isMuted) return;
    const conf = LEVEL_SOUNDS[level];
    if (!conf?.bed) return;
    // Si le meme bed joue deja (palier 1), on le laisse tourner en continu.
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

  // --- Sons par niveau ------------------------------------------------------
  playLetsPlay(level) {
    // A partir du niveau 6, on coupe le bed avant l'annonce "Let's play".
    // Sur le premier palier (1-5), on garde le bed en continu, y compris sur "Pour x€".
    if (level >= 6) this.stopBed();
    const conf = LEVEL_SOUNDS[level];
    return this._playOnce(conf?.letsPlay);
  }

  playFinalAnswer(level) {
    // Palier 1 (Q1-Q5) : bed non-stop, donc pas de coupe ici.
    if (level >= 6) this.stopBed();
    const conf = LEVEL_SOUNDS[level];
    return this._playOnce(conf?.final, { stopOthers: true });
  }

  playCorrect(level) {
    // Palier 1 (Q1-Q5) : superposition bed + jingle de bonne reponse.
    if (level >= 6) this.stopBed();
    const conf = LEVEL_SOUNDS[level];
    return this._playOnce(conf?.win, { stopOthers: true });
  }

  playWrong(level) {
    this.stopBed();
    const conf = LEVEL_SOUNDS[level];
    return this._playOnce(conf?.lose, { stopOthers: true });
  }

  // --- Sons generiques ------------------------------------------------------
  playGameStart()    { return Promise.resolve(); }
  playFiftyFifty()   { return this._playOnce(SFX.fiftyFifty); }
  playPhoneFriend()  { return this._playOnce(SFX.phoneFriend); }
  stopPhoneFriend()  { this._stopAllOneshots(); }
  playAskAudience()  { return this._playOnce(SFX.askAudience); }
  stopAskAudience()  { this._stopAllOneshots(); }
  playLifeline()     { return this._playOnce(SFX.lifeline); }
  playTimeUp()       { this.stopBed(); return this._playOnce(SFX.timeUp, { stopOthers: true }); }
  playGoodbye()      { return this._playOnce(SFX.goodbye); }

  // --- Compat avec l'ancienne API (play("nom")) -----------------------------
  // Les noms depourvus de contexte de niveau sont mappes ici ; les sons
  // dependant du niveau doivent etre appeles via playCorrect/playWrong/etc.
  play(name) {
    switch (name) {
      case 'fifty_fifty':  return this.playFiftyFifty();
      case 'phone_friend': return this.playPhoneFriend();
      case 'ask_audience': return this.playAskAudience();
      case 'game_start':   return this.playGameStart();
      case 'game_over':    return this.playGoodbye();
      case 'timer_expired':return this.playTimeUp();
      case 'million':      return this.playCorrect(15);
      case 'select':       // pas de SFX : on reste silencieux
      case 'hover':
      case 'click':
      case 'final_answer': // doit etre appele via playFinalAnswer(level)
      case 'correct':      // doit etre appele via playCorrect(level)
      case 'wrong':        // doit etre appele via playWrong(level)
      case 'level_up':
      case 'checkpoint':
      case 'timer_tick':
      case 'timer_warning':
      default:
        return Promise.resolve();
    }
  }

  // Back-compat : anciennes methodes utilisees par Game.jsx
  playBackground(level) { this.playBed(level); }
  stopBackground()      { this.stopBed(); }
  // Pas d'asset de tick/warning : les beds de question assurent la tension
  startTimerTick()      { /* no-op */ }
  stopTimerTick()       { /* no-op */ }
  playTimerWarning()    { /* no-op */ }
  playTimerExpired()    { this.playTimeUp(); }

  // --- Mute / volume --------------------------------------------------------
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

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.bed) this.bed.volume = this.volume * this.bedVolume;
    this.oneshots.forEach((a) => { a.volume = this.volume; });
  }
}

export const soundManager = new SoundManager();
export default soundManager;
