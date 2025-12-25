import { useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { base64ToUint8Array, decodeAudioData } from '../utils/audio';

export const useGeminiTTS = (apiKey: string | undefined) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string) => {
    if (!apiKey) {
      setError("API Key missing");
      return;
    }
    try {
      setIsPlaying(true);
      setError(null);
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Puck' },
            },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (!audioData) {
        throw new Error("No audio data received");
      }

      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(base64ToUint8Array(audioData), ctx);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => {
        setIsPlaying(false);
        ctx.close();
      };
      source.start();

    } catch (err: any) {
      console.error("TTS Error", err);
      setError("Failed to generate speech");
      setIsPlaying(false);
    }
  };

  return { speak, isPlaying, error };
};
