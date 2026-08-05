import { Bot, ExternalLink, Moon, Plus, RefreshCw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/siteConfig";

interface HeaderProps {
  theme: "light" | "dark";
  loading: boolean;
  onReload: () => void;
  onToggleTheme: () => void;
  onSubmitClick: () => void;
}

export function Header({
  theme,
  loading,
  onReload,
  onToggleTheme,
  onSubmitClick,
}: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10 text-primary">
            {siteConfig.logo ? (
              <img
                src={siteConfig.logo}
                alt={siteConfig.title}
                className="size-full object-cover"
              />
            ) : (
              <Bot className="size-5" />
            )}
            {siteConfig.badge && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full border border-background bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {siteConfig.badge}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight">
              {siteConfig.title}
            </h1>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {siteConfig.subtitle}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <a
            href="https://docs.axtn.net/axtbot/v2.1.1/guide/intro.html"
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
          >
            <ExternalLink className="size-4" />
            文档
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={onReload}
            disabled={loading}
            aria-label="刷新数据"
            className="text-muted-foreground"
          >
            <RefreshCw className={`size-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            aria-label="切换主题"
            className="text-muted-foreground"
          >
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </Button>
          <Button onClick={onSubmitClick} className="h-9 shrink-0">
            <Plus className="size-4" />
            提交插件
          </Button>
        </div>
      </div>
    </header>
  );
}
