## ADDED Requirements

### Requirement: GitHub Actions workflow
The project SHALL include a GitHub Actions workflow at `.github/workflows/deploy.yml` that: triggers on push to `main`, checks out the repository, installs Hugo extended edition, builds the site with `--minify`, and deploys to GitHub Pages.

#### Scenario: Push triggers build and deploy
- **WHEN** a commit is pushed to the `main` branch
- **THEN** GitHub Actions builds the Hugo site and deploys the output to GitHub Pages

#### Scenario: Build uses Hugo extended
- **WHEN** the workflow runs
- **THEN** it uses Hugo extended edition (required for Hugo Pipes CSS processing)

### Requirement: GitHub Pages configuration
The repository SHALL be configured for GitHub Pages deployment from the `gh-pages` branch (or GitHub Actions source). A `CNAME` file SHALL exist in `static/` with contents `gianna-brachetti.com`.

#### Scenario: Custom domain configured
- **WHEN** the site is deployed
- **THEN** GitHub Pages serves the site at `gianna-brachetti.com`

### Requirement: .gitignore
The repository SHALL include a `.gitignore` that excludes: `public/`, `resources/`, `.hugo_build.lock`, `.DS_Store`, `node_modules/` (precautionary), and any Obsidian workspace files (`.obsidian/workspace.json`, `.obsidian/workspace-mobile.json`).

#### Scenario: Build output not committed
- **WHEN** `hugo` is run locally
- **THEN** the `public/` directory is not tracked by git

### Requirement: Repository initialisation
The project SHALL be initialised as a git repository with an initial commit. A `README.md` SHALL describe the project and basic usage (how to run locally, how to add content).

#### Scenario: Repository is functional
- **WHEN** the project setup is complete
- **THEN** `git status` shows a clean working tree with all project files committed
