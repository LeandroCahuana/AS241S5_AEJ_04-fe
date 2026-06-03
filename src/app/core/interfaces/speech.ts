export interface ChunkData {
  offset: number;
  duration: number;
  lang: string;
  text: string;
}

export interface SpeechToText {
  id: string;
  url: string;
  lang: string;
  text: string;
  chunks: ChunkData[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
