export interface Scene {
  id: string;
  sceneNumber: number;
  prompt: string;
  title: string;
  actionType:
    | 'running_late'
    | 'tripping'
    | 'falling'
    | 'looking_clock'
    | 'coffee_spill'
    | 'briefcase_flying'
    | 'bicycle_ride'
    | 'bus_chase'
    | 'rain_umbrella'
    | 'sliding'
    | 'jumping'
    | 'superhero_fly'
    | 'desk_typing'
    | 'celebrating'
    | 'thinking'
    | 'sleeping'
    | 'generic';
  customDetails?: {
    expression?: 'neutral' | 'panic' | 'shock' | 'happy' | 'determined' | 'dizzy';
    hasSpeedLines?: boolean;
    speechBubble?: string;
    prop?: 'rock' | 'clock' | 'coffee' | 'briefcase' | 'bicycle' | 'umbrella' | 'banana' | 'computer' | 'none';
  };
}

export type ColorTheme = 'lineart' | 'blueprint' | 'chalkboard' | 'sepia' | 'darkline';

export interface RenderStyleConfig {
  theme: ColorTheme;
  bgColor: string;
  strokeColor: string;
  accentColor: string;
  lineWidth: number;
  aspectRatio: '16:9' | '1:1' | '9:16' | '4:3';
  showSceneWatermark: boolean;
  showBorder: boolean;
}

export interface StoryPack {
  id: string;
  title: string;
  description: string;
  genre: string;
  scenes: Omit<Scene, 'id' | 'sceneNumber'>[];
}
