export interface VideoQuality {
  id: string;
  label: string;
  src: string;
  bitrate: number;
  width: number;
  height: number;
  codec?: string;
}
