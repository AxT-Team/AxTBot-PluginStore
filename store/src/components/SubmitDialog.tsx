import { useEffect, useState } from "react";
import { ExternalLink, Github, Package, Tag, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildIssueUrl } from "../services/dataSource";
import { cn } from "@/lib/utils";

interface SubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
}

const DEFAULT_CATEGORIES = [
  "工具",
  "娱乐",
  "管理",
  "功能",
  "社交",
  "图像",
  "网络",
  "其他",
];

export function SubmitDialog({
  open,
  onOpenChange,
  categories,
}: SubmitDialogProps) {
  const availableCategories =
    categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const [name, setName] = useState("");
  const [pypi, setPypi] = useState("");
  const [owner, setOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [description, setDescription] = useState("");

  // 关闭后延迟重置，避免动画过程中看到清空的内容
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setName("");
        setPypi("");
        setOwner("");
        setRepoName("");
        setCategory("");
        setTags([]);
        setTagInput("");
        setDescription("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  const handleSubmit = () => {
    const url = buildIssueUrl({
      name: name.trim(),
      pypi: pypi.trim(),
      owner: owner.trim(),
      repo: repoName.trim(),
      category: category.trim(),
      tags: tags.join(", "),
      description: description.trim(),
    });
    try {
      localStorage.setItem("axtbot:lastIssueUrl", url);
    } catch {
      // ignore storage errors
    }
    window.open(url, "_blank", "noopener,noreferrer");
    onOpenChange(false);
  };

  const canSubmit =
    name.trim() && pypi.trim() && owner.trim() && repoName.trim();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* 从右上角飞出：覆盖默认的居中定位和 zoom 动画 */}
      <DialogContent
        className={cn(
          // 定位：右上角，留出顶部导航空间
          "fixed top-16 right-3 left-auto bottom-3 translate-x-0 translate-y-0",
          "w-[min(420px,calc(100vw-1.5rem))] max-w-none",
          "sm:top-20 sm:right-6 sm:bottom-6 sm:w-[440px]",
          // 动画：从右侧滑入/滑出
          "data-[state=open]:slide-in-from-right-8 data-[state=closed]:slide-out-to-right-8",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          // 移除默认 zoom
          "data-[state=closed]:zoom-out-0 data-[state=open]:zoom-in-0",
          // 布局
          "flex flex-col gap-4 overflow-hidden p-0",
        )}
      >
        <DialogHeader className="border-b px-6 pb-4 pt-6">
          <DialogTitle>提交插件</DialogTitle>
          <DialogDescription>
            填写插件信息后，将跳转到 GitHub Issue 页面完成最终提交。
          </DialogDescription>
        </DialogHeader>

        {/* 主体：自定义 thin 滚动条，避免缩放较大时突兀的系统滚动条 */}
        <div className="dialog-scroll flex-1 overflow-y-auto px-6">
          <div className="grid gap-4 pb-2">
            <div className="grid gap-2">
              <Label htmlFor="sub-name">插件名称</Label>
              <Input
                id="sub-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：AxTBot Welcome"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sub-pypi">
                <Package className="mr-1 inline size-3.5" />
                PyPI 包名
              </Label>
              <Input
                id="sub-pypi"
                value={pypi}
                onChange={(e) => setPypi(e.target.value)}
                placeholder="例如：axtbot-plugin-welcome"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="sub-owner">
                  <Github className="mr-1 inline size-3.5" />
                  GitHub 用户名
                </Label>
                <Input
                  id="sub-owner"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="例如：axt-team"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sub-repo-name">
                  <ExternalLink className="mr-1 inline size-3.5" />
                  仓库名
                </Label>
                <Input
                  id="sub-repo-name"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="例如：axtbot-plugin-welcome"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="sub-category">插件分类</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="sub-category" className="w-full">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sub-tags">
                  <Tag className="mr-1 inline size-3.5" />
                  标签（回车添加）
                </Label>
                <Input
                  id="sub-tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const value = tagInput.trim();
                      if (value && !tags.includes(value)) {
                        setTags((prev) => [...prev, value]);
                      }
                      setTagInput("");
                    }
                  }}
                  placeholder="输入标签后按回车"
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="glass-chip flex items-center gap-1 border bg-secondary text-secondary-foreground"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() =>
                            setTags((prev) => prev.filter((t) => t !== tag))
                          }
                          className="text-muted-foreground transition-colors hover:text-destructive"
                          aria-label={`删除标签 ${tag}`}
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sub-desc">插件描述</Label>
              <Textarea
                id="sub-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要描述插件的功能与用途..."
                className="min-h-24"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t bg-background/40 px-6 pb-5 pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            <ExternalLink className="size-4" />
            前往 GitHub 提交
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}