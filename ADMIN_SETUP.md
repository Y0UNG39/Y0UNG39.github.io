# Decap CMS 后台管理设置指南

## 访问后台

部署后，访问 `https://y0ung39.github.io/admin/` 即可进入后台管理界面。

## OAuth 认证设置

Decap CMS 需要 OAuth 认证来访问你的 GitHub 仓库。有以下几种方式：

### 方式 1：使用 Netlify OAuth（推荐）

1. 注册 [Netlify](https://www.netlify.com/) 账号（免费）

2. 创建一个新的 Netlify 站点（可以是空的）

3. 在 Netlify 站点设置中，启用 **Identity** 服务：
   - 进入 Site settings > Identity
   - 点击 "Enable Identity"
   - 在 Registration 中选择 "Invite only"

4. 启用 Git Gateway：
   - 进入 Site settings > Identity > Services
   - 点击 "Enable Git Gateway"
   - 连接你的 GitHub 账号

5. 更新 `public/admin/config.yml`：

   ```yaml
   backend:
     name: git-gateway
     branch: main
   ```

6. 部署你的 Netlify 站点（可以是空的）

7. 在 Netlify 站点的 Identity 中邀请自己：
   - 进入 Identity > Invite users
   - 输入你的邮箱
   - 接受邀请邮件

### 方式 2：使用 GitHub OAuth App

1. 去 GitHub Settings > Developer settings > OAuth Apps
2. 点击 "New OAuth App"
3. 填写信息：
   - Application name: `Y0UNG39 Blog CMS`
   - Homepage URL: `https://y0ung39.github.io`
   - Authorization callback URL: `https://y0ung39-cms.netlify.app/`
4. 创建后获取 Client ID 和 Client Secret

5. 创建一个 Netlify Function 或 Vercel Serverless Function 来处理 OAuth

### 方式 3：使用外部 OAuth 提供商

可以使用 Auth0、Firebase 等第三方 OAuth 提供商。

## 本地开发

在本地开发时，可以使用 `npx decap-server` 启动本地代理服务器：

```bash
npx decap-server
```

然后访问 `http://localhost:8081/admin/` 进入后台。

## 使用方法

1. 登录后台后，你可以：
   - 创建、编辑、删除文章
   - 管理项目
   - 管理友链
   - 编辑关于页面

2. 所有更改会自动提交到 GitHub 仓库

3. GitHub Actions 会自动构建并部署你的网站

## 注意事项

- 首次登录需要授权 Decap CMS 访问你的 GitHub 仓库
- 建议先在本地测试，确认没问题后再部署到生产环境
- 图片会保存到 `public/images/` 目录
- 所有更改都会生成 Git commit
