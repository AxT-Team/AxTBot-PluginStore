#!/usr/bin/env python3
"""解析插件 __init__.py 中的 __meta__，写入 meta.json。

支持两种写法：
- __meta__ = {"name": ..., "version": ...}           （dict 字面量）
- __meta__ = PluginMetadata(name=..., version=...)    （类调用 / 命名参数）

用法：python3 parse_meta.py <path/to/__init__.py>
"""
import ast
import json
import sys


def parse_value(node):
    """把 AST 节点转换为 JSON 可序列化值。"""
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.List):
        return [parse_value(x) for x in node.elts]
    if isinstance(node, ast.Tuple):
        return [parse_value(x) for x in node.elts]
    if isinstance(node, ast.Dict):
        d = {}
        for k, v in zip(node.keys, node.values):
            if k is None:  # **kwargs 展开，跳过
                continue
            key = parse_value(k)
            d[key] = parse_value(v)
        return d
    if isinstance(node, ast.Call):
        # PluginMetadata(name=..., version=...)：把命名参数转为 dict
        d = {}
        for kw in node.keywords:
            if kw.arg is not None:
                d[kw.arg] = parse_value(kw.value)
        return d
    if isinstance(node, ast.UnaryOp) and isinstance(node.op, ast.USub):
        return -parse_value(node.operand)
    if isinstance(node, ast.Name):
        # 布尔/None 等名称常量
        if node.id == "True":
            return True
        if node.id == "False":
            return False
        if node.id == "None":
            return None
        raise ValueError(f"无法解析名称: {node.id}")
    raise ValueError(f"不支持的字面量: {type(node).__name__}")


if len(sys.argv) < 2:
    print("usage: parse_meta.py <init.py>", file=sys.stderr)
    sys.exit(1)

src_path = sys.argv[1]
with open(src_path, "r", encoding="utf-8") as f:
    tree = ast.parse(f.read())

for node in ast.walk(tree):
    if isinstance(node, ast.Assign):
        for t in node.targets:
            if isinstance(t, ast.Name) and t.id == "__meta__":
                value = parse_value(node.value)
                print(json.dumps(value, ensure_ascii=False, indent=2))
                with open("meta.json", "w", encoding="utf-8") as out:
                    json.dump(value, out, ensure_ascii=False, indent=2)
                sys.exit(0)

sys.stderr.write("未找到 __meta__\n")
sys.exit(1)
