#!/usr/bin/env python3
"""合并表单与 __meta__，合成 assess 插件元数据 JSON。

用法：python3 build_metadata.py
前置：当前目录存在 form.json、meta.json
"""
import datetime
import json

form = json.load(open("form.json", encoding="utf-8"))
meta = json.load(open("meta.json", encoding="utf-8"))

name = form["name"] or meta.get("name") or form["pypi"]
version = str(meta.get("version", "0.0.0"))
author = form["author"] or meta.get("author", meta.get("author_name", ""))
description = form["description"] or meta.get("description", meta.get("usage", ""))
pypi = form["pypi"]
category = form["category"] or "其他"
tags = form["tags_list"] or list(meta.get("tags", []))
repo_url = form["repo"]

# 官方插件判定：插件 __meta__ 声明 official=true，且仓库属于官方组织 AxT-Team。
# 只校验归属而不直接采信声明，防止任意作者在 __meta__ 里自述为官方插件。
OFFICIAL_ORG = "AxT-Team"
declared_official = meta.get("official") is True
belongs_to_org = repo_url.rstrip("/").lower().startswith(
    f"https://github.com/{OFFICIAL_ORG.lower()}"
)
official = declared_official and belongs_to_org

out = {
    "name": name,
    "version": version,
    "author": author,
    "description": description,
    "pypi": pypi,
    "pypi_url": f"https://pypi.org/project/{pypi}/",
    "official": official,
    "category": category,
    "tags": tags,
    "homepage": repo_url,
    "repo": repo_url,
    "updated_at": datetime.datetime.now(datetime.timezone.utc).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    ),
}

with open("axtbot-plugin-tmp.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(json.dumps(out, ensure_ascii=False, indent=2))
