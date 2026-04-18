// Sound URLs - Using high-quality royalty-free sounds similar to the TV show
// Freesound.org and Pixabay provide game show-like sounds

const SOUND_URLS = {
  // Background tension music for different levels (ambient suspense)
  background_low: 'https://cdn.pixabay.com/audio/2022/10/18/audio_ce166dbce5.mp3', // Suspense ambient
  background_mid: 'https://cdn.pixabay.com/audio/2023/07/06/audio_12b0c7443c.mp3', // Rising tension
  background_high: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb749bf57.mp3', // High stakes
  
  // Answer sounds - closer to the TV show style
  select: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f11e7f1191.mp3', // Selection click
  final_answer: 'https://cdn.pixabay.com/audio/2022/10/18/audio_ce166dbce5.mp3', // "Final answer" tension
  correct: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3', // Victory fanfare
  wrong: 'https://cdn.pixabay.com/audio/2022/03/15/audio_942694cbd0.mp3', // Wrong answer dramatic
  
  // Timer sounds
  timer_tick: 'https://cdn.pixabay.com/audio/2022/03/24/audio_8e7a57bf5e.mp3', // Clock tick
  timer_warning: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0c6ff0425.mp3', // Warning beep
  timer_expired: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3', // Time's up
  
  // UI sounds
  hover: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f11e7f1191.mp3', // Subtle hover
  click: 'https://cdn.pixabay.com/audio/2022/11/21/audio_a94e0c5c87.mp3', // Button click
  
  // Joker sounds - dramatic reveals
  fifty_fifty: 'https://cdn.pixabay.com/audio/2022/03/15/audio_7a79e82418.mp3', // 50:50 whoosh
  phone_friend: 'https://cdn.pixabay.com/audio/2022/10/30/audio_9b1eb9e678.mp3', // Phone ringing
  ask_audience: 'https://cdn.pixabay.com/audio/2024/02/19/audio_a93e0d9f4f.mp3', // Crowd murmur
  
  // Level progression
  level_up: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3', // Level complete
  checkpoint: 'https://cdn.pixabay.com/audio/2022/03/15/audio_4da09bb0bc.mp3', // Checkpoint reached
  million: 'https://cdn.pixabay.com/audio/2024/09/08/audio_6de7e02ca3.mp3', // Grand victory - million won!
  
  // Game start/end
  game_start: 'https://cdn.pixabay.com/audio/2022/03/10/audio_f11e7f1191.mp3', // Game intro
  game_over: 'https://cdn.pixabay.com/audio/2022/03/15/audio_942694cbd0.mp3', // Game over
};

class SoundManager {
  constructor() {
    this.sounds = {};
    this.backgroundMusic = null;
    this.timerSound = null;
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
      // Clone the audio for overlapping sounds
      const audio = this.sounds[soundName].cloneNode();
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
        audio.volume = this.volume * 0.25; // Lower volume for background
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

  // Timer sound methods
  startTimerTick() {
    if (this.isMuted) return;
    
    this.stopTimerTick();
    
    try {
      const audio = this.sounds['timer_tick'];
      if (audio) {
        audio.loop = true;
        audio.volume = this.volume * 0.4;
        audio.play().catch(() => {});
        this.timerSound = audio;
      }
    } catch (e) {
      // Silently handle errors
    }
  }

  stopTimerTick() {
    if (this.timerSound) {
      this.timerSound.pause();
      this.timerSound.currentTime = 0;
      this.timerSound = null;
    }
  }

  playTimerWarning() {
    this.play('timer_warning');
  }

  playTimerExpired() {
    this.stopTimerTick();
    this.play('timer_expired');
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopBackground();
      this.stopTimerTick();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    Object.values(this.sounds).forEach(audio => {
      audio.volume = this.volume;
    });
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.volume * 0.25;
    }
    if (this.timerSound) {
      this.timerSound.volume = this.volume * 0.4;
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }
}

export const soundManager = new SoundManager();
export default soundManager;
