import type { MimeType } from './file';
import type { Color } from './image';

export type ImageFit =
  | 'contain'
  | 'cover'
  | 'fill'
  | 'inside'
  | 'outside';

export type ImagePositionHorizontal = 'left' | 'center' | 'right';
export type ImagePositionVertical = 'top' | 'center' | 'bottom';
export type ImagePosition =
  | ImagePositionHorizontal
  | ImagePositionVertical
  | `${ImagePositionHorizontal} ${ImagePositionVertical}`;

export type FlipDirection = 'horizontal' | 'vertical' | 'both';

export interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TransformOptions {
  width?: number | null;
  height?: number | null;
  contentType?: MimeType;
  fit?: ImageFit;
  position?: ImagePosition | string | number;
  background?: Color;
  quality?: number;
  compressionLevel?: number;
  loop?: number;
  delay?: number;
  blurRadius?: number | null;
  rotate?: number | null;
  flip?: FlipDirection | null;
  crop?: CropOptions | null;
}

export type SizelessOptions = Omit<TransformOptions, 'width' | 'height'>;

export type Transformer = {
  name: string;
  supportedInputs: Set<MimeType>;
  supportedOutputs: Set<MimeType>;
  fallbackOutput: MimeType;
  transform: (
    input: {
      url: string;
      data: Uint8Array;
      contentType: MimeType;
    },
    output: Required<TransformOptions>
  ) => Promise<Uint8Array>;
};

