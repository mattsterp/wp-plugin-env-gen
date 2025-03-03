# wp-plugin-env-gen

A command-line interface (CLI) tool for scaffolding WordPress plugin development environments.

## Features

- Generate different types of WordPress plugins:
  - Classic Plugin (PHP-only)
  - Block Plugin (single block with modern JavaScript tooling)
  - Block Library (multiple blocks bundled together)
- Optional components:
  - Admin Page
  - Settings Page
- Environment setup:
  - wp-env integration for local development
  - wp-now integration for serverless previews
  - npm scripts for build tasks

## Installation

### Global Installation

```bash
npm install -g wp-plugin-env-gen
```

### Local Installation

```bash
npm install wp-plugin-env-gen
```

## Usage

### Creating a new plugin

```bash
wp-plugin-env-gen create
```

This will start an interactive prompt that will ask you for:

1. Plugin Name
2. Plugin Slug (auto-generated from name)
3. Plugin Description
4. Plugin Type (Classic, Block, or Block Library)
5. Whether to include an Admin Page
6. Whether to include a Settings Page
7. Whether to include wp-env configuration
8. Whether to include wp-now integration
9. Whether to initialize a Git repository

### Generated Plugin Structure

#### Classic Plugin

```
plugin-name/
├── includes/
│   ├── admin/
│   │   └── admin-page.php (if selected)
│   └── settings/
│       └── settings-page.php (if selected)
├── languages/
├── .wp-env.json (if selected)
├── .wp-now.json (if selected)
├── wp-now-setup.sh (if selected)
├── README.md
└── plugin-name.php
```

#### Block Plugin

```
plugin-name/
├── build/
├── includes/
│   ├── admin/
│   │   └── admin-page.php (if selected)
│   └── settings/
│       └── settings-page.php (if selected)
├── src/
│   ├── block/
│   │   ├── block.json
│   │   ├── editor.css
│   │   ├── index.js
│   │   └── style.css
│   └── index.js
├── .gitignore
├── .wp-env.json (if selected)
├── .wp-now.json (if selected)
├── wp-now-setup.sh (if selected)
├── package.json
├── README.md
└── plugin-name.php
```

#### Block Library

```
plugin-name/
├── build/
├── includes/
│   ├── admin/
│   │   └── admin-page.php (if selected)
│   ├── blocks/
│   │   └── example-dynamic.php
│   └── settings/
│       └── settings-page.php (if selected)
├── src/
│   ├── blocks/
│   │   ├── example-static/
│   │   │   ├── block.json
│   │   │   ├── editor.css
│   │   │   ├── index.js
│   │   │   └── style.css
│   │   ├── example-dynamic/
│   │   │   ├── block.json
│   │   │   ├── editor.css
│   │   │   ├── index.js
│   │   │   └── style.css
│   │   └── example-editable/
│   │       ├── block.json
│   │       ├── editor.css
│   │       ├── index.js
│   │       └── style.css
│   └── index.js
├── .gitignore
├── .wp-env.json (if selected)
├── .wp-now.json (if selected)
├── wp-now-setup.sh (if selected)
├── package.json
├── README.md
└── plugin-name.php
```

## Development

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Setup

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm link` to create a symlink to the global npm modules

### Available Scripts

- `npm start`: Run the CLI tool

## License

MIT
