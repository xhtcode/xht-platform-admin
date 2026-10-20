# XHT Platform Admin

> 基于 Vue 3 + TypeScript + Vite 构建的企业级前端管理后台系统

## 📋 项目介绍

XHT Platform Admin 是一个现代化的企业级前端管理后台系统，采用最新的前端技术栈构建。系统提供完整的权限管理、系统管理、代码生成、监控中心等功能模块，为企业应用提供强大的管理界面支持。

## 🚀 技术栈

- **核心框架**: Vue 3.5+ (Composition API)
- **开发语言**: TypeScript 6.0+
- **构建工具**: Vite 8.2+（Rolldown 内核）
- **UI 组件库**: Element Plus 2.14+
- **状态管理**: Pinia 4.0+
- **路由管理**: Vue Router 5.3+
- **HTTP 客户端**: Axios 1.18+
- **样式方案**: UnoCSS + SCSS
- **图标方案**: Element Plus Icons
- **工具库**: VueUse、Lodash

## 📦 环境要求

- **Node.js**: ^22.18.0 || >=24.12.0
- **包管理器**: npm、yarn 或 pnpm

## 🛠️ 快速开始

### 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install --ignore-scripts=false
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查和格式化

```bash
# ESLint 检查
npm run lint

# Prettier 格式化
npm run format

# TypeScript 类型检查
npm run type-check
```

## 🌐 环境变量与部署

### 环境变量

| 变量 | 说明 |
| --- | --- |
| `VITE_APP_PORT` | 开发服务器端口，默认 `3000` |
| `VITE_BASE_API` | 前端请求基础路径，默认 `/api` |
| `VITE_GATEWAY_API` | 开发环境代理目标（网关地址），**仅开发服务器生效** |
| `VITE_AUTH_API_PREFIX` | 鉴权服务前缀，默认 `/api/auth` |
| `VITE_ADMIN_API_PREFIX` | 管理服务前缀，默认 `/api/admin` |
| `VITE_GENERATE_API_PREFIX` | 代码生成服务前缀，默认 `/api/generate` |
| `VITE_SMS_RESEND_INTERVAL` | 短信验证码重发间隔（秒），默认 `120`，需与后端频控一致 |

### 生产部署要求

1. `VITE_GATEWAY_API` 仅用于开发服务器代理（见 `plugins/vite-config-server.ts`），**不会进入构建产物**。
2. 构建产物中的接口地址是相对路径 `/api`，因此生产环境必须由 Nginx 将 `/api` 反向代理到网关，否则所有接口都会 404。
3. 开发代理会去掉 `/api` 前缀（`/api/auth/login` → `/auth/login`），Nginx 需保持同样行为：

```nginx
location /api/ {
    proxy_pass http://<gateway-host>:<port>/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

4. 前端为单页应用，需配置 history 回退：`try_files $uri $uri/ /index.html;`

## 📁 项目结构

```
src/
├── components/          # 通用组件
├── hooks/               # Vue 组合式函数
├── layout/              # 布局组件
├── plugin/              # 插件配置
├── router/              # 路由配置
├── service/             # 服务层
│   ├── api/                 # API 接口定义
│   ├── constant/            # 常量定义
│   ├── enums/               # 枚举定义
│   └── model/               # 数据模型
├── store/               # Pinia 状态管理
├── styles/              # 样式文件
├── typings/             # TypeScript 类型定义
├── utils/               # 工具函数
└── views/               # 页面视图
    ├── dashboard/           # 工作台
    ├── generate/            # 代码生成
    ├── login/               # 登录页面
    ├── monitor/             # 监控中心
    ├── other/               # 其他页面
    └── system/              # 系统管理
```

## 🔧 核心功能

### 系统管理
- **用户管理**: 用户增删改查、状态管理、密码重置
- **角色管理**: 角色权限分配、状态控制
- **部门管理**: 树形结构部门管理
- **菜单管理**: 动态菜单配置、权限绑定
- **字典管理**: 数据字典类型和字典项管理

### 代码生成
- **数据源管理**: 多数据库连接配置
- **表管理**: 数据库表结构分析
- **字段管理**: 表字段属性配置
- **模板管理**: 代码生成模板编辑
- **类型映射**: 数据库类型到编程语言类型映射
- **生成日志**: 代码生成记录追踪

### 监控中心
- **在线用户**: 当前在线用户监控
- **操作日志**: 系统操作记录查看

### 权限控制
- **RBAC 模型**: 基于角色的访问控制
- **动态路由**: 根据权限动态生成菜单
- **按钮权限**: 细粒度的操作权限控制
- **数据权限**: 基于部门的数据访问控制

## 🎨 特性亮点

- **现代化技术栈**: 使用 Vue 3 Composition API + TypeScript
- **响应式设计**: 支持多种设备尺寸自适应
- **主题切换**: 支持明暗主题切换
- **国际化**: 多语言支持准备
- **权限控制**: 完整的 RBAC 权限管理体系
- **代码生成**: 强大的代码自动生成功能
- **组件化**: 高度组件化的开发模式
- **类型安全**: 完整的 TypeScript 类型支持

## 📖 开发指南

### 添加新页面

1. 在 `src/views` 下创建页面组件
2. 在 `src/router/modules` 中添加路由配置
3. 在后端菜单管理中配置对应菜单项

### 添加新组件

1. 在 `src/components` 下创建组件目录
2. 创建 `index.vue` 组件文件
3. 如需类型定义，创建 `types.ts` 文件

### API 接口开发

1. 在 `src/service/api` 对应模块下定义接口
2. 在 `src/service/model` 中定义数据模型
3. 在 `src/service/enums` 中定义相关枚举

## 🤝 参与贡献

1. Fork 本项目
2. 创建新的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交代码 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源。

## 🙏 致谢

感谢以下开源项目提供的支持：

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [UnoCSS](https://uno.antfu.me/)
