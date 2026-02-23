# MKDOC - Drop-in Markdown Doc Viewer

[中文说明](README_ZH.md)

MKDOC is a single-file Markdown doc viewer. Drop it into your repo and you get a clean, navigable doc site with an auto-built directory tree. No build step, no setup, just open and browse.

## ✨ Features

*   **Single File, Zero Build**: One `index.html` file that works out of the box.
*   **Tree File First**: Supports a repository `mkdoc.tree.json` file and prefers it to avoid API rate limits.
*   **GitHub API Fallback + Cache**: Uses the API when needed and falls back to local cache (optional).
*   **Markdown Rendering**: Renders Markdown files to HTML.
*   **GitHub Styling**: Uses `github-markdown-css` (dark theme) for a familiar GitHub reading experience.
*   **Tailwind UI**: Uses TailwindCSS (CDN) for the app shell (sidebar, buttons, notices).
*   **URL Hash Navigation**: Navigate and share links to specific files using URL hashes (e.g., `#path/to/your/file.md`).
*   **Configurable**:
    *   Supports configuration of GitHub username, repository name, and branch.
    *   Allows specifying a root directory within the repository for Markdown files (e.g., `docs/`).
    *   Set a default Markdown file to load (e.g., `README.md`).
*   **Auto Configuration Inference**: Attempts to automatically infer `GITHUB_OWNER` and `GITHUB_REPO` when deployed on GitHub Pages (e.g., `username.github.io/repo/`).
*   **Error Handling**: Provides user-friendly error messages for directory loading and Markdown file fetching.
*   **Responsive Design**: Sidebar and content areas adapt to smaller screen sizes.

## 🚀 How to Use

1.  **Drop in the file**:
    *   Put `index.html` into your docs repository.

2.  **(Recommended) Generate a tree file**:
    Generate `mkdoc.tree.json` and commit it to avoid API rate limits and make local preview work without any GitHub configuration:

    ```bash
    node scripts/mkdoc-generate-tree.mjs --root . --out mkdoc.tree.json
    ```

    If your Markdown files live in `docs/`, use:

    ```bash
    node scripts/mkdoc-generate-tree.mjs --root docs --out mkdoc.tree.json
    ```

3.  **(Optional) Configure GitHub API fallback**:
    Only needed when you do **not** ship `mkdoc.tree.json`, or you want the app to fetch directory data from GitHub.

    Set repo details via `window.AppConfig`. At the bottom of `index.html` inside `<script>`, you'll find an example; uncomment and edit it:

    ```html
    <script>
        // ... app code ...

        // Optional: Override AppConfig from another script or HTML
        window.AppConfig = {
            GITHUB_OWNER: "your_github_username", // Your GitHub username or organization name
            GITHUB_REPO: "your_repository_name",  // Your GitHub repository name
            GITHUB_BRANCH: "main",                // Repository branch, e.g., "main", "gh-pages"
            PAGES_ROOT_IN_REPO: "",               // If Markdown files are in "docs" folder within repo, set to "docs"
                                                  // If at the root, keep as an empty string ""
            DEFAULT_MARKDOWN_FILE: "README.md"    // Default file to load when URL hash is empty
            // TREE_FILE_NAME: "mkdoc.tree.json"  // Optional: custom tree file name
        };
    </script>
    ```

    *   **`GITHUB_OWNER`**: Your GitHub username or organization name.
    *   **`GITHUB_REPO`**: The name of your GitHub repository containing the Markdown files.
    *   **`GITHUB_BRANCH`**: The branch you want to pull files from (e.g., `main`, `gh-pages`).
    *   **`PAGES_ROOT_IN_REPO`**: If your Markdown files are not in the root of the repository but in a subdirectory (e.g., `docs`), set this option. For instance, if your files are at `https://github.com/user/repo/tree/main/docs/README.md`, then `PAGES_ROOT_IN_REPO` should be `"docs"`. If files are at the repository root, leave it empty (`""`).
    *   **`DEFAULT_MARKDOWN_FILE`**: The path to the Markdown file (relative to `PAGES_ROOT_IN_REPO` or repository root) to display by default when the user first visits or the URL hash is empty.
    *   **`AUTO_INFER_CONFIG`**: (Defaults to `true`) If `true` and the app is deployed on a standard GitHub Pages URL (like `owner.github.io/repo` or `owner.github.io` for user/org pages), it will try to infer `GITHUB_OWNER` and `GITHUB_REPO`. Manually set `GITHUB_OWNER` and `GITHUB_REPO` will take precedence.

4.  **Local preview**:
    If you generated `mkdoc.tree.json`, you can preview locally with any static file server:

    ```bash
    python -m http.server 5173 --bind 127.0.0.1
    ```

    Then open `http://127.0.0.1:5173/`.

5.  **Deployment**:
    *   **GitHub Pages**:
        1.  Push the configured `index.html` file to your GitHub repository (e.g., to a `gh-pages` branch, or the `/docs` folder on the `main` branch, depending on your GitHub Pages settings).
        2.  Ensure your Markdown files are also present in the repository and branch at the appropriate paths.
        3.  Configure GitHub Pages in your repository's "Settings" -> "Pages" to serve from the respective branch and folder.
    *   **Other Static Hosting**: You can also deploy this `index.html` to any service that supports static file hosting.

6.  **Access**:
    Open the URL of your deployed `index.html`.
    *   The file directory will be shown on the left. Click on `.md` file links to view them.
    *   You can also access specific files directly via the URL hash, e.g.: `https://your-username.github.io/your-repo/#path/to/your/file.md` (if `PAGES_ROOT_IN_REPO` is empty) or `https://your-username.github.io/your-repo/#file.md` (if `PAGES_ROOT_IN_REPO` is `docs` and `file.md` is in the `docs` directory).

## 🛠️ Configuration Options Detailed

These configuration options live in the app's `data.config` object and can be overridden by `window.AppConfig`.

*   `AUTO_INFER_CONFIG` (Boolean, Default: `true`): Whether to attempt auto-inference of GitHub Pages config from `window.location`.
*   `GITHUB_OWNER` (String, Default: `null`): GitHub username or organization. Required only when using the GitHub API fallback (i.e. when you do not ship `mkdoc.tree.json`).
*   `GITHUB_REPO` (String, Default: `null`): GitHub repository name. Required only when using the GitHub API fallback (i.e. when you do not ship `mkdoc.tree.json`).
*   `GITHUB_BRANCH` (String, Default: `'main'`): The branch from which to fetch the directory tree and content.
*   `PAGES_ROOT_IN_REPO` (String, Default: `''`): The relative root path for Markdown files within the repository. E.g., if files are in `repo/docs/`, set this to `"docs"`. This affects directory tree building and file linking.
*   `DEFAULT_MARKDOWN_FILE` (String, Default: `'README.md'`): The filename (path relative to `PAGES_ROOT_IN_REPO`) to load by default when the URL hash is empty.
*   `API_BASE_URL` (String, Default: `'https://api.github.com'`): Base URL for the GitHub API.
*   `TREE_FILE_NAME` (String, Default: `'mkdoc.tree.json'`): Tree file name. When present, the app will prefer it to build the directory.

## 📦 Dependencies

Loaded via CDN in `index.html`:

*   Vue 2.7.16
*   marked.js 4.2.12
*   DOMPurify 3.0.8
*   github-markdown-css 5.8.1 (dark)
*   TailwindCSS (via `cdn.tailwindcss.com`)

## 📄 License

This project is licensed under the [MIT License](LICENSE).
