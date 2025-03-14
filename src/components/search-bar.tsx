import { Search } from "lucide-react";
import { ChangeEvent } from "react";

export const SearchBar: React.FC<{
  setSearchTerm: (value: string) => void;
  searchTerm: string;
}> = ({ setSearchTerm, searchTerm }) => {
  return (
    <div className="flex max-w-xl w-full relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <Search size={18} className="text-rosePine-subtle" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        className="w-full py-2.5 pl-10 pr-4 bg-rosePine-surface border border-rosePine-highlight-med rounded-lg 
                 focus:outline-none focus:border-rosePine-iris
                 placeholder-rosePine-subtle text-rosePine-text transition-colors"
        placeholder="Search across all categories..."
      />
    </div>
  );
};
