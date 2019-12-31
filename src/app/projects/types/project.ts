import { BuilderType } from '../../builder/builder.types';

export interface UiComponent {
  name: string;
  location: string;
  type: BuilderType;
}

export interface Project {
  name: string;
  location: string;
  description?: string;
  version?: string;
  keywords?: string;
  types?: {
    atoms?: UiComponent[];
    molecules?: UiComponent[];
    organisms?: UiComponent[];
    pages?: UiComponent[];
  };
  dependencies?: {
    [key: string]: string;
  };
}
