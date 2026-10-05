# WaltYoung Photography

二次元 / Cosplay 摄影作品站（Astro 7 + Cloudflare R2 + GitHub Pages）。

- 线上：https://waltyoung.github.io/photography/
- 仓库：https://github.com/WaltYoung/photography
- 图床：https://20011129.xyz（R2 自定义域名）

## 开发

需要 **Node ≥ 22.12**（与 CI 一致：`nvm use` → `.nvmrc` 为 22.23.3）。

```bash
cp .env.example .env
nvm use
npm ci
astro dev --background
```

本地预览：`http://localhost:4321/photography/`（含 `base` 子路径）。

## 构建与搜索

```bash
PUBLIC_MEDIA_BASE_URL=https://20011129.xyz npm run build
npm run preview
```

`build` 会运行 Astro 静态构建并生成 Pagefind 索引。开发模式下搜索需先 `build` 再 `preview`。

## 内容维护

| 目录 | 说明 |
|------|------|
| `src/content/categories/` | 分类 |
| `src/content/albums/` | 相册 |
| `src/content/photos/` | 单张照片（EXIF、标签；展示标题由文件名自动简化） |
| `src/content/bio/zh.md` | 中文简介（仅中文页） |
| `src/content/bio/en.md` | 英文简介（仅英文页） |
| `public/avatar.jpg` 等 | 头像与 favicon（静态资源，不请求外链） |

照片 `imageKey` / `thumbKey` 为 R2 桶内路径（如 `photo/acg/...`）。

```bash
node scripts/generate-acg-content.mjs          # 从 ACG 目录结构批量生成 md
PUBLIC_MEDIA_BASE_URL=https://20011129.xyz npm run sync-exif
npm run sync-branding                            # 从 COS 源图更新 public/ 头像与 favicon
```

## 部署

推送到 `main` 触发 [GitHub Actions](.github/workflows/deploy.yml)（`npm ci` + `npm run build`）。Pages 源需为 **GitHub Actions**；若 CI 失败，线上会停留在上一次成功构建。

页脚版权年份由 `src/lib/site.ts` 的 `SITE_START_YEAR` 与当前年自动组成区间。
