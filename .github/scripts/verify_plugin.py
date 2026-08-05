#!/usr/bin/env python3
"""在 AxTBot 仓库上下文导入插件包，校验 __meta__ 存在性，写入 verify.json。

用法：cd axtbot && PKG=<pkg> python3 ../scripts/verify_plugin.py
"""
import json
import os
import sys
import traceback

sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), "src"))

pkg = os.environ.get("PKG", "")
ok = False
err = ""
try:
    mod = __import__(pkg)
    if not hasattr(mod, "__meta__"):
        err = "模块缺少 __meta__ 字段"
    else:
        ok = True
except Exception as e:
    err = f"{type(e).__name__}: {e}\n" + traceback.format_exc()

result = {"ok": ok, "error": err}
with open("verify.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print(json.dumps(result, ensure_ascii=False, indent=2))
