"use client";

import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { applications } from "@/constants";
import { useOSStore } from "@/stores/osStore";
import { App } from "@/types";

import { Selections } from "@/components/selections";
import { Application } from "@/components/application-card";
import { SearchBar } from "@/components/search-bar";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredApps, setFilteredApps] = useState<App[]>(applications);

  // Get all available categories from the flat applications array
  const allCategories = useMemo(() => {
    return Array.from(new Set(applications.map((app) => app.category)));
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    allCategories[0]
  );

  const { os, setOperatingSystem } = useOSStore();

  const fuse = useMemo(
    () =>
      new Fuse(applications, {
        keys: ["name", "id", "description"],
        threshold: 0.4,
        ignoreLocation: true,
      }),
    [applications]
  );

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredApps(applications);
      return;
    }

    const results = fuse.search(searchTerm);

    const matchedApps = results.map((result) => result.item);
    setFilteredApps(matchedApps);
  }, [searchTerm, fuse]);

  const currentCategoryApps = useMemo(() => {
    return filteredApps.filter((app) => app.category === selectedCategory);
  }, [filteredApps, selectedCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    allCategories.forEach((category) => {
      counts[category] = filteredApps.filter(
        (app) => app.category === category
      ).length;
    });

    return counts;
  }, [filteredApps, allCategories]);

  useEffect(() => {
    if (searchTerm.trim()) {
      if (currentCategoryApps.length === 0) {
        const categoryWithResults = allCategories.find(
          (category) => categoryCounts[category] > 0
        );

        if (categoryWithResults) {
          setSelectedCategory(categoryWithResults);
        }
      }
    }
  }, [
    filteredApps,
    selectedCategory,
    searchTerm,
    currentCategoryApps,
    categoryCounts,
    allCategories,
  ]);

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-rosePine-surface border-r border-rosePine-highlight-low overflow-y-auto mr-4">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-rosePine-gold">tsuika</h1>

          <p className="text-sm text-rosePine-subtle">One click installer</p>
        </div>

        <nav className="mt-2">
          {allCategories.map(
            (category) =>
              categoryCounts[category] > 0 && (
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
                    {categoryCounts[category]}
                  </span>
                </button>
              )
          )}
        </nav>

        <div className="p-4 border-t border-rosePine-highlight-low">
          <span className="block mb-2 text-sm text-rosePine-subtle">
            Operating System
          </span>
          <select
            name="operatingSystem"
            defaultValue={os}
            onChange={(e) =>
              setOperatingSystem(e.target.value as "windows" | "osx")
            }
            className="w-full bg-rosePine-overlay text-rosePine-text border border-rosePine-highlight-low rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rosePine-gold"
          >
            <option value="windows">Windows</option>
            <option value="osx">macOS</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden gap-6 m-4 mt-8">
        <SearchBar setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

        <Selections />

        <div className="flex-1 overflow-y-auto p-6 pt-0 pl-0 rounded-tl-lg">
          {currentCategoryApps.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentCategoryApps.map((app) => (
                  <Application
                    key={app.id}
                    app={app}
                    selectedCategory={selectedCategory}
                  />
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
