# WaltYoung Photography

摄影师个人作品站（Astro 7 + 腾讯云 COS + GitHub Pages）。

- 线上：https://waltyoung.github.io/photography/
- 仓库：https://github.com/WaltYoung/photography

## 开发

需要 **Node ≥ 22.12**（推荐与 CI 一致：`nvm use` 读取 `.nvmrc` → 22.23.3）。

```bash
cp .env.example .env
nvm use
npm ci          # 与 GitHub Actions 相同；勿仅用 npm install 后忘记提交 lockfile
astro dev --background
```

线上部署由 **GitHub Actions** 执行 `npm ci` + `npm run build`。若 Actions 失败，Pages 会停留在上一次成功构建（常见原因：`package-lock.json` 与 `package.json` 不同步）。

本地地址含 `base` 路径：`http://localhost:4321/photography/`。

## 构建与搜索

```bash
npm run build   # astro build + Pagefind 索引
npm run preview
```

搜索（Pagefind）仅在 `build` 之后可用，开发模式请用 preview。

## 内容维护

| 目录 | 说明 |
|------|------|
| `src/content/categories/` | 分类 |
| `src/content/albums/` | 相册 |
| `src/content/photos/` | 单张照片（含 EXIF、标签） |
| `src/content/bio/` | 简介 |

图片托管在 Cloudflare R2（自定义域名 `20011129.xyz`），在 frontmatter 填写 `imageKey` / `thumbKey`（桶内路径，如 `photo/acg/...`）。

批量导入 ACG 目录：

```bash
node scripts/generate-acg-content.mjs
```

从 R2 批量写回 EXIF（推荐）：

```bash
PUBLIC_MEDIA_BASE_URL=https://20011129.xyz npm run sync-exif
```

单张本地文件：

```bash
node scripts/sync-exif.mjs ./path/to/photo.jpg
```

## 部署

推送到 `main` 分支触发 [GitHub Actions](.github/workflows/deploy.yml)。Pages 源需设为 **GitHub Actions**。
