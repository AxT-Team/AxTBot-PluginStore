import { Search, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onSearchChange: (query: string) => void;
  onClear: () => void;
}

export function FilterBar({
  categories,
  activeCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onClear,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="搜索插件名称、描述或标签..."
          className="h-10 bg-card/70 pl-9 pr-16 backdrop-blur-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="清空搜索"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap items-center gap-2">
        <Tag className="size-4 shrink-0 text-muted-foreground" />
        <button
          onClick={() => onCategoryChange("")}
          className={`glass-chip cursor-pointer border transition-all duration-200 ${
            activeCategory === ""
              ? "border-primary/35 bg-primary/10 text-primary"
              : "border bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          全部
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat)}
            className={`glass-chip cursor-pointer border transition-all duration-200 ${
              activeCategory === cat
                ? "border-primary/35 bg-primary/10 text-primary"
                : "border bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {cat}
          </button>
        ))}
        {(activeCategory || searchQuery) && (
          <button
            onClick={onClear}
            className="ml-auto flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <X className="size-3" />
            清除筛选
          </button>
        )}
      </div>
    </div>
  );
}
