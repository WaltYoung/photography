# 摄影师作品站 — 已确认技术决策

## 基础设施

| 项 | 决策 |
|----|------|
| 对象存储 | **Cloudflare R2**（自定义域名 `https://20011129.xyz`） |
| 桶权限 | 公有读（站点仅用 HTTPS 公开 URL） |
| 部署 | **GitHub Pages**（静态 `dist/`） |
| 增强功能 | **EXIF 展示**、**Lightbox**、**站内搜索** |

---

## Cloudflare R2 — URL 与环境变量

`PUBLIC_MEDIA_BASE_URL=https://20011129.xyz`（无末尾斜杠）。对象 Key 与 R2 路径一致，例如 `photo/acg/2026.05.03 武汉梦乡漫展/妲己_盒子/_MG_0030.jpg`。

```ts
// src/lib/cos.ts — 按路径段 encodeURIComponent
export function cosUrl(key: string): string {
  const base = import.meta.env.PUBLIC_MEDIA_BASE_URL.replace(/\/$/, '');
  const encoded = key.replace(/^\//, '').split('/').map(encodeURIComponent).join('/');
  return `${base}/${encoded}`;
}
```

批量生成 content：`node scripts/generate-acg-content.mjs`（数据源与 `photo/acg/...` 目录一致）。

### 缩略图（可选）

当前 `thumbKey` 与 `imageKey` 相同；可在 R2 侧预生成 `-thumb` 或接入 Image Resizing 后再改 frontmatter。

---

## GitHub Pages — Astro 配置

### `site` 与 `base`

| 项 | 值 |
|----|-----|
| 用户 | [WaltYoung](https://github.com/WaltYoung) |
| 仓库 | [WaltYoung/photography](https://github.com/WaltYoung/photography) |
| 线上 URL | `https://waltyoung.github.io/photography/` |
| `site` | `https://waltyoung.github.io` |
| `base` | `/photography/` |

说明：属于 **GitHub Pages 项目站**。若希望根域名 `https://waltyoung.github.io/` 直接打开作品站，需把仓库改名为 `WaltYoung.github.io` 并将 `base` 改为 `'/'`。

```js
// astro.config.mjs（与仓库一致）
export default defineConfig({
  site: 'https://waltyoung.github.io',
  base: '/photography/',
  output: 'static',
  trailingSlash: 'always',
});
```

部署：`.github/workflows/deploy.yml`（push `main` → GitHub Actions → Pages）。首次需在仓库 **Settings → Pages → Build and deployment** 选择 **GitHub Actions**。

本地开发带 base：`astro dev` 会自动处理 `import.meta.env.BASE_URL`。

### 部署工作流

`.github/workflows/deploy.yml`：

1. `npm ci`
2. `npm run build`（见下方 build 含 pagefind）
3. `actions/upload-pages-artifact` + `actions/deploy-pages`  
   或 `peaceiris/actions-gh-pages` 推 `gh-pages` 分支。

Settings → Pages → Source: GitHub Actions。

### 注意事项

- 所有站内链接使用 Astro `<a href={import.meta.env.BASE_URL + '...'}>` 或 `getRelativeLocaleUrl()`（i18n），避免根路径 404。
- R2 图片为绝对 URL，不受 `base` 影响。

---

## EXIF

### 策略：写入 frontmatter，不在浏览器拉原图解析

公有读下若在客户端对 COS 原图跑 EXIF，会浪费流量且 CORS 需额外配置。**推荐维护期提取一次，写入 content**。

### Schema 扩展（`photos`）

```yaml
exif:
  make: Canon
  model: EOS R6
  lens: RF 24-70mm F2.8
  focalLength: 50mm
  aperture: f/2.8
  shutter: 1/200s
  iso: 400
  takenAt: 2024-06-15T14:30:00+08:00  # 可与顶层 takenAt 同步
```

### 工具

- 脚本 `scripts/sync-exif.mjs`：对本地副本或 COS 下载文件用 **exifr**，更新对应 `src/content/photos/*.md`。
- 相册批量导入流程：导出 → 跑 EXIF 脚本 → 上传 COS → 提交 md。

### 展示

- 单张 `/photos/[id]`：折叠面板「拍摄参数」，中英 UI 标签（机身/镜头/焦距/光圈/快门/ISO）。
- `takenAt` 与 EXIF 不一致时以 EXIF 为准并写回 frontmatter。

---

## Lightbox

### 选型：PhotoSwipe 5

- 支持相册内前后切换、移动端手势、Caption；与静态站兼容（客户端 island 或 `<script>` 初始化）。

### 行为

- **相册页**：点击缩略图打开 Lightbox，items 为当前相册内全部 `imageKey` + 标题。
- **单张页**：可选「全屏查看」同一 PhotoSwipe 实例。
- 使用 `thumbKey` 作小图、`imageKey` 作 `data-pswp-src`；`width`/`height` 必填以避免动画跳动。

### 实现要点

- 组件 `PhotoGallery.astro` + `photoswipe.css`（仅相册/详情页加载）。
- 尊重 `prefers-reduced-motion`；键盘 Esc/左右键可用。

---

## 站内搜索

### 选型：Pagefind

- 纯静态、构建后索引 `dist/`，适配 GitHub Pages 与 `base` 子路径。
- 支持中文分词效果尚可；可索引标题、摘要、标签、分类名（通过 `data-pagefind-meta` 或 hidden 文本）。

### 构建脚本

```json
"build": "astro build && node ./node_modules/pagefind/lib/runner/bin.cjs --site dist"
```

搜索页 `PagefindUI` 的 `baseUrl` 使用 `import.meta.env.BASE_URL`（与 `astro.config.mjs` 的 `base` 一致）。

### UI

- 顶栏搜索图标 → 模态或跳转 `/search/` 页，嵌入 Pagefind UI 或自定义 `pagefind.js` API。
- i18n：中英页面分别被索引；UI 文案走 `src/i18n/ui.ts`。

### 备选（不优先）

- 自建 `public/search-index.json` + Fuse.js：需自行维护分词与 `base` 路径，维护成本高于 Pagefind。

---

## 修订后的阶段验收（增量）

| 阶段 | 额外验收 |
|------|----------|
| 1 | `cosUrl()`、`site`/`base` 本地可访问 |
| 2 | R2 公网 URL 在列表/详情可加载 |
| 3 | Pagefind 本地 `build` 后可搜到相册标题/标签 |
| 4 | 相册 Lightbox 可滑动；单张页 EXIF 块显示；GitHub Actions 部署 Pages 成功 |

---

## 可选后续

- 为 75 张图批量跑 `scripts/sync-exif.mjs` 并写回 frontmatter
- 独立缩略图 Key，减轻列表页流量
- `photo_path.txt` 中 `video/` 若需展示，另建集合或外链页
- GitHub Pages 绑定自定义域名（与 R2 域名可并存）
