export interface App {
  id: string;
  name: string;
  category?: string | null;
  winget?: string | null;
  brew?: string | null;
  choco?: string | null;
  link?: string | null;
  icon?: string | null;
  description?: string | null;
  publisher?: string | null;
}

export interface ApplicationsData {
  [category: string]: App[];
}

export interface SelectionState {
  selectedApps: App[];
  selectApp: (app: App) => void;
  unselectApp: (appId: string) => void;
  clearSelected: () => void;
  isSelected: (appId: string) => boolean;
}

export type OperatingSystem = "windows" | "osx";
