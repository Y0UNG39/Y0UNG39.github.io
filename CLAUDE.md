# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ 最重要的规则

**git push 之前必须先本地验证！**

1. 修改代码后，先运行 `pnpm build` 验证构建是否成功
2. 确认构建无错误后再 `git push`
3. 绝对不能跳过本地验证直接推送

## Project Overview

Gyoza is a static blog template built with **Astro 4.6** and **React 18**. The site is in Chinese (zh-CN).

## Commands

```bash
pnpm i              # Install dependencies
pnpm dev            # Start dev server at localhost:4321
pnpm build          # Type-check (astro check) + build + generate search index (pagefind)
pnpm preview        # Preview production build locally
pnpm lint           # Format code with Prettier

# Scaffold content (interactive prompts):
pnpm new-post       # Create a new blog post in src/content/posts/
pnpm new-friend     # Create a new friend entry in src/content/friends/
pnpm new-project    # Create a new project entry in src/content/projects/
```

## Architecture

### Content Collections (src/content/config.ts)

- **posts** — Markdown blog posts. Frontmatter: `title`, `date`, `tags[]`, `category`, `cover`, `summary`, `draft`, `sticky`, `comments`, `lastMod`
- **spec** — Special pages (about, friends, projects). Rendered via `[spec].astro`
- **projects** — YAML data files with `title`, `description`, `image`, `link`
- **friends** — YAML data files with `title`, `description`, `avatar`, `link`

Draft posts are excluded in production builds (`import.meta.env.PROD`).

### Layouts

- `Layout.astro` — Base HTML shell (head, body, global components)
- `PageLayout.astro` — Standard page with Header + Footer
- `MarkdownLayout.astro` — Blog post layout with HeadGradient, table of contents support

### Routing

- `[...page].astro` — Paginated home page
- `posts/[...slug].astro` — Individual post pages
- `[spec].astro` — Special pages (about, friends, projects) from `src/content/spec/`
- `categories/[category].astro`, `tags/[tag].astro` — Taxonomy pages

### Custom Markdown Plugins (src/plugins/)

Remark plugins (parse phase): `remarkReadingTime`, `remarkSpoiler`, `remarkEmbed`, `remarkDirective`
Rehype plugins (HTML phase): `rehypeCodeBlock`, `rehypeCodeHighlight`, `rehypeHeading`, `rehypeImage`, `rehypeLink`, `rehypeTableBlock`

### State Management

Jotai atoms in `src/store/`: `theme.ts`, `viewport.ts`, `scrollInfo.ts`, `metaInfo.ts`, `modalStack.ts`

### Styling

- **Tailwind CSS** with custom theme using CSS variables (`--color-accent`, `--color-bg-*`, `--color-text-*`, `--color-border-*`)
- Dark mode via `[data-theme="dark"]` selector
- Global styles in `src/styles/global.css` (imports iconfont, shiki, markdown, signature, swup CSS)
- Custom fonts: Atkinson (headings), Noto Sans SC / Noto Serif SC (CJK), JetBrains Mono (code)

### React Hydration

React components use Astro's client directives:

- `client:only="react"` — Components that must skip SSR (Header, providers, modals)
- `client:idle` — Hydrate when browser idle (HeadGradient)
- `client:visible` — Hydrate when scrolled into view

### Page Transitions

Swup handles SPA-like transitions between pages. Animation classes prefixed with `swup-transition-`. The main content container and Provider component morph across navigations.

## Configuration

- **Site config**: `src/config.json` — URL, author, hero section, colors, menus, pagination, analytics, Waline comments
- **Tailwind**: `tailwind.config.ts` — Custom color tokens, font families, spacing
- **Prettier**: No semicolons, single quotes, 100 char width, Astro plugin
- **Commitlint**: Conventional commits enforced via git hooks (simple-git-hooks + lint-staged)
- **TypeScript**: Strict mode, `@/*` path alias maps to `src/*`

## Git Hooks

Pre-commit runs Prettier on staged files. Commit-msg enforces conventional commit format.
