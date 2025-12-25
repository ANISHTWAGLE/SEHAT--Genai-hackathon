export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface GeminiResponse {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface HospitalMarker {
  name: string;
  lat: number;
  lng: number;
  phone?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOCATING = 'LOCATING',
  THINKING = 'THINKING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
