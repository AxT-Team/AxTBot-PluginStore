/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_TITLE?: string;
  readonly VITE_SITE_SUBTITLE?: string;
  readonly VITE_SITE_LOGO?: string;
  readonly VITE_SITE_BADGE?: string;
  readonly VITE_FOOTER_LEFT?: string;
  readonly VITE_FOOTER_RIGHT?: string;
  readonly VITE_GITHUB_OWNER?: string;
  readonly VITE_GITHUB_REPO?: string;
  readonly VITE_GITHUB_BRANCH?: string;
  readonly VITE_ASSESS_DIR?: string;
  readonly VITE_ASSESS_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/** 由 vite.config.ts 注入的构建信息（来源于 Vercel 系统变量） */
declare const __BUILD_INFO__: {
  /** commit SHA（完整） */
  sha: string;
  /** 分支名 */
  ref: string;
  /** Vercel 环境：production / preview / development */
  env: string;
};
