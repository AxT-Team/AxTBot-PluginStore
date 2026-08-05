import { useCallback, useEffect, useState } from "react";
import type { PluginEntry, StoreIndex } from "../types/plugin";
import { loadIndex, loadPlugins } from "../services/pluginLoader";

export type LoadState = "idle" | "loading" | "success" | "error";

export function usePlugins() {
  const [index, setIndex] = useState<StoreIndex | null>(null);
  const [plugins, setPlugins] = useState<PluginEntry[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string>("");

  const reload = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      const idx = await loadIndex();
      const entries = await loadPlugins(idx.plugins);
      setIndex(idx);
      setPlugins(entries);
      setState("success");
    } catch (err) {
      console.error("[usePlugins] 数据源加载失败", err);
      setIndex(null);
      setPlugins([]);
      setState("error");
      setError(
        "无法从 GitHub 加载索引，请检查网络后重试。",
      );
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    index,
    plugins,
    state,
    error,
    reload,
  };
}
