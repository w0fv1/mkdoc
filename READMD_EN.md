# MKDOC - Simple Vue Markdown Viewer

[中文版 (Chinese Version)](https://w0fv1.github.io/mkdoc/#README.md)

MKDOC is a single-page application built with Vue.js 2, designed to view Markdown files hosted in a GitHub repository directly in the browser. It automatically fetches the directory structure from the specified GitHub repository and renders Markdown content using `marked.js`, providing a GitHub Pages-like documentation browsing experience.

## ✨ Features

*   **Dynamic Directory Tree**: Fetches and displays the file directory structure from the GitHub API.
*   **Markdown Rendering**: Renders Markdown files to HTML using `marked.js`.
*   **GitHub Styling**: Uses `github-markdown-css` (dark theme) for a familiar GitHub reading experience.
*   **URL Hash Navigation**: Navigate and share links to specific files using URL hashes (e.g., `#path/to/your/file.md`).
*   **Highly Configurable**:
    *   Supports configuration of GitHub username, repository name, and branch.
    *   Allows specifying a root directory within the repository for Markdown files (e.g., `docs/`).
    *   Set a default Markdown file to load (e.g., `README.md`).
*   **Auto Configuration Inference**: Attempts to automatically infer `GITHUB_OWNER` and `GITHUB_REPO` when deployed on GitHub Pages (e.g., `username.github.io/repo/`).
*   **Error Handling**: Provides user-friendly error messages for directory loading and Markdown file fetching.
*   **Responsive Design**: Sidebar and content areas adapt to smaller screen sizes.

## 🚀 How to Use

1.  **Download/Get the File**:
    *   Download the `index.html` file to your project.

2.  **Configuration (Crucial!)**:
    MKDOC relies on correct GitHub repository configuration. You can configure it via the `window.AppConfig` object. At the bottom of the `index.html` file, within the `<script>` tags, you'll find a commented-out example of `window.AppConfig`. Uncomment and modify it:

    ```html
    <script>
        // ... Vue app code ...

        // Optional: For overriding Vue AppConfig easily from another script or HTML
        window.AppConfig = {
            GITHUB_OWNER: "your_github_username", // Your GitHub username or organization name
            GITHUB_REPO: "your_repository_name",  // Your GitHub repository name
            GITHUB_BRANCH: "main",                // Repository branch, e.g., "main", "gh-pages"
            PAGES_ROOT_IN_REPO: "",               // If Markdown files are in "docs" folder within repo, set to "docs"
                                                  // If at the root, keep as an empty string ""
            DEFAULT_MARKDOWN_FILE: "README.md"    // Default file to load when URL hash is empty
            // GITHUB_TOKEN: null, // Optional: For private repos or to avoid API rate limits (security risk on client-side, use with caution!)
        };
    </script>
    ```

    *   **`GITHUB_OWNER`**: Your GitHub username or organization name.
    *   **`GITHUB_REPO`**: The name of your GitHub repository containing the Markdown files.
    *   **`GITHUB_BRANCH`**: The branch you want to pull files from (e.g., `main`, `gh-pages`).
    *   **`PAGES_ROOT_IN_REPO`**: If your Markdown files are not in the root of the repository but in a subdirectory (e.g., `docs`), set this option. For instance, if your files are at `https://github.com/user/repo/tree/main/docs/README.md`, then `PAGES_ROOT_IN_REPO` should be `"docs"`. If files are at the repository root, leave it empty (`""`).
    *   **`DEFAULT_MARKDOWN_FILE`**: The path to the Markdown file (relative to `PAGES_ROOT_IN_REPO` or repository root) to display by default when the user first visits or the URL hash is empty.
    *   **`AUTO_INFER_CONFIG`**: (Defaults to `true`) If `true` and the app is deployed on a standard GitHub Pages URL (like `owner.github.io/repo` or `owner.github.io` for user/org pages), it will try to infer `GITHUB_OWNER` and `GITHUB_REPO`. Manually set `GITHUB_OWNER` and `GITHUB_REPO` will take precedence.

3.  **Deployment**:
    *   **GitHub Pages**:
        1.  Push the configured `index.html` file to your GitHub repository (e.g., to a `gh-pages` branch, or the `/docs` folder on the `main` branch, depending on your GitHub Pages settings).
        2.  Ensure your Markdown files are also present in the repository and branch at the appropriate paths.
        3.  Configure GitHub Pages in your repository's "Settings" -> "Pages" to serve from the respective branch and folder.
    *   **Other Static Hosting**: You can also deploy this `index.html` to any service that supports static file hosting.

4.  **Access**:
    Open the URL of your deployed `index.html`.
    *   The file directory will be shown on the left. Click on `.md` file links to view them.
    *   You can also access specific files directly via the URL hash, e.g.: `https://your-username.github.io/your-repo/#path/to/your/file.md` (if `PAGES_ROOT_IN_REPO` is empty) or `https://your-username.github.io/your-repo/#file.md` (if `PAGES_ROOT_IN_REPO` is `docs` and `file.md` is in the `docs` directory).

## 🛠️ Configuration Options Detailed

These configuration options are defined in the Vue app's `data.config` object and can be overridden by `window.AppConfig`.

*   `AUTO_INFER_CONFIG` (Boolean, Default: `true`): Whether to attempt auto-inference of GitHub Pages config from `window.location`.
*   `GITHUB_OWNER` (String, Default: `null`): GitHub username or organization. **Must be configured (if auto-infer fails or is disabled).**
*   `GITHUB_REPO` (String, Default: `null`): GitHub repository name. **Must be configured (if auto-infer fails or is disabled).**
*   `GITHUB_BRANCH` (String, Default: `'main'`): The branch from which to fetch the directory tree and content.
*   `PAGES_ROOT_IN_REPO` (String, Default: `''`): The relative root path for Markdown files within the repository. E.g., if files are in `repo/docs/`, set this to `"docs"`. This affects directory tree building and file linking.
*   `DEFAULT_MARKDOWN_FILE` (String, Default: `'README.md'`): The filename (path relative to `PAGES_ROOT_IN_REPO`) to load by default when the URL hash is empty.
*   `API_BASE_URL` (String, Default: `'https://api.github.com'`): Base URL for the GitHub API.
*   `GITHUB_TOKEN` (String, Default: `null`, commented out in code): GitHub Personal Access Token. Can be used for private repositories or to increase API rate limits. **Warning**: Embedding tokens in client-side code is a security risk; use only in trusted environments or consider a backend proxy.

## 📦 Dependencies

*   Vue.js 2.7.16
*   marked.js 4.2.12
*   github-markdown-css 5.8.1

## 📄 License

This project is licensed under the [MIT License](LICENSE).
