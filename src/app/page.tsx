"use client";

import Fuse from "fuse.js";
import { Check, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { applications } from "@/constants";
import { useSelectionStore } from "@/stores/selectedAppsStore";
import { App } from "@/types";

import { Selections } from "@/components/selections";
import { Application } from "@/components/application-card";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredApps, setFilteredApps] = useState(applications);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    Object.keys(applications)[0]
  );

  const selectedApps = useSelectionStore((state) => state.selectedApps);
  const selectApp = useSelectionStore((state) => state.selectApp);
  const unselectApp = useSelectionStore((state) => state.unselectApp);
  const isSelected = useSelectionStore((state) => state.isSelected);

  const allApps = useMemo(() => {
    const apps: Array<{ id: string; name: string; category: string }> = [];

    Object.keys(applications).forEach((category: string) => {
      applications[category].forEach((app: App) => {
        apps.push({
          id: app.id,
          name: app.name || app.id,
          category,
        });
      });
    });

    return apps;
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(allApps, {
        keys: ["name", "id"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [allApps]
  );

  const handleAppSelect = (app: App, category: string | undefined) => {
    if (!category) return;

    if (isSelected(app.id)) return unselectApp(app.id);

    const appWithCategory = { ...app, category };

    selectApp(appWithCategory);
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApps(applications);
      return;
    }

    const results = fuse.search(searchTerm);
    const filtered: typeof applications = {};

    results.forEach(({ item }) => {
      const { category } = item;
      if (!filtered[category]) filtered[category] = [];

      const originalApp = applications[category].find(
        (app) => app.id === item.id
      );
      if (originalApp) filtered[category].push(originalApp);
    });

    setFilteredApps(filtered);

    if (
      filtered[selectedCategory]?.length === 0 &&
      Object.keys(filtered).length > 0
    ) {
      setSelectedCategory(Object.keys(filtered)[0]);
    }
  }, [searchTerm, fuse, selectedCategory]);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-rosePine-surface border-r border-rosePine-highlight-low overflow-y-auto mr-4">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-rosePine-gold">tsuika</h1>
          <p className="text-sm text-rosePine-subtle">One click installer</p>
        </div>

        <div className="p-4 relative">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search size={16} className="text-rosePine-subtle" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 py-2 text-sm bg-rosePine-overlay border border-rosePine-highlight-low rounded focus:outline-none focus:border-rosePine-iris"
            placeholder="Search apps..."
          />
        </div>

        <nav className="mt-2">
          {Object.keys(filteredApps).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-4 py-3 flex items-center transition-colors ${
                selectedCategory === category
                  ? "bg-rosePine-highlight-med text-rosePine-text"
                  : "hover:bg-rosePine-highlight-low text-rosePine-subtle"
              }`}
            >
              <span className="capitalize">{category}</span>
              <span className="ml-auto text-xs bg-rosePine-overlay px-2 py-1 rounded-full">
                {filteredApps[category].length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden gap-4">
        <Selections />

        <div className="flex-1 overflow-y-auto p-6 bg-rosePine-surface m-4 mb-0 mt-0 ml-0 rounded-tl-lg">
          ADD SORTING OPTIONS
          {filteredApps[selectedCategory]?.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApps[selectedCategory].map((app) => (
                  <Application app={app} selectedCategory={selectedCategory} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-rosePine-highlight-low p-8 rounded-full">
                <Search size={48} className="text-rosePine-subtle" />
              </div>
              <h3 className="mt-6 text-xl font-medium">
                No applications found
              </h3>
              <p className="mt-2 text-rosePine-subtle">
                Try adjusting your search or select a different category
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
