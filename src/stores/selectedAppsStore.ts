import { create } from "zustand";

import { SelectionState } from "@/types";

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedApps: [],

  selectApp: (app) =>
    set((state) => {
      if (state.selectedApps.some((selectedApp) => selectedApp.id === app.id)) {
        return state;
      }
      return { selectedApps: [...state.selectedApps, app] };
    }),

  unselectApp: (appId) =>
    set((state) => ({
      selectedApps: state.selectedApps.filter((app) => app.id !== appId),
    })),

  clearSelected: () => set({ selectedApps: [] }),

  isSelected: (appId) => get().selectedApps.some((app) => app.id === appId),
}));
