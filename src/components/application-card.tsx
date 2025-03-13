import { App } from "@/types";
import { useState, useRef, useEffect } from "react";
import { useSelectionStore } from "@/stores/selectedAppsStore";
import { Check, User, Package, Info, ExternalLink } from "lucide-react";

export const Application = ({
  app,
  selectedCategory,
}: {
  app: App;
  selectedCategory: string;
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const selectApp = useSelectionStore((state) => state.selectApp);
  const unselectApp = useSelectionStore((state) => state.unselectApp);
  const isSelected = useSelectionStore((state) => state.isSelected);

  const handleAppSelect = (app: App, category: string | undefined) => {
    if (!category) return;

    if (isSelected(app.id)) return unselectApp(app.id);

    const appWithCategory = { ...app, category };

    selectApp(appWithCategory);
  };

  const showPopup = isInfoOpen;

  useEffect(() => {
    if (!showPopup) return;

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        buttonRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsInfoOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showPopup]);

  return (
    <div
      key={app.id}
      onClick={(e) => {
        if (!(e.target as Element).closest(".info-button")) {
          handleAppSelect(app, selectedCategory);
        }
      }}
      className={`relative rounded-lg transition-all ${
        isSelected(app.id)
          ? "bg-rosePine-highlight-med border border-rosePine-iris"
          : "bg-transparent border border-rosePine-highlight-low hover:border-rosePine-highlight-med"
      }`}
    >
      <div className="flex items-center p-3">
        {/* App icon and name */}
        <div className="flex-grow flex items-center">
          <div className="flex-shrink-0 mr-3 relative">
            {app.icon ? (
              <img
                src={app.icon}
                alt=""
                className="w-8 h-8 rounded-md"
                aria-hidden="true"
              />
            ) : (
              <div className="w-8 h-8 bg-rosePine-surface rounded-md flex items-center justify-center">
                <Package size={16} className="text-rosePine-subtle" />
              </div>
            )}

            {/* Selection indicator overlay */}
            {isSelected(app.id) && (
              <div className="absolute inset-0 bg-rosePine-iris bg-opacity-20 rounded-md flex items-center justify-center">
                <div className="bg-rosePine-iris rounded-full p-0.5">
                  <Check size={12} className="text-rosePine-base" />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="font-medium text-rosePine-text">
              {app.name || app.id}
            </span>
            {app.publisher && (
              <span className="text-xs text-rosePine-subtle mt-0.5">
                {app.publisher}
              </span>
            )}
          </div>
        </div>

        {/* Info button */}
        <button
          ref={buttonRef}
          className="info-button ml-2 p-1.5 rounded-full hover:bg-rosePine-highlight-low text-rosePine-muted hover:text-rosePine-text transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsInfoOpen(!isInfoOpen);
          }}
          aria-label="More information"
        >
          <Info size={16} />
        </button>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          ref={popupRef}
          className="absolute cursor-auto right-0 top-full left-0 mt-1 w-96 z-50 rounded-lg bg-rosePine-overlay shadow-lg border border-rosePine-highlight-med transition-opacity duration-200 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-rosePine-highlight-low bg-rosePine-surface">
            <div className="flex items-center">
              {app.icon ? (
                <img
                  src={app.icon}
                  alt={app.name}
                  className="w-8 h-8 mr-3 rounded-md"
                />
              ) : (
                <div className="w-8 h-8 bg-rosePine-surface rounded-md flex items-center justify-center mr-3">
                  <Package size={16} className="text-rosePine-subtle" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-rosePine-text">
                  {app.name}
                </h3>

                {app.publisher && (
                  <div className="flex items-center text-sm text-rosePine-subtle">
                    <User size={12} className="mr-1.5" />
                    <span>{app.publisher}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            {app.description ? (
              <div className="mb-4">
                <p className="text-sm text-rosePine-text leading-relaxed">
                  {app.description}
                </p>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-rosePine-muted italic">
                  No description available.
                </p>
              </div>
            )}

            {app.link && (
              <a
                href={app.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-rosePine-foam hover:underline"
              >
                <ExternalLink size={14} className="mr-1.5" />
                Visit Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
