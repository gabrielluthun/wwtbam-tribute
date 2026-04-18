// Sound URLs - Using royalty-free sounds
const SOUND_URLS = {
  // Background tension music for different levels
  background_low: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Suspense
  background_mid: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3', // Higher tension
  background_high: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Maximum tension
  
  // Answer sounds
  select: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Click select
  final_answer: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Tension wait
  correct: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Win fanfare
  wrong: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3', // Dramatic fail
  
  // UI sounds
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle hover
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Button click
  
  // Joker sounds
  fifty_fifty: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  phone_friend: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  ask_audience: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  
  // Level up
  level_up: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  checkpoint: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  million: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Grand victory
};

class SoundManager {
  constructor() {
    this.sounds = {};
    this.backgroundMusic = null;
    this.isMuted = false;
    this.volume = 0.5;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    // Pre-load all sounds
    Object.entries(SOUND_URLS).forEach(([key, url]) => {
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds[key] = audio;
    });
    
    this.initialized = true;
  }

  play(soundName) {
    if (this.isMuted || !this.sounds[soundName]) return;
    
    try {
      const audio = this.sounds[soundName];
      audio.currentTime = 0;
      audio.volume = this.volume;
      audio.play().catch(() => {
        // Silently handle autoplay restrictions
      });
    } catch (e) {
      // Silently handle errors
    }
  }

  playBackground(level) {
    if (this.isMuted) return;
    
    this.stopBackground();
    
    let soundKey = 'background_low';
    if (level >= 10) soundKey = 'background_high';
    else if (level >= 5) soundKey = 'background_mid';
    
    try {
      const audio = this.sounds[soundKey];
      if (audio) {
        audio.loop = true;
        audio.volume = this.volume * 0.3; // Lower volume for background
        audio.play().catch(() => {});
        this.backgroundMusic = audio;
      }
    } catch (e) {
      // Silently handle errors
    }
  }

  stopBackground() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopBackground();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    Object.values(this.sounds).forEach(audio => {
      audio.volume = this.volume;
    });
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume * 0.3;
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
export default soundManager;
