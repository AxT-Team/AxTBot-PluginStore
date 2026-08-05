/**
 * 数据源配置：从 .env 读取（均有默认值）。
 *
 * 支持的变量：
 *  - VITE_GITHUB_OWNER        GitHub 仓库所属用户/组织
 *  - VITE_GITHUB_REPO         GitHub 仓库名
 *  - VITE_GITHUB_BRANCH       GitHub 分支
 *  - VITE_ASSESS_DIR          assess 目录名
 *  - VITE_ASSESS_BASE_URL     可选：完全自定义数据源根 URL
 *                             （设置后直接以此地址拼接 /index.json、/插件.json，
 *                               可指向镜像、CDN 或自建服务，覆盖上述 GitHub 配置）
 */

const env = import.meta.env;

export const GITHUB_OWNER = env.VITE_GITHUB_OWNER || "AxT-Team";
export const GITHUB_REPO = env.VITE_GITHUB_REPO || "AxTBot-PluginStore";
export const GITHUB_BRANCH = env.VITE_GITHUB_BRANCH || "main";
export const ASSESS_DIR = env.VITE_ASSESS_DIR || "assess";

const GITHUB_RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

/**
 * 计算 assess 根 URL，优先级：
 *  1. VITE_ASSESS_BASE_URL：完全自定义数据源（覆盖一切）
 *  2. dev 环境：本地 /assess（便于无网络联调）
 *  3. 生产环境：GitHub raw 地址 + assess 目录
 */
function getAssessBase(): string {
  if (env.VITE_ASSESS_BASE_URL) {
    return env.VITE_ASSESS_BASE_URL.replace(/\/+$/, "");
  }
  if (import.meta.env.DEV) {
    return `/${ASSESS_DIR}`;
  }
  return `${GITHUB_RAW_BASE}/${ASSESS_DIR}`;
}

/** assess 根 URL */
export function getGitHubAssessBase(): string {
  return getAssessBase();
}

/**
 * 根据 assess 内相对路径，生成完整的可 fetch URL。
 * @param relativePath assess 目录内的相对路径，如 "index.json" 或 "axtbot-plugin-xxx.json"
 */
export function resolveAssessUrl(relativePath: string): string {
  return `${getAssessBase()}/${relativePath}`;
}

/** 提交表单字段，对应 .github/ISSUE_TEMPLATE/plugin-submission.yml 中的 id */
export interface PluginSubmissionForm {
  name: string;
  pypi: string;
  /** GitHub 用户名（同时也是作者与仓库 owner） */
  owner: string;
  /** 仓库名 */
  repo: string;
  category: string;
  tags: string;
  description: string;
}

/**
 * 组装提交插件的 GitHub issue 地址（使用 .env 中定义的仓库）。
 * 通过 `template=plugin-submission.yml` 指定表单模板，并将表单内容按模板中
 * 字段的 id 作为查询参数预填（参考 nonebot 插件发布表单），用户打开即可直接提交。
 */
export function buildIssueUrl(form: PluginSubmissionForm): string {
  const params = new URLSearchParams({
    template: "plugin-submission.yml",
    title: form.name.trim()
      ? `[插件申请] ${form.name.trim()}`
      : "[插件申请] 新插件",
  });

  const fields: Record<string, string> = {
    "plugin-name": form.name,
    "pypi-name": form.pypi,
    "repo-owner": form.owner,
    "repo-name": form.repo,
    category: form.category,
    tags: form.tags,
    description: form.description,
  };
  for (const [key, value] of Object.entries(fields)) {
    const trimmed = value.trim();
    if (trimmed) params.set(key, trimmed);
  }

  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new?${params.toString()}`;
}
