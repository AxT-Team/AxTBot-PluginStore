import { BadgeCheck, Box, ExternalLink, Github, Package } from "lucide-react";
import type { PluginEntry } from "../types/plugin";
import { Badge } from "@/components/ui/badge";

const GITHUB_USER_URL = "https://github.com";

interface PluginCardProps {
  entry: PluginEntry;
}

export function PluginCard({ entry }: PluginCardProps) {
  if (entry.failed || !entry.meta) {
    return (
      <div className="glass-surface flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl px-6 py-8 text-center">
        <Package className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          该插件元数据加载失败，请稍后重试
        </p>
      </div>
    );
  }

  const { meta } = entry;
  const authorUrl = `${GITHUB_USER_URL}/${meta.author}`;
  const repoUrl = meta.repo ?? authorUrl;

  return (
    <div className="glass-surface group relative flex flex-col gap-4 rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 hover:border-ring/50">
      {/* Header: name + version + official */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold tracking-tight">
              {meta.name}
            </h3>
            {meta.official && (
              <BadgeCheck className="size-5 shrink-0 text-primary" />
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              v{meta.version}
            </Badge>
            <span className="glass-chip border bg-primary/10 text-primary">
              {meta.category}
            </span>
            {meta.official && (
              <span className="glass-chip border border-primary/35 bg-primary/10 text-primary">
                官方
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {meta.description}
      </p>

      {/* Tags */}
      {meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {meta.tags.slice(0, 6).map((tag) => (
            <span
              key={tag}
              className="glass-chip border bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: author / repo / pypi */}
      <div className="mt-auto flex items-center justify-between border-t pt-4">
        <a
          href={authorUrl}
          target="_blank"
          rel="noreferrer"
          className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <Github className="size-4 shrink-0" />
          <span className="truncate">{meta.author}</span>
        </a>
        <div className="flex shrink-0 items-center gap-3">
          <a
            href={meta.pypi_url ?? `https://pypi.org/project/${meta.pypi}/`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm font-medium text-primary transition-opacity hover:opacity-80"
            aria-label={`在 PyPI 查看 ${meta.pypi}`}
          >
            <Box className="size-4" />
            <span className="hidden sm:inline">PyPI</span>
          </a>
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ExternalLink className="size-4" />
            <span className="hidden sm:inline">源码</span>
          </a>
        </div>
      </div>
    </div>
  );
}
