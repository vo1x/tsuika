export interface App {
  id: string;
  name: string;
  category?: string;
  winget?: string;
  brew?: string;
  choco?: string;
  link?: string;
  icon?: string;
  description?: string;
  publisher?: string;
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
