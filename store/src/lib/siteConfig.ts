/**
 * 站点配置：集中读取 .env 中的 VITE_ 变量。
 *
 * 支持的变量：
 *  - VITE_SITE_TITLE     标题栏主标题（如 "AxTBot 插件商店"）
 *  - VITE_SITE_SUBTITLE  标题栏副标题
 *  - VITE_SITE_LOGO      标题栏 Logo（可为图片 URL，或留空使用默认机器人图标）
 *  - VITE_SITE_BADGE     标题栏 Logo 右上角小徽章文字（如 "AxTBot"）
 *  - VITE_FOOTER_LEFT    页脚左侧文案（如 "© 2026 AxTBot. All rights reserved."）
 *  - VITE_FOOTER_RIGHT   页脚右侧文案（通常为 GitHub 链接 Markdown：`[GitHub](https://github.com/...)`）
 */

export interface SiteConfig {
  title: string;
  subtitle: string;
  logo: string;
  badge: string;
  footerLeft: string;
  footerRight: string;
}

const env = import.meta.env as Record<string, string | undefined>;

const V = {
  TITLE: env.VITE_SITE_TITLE ?? "AxTBot 插件商店",
  SUBTITLE: env.VITE_SITE_SUBTITLE ?? "发现、浏览与提交 AxTBot 插件",
  LOGO: env.VITE_SITE_LOGO ?? "",
  BADGE: env.VITE_SITE_BADGE ?? "",
  FOOTER_LEFT: env.VITE_FOOTER_LEFT ?? "",
  FOOTER_RIGHT: env.VITE_FOOTER_RIGHT ?? "",
};

/** 将页脚文本中 `[text](url)` 形式转换为 { text, url } 链接列表 */
function parseLinks(input: string): { text: string; url: string }[] {
  const links: { text: string; url: string }[] = [];
  const parts = input.split(/(\[[^\]]+\]\([^)]+\))/g);
  for (const part of parts) {
    if (!part) continue;
    const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part.trim());
    if (m) {
      links.push({ text: m[1], url: m[2] });
    } else {
      links.push({ text: part, url: "" });
    }
  }
  return links;
}

export const siteConfig: SiteConfig = {
  title: V.TITLE,
  subtitle: V.SUBTITLE,
  logo: V.LOGO,
  badge: V.BADGE,
  footerLeft: V.FOOTER_LEFT,
  footerRight: V.FOOTER_RIGHT,
};

/** 解析页脚右侧（支持链接） */
export const footerRightLinks = parseLinks(siteConfig.footerRight);
