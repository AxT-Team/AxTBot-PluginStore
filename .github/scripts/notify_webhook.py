#!/usr/bin/env python3
"""把审核结果推送到 AxTBot 插件商店通知的 Webhook 端点。

读取环境变量：
  NOTIFY_JSON           必填，推送的 JSON 负载（由上游 jq 构造）
  NOTIFY_WEBHOOK_URL    必填，Webhook 地址（仓库 Secret: AUTO_REVIEW_WEBHOOK_URL）
  NOTIFY_WEBHOOK_TOKEN  必填，Bearer 鉴权 token（仓库 Secret: AUTO_REVIEW_WEBHOOK_TOKEN）

行为约定：
  - Webhook 未配置（URL / token 为空）或负载为空时，打印提示并静默跳过，不阻断工作流；
  - 推送失败（网络异常 / 非 2xx）时打印告警，仍以退出码 0 结束，避免误伤主流程；
  - 推送成功时打印事件类型与响应摘要。
"""
import json
import os
import sys
import urllib.error
import urllib.request


def main() -> int:
    url = os.environ.get("NOTIFY_WEBHOOK_URL", "").strip()
    token = os.environ.get("NOTIFY_WEBHOOK_TOKEN", "").strip()
    raw = os.environ.get("NOTIFY_JSON", "").strip()

    if not url or not token:
        print(
            "notify_webhook >>> 未配置 NOTIFY_WEBHOOK_URL / NOTIFY_WEBHOOK_TOKEN，跳过推送",
            file=sys.stderr,
        )
        return 0

    if not raw:
        print("notify_webhook >>> NOTIFY_JSON 为空，跳过推送", file=sys.stderr)
        return 0

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"notify_webhook >>> NOTIFY_JSON 不是合法 JSON: {e}", file=sys.stderr)
        return 0

    data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "User-Agent": "AxTBot-PluginStore-Notify",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(
            f"notify_webhook >>> 推送失败 HTTP {e.code}: {body[:500]}",
            file=sys.stderr,
        )
        return 0
    except urllib.error.URLError as e:
        print(f"notify_webhook >>> 推送失败: {e.reason}", file=sys.stderr)
        return 0
    except TimeoutError:
        print("notify_webhook >>> 推送超时", file=sys.stderr)
        return 0

    print(f"notify_webhook >>> 推送成功: {payload.get('event', '?')} ({body[:200]})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
