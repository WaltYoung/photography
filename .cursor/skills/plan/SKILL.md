---
name: plan
description: >-
  Produces an implementation plan for the photographer portfolio Astro site at
  ~/photography (mobile, albums, categories, tags, OSS photos, light UI, zh/en).
  Use when the user invokes /plan or asks to plan, architect, or roadmap this project.
disable-model-invocation: true
---

# /plan — 摄影师作品站实施规划

## 项目目标（用户原文）

我需要做一个摄影师个人作品展示网站，要求支持移动端展示、摄影师简介、允许建立相册、允许照片分类（如二次元、婚礼等）、支持给照片打标签，框架已选择为astro。

1. 注意照片存储在我个人的对象存储桶中
2. 项目创建在 Ubuntu 系统的 `~/photography/` 下
3. 浅色风格，不喜欢极简画廊，需要中英文切换

**已确认技术决策**（细节见 [reference.md](reference.md)）：腾讯云 COS（公有读私有写）、GitHub Pages 部署、需要 EXIF、Lightbox、站内搜索（Pagefind）。

## 执行前

1. 阅读 `~/photography/` 现有结构（`package.json`、`astro.config.mjs`、`src/`）。
2. 读取 [reference.md](reference.md) 中的已确认决策；未填写的 COS/GitHub 具体域名仍列为待确认项。
3. 计划面向 **Astro 7+**、Node **≥22.12**（见项目 `engines`）。
4. 本地开发：`astro dev --background`（见 `AGENTS.md` / `CLAUDE.md`）。

## 必须覆盖的规划维度

| 维度 | 要点 |
|------|------|
| 信息架构 | 首页、简介、分类浏览、相册列表/详情、单张作品、标签聚合、404 |
| 内容模型 | 摄影师简介；相册；照片（外链 URL、标题、描述、分类、标签、排序、拍摄日期） |
| 分类 vs 标签 | 分类：少量固定入口（如二次元、婚礼）；标签：多值、可交叉筛选 |
| 对象存储 | 站点不托管原图；元数据在仓库，图片 URL 指向桶（CDN/公开读或签名 URL 策略二选一） |
| 国际化 | 路由或前缀（如 `/` 与 `/en/`）；UI 文案与内容字段的中英文策略 |
| 视觉 | 浅色、有层次与排版（非极简白墙画廊）；移动端优先 |
| 性能 | 响应式图、懒加载、合适尺寸/thumbnail 策略（可在桶或构建侧） |
| 部署 | 静态站输出 + 环境变量（桶域名、可选 API） |

## 推荐技术方向（默认，可写进计划）

- **内容**：Astro Content Collections（`src/content/`，Zod schema 校验相册/照片/简介）。
- **i18n**：Astro 官方 i18n 指南；简介与 UI 分离（如 `bio.zh.md` / `bio.en.md` 或 frontmatter 字段）。
- **样式**：Tailwind 或项目已有方案；浅色主题 token（背景、卡片、分隔、字重）。
- **照片 URL**：frontmatter 中 `imageUrl` / `thumbUrl` 指向对象存储；禁止把大图 commit 进仓库。
- **筛选**：分类页、标签页、相册内列表；可选客户端轻量筛选或静态生成多路由。

对象存储集成占位（计划中必须出现）：

```env
# .env.example — 勿提交密钥
PUBLIC_OSS_BASE_URL=https://your-bucket.example.com
# 若用签名 URL，说明服务端/构建时生成策略，而非在前端暴露密钥
```

## 输出格式

用简体中文撰写，结构固定如下（可增删子节，但顺序保留）：

```markdown
# 摄影师作品站 — 实施计划

## 1. 目标与约束摘要
（复述需求 + 已确认/待确认项）

## 2. 站点地图与页面职责
（列表 + 简短说明）

## 3. 内容模型与目录结构
（schema 字段、示例 frontmatter、建议的 src/ 树）

## 4. 对象存储与图片策略
（URL 规则、缩略图、SEO/og:image）

## 5. 国际化方案
（路由、语言切换、翻译范围）

## 6. UI/UX 方向
（浅色、非极简画廊的具体布局建议：首页、相册网格、详情）

## 7. 分阶段里程碑
| 阶段 | 交付物 | 验收标准 |
（至少 4 阶段：基础架構 → 内容与分类标签 → i18n/移动 →  polish/部署）

## 8. 风险与决策
（签名 URL vs 公开读、内容维护流程等）

## 9. 建议的下一步
（3–5 条可立即执行的任务，按优先级）
```

## 行为准则

- **只规划时不改代码**，除非用户在同一条消息里明确要求开始实现。
- 计划要可执行：文件路径、集合名、路由示例要具体到能直接开工。
- 「不喜欢极简画廊」：计划中必须描述至少一种具体版式（如卡片+说明文字、分栏、时间线区块），避免只写「现代简洁」。
- 相册、分类、标签三者关系要在计划中定义清楚（例：相册归属一个主分类；照片可有多标签）。

## 可选深入

用户需要细节时，再写 `reference.md`（OSS 厂商差异、schema 完整示例）；默认单次 `/plan` 输出上述九节即可。
