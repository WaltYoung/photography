# WaltYoung Photography

摄影师个人作品站（Astro 7 + 腾讯云 COS + GitHub Pages）。

- 线上：https://waltyoung.github.io/photography/
- 仓库：https://github.com/WaltYoung/photography

## 开发

```bash
cp .env.example .env
npm install
astro dev --background
```

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

图片上传到 COS 后，在 frontmatter 填写 `imageKey` / `thumbKey`（相对 Key，不含域名）。

从本地文件提取 EXIF 片段：

```bash
node scripts/sync-exif.mjs ./path/to/photo.jpg
```

## 部署

推送到 `main` 分支触发 [GitHub Actions](.github/workflows/deploy.yml)。Pages 源需设为 **GitHub Actions**。
