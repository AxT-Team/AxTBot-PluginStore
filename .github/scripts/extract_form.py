#!/usr/bin/env python3
"""从 issue body 中提取表单字段，写入 form.json。

用法：echo "$BODY" | python3 extract_form.py
"""
import json
import re
import sys

body = sys.stdin.read()

mapping = {
    "name": "插件名称",
    "pypi": "PyPI 包名",
    "repo_owner": "GitHub 用户名",
    "repo_name": "仓库名",
    "category": "插件分类",
    "tags": "标签",
    "description": "插件描述",
}

fields = {}
for en, cn in mapping.items():
    pattern = rf"### {re.escape(cn)}\s*\n+(.*?)(?=\n### |\n---|\Z)"
    m = re.search(pattern, body, re.DOTALL)
    fields[en] = m.group(1).strip() if m and m.group(1).strip() else ""

fields["tags_list"] = [
    t.strip() for t in re.split(r"[,，\s]+", fields["tags"]) if t.strip()
]

# 作者即 GitHub 用户名，兼容下游读取 form["author"]
fields["author"] = fields["repo_owner"]

# 拼接完整仓库地址，供后续克隆插件代码使用
if fields["repo_owner"] and fields["repo_name"]:
    fields["repo"] = (
        f"https://github.com/{fields['repo_owner']}/{fields['repo_name']}"
    )
else:
    fields["repo"] = ""

with open("form.json", "w", encoding="utf-8") as f:
    json.dump(fields, f, ensure_ascii=False, indent=2)
print(json.dumps(fields, ensure_ascii=False, indent=2))
