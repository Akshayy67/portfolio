// Audio Manager for handling background music and sound effects
export interface AudioConfig {
  volume: number;
  loop: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
  fadeDuration?: number;
}

export class AudioManager {
  private static instance: AudioManager;
  private audioContext: AudioContext | null = null;
  private backgroundMusic: HTMLAudioElement | null = null;
  private soundEffects: Map<string, HTMLAudioElement> = new Map();
  private masterVolume: number = 0.7;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Get initialization status
  public getIsInitialized(): boolean {
    return this.isInitialized;
  }

  // Initialize audio context (must be called after user interaction)
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Create audio context
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // Resume audio context if suspended
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.isInitialized = true;
      console.log("🎵 Audio Manager initialized");
    } catch (error) {
      console.warn("Audio initialization failed:", error);
    }
  }

  // Create audio element with proper configuration
  private createAudioElement(
    src: string,
    config: AudioConfig
  ): HTMLAudioElement {
    const audio = new Audio();
    audio.src = src;
    audio.volume = config.volume * this.masterVolume;
    audio.loop = config.loop;
    audio.preload = "auto";

    // Add error handling
    audio.onerror = (e) => {
      console.warn(`Failed to load audio: ${src}`, e);
    };

    return audio;
  }

  // Play background music based on theme
  public async playBackgroundMusic(
    theme: "space" | "light" | "dark"
  ): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    if (this.isMuted) return;

    // Stop current background music
    this.stopBackgroundMusic();

    try {
      console.log("🎵 Attempting to start background music...");
      console.log("Audio context state:", this.audioContext?.state);
      console.log("Is muted:", this.isMuted);
      console.log("Master volume:", this.masterVolume);

      // Test with a simple beep first
      this.testAudioWithBeep();

      // Use Web Audio API to generate ambient space sounds
      const ambientSound = this.generateAmbientSpaceSound();
      if (ambientSound) {
        this.backgroundMusic = ambientSound;
        await this.playWithFadeIn(this.backgroundMusic, 2000);
        console.log("🎵 Background music started successfully");
      } else {
        console.warn("Failed to generate ambient sound");
      }
    } catch (error) {
      console.warn("Failed to play background music:", error);
    }
  }

  // Test audio with a simple beep
  public testAudioWithBeep(): void {
    if (!this.audioContext) {
      console.warn("No audio context available for test");
      return;
    }

    try {
      console.log("🔊 Testing audio with beep...");
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = 440; // A4 note
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        0.1,
        this.audioContext.currentTime + 0.01
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        this.audioContext.currentTime + 0.5
      );

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);

      console.log("🔊 Test beep should be playing");
    } catch (error) {
      console.error("Test beep failed:", error);
    }
  }

  // Generate soothing ambient space sound using Web Audio API
  private generateAmbientSpaceSound(): HTMLAudioElement | null {
    if (!this.audioContext) return null;

    try {
      // Create a buffer for ambient space sound
      const duration = 45; // 45 seconds loop for more variation
      const sampleRate = this.audioContext.sampleRate;
      const buffer = this.audioContext.createBuffer(
        2,
        duration * sampleRate,
        sampleRate
      );

      // Generate soothing ambient space-like sound
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < channelData.length; i++) {
          const time = i / sampleRate;

          // Soothing low-frequency drones
          const drone1 = Math.sin(2 * Math.PI * 55 * time) * 0.03; // A1 note
          const drone2 = Math.sin(2 * Math.PI * 82.4 * time) * 0.02; // E2 note
          const drone3 = Math.sin(2 * Math.PI * 110 * time) * 0.015; // A2 note

          // Gentle harmonic overtones
          const harmonic1 = Math.sin(2 * Math.PI * 165 * time) * 0.01; // E3
          const harmonic2 = Math.sin(2 * Math.PI * 220 * time) * 0.008; // A3

          // Slow modulation for breathing effect
          const modulation = Math.sin(2 * Math.PI * 0.05 * time) * 0.3 + 0.7;

          // Very subtle pink noise for texture
          const noise = (Math.random() - 0.5) * 0.005;

          // Gentle reverb-like delay
          const delay =
            i > sampleRate * 0.3
              ? channelData[i - Math.floor(sampleRate * 0.3)] * 0.1
              : 0;

          channelData[i] =
            (drone1 + drone2 + drone3 + harmonic1 + harmonic2 + noise + delay) *
            modulation;
        }
      }

      // Create audio element from buffer
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.15 * this.masterVolume; // Lower volume for soothing effect

      // Add a low-pass filter for warmth
      const filter = this.audioContext.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 800;
      filter.Q.value = 0.5;

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create a dummy audio element for interface compatibility
      const audio = new Audio();
      audio.volume = 0.15 * this.masterVolume;
      audio.loop = true;

      // Store references for stopping
      (audio as any)._source = source;
      (audio as any)._gainNode = gainNode;

      // Override play method to start Web Audio API source
      audio.play = () => {
        source.start();
        return Promise.resolve();
      };

      // Override pause method to stop Web Audio API source
      audio.pause = () => {
        try {
          source.stop();
        } catch (e) {
          // Source might already be stopped
        }
      };

      return audio;
    } catch (error) {
      console.warn("Failed to generate ambient sound:", error);
      return null;
    }
  }

  // Play rocket launch sound effects
  public async playRocketLaunchSequence(): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    if (this.isMuted) return;

    try {
      console.log("🚀 Starting rocket launch audio sequence...");
      console.log("Audio context state:", this.audioContext?.state);

      // Test beep first
      this.testAudioWithBeep();

      // Countdown beeps
      await this.playCountdownBeeps();

      // Ignition sound
      setTimeout(() => {
        console.log("🔥 Playing ignition sound");
        this.playIgnitionSound();
      }, 2400);

      // Launch sound
      setTimeout(() => {
        console.log("🚀 Playing launch sound");
        this.playLaunchSound();
      }, 3200);

      // Warp sound
      setTimeout(() => {
        console.log("⚡ Playing warp sound");
        this.playWarpSound();
      }, 4500);
    } catch (error) {
      console.warn("Failed to play rocket launch sequence:", error);
    }
  }

  // Generate countdown beeps with NASA-style sounds
  private async playCountdownBeeps(): Promise<void> {
    if (!this.audioContext) return;

    console.log("⏰ Starting countdown beeps...");
    for (let i = 3; i > 0; i--) {
      setTimeout(() => {
        console.log(`⏰ Countdown: T-${i}`);
        // NASA-style countdown beep with harmonics
        this.generateCountdownBeep(i);
      }, (3 - i) * 600);
    }
  }

  // Generate NASA-style countdown beep
  private generateCountdownBeep(count: number): void {
    if (!this.audioContext) return;

    const frequency = count === 1 ? 1000 : 800; // Higher pitch for final countdown
    const duration = count === 1 ? 0.4 : 0.2;

    // Main beep
    this.generateBeep(frequency, duration, 0.4);

    // Harmonic for richness
    setTimeout(() => {
      this.generateBeep(frequency * 1.5, duration * 0.7, 0.2);
    }, 50);
  }

  // Generate realistic ignition sound
  private playIgnitionSound(): void {
    if (!this.audioContext) return;

    // Deep rumble for engine ignition
    this.generateEngineIgnition();
  }

  // Generate engine ignition with multiple layers
  private generateEngineIgnition(): void {
    if (!this.audioContext) return;

    // Deep bass rumble
    this.generateNoise(0.15, 1200, "lowpass", 150);

    // Mid-frequency engine roar
    setTimeout(() => {
      this.generateNoise(0.1, 800, "bandpass", 300);
    }, 200);

    // High-frequency hiss
    setTimeout(() => {
      this.generateNoise(0.05, 600, "highpass", 2000);
    }, 400);
  }

  // Generate powerful launch sound
  private playLaunchSound(): void {
    if (!this.audioContext) return;

    // Multi-layered rocket launch sound
    this.generateRocketLaunch();
  }

  // Generate realistic rocket launch sound
  private generateRocketLaunch(): void {
    if (!this.audioContext) return;

    // Deep engine roar
    this.generateSweep(80, 200, 2.0, 0.5);

    // Mid-frequency thrust
    setTimeout(() => {
      this.generateSweep(200, 600, 1.8, 0.3);
    }, 300);

    // High-frequency exhaust
    setTimeout(() => {
      this.generateNoise(0.2, 1500, "highpass", 1500);
    }, 600);

    // Doppler effect as rocket moves away
    setTimeout(() => {
      this.generateSweep(600, 300, 1.0, 0.2);
    }, 1200);
  }

  // Generate warp sound with sci-fi elements
  private playWarpSound(): void {
    if (!this.audioContext) return;

    // Sci-fi warp sound with multiple layers
    this.generateWarpEffect();
  }

  // Generate sci-fi warp effect
  private generateWarpEffect(): void {
    if (!this.audioContext) return;

    // Rising frequency sweep
    this.generateSweep(400, 2000, 1.2, 0.3);

    // Harmonic sweep
    setTimeout(() => {
      this.generateSweep(800, 4000, 1.0, 0.2);
    }, 200);

    // Digital-like modulation
    setTimeout(() => {
      this.generateModulatedTone(1500, 0.8, 0.25);
    }, 400);
  }

  // Generate modulated tone for sci-fi effects
  private generateModulatedTone(
    frequency: number,
    duration: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const modulator = this.audioContext.createOscillator();
    const modulatorGain = this.audioContext.createGain();

    // Setup modulation
    modulator.frequency.value = 20; // 20 Hz modulation
    modulatorGain.gain.value = 100;

    modulator.connect(modulatorGain);
    modulatorGain.connect(oscillator.frequency);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sawtooth";
    modulator.type = "sine";

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume * this.masterVolume,
      this.audioContext.currentTime + 0.1
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    modulator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
    modulator.stop(this.audioContext.currentTime + duration);
  }

  // Generate a beep sound
  private generateBeep(
    frequency: number,
    duration: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume * this.masterVolume,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Generate noise with filter
  private generateNoise(
    volume: number,
    duration: number,
    filterType: BiquadFilterType,
    frequency: number
  ): void {
    if (!this.audioContext) return;

    const bufferSize = (this.audioContext.sampleRate * duration) / 1000;
    const buffer = this.audioContext.createBuffer(
      1,
      bufferSize,
      this.audioContext.sampleRate
    );
    const data = buffer.getChannelData(0);

    // Generate white noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.audioContext.createBufferSource();
    const filter = this.audioContext.createBiquadFilter();
    const gainNode = this.audioContext.createGain();

    source.buffer = buffer;
    filter.type = filterType;
    filter.frequency.value = frequency;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    gainNode.gain.value = volume * this.masterVolume;

    source.start();
  }

  // Generate frequency sweep
  private generateSweep(
    startFreq: number,
    endFreq: number,
    duration: number,
    volume: number
  ): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(
      startFreq,
      this.audioContext.currentTime
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      endFreq,
      this.audioContext.currentTime + duration
    );

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume * this.masterVolume,
      this.audioContext.currentTime + 0.1
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Utility methods
  private async playWithFadeIn(
    audio: HTMLAudioElement,
    duration: number
  ): Promise<void> {
    audio.volume = 0;
    await audio.play();

    const steps = 50;
    const stepDuration = duration / steps;
    const volumeStep = (0.3 * this.masterVolume) / steps;

    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        audio.volume = Math.min(
          audio.volume + volumeStep,
          0.3 * this.masterVolume
        );
      }, i * stepDuration);
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic = null;
    }
  }

  public stopAllAudio(): void {
    // Stop background music
    this.stopBackgroundMusic();

    // Stop all sound effects
    this.soundEffects.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.soundEffects.clear();

    // Suspend audio context to stop all audio
    if (this.audioContext && this.audioContext.state !== "suspended") {
      this.audioContext.suspend();
    }
  }

  public resumeAudio(): void {
    // Resume audio context
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  public setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = 0.3 * this.masterVolume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
    }
    return this.isMuted;
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();
