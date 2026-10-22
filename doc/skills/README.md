# doc/skills —— 给 AI 工具复用的开发规范包

本目录存放**纯 Markdown + 一个零依赖 Node 脚本**的开发规范包，用来在任何 AI 编程工具里复现同一套「新增页面 / 组件」的产出质量。不绑定具体工具，换工具时把路径指过来就能用。

## 目录内容

```
doc/skills/
├── README.md                       ← 本文件（接入说明）
├── SKILL.md                        ← 主规范：落位判定 / 流程 / 硬性约束 / 返工点
├── references/
│   ├── page-workflow.md            ← 新增业务页面：全量可复制模板
│   └── component-workflow.md       ← 新增通用组件：全量可复制模板
└── scripts/
    └── check-module.mjs            ← 结构与规范自检（零依赖，Node 18+）
```

与 `doc/开发文档.md` 的关系：那份是**总规范**（命名、提交、目录、接口约定），这份是**操作手册**（照抄就能产出正确代码）。冲突时以 `开发文档.md` 与现有代码为准。

## 三种用法

### 方式一：直接把文件甩给 AI（最快，不改任何配置）

新开一个会话，把 `SKILL.md` 全文贴进去，或者直接说：

> 读 `doc/skills/SKILL.md` 和 `references/page-workflow.md`，照里面的流程在 `src/views/system/example/` 新增一个「示例管理」列表页。

AI 会自己去读被引用的 `references/` 文件。

### 方式二：写进工具自己的规则文件（一次配置，长期生效）

各工具的规则入口不同，往里加一行指路即可：

| 工具 | 规则文件 | 加什么 |
| --- | --- | --- |
| Claude Code | `CLAUDE.md` | `@doc/skills/SKILL.md` |
| Codex CLI / 通用 | `AGENTS.md` | `新增页面或组件时，先读 doc/skills/SKILL.md` |
| GitHub Copilot | `.github/copilot-instructions.md` | 同上 |
| Cursor | `.cursor/rules/xht-page-component.mdc` | 用 `alwaysApply: false` + `globs`，正文写指路句 |
| 其他（Trae / 通义灵码 / Windsurf / Cline 等） | 各自的「自定义规则 / 项目规则」 | 同上 |

具体字段各工具版本略有差异，按各自文档填；核心只有一句「新增页面或组件时先读这个文件」。

### 方式三：用自检脚本卡质量

```bash
# 页面模式：结构齐备性 + 规范扫描
node doc/skills/scripts/check-module.mjs system/example

# 组件模式
node doc/skills/scripts/check-module.mjs --component element-plus/xht-amount-input
```

- 从仓库**任意目录**执行都可以：脚本会自己向上找到含 `package.json` 和 `src` 的仓库根。
- 输出形如 `文件:行号  规则名  说明`；有 error 时退出码为 1，可直接串进 CI 或 git hook。
- 它只覆盖「本规范约定的那部分」，**不替代** `pnpm type-check` 与 `pnpm lint`。

## 与 `.workbuddy/skills/` 的关系

仓库里有两份内容相同的包：

| 位置 | 用途 | 是否进 git |
| --- | --- | --- |
| `doc/skills/`（本目录） | 换 AI 工具时复用；团队可见 | 是 |
| `.workbuddy/skills/xht-page-component/` | WorkBuddy 自动加载（保留一层目录，便于以后扩多个技能） | 否，`/.workbuddy/` 被 `.gitignore` 忽略 |

两份的差异仅三处，都是刻意保留的：

1. 文件内命令示例的路径，各写自己所在位置；
2. `.workbuddy` 那份带 `agent_created: true` 等工具专属 frontmatter，本目录这份只有 `name` / `description`（通用 Agent Skills 字段）；
3. 本目录这份把「本技能」改为「本目录/本规范」等中立措辞。

**维护时改一处、同步另一处**：

```bash
# 以 .workbuddy 那份为准，同步到 doc（注意反向替换路径、去掉专属字段）
cp -r .workbuddy/skills/xht-page-component/. doc/skills/
# 然后把 doc 那份里的 ".workbuddy/skills/xht-page-component" 替换成 "doc/skills"
```
