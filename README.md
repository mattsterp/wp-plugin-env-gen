# wp-plugin-env-gen

A command-line interface (CLI) tool for scaffolding WordPress plugin development environments.

## Features

- Generate different types of WordPress plugins:
  - Classic Plugin (PHP-only)
  - Block Plugin (single block with modern JavaScript tooling)
  - Block Library (multiple blocks bundled together)
  - Official WordPress Block Plugin using @wordpress/create-block
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
4. Plugin Type (Classic, Block, Block Library, or WordPress create-block)
5. For create-block: Block Variant (Static or Dynamic)
6. For create-block: Block Namespace
7. Whether to include an Admin Page (not applicable for create-block)
8. Whether to include a Settings Page (not applicable for create-block)
9. Whether to include wp-env configuration
10. Whether to include wp-now integration
11. Whether to initialize a Git repository

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

#### WordPress Official create-block Plugin

The structure follows the official WordPress block plugin template with optional additions:

```
plugin-name/
├── build/
├── src/
│   ├── blocks/
│   │   └── (varies based on block type)
│   ├── edit.js
│   ├── editor.scss
│   ├── index.js
│   ├── save.js (for static blocks)
│   └── style.scss
├── block.json
├── .wp-env.json (if selected)
├── .wp-now.json (if selected)
├── wp-now-setup.sh (if selected)
├── package.json
├── README.md
└── plugin-name.php
```

## WordPress create-block Integration

This tool includes integration with the official [@wordpress/create-block](https://www.npmjs.com/package/@wordpress/create-block) package, which is the WordPress-recommended way to scaffold block plugins.

When selecting the "Official WordPress Block (@wordpress/create-block)" option, the tool will:

1. Use npx to run @wordpress/create-block with your specified options
2. Allow you to choose between static and dynamic block variants
3. Let you specify a custom namespace for your block
4. Optionally add wp-env and wp-now configuration
5. Optionally initialize a Git repository

This gives you the best of both worlds: the officially supported WordPress block scaffolding tool with the additional environment setup features of wp-plugin-env-gen.

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
