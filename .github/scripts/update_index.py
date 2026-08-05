#!/usr/bin/env python3
"""把新合并的插件元数据追加到 assess/index.json。

用法：PYPI_NAME=<pypi名> python3 update_index.py
前置：assess/<PYPI_NAME>.json 已存在
"""
import datetime
import json
import os

index_path = "assess/index.json"
pypi_name = os.environ.get("PYPI_NAME", "")
if not pypi_name:
    print("PYPI_NAME 未设置", file=__import__("sys").stderr)
    __import__("sys").exit(1)

meta_path = f"assess/{pypi_name}.json"
try:
    index = json.load(open(index_path, encoding="utf-8"))
except Exception:
    index = {"count": 0, "updated_at": "", "categories": [], "plugins": []}
meta = json.load(open(meta_path, encoding="utf-8"))

file_name = meta_path.split("/")[-1]
if not any(p.get("file") == file_name for p in index["plugins"]):
    index["plugins"].append({"file": file_name})

for cat in [meta.get("category", "其他")]:
    if cat not in index["categories"]:
        index["categories"].append(cat)

index["count"] = len(index["plugins"])
index["updated_at"] = datetime.datetime.now(datetime.timezone.utc).strftime(
    "%Y-%m-%dT%H:%M:%SZ"
)

with open(index_path, "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False, indent=2)
print(json.dumps(index, ensure_ascii=False, indent=2))
