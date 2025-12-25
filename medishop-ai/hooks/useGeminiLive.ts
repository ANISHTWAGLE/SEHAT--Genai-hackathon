import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, FunctionDeclaration, Type } from '@google/genai';
import { createPcmBlob, base64ToUint8Array, decodeAudioData } from '../utils/audio';
import { PRODUCTS } from '../constants';
import { StoreAction } from '../types';

// Define tools available to the model
const tools: FunctionDeclaration[] = [
  {
    name: 'addToCart',
    description: 'Add a product to the shopping cart. Ask for quantity if not specified (default 1).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: 'The ID of the product to add (e.g., m1, m2)' },
        quantity: { type: Type.NUMBER, description: 'The number of items to add' },
      },
      required: ['productId'],
    },
  },
  {
    name: 'removeFromCart',
    description: 'Remove a quantity of a product from the cart. If quantity is omitted, remove the item entirely.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: 'The ID of the product to remove' },
        quantity: { type: Type.NUMBER, description: 'The number of items to remove. Optional.' },
      },
      required: ['productId'],
    },
  },
  {
    name: 'viewProductDetails',
    description: 'Open the detailed view for a specific product.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        productId: { type: Type.STRING, description: 'The ID of the product to view' },
      },
      required: ['productId'],
    },
  },
  {
    name: 'searchProducts',
    description: 'Search or filter products by a query string.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: { type: Type.STRING, description: 'The search term' },
      },
      required: ['query'],
    },
  },
  {
    name: 'openCart',
    description: 'Open the shopping cart sidebar/drawer.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: 'closeCart',
    description: 'Close the shopping cart sidebar/drawer.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: 'checkout',
    description: 'Proceed to checkout and complete the order. This will clear the cart and show the order confirmation.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: 'viewOrderHistory',
    description: 'Navigate to the order history page to see past orders.',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
];

const systemInstruction = `
You are the voice assistant for "MediShop AI", a medical supply store. 
You can control the website for the user.
Your tone should be helpful, professional, and empathetic.
Products available (Prices in INR/Rupees):
${PRODUCTS.map(p => `- ${p.name} (ID: ${p.id}): ₹${p.price}, ${p.category}`).join('\n')}

When a user asks to see something, use viewProductDetails.
When they want to buy, use addToCart.
When they want to remove items, be careful to check if they specified a quantity. Use removeFromCart with the quantity argument if specified.
When they say "checkout", "buy now", or "place order", use the checkout tool.
When they want to see past orders or history, use viewOrderHistory.
Always confirm actions briefly verbally.
If the user asks about medicine details, provide the 'description' and 'benefits' from the product list.
`;

interface UseGeminiLiveProps {
  dispatch: React.Dispatch<StoreAction>;
  apiKey: string | undefined;
}

