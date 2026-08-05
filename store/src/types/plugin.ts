export interface PluginMeta {
  /** 展示名称 */
  name: string;
  /** 版本 */
  version: string;
  /** 作者，链接到 github.com/<author> */
  author: string;
  /** 插件描述 */
  description: string;
  /** PyPI 包名 */
  pypi: string;
  /** PyPI 包地址 */
  pypi_url?: string;
  /** 是否为官方插件 */
  official: boolean;
  /** 预定义分类 */
  category: string;
  /** 自由标签 */
  tags: string[];
  /** 主页 */
  homepage?: string;
  /** 源码仓库 */
  repo?: string;
  updated_at?: string;
}

export interface StoreIndex {
  /** 插件总数 */
  count: number;
  updated_at: string;
  /** 预定义分类 */
  categories: string[];
  /** 插件元数据文件清单 */
  plugins: { file: string }[];
}

export interface PluginEntry {
  meta: PluginMeta;
  /** 对应的元数据文件路径，如 assess/axtbot-plugin-xxx.json */
  file: string;
  /** 加载失败时置为 true */
  failed?: boolean;
}
