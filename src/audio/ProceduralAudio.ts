export function generateAudioAssets(
  load: (key: string, url: string) => void
): void {
  for (const [key, gen] of Object.entries(generators)) {
    const blob = generateWav(gen);
    const url = URL.createObjectURL(blob);
    load(key, url);
  }
}

interface SoundDef {
  samples: number;
  sampleRate: number;
  channels: number;
  generate: (t: number, i: number, sampleRate: number) => number;
}

const SAMPLE_RATE = 22050;

const generators: Record<string, SoundDef> = {
  "music-menu": menuMusic(),
  "music-world1": worldMusic(),
  "music-world2": worldMusic(),
  "music-world3": worldMusic(),
  "music-boss": bossMusic(),
  "music-victory": victoryMusic(),
  "sfx-jump": sfxJump(),
  "sfx-coin": sfxCoin(),
  "sfx-stomp": sfxStomp(),
  "sfx-powerup": sfxPowerUp(),
  "sfx-damage": sfxDamage(),
  "sfx-block-hit": sfxBlockHit(),
  "sfx-break-block": sfxBreakBlock(),
  "sfx-gameover": sfxGameOver(),
  "sfx-boss-hurt": sfxBossHurt(),
  "sfx-checkpoint": sfxCheckpoint(),
  "sfx-level-complete": sfxLevelComplete(),
  "sfx-shoot": sfxShoot(),
};

function generateWav(def: SoundDef): Blob {
  const numSamples = def.samples;
  const buffer = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / def.sampleRate;
    buffer[i] = def.generate(t, i, def.sampleRate);
  }

  const numChannels = def.channels;
  const bitsPerSample = 16;
  const byteRate = def.sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = numSamples * (bitsPerSample / 8);
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, def.sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, buffer[i]));
    const val = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(headerSize + i * 2, val, true);
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function square(freq: number, t: number): number {
  return Math.sin(2 * Math.PI * freq * t) >= 0 ? 0.5 : -0.5;
}

function triangle(freq: number, t: number): number {
  return (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * freq * t));
}

function noise(): number {
  return Math.random() * 2 - 1;
}

function sfxJump(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.15),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const freq = 300 + t * 3000;
      const env = Math.max(0, 1 - t / 0.15);
      return square(freq, t) * env * 0.3;
    },
  };
}

function sfxCoin(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.12),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const freq = t < 0.06 ? 988 : 1319;
      const env = Math.max(0, 1 - t / 0.12);
      return square(freq, t) * env * 0.3;
    },
  };
}

function sfxStomp(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.2),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const freq = 200 - t * 800;
      const env = Math.max(0, 1 - t / 0.2);
      return square(Math.max(freq, 40), t) * env * 0.3;
    },
  };
}

function sfxPowerUp(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.4),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const freq = 200 + t * 2000;
      const env = Math.max(0, 1 - t / 0.4);
      return triangle(freq, t) * env * 0.25;
    },
  };
}

function sfxDamage(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.3),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const freq = 100 - t * 150;
      const env = Math.max(0, 1 - t / 0.3);
      return square(Math.max(freq, 30), t) * env * 0.3;
    },
  };
}

function sfxBlockHit(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.08),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const env = Math.max(0, 1 - t / 0.08);
      return square(400, t) * env * 0.25;
    },
  };
}

function sfxBreakBlock(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.15),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const env = Math.max(0, 1 - t / 0.15);
      return (square(200 + noise() * 100, t) + noise() * 0.3) * env * 0.2;
    },
  };
}

function sfxGameOver(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 1.0),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const freq = 300 - t * 250;
      const env = Math.max(0, 1 - t / 1.0);
      return square(Math.max(freq, 50), t) * env * 0.3;
    },
  };
}

function sfxBossHurt(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.3),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const env = Math.max(0, 1 - t / 0.3);
      return noise() * env * 0.3;
    },
  };
}

function sfxCheckpoint(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.3),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const freq = t < 0.15 ? 660 : 880;
      const env = Math.max(0, 1 - t / 0.3);
      return triangle(freq, t) * env * 0.3;
    },
  };
}

function sfxLevelComplete(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.6),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const notes = [523, 659, 784, 1047];
      const noteIdx = Math.min(Math.floor(t / 0.15), 3);
      const freq = notes[noteIdx];
      const env = Math.max(0, 1 - t / 0.6);
      return triangle(freq, t) * env * 0.3;
    },
  };
}

function sfxShoot(): SoundDef {
  return {
    samples: Math.floor(SAMPLE_RATE * 0.1),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const freq = 400 + t * 3000;
      const env = Math.max(0, 1 - t / 0.1);
      return square(freq, t) * env * 0.2;
    },
  };
}

function menuMusic(): SoundDef {
  const noteSeq = [262, 294, 330, 349, 392, 349, 330, 294];
  const noteLen = 0.25;
  const totalLen = noteSeq.length * noteLen;
  const loopCount = 4;
  return {
    samples: Math.floor(SAMPLE_RATE * totalLen * loopCount),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const loopPos = t % totalLen;
      const noteIdx = Math.min(Math.floor(loopPos / noteLen), noteSeq.length - 1);
      const freq = noteSeq[noteIdx];
      const noteT = (loopPos % noteLen) / noteLen;
      const env = Math.max(0, 1 - noteT) * 0.5;
      return triangle(freq, t) * env * 0.15;
    },
  };
}

function worldMusic(): SoundDef {
  const noteSeq = [392, 440, 494, 523, 494, 440, 392, 330];
  const noteLen = 0.2;
  const totalLen = noteSeq.length * noteLen;
  const loopCount = 4;
  return {
    samples: Math.floor(SAMPLE_RATE * totalLen * loopCount),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const loopPos = t % totalLen;
      const noteIdx = Math.min(Math.floor(loopPos / noteLen), noteSeq.length - 1);
      const freq = noteSeq[noteIdx];
      const noteT = (loopPos % noteLen) / noteLen;
      const env = Math.max(0, 1 - noteT) * 0.4;
      return triangle(freq, t) * env * 0.12;
    },
  };
}

function bossMusic(): SoundDef {
  const noteSeq = [220, 233, 262, 233, 220, 196, 220, 262];
  const noteLen = 0.3;
  const totalLen = noteSeq.length * noteLen;
  const loopCount = 3;
  return {
    samples: Math.floor(SAMPLE_RATE * totalLen * loopCount),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const loopPos = t % totalLen;
      const noteIdx = Math.min(Math.floor(loopPos / noteLen), noteSeq.length - 1);
      const freq = noteSeq[noteIdx];
      const noteT = (loopPos % noteLen) / noteLen;
      const env = Math.max(0, 1 - noteT) * 0.5;
      return triangle(freq, t) * env * 0.2;
    },
  };
}

function victoryMusic(): SoundDef {
  const noteSeq = [523, 659, 784, 1047, 784, 1047, 1319];
  const noteLen = 0.2;
  const totalLen = noteSeq.length * noteLen;
  const loopCount = 2;
  return {
    samples: Math.floor(SAMPLE_RATE * totalLen * loopCount),
    sampleRate: SAMPLE_RATE,
    channels: 1,
    generate: (t) => {
      const loopPos = t % totalLen;
      const noteIdx = Math.min(Math.floor(loopPos / noteLen), noteSeq.length - 1);
      const freq = noteSeq[noteIdx];
      const noteT = (loopPos % noteLen) / noteLen;
      const env = Math.max(0, 1 - noteT) * 0.5;
      return triangle(freq, t) * env * 0.2;
    },
  };
}
