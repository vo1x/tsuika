import { create } from "zustand";

import { detectOS } from "@/lib/utils";

type OperatingSystem = "windows" | "osx";

interface OSStoreProps {
  os: OperatingSystem;
  setOperatingSystem: (newOs: OperatingSystem) => void;
}

export const useOSStore = create<OSStoreProps>((set) => ({
  os: detectOS(),
  setOperatingSystem: (newOs) => set({ os: newOs }),
}));
