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
      className={`p-4 rounded-lg cursor-pointer transition-colors ${
        isSelected(app.id)
          ? "bg-rosePine-highlight-med"
          : "border-rosePine-highlight-low hover:bg-rosePine-highlight-med/25"
      } relative`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-5 h-5 border rounded flex items-center justify-center ${
              isSelected(app.id)
                ? "bg-rosePine-iris border-rosePine-iris"
                : "border-rosePine-muted"
            }`}
          >
            {isSelected(app.id) && (
              <span className="text-rosePine-base">
                <Check size={14} />
              </span>
            )}
          </span>
          <div className="flex items-center gap-2 ml-2">
            {app.icon ? (
              <img src={app.icon} alt={app.name} className="w-6 h-6" />
            ) : (
              <Package size={20} className="w-6 h-6 text-rosePine-subtle" />
            )}
            <span className="font-medium">{app.name || app.id}</span>
          </div>
        </div>

        <button
          ref={buttonRef}
          className="info-button p-1.5 cursor-help rounded-full hover:bg-rosePine-highlight-low text-rosePine-muted hover:text-rosePine-text transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            setIsInfoOpen(!isInfoOpen);
          }}
          aria-label="More information"
        >
          <Info size={16} />
        </button>

        {showPopup && (
          <div
            ref={popupRef}
            className="absolute cursor-auto right-0 top-full left-0 mt-1 w-96 z-50 rounded-lg bg-rosePine-overlay shadow-lg border border-rosePine-highlight-med transition-opacity duration-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-rosePine-highlight-low bg-rosePine-surface">
              <div className="flex items-center">
                {app.icon ? (
                  <img src={app.icon} alt={app.name} className="w-8 h-8 mr-3" />
                ) : (
                  <Package
                    size={20}
                    className="w-8 h-8 mr-3 text-rosePine-subtle"
                  />
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
    </div>
  );
};
