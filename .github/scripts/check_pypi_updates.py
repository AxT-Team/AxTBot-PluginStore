#!/usr/bin/env python3
"""对比 assess 中各插件当前版本与 PyPI 最新版本，输出需要更新的插件清单。

用法：python3 check_pypi_updates.py
输出：
  stdout  -> updates.json 内容（JSON 数组），每项含 pypi / repo / current_version / latest_version
  failures.json -> 查询 PyPI 失败的插件清单（JSON 数组），每项含 pypi / current_version
"""
import glob
import json
import sys
import urllib.request


def fetch_json(url):
    req = urllib.request.Request(
        url, headers={"User-Agent": "AxTBot-PluginStore-UpdateChecker"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


updates = []
failures = []
for path in sorted(glob.glob("assess/*.json")):
    if path.endswith("index.json"):
        continue
    try:
        meta = json.load(open(path, encoding="utf-8"))
    except Exception:
        continue
    pypi = meta.get("pypi", "")
    current = meta.get("version", "")
    if not pypi:
        continue
    try:
        data = fetch_json(f"https://pypi.org/pypi/{pypi}/json")
        latest = data["info"]["version"]
    except Exception as e:
        print(f"[fail] {pypi}: 无法查询 PyPI ({e})", file=sys.stderr)
        failures.append(
            {
                "pypi": pypi,
                "current_version": current,
                "error": str(e),
            }
        )
        continue
    if latest != current:
        updates.append(
            {
                "pypi": pypi,
                "repo": meta.get("repo", ""),
                "current_version": current,
                "latest_version": latest,
            }
        )
        print(f"[update] {pypi}: {current} -> {latest}", file=sys.stderr)

with open("failures.json", "w", encoding="utf-8") as f:
    json.dump(failures, f, ensure_ascii=False, indent=2)

print(json.dumps(updates, ensure_ascii=False, indent=2))
