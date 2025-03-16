import { App } from "@/types";

import { useSelectionStore } from "@/stores/selectedAppsStore";

import { generateAndDownloadInstallScript } from "@/lib/utils";

import { X, Package } from "lucide-react";

export const Selections = () => {
  const selectedApps = useSelectionStore((state) => state.selectedApps);
  const clearSelected = useSelectionStore((state) => state.clearSelected);

  const handleInstallApps = () => {
    generateAndDownloadInstallScript({
      selectedApps: selectedApps,
      operatingSystem: "windows",
    });
    // add sonner for error handling later
  };

  return (
    <div className="bg-rosePine-surface p-4 mr-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">
          Selected Apps ({selectedApps.length})
        </h2>

        {selectedApps.length > 0 && (
          <button
            onClick={clearSelected}
            className="text-rosePine-subtle hover:text-rosePine-love flex items-center gap-1 text-sm"
          >
            <X size={14} /> Clear all
          </button>
        )}
      </div>

      {selectedApps.length > 0 ? (
        <div className="mt-2 max-h-[128px] overflow-y-auto pr-1 flex flex-wrap gap-2 custom-scrollbar">
          {selectedApps.map((app) => (
            <Selection app={app} key={app.id} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-rosePine-subtle text-sm">
          No applications selected
        </p>
      )}

      {selectedApps.length > 0 && (
        <button
          onClick={handleInstallApps}
          className="mt-4 bg-rosePine-iris text-rosePine-base px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-90 transition-opacity"
        >
          <Package size={16} />
          Install Selected Apps
        </button>
      )}
    </div>
  );
};

const Selection = ({ app }: { app: App }) => {
  const unselectApp = useSelectionStore((state) => state.unselectApp);

  const handleAppDeselect = (app: App) => {
    if (!app.id) return;

    unselectApp(app.id);
  };
  return (
    <div
      key={app.id}
      className="bg-rosePine-highlight-med text-rosePine-text p-2 rounded-lg text-sm flex items-center gap-2"
    >
      {app.icon ? (
        <img
          src={app.icon}
          alt=""
          className="w-6 h-6 rounded-md"
          aria-hidden="true"
        />
      ) : (
        <div className="w-8 h-8 bg-rosePine-surface rounded-md flex items-center justify-center">
          <Package size={16} className="text-rosePine-subtle" />
        </div>
      )}

      <span>{app.name}</span>
      <button
        onClick={() => handleAppDeselect(app)}
        className="ml-1 text-rosePine-subtle hover:text-rosePine-love"
      >
        <X size={12} />
      </button>
    </div>
  );
};
