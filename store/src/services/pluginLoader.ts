import type {
  PluginEntry,
  PluginMeta,
  StoreIndex,
} from "../types/plugin";
import { resolveAssessUrl } from "./dataSource";

/** 并发分片大小 */
const CONCURRENCY = 4;

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${url}`);
  }
  return (await res.json()) as T;
}

/** 加载总索引 */
export async function loadIndex(): Promise<StoreIndex> {
  const url = resolveAssessUrl("index.json");
  return fetchJson<StoreIndex>(url);
}

/**
 * 按并发分片加载插件元数据。
 * 单条失败时降级返回 failed 条目，不影响其余插件。
 */
export async function loadPlugins(
  files: { file: string }[],
): Promise<PluginEntry[]> {
  const entries: PluginEntry[] = new Array(files.length);

  const runChunk = async (chunk: { file: string }[], offset: number) => {
    const results = await Promise.all(
      chunk.map(async ({ file }) => {
        const url = resolveAssessUrl(file);
        try {
          const meta = await fetchJson<PluginMeta>(url);
          return { meta, file, failed: false };
        } catch (err) {
          console.error(`[pluginLoader] 加载插件元数据失败: ${url}`, err);
          return { file, failed: true, meta: undefined as unknown as PluginMeta };
        }
      }),
    );
    results.forEach((entry, i) => {
      entries[offset + i] = entry as PluginEntry;
    });
  };

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    await runChunk(files.slice(i, i + CONCURRENCY), i);
  }

  return entries.filter(Boolean);
}
