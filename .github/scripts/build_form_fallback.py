#!/usr/bin/env python3
"""当无法从 __meta__ 解析到完整元数据时，从表单数据生成部分元数据。

用法：python3 build_form_fallback.py
前置：当前目录存在 form.json（可选）
输出：logs/meta.json（部分字段 + _note 标注）
"""
import json

try:
    form = json.load(open("form.json", encoding="utf-8"))
except Exception:
    form = {}

partial = {
    "name": form.get("name", ""),
    "pypi": form.get("pypi", ""),
    "author": form.get("author", ""),
    "description": form.get("description", ""),
    "category": form.get("category", "其他"),
    "tags": form.get("tags_list", []),
    "repo": form.get("repo", ""),
    "_note": "由表单数据生成（未从 __meta__ 解析到完整元数据）",
}

with open("logs/meta.json", "w", encoding="utf-8") as f:
    json.dump(partial, f, ensure_ascii=False, indent=2)
print(json.dumps(partial, ensure_ascii=False, indent=2))
