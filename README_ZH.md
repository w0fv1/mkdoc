# MKDOC - 即放即用的 Markdown 文档查看器

[English Version](README.md)

MKDOC 是一个单文件、无需构建的 Markdown 文档查看器。放进仓库即可使用，自动生成目录并渲染 Markdown，适合快速发布与分享。

## ✨ 特性

*   **单文件，零构建**: 仅需一个 `index.html`，无需安装依赖。
*   **目录树文件优先**: 支持仓库内 `mkdoc.tree.json` 文件，优先使用静态目录树以避免 API 限流。
*   **API 回退 + 缓存**: 需要时使用 GitHub API，并自动回退到本地缓存。
*   **Markdown 渲染**: 将 Markdown 文件渲染为 HTML。
*   **GitHub 样式**: 使用 `github-markdown-css` (暗黑主题) 以获得熟悉的 GitHub 阅读体验。
*   **Tailwind UI**: 应用外壳（侧栏、按钮、提示等）使用 TailwindCSS（CDN）。
*   **URL Hash 导航**: 通过 URL hash (例如 `#path/to/your/file.md`) 进行文件间的导航和分享。
*   **配置灵活**:
    *   支持配置 GitHub 用户名、仓库名、分支。
    *   支持指定 Markdown 文件在仓库中的根目录 (例如 `docs/`)。
    *   可设置默认加载的 Markdown 文件 (例如 `README.md`)。
*   **自动配置推断**: 当部署在 GitHub Pages (例如 `username.github.io/repo/`) 时，会自动尝试推断 `GITHUB_OWNER` 和 `GITHUB_REPO`。
*   **错误处理**: 为目录加载和 Markdown 文件加载提供用户友好的错误提示。
*   **响应式设计**: 侧边栏和内容区域在小屏幕设备上会自动调整布局。

## 🚀 如何使用

1.  **放入文件**:
    *   将 `index.html` 放到你的文档仓库中。

2.  **配置仓库信息**:
    通过 `window.AppConfig` 指定仓库信息。在 `index.html` 底部 `<script>` 中有示例，取消注释并修改：

    ```html
    <script>
        // ... app code ...

        // 可选：从其他脚本或 HTML 覆盖 AppConfig
        window.AppConfig = {
            GITHUB_OWNER: "your_github_username", // 你的 GitHub 用户名或组织名
            GITHUB_REPO: "your_repository_name",  // 你的 GitHub 仓库名
            GITHUB_BRANCH: "main",                // 仓库分支, e.g., "main", "gh-pages"
            PAGES_ROOT_IN_REPO: "",               // 如果 Markdown 文件在仓库的 "docs" 文件夹下, 则设置为 "docs"
                                                  // 如果就在根目录, 保持为空字符串 ""
            DEFAULT_MARKDOWN_FILE: "README.md"    // 当 URL hash 为空时默认加载的文件
            // TREE_FILE_NAME: "mkdoc.tree.json"  // 可选: 自定义目录树文件名
        };
    </script>
    ```

    *   **`GITHUB_OWNER`**: 您的 GitHub 用户名或组织名。
    *   **`GITHUB_REPO`**: 包含 Markdown 文件的 GitHub 仓库名。
    *   **`GITHUB_BRANCH`**: 您希望从中拉取文件的分支 (例如 `main`, `gh-pages`)。
    *   **`PAGES_ROOT_IN_REPO`**: 如果您的 Markdown 文件不是位于仓库的根目录，而是位于某个子目录（例如 `docs`），请设置此项。例如，如果您的文件在 `https://github.com/user/repo/tree/main/docs/README.md`，则 `PAGES_ROOT_IN_REPO` 应为 `"docs"`。如果文件就在仓库根目录，则留空 (`""`)。
    *   **`DEFAULT_MARKDOWN_FILE`**: 当用户首次访问或 URL hash 为空时，默认显示的 Markdown 文件路径 (相对于 `PAGES_ROOT_IN_REPO` 或仓库根目录)。
    *   **`AUTO_INFER_CONFIG`**: (默认为 `true`) 如果设置为 `true` 且应用部署在标准的 GitHub Pages URL (如 `owner.github.io/repo` 或 `owner.github.io` 对于用户/组织页面)，它会尝试自动推断 `GITHUB_OWNER` 和 `GITHUB_REPO`。如果手动设置了 `GITHUB_OWNER` 和 `GITHUB_REPO`，则手动设置的值优先。

3.  **生成目录树文件 (推荐)**:
    运行脚本生成 `mkdoc.tree.json` 并提交，可避免 API 限流并加快加载：

    ```bash
    node scripts/mkdoc-generate-tree.mjs --root . --out mkdoc.tree.json
    ```

    如果你的 Markdown 位于 `docs/` 目录，可改为：

    ```bash
    node scripts/mkdoc-generate-tree.mjs --root docs --out mkdoc.tree.json
    ```

4.  **部署**:
    *   **GitHub Pages**:
        1.  将配置好的 `index.html` 文件推送到您的 GitHub 仓库（例如，推送到 `gh-pages` 分支，或者 `main` 分支的 `/docs` 目录，具体取决于您的 GitHub Pages 设置）。
        2.  确保您的 Markdown 文件也位于该仓库和分支的相应路径下。
        3.  在仓库的 "Settings" -> "Pages" 中配置 GitHub Pages 以从相应分支和文件夹提供服务。
    *   **其他静态托管**: 您也可以将此 `index.html` 部署到任何支持静态文件托管的服务上。

5.  **访问**:
    打开您部署的 `index.html` 的 URL。
    *   左侧将显示文件目录。点击 `.md` 文件链接进行查看。
    *   您也可以直接通过 URL hash 访问特定文件，例如: `https://your-username.github.io/your-repo/#path/to/your/file.md` (如果 `PAGES_ROOT_IN_REPO` 为空) 或 `https://your-username.github.io/your-repo/#file.md` (如果 `PAGES_ROOT_IN_REPO` 为 `docs` 且 `file.md` 在 `docs` 目录下)。

## 🛠️ 配置选项详解

这些配置项定义在应用的 `data.config` 对象中，可以通过 `window.AppConfig` 覆盖。

*   `AUTO_INFER_CONFIG` (布尔值, 默认: `true`): 是否尝试自动从 `window.location` 推断 GitHub Pages 配置。
*   `GITHUB_OWNER` (字符串, 默认: `null`): GitHub 用户名或组织名。**必须配置 (如果自动推断失败或禁用)。**
*   `GITHUB_REPO` (字符串, 默认: `null`): GitHub 仓库名。**必须配置 (如果自动推断失败或禁用)。**
*   `GITHUB_BRANCH` (字符串, 默认: `'main'`): 要从中获取目录树和内容的分支。
*   `PAGES_ROOT_IN_REPO` (字符串, 默认: `''`): Markdown 文件在仓库中的相对根路径。例如，如果文件在 `repo/docs/` 目录下，则设置为 `"docs"`。这会影响目录树的构建和文件链接。
*   `DEFAULT_MARKDOWN_FILE` (字符串, 默认: `'README.md'`): 当 URL hash 为空时默认加载的文件名 (路径相对于 `PAGES_ROOT_IN_REPO`)。
*   `API_BASE_URL` (字符串, 默认: `'https://api.github.com'`): GitHub API 的基础 URL。
*   `TREE_FILE_NAME` (字符串, 默认: `'mkdoc.tree.json'`): 目录树文件名。若该文件存在，将优先使用它构建目录。

## 📦 依赖

*   marked.js 4.2.12
*   github-markdown-css 5.8.1

## 📄 许可证

本项目使用 [MIT License](LICENSE) 授权。
