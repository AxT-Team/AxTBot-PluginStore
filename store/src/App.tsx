import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, PackageOpen } from "lucide-react";
import { Header } from "./components/Header";
import { FilterBar } from "./components/FilterBar";
import { PluginCard } from "./components/PluginCard";
import { SubmitDialog } from "./components/SubmitDialog";
import { usePlugins } from "./hooks/usePlugins";
import { useTheme } from "./hooks/useTheme";
import { Button } from "@/components/ui/button";
import { siteConfig, footerRightLinks } from "@/lib/siteConfig";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { index, plugins, state, error, reload } = usePlugins();

  const [activeCategory, setActiveCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [submitOpen, setSubmitOpen] = useState(false);

  const categories = useMemo(() => index?.categories ?? [], [index]);

  const filteredPlugins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return plugins.filter((entry) => {
      if (entry.failed || !entry.meta) return true;
      if (activeCategory && entry.meta.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        entry.meta.name,
        entry.meta.description,
        entry.meta.author,
        entry.meta.pypi,
        ...entry.meta.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [plugins, activeCategory, searchQuery]);

  const clearFilters = () => {
    setActiveCategory("");
    setSearchQuery("");
  };

  return (
    <div className="glass-canvas relative min-h-screen">
      <div className="relative z-10">
        <Header
          theme={theme}
          loading={state === "loading"}
          onReload={() => void reload()}
          onToggleTheme={toggleTheme}
          onSubmitClick={() => setSubmitOpen(true)}
        />

        <main className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6">
          {/* Intro */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">插件市场</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {state === "success" && index
                ? `共收录 ${index.count} 个插件 · 更新于 ${formatDate(index.updated_at)}`
                : siteConfig.subtitle}
            </p>
          </section>

          {/* Filters */}
          <div className="mb-8">
            <FilterBar
              categories={categories}
              activeCategory={activeCategory}
              searchQuery={searchQuery}
              onCategoryChange={setActiveCategory}
              onSearchChange={setSearchQuery}
              onClear={clearFilters}
            />
          </div>

          {/* Content states */}
          {state === "loading" && (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm">正在从 GitHub 加载插件...</p>
            </div>
          )}

          {state === "error" && (
            <div className="glass-surface flex flex-col items-center justify-center gap-4 rounded-xl px-6 py-16 text-center">
              <AlertTriangle className="size-10 text-destructive" />
              <div>
                <p className="font-medium">数据加载失败</p>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              </div>
              <Button onClick={() => void reload()}>重新加载</Button>
            </div>
          )}

          {state === "success" && filteredPlugins.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-24 text-center text-muted-foreground">
              <PackageOpen className="size-10" />
              <p className="text-sm">
                {searchQuery || activeCategory
                  ? "没有找到匹配的插件，试试调整筛选条件。"
                  : "当前暂未收录任何插件。"}
              </p>
            </div>
          )}

          {state === "success" && filteredPlugins.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPlugins.map((entry) => (
                <PluginCard key={entry.file} entry={entry} />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>{siteConfig.footerLeft}</p>
            <div className="flex items-center gap-4">
              {footerRightLinks.map((link, i) =>
                link.url ? (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors hover:text-primary"
                  >
                    {link.text}
                  </a>
                ) : (
                  <span key={i}>{link.text}</span>
                ),
              )}
              {/* 构建号：来源于 Vercel 的 commit SHA，本地开发显示 dev */}
              <span
                className="border-l pl-4 font-mono"
                title={
                  __BUILD_INFO__.sha
                    ? `commit ${__BUILD_INFO__.sha}`
                    : "本地构建"
                }
              >
                build {__BUILD_INFO__.sha ? __BUILD_INFO__.sha.slice(0, 7) : "dev"}
              </span>
            </div>
          </div>
        </footer>

        <SubmitDialog
          open={submitOpen}
          onOpenChange={setSubmitOpen}
          categories={categories}
        />
      </div>
    </div>
  );
}

function formatDate(iso?: string): string {
  if (!iso) return "未知";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default App;