export const useGeminiLive = ({ dispatch, apiKey }: UseGeminiLiveProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Track the current session promise to ensure we can reference it in closures and clean it up
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  const stopAllAudio = useCallback(() => {
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { /* ignore */ }
    });
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setIsSpeaking(false);
  }, []);

  const disconnect = useCallback(() => {
    // Stop processing input
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      inputSourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    
    stopAllAudio();

    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      try { inputAudioContextRef.current.close(); } catch (e) { /* ignore */ }
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      try { outputAudioContextRef.current.close(); } catch (e) { /* ignore */ }
    }

    // Close session if it exists
    if (sessionPromiseRef.current) {
      sessionPromiseRef.current.then(session => {
        // @ts-ignore
        if (session && session.close) session.close();
      }).catch(() => {});
      sessionPromiseRef.current = null;
    }

    setIsConnected(false);
    setIsSpeaking(false);
  }, [stopAllAudio]);

  const connect = useCallback(async () => {
    if (!apiKey) {
      setError("API Key is missing");
      return;
    }
    setError(null);

    // Ensure clean state before connecting
    disconnect();

    try {
      const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      // Initialize audio contexts
      inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
      outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      let currentSession: Promise<any>;

      // We define the promise variable before assigning it, allowing usage inside the callbacks
      // @ts-ignore
      currentSession = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: ['AUDIO'], // Use string literal to avoid Enum import issues
          tools: [{ functionDeclarations: tools }],
          systemInstruction: systemInstruction,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Opened');
            setIsConnected(true);
            
            if (!inputAudioContextRef.current) return;
            const ctx = inputAudioContextRef.current;
            const source = ctx.createMediaStreamSource(stream);
            const processor = ctx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              
              currentSession.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(ctx.destination);
            
            inputSourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.toolCall) {
              console.log("Tool Call:", msg.toolCall);
              for (const fc of msg.toolCall.functionCalls) {
                let result: any = { result: 'ok' };
                try {
                  const { name, args } = fc;
                  if (name === 'addToCart') {
                    const product = PRODUCTS.find(p => p.id === args.productId);
                    if (product) {
                      dispatch({ 
                        type: 'ADD_TO_CART', 
                        product, 
                        quantity: typeof args.quantity === 'number' ? args.quantity : 1 
                      });
                      result = { result: `Added ${product.name} to cart` };
                    } else {
                      result = { error: 'Product not found' };
                    }
                  } else if (name === 'removeFromCart') {
                     const product = PRODUCTS.find(p => p.id === args.productId);
                     if (product) {
                       if (typeof args.quantity === 'number') {
                         dispatch({ type: 'DECREMENT_CART_ITEM', productId: product.id, quantity: args.quantity });
                         result = { result: `Removed ${args.quantity} ${product.name} from cart` };
                       } else {
                         dispatch({ type: 'REMOVE_FROM_CART', productId: product.id });
                         result = { result: `Removed all ${product.name} from cart` };
                       }
                     } else {
                        result = { error: 'Product not found' };
                     }
                  } else if (name === 'viewProductDetails') {
                    const product = PRODUCTS.find(p => p.id === args.productId);
                    if (product) {
                      dispatch({ type: 'VIEW_PRODUCT', product });
                      result = { result: `Viewing ${product.name}` };
                    } else {
                      result = { error: 'Product not found' };
                    }
                  } else if (name === 'openCart') {
                    dispatch({ type: 'OPEN_CART' });
                    result = { result: 'Cart opened' };
                  } else if (name === 'closeCart') {
                    dispatch({ type: 'CLOSE_CART' });
                    result = { result: 'Cart closed' };
                  } else if (name === 'searchProducts') {
                    dispatch({ type: 'SET_SEARCH', query: String(args.query) });
                    result = { result: `Searching for ${args.query}` };
                  } else if (name === 'checkout') {
                    dispatch({ type: 'CHECKOUT' });
                    result = { result: 'Checkout successful, order placed.' };
                  } else if (name === 'viewOrderHistory') {
                    dispatch({ type: 'VIEW_ORDER_HISTORY' });
                    result = { result: 'Navigated to order history.' };
                  }
                } catch (err) {
                  console.error("Tool execution error", err);
                  result = { error: 'Failed to execute action' };
                }

                currentSession.then(session => {
                   session.sendToolResponse({
                    functionResponses: {
                      id: fc.id,
                      name: fc.name,
                      response: result
                    }
                  });
                });
              }
            }

            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioData && outputAudioContextRef.current) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current;
              // Ensure we schedule ahead
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                base64ToUint8Array(audioData),
                ctx
              );

              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.onended = () => {
                activeSourcesRef.current.delete(source);
                if (activeSourcesRef.current.size === 0) {
                   setTimeout(() => {
                     if (activeSourcesRef.current.size === 0) setIsSpeaking(false);
                   }, 200);
                }
              };

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              activeSourcesRef.current.add(source);
            }
            
            if (msg.serverContent?.interrupted) {
              console.log("Model Interrupted");
              stopAllAudio();
            }
          },
          onclose: () => {
            console.log('Session Closed');
            setIsConnected(false);
            setIsSpeaking(false);
          },
          onerror: (err) => {
            console.error('Session Error', err);
            // Don't kill the UI state immediately if it's a transient error, 
            // but for "Network error" it usually means a kill.
            setError("Connection disrupted. Please retry.");
            setIsConnected(false);
          }
        }
      });
      
      sessionPromiseRef.current = currentSession;
      await currentSession;

    } catch (err) {
      console.error("Failed to connect", err);
      setError("Failed to initialize connection");
      setIsConnected(false);
    }
  }, [apiKey, dispatch, disconnect, stopAllAudio]);

  return { isConnected, isSpeaking, error, connect, disconnect };
};