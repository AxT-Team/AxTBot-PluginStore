#!/usr/bin/env python3
"""从现有 assess 元数据与最新 __meta__ 构造 form.json，供 build_metadata.py 使用。

适用场景：自动版本更新（无 issue 表单），字段从 assess/<PYPI>.json 继承。

用法：PYPI_NAME=<pypi名> python3 build_form_for_update.py
前置：assess/<PYPI_NAME>.json 与 meta.json 已存在
"""
import json
import os
import sys
from urllib.parse import urlparse

pypi = os.environ.get("PYPI_NAME", "")
if not pypi:
    sys.exit("PYPI_NAME 未设置")

old = json.load(open(f"assess/{pypi}.json", encoding="utf-8"))
meta = json.load(open("meta.json", encoding="utf-8"))

repo = old.get("repo", "")
owner = ""
repo_name = ""
try:
    path = urlparse(repo).path.strip("/")
    if "/" in path:
        owner, repo_name = path.split("/", 1)
except Exception:
    pass

tags = old.get("tags", [])
form = {
    "name": old.get("name", "") or meta.get("name", pypi),
    "pypi": pypi,
    "repo_owner": owner,
    "repo_name": repo_name,
    "category": old.get("category", ""),
    "tags": ", ".join(tags),
    "description": old.get("description", ""),
    "author": owner,
    "repo": repo,
}
form["tags_list"] = [t.strip() for t in form["tags"].split(",") if t.strip()]

with open("form.json", "w", encoding="utf-8") as f:
    json.dump(form, f, ensure_ascii=False, indent=2)
print(json.dumps(form, ensure_ascii=False, indent=2))
