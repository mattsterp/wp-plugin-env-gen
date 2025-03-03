import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Template directory
const templatesDir = path.join(__dirname, "..", "templates");

/**
 * Generate a block library WordPress plugin
 * @param {string} targetDir - Target directory for the plugin
 * @param {object} options - Plugin options
 */
export async function generateBlockLibrary(targetDir, options) {
  // Create plugin main file
  const mainPluginFile = `${options.pluginSlug}.php`;
  const mainPluginTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "main-plugin.php.ejs"),
    "utf8"
  );
  const mainPluginContent = ejs.render(mainPluginTemplate, {
    pluginName: options.pluginName,
    pluginSlug: options.pluginSlug,
    pluginDescription: options.pluginDescription,
    includeAdminPage: options.includeAdminPage,
    includeSettingsPage: options.includeSettingsPage,
  });
  await fs.writeFile(path.join(targetDir, mainPluginFile), mainPluginContent);

  // Create block directory structure
  const srcDir = path.join(targetDir, "src");
  const blocksDir = path.join(srcDir, "blocks");
  const buildDir = path.join(targetDir, "build");

  await fs.mkdir(srcDir, { recursive: true });
  await fs.mkdir(blocksDir, { recursive: true });
  await fs.mkdir(buildDir, { recursive: true });

  // Create sample blocks
  await createSampleBlock(targetDir, options, "example-static");
  await createSampleBlock(targetDir, options, "example-dynamic");
  await createSampleBlock(targetDir, options, "example-editable");

  // Create main index.js entry file
  const indexJsTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "src-index.js.ejs"),
    "utf8"
  );
  const indexJsContent = ejs.render(indexJsTemplate, {
    pluginSlug: options.pluginSlug,
  });
  await fs.writeFile(path.join(srcDir, "index.js"), indexJsContent);

  // If admin page is requested, create admin page
  if (options.includeAdminPage) {
    await createAdminPage(targetDir, options);
  }

  // If settings page is requested, create settings page
  if (options.includeSettingsPage) {
    await createSettingsPage(targetDir, options);
  }

  // Create package.json
  const packageJsonTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "package.json.ejs"),
    "utf8"
  );
  const packageJsonContent = ejs.render(packageJsonTemplate, {
    pluginName: options.pluginName,
    pluginSlug: options.pluginSlug,
    includeWpEnv: options.includeWpEnv,
  });
  await fs.writeFile(path.join(targetDir, "package.json"), packageJsonContent);

  // Create README.md
  const readmeTemplate = await fs.readFile(
    path.join(templatesDir, "common", "readme.md.ejs"),
    "utf8"
  );
  const readmeContent = ejs.render(readmeTemplate, {
    pluginName: options.pluginName,
    pluginDescription: options.pluginDescription,
    pluginType: "block-library",
    includeWpEnv: options.includeWpEnv,
    includeWpNow: options.includeWpNow,
  });
  await fs.writeFile(path.join(targetDir, "README.md"), readmeContent);

  // Create wp-env.json if requested
  if (options.includeWpEnv) {
    await createWpEnvConfig(targetDir, options);
  }

  // Create wp-now configuration if requested
  if (options.includeWpNow) {
    await createWpNowConfig(targetDir, options);
  }

  // Create .gitignore
  const gitignoreTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "gitignore.ejs"),
    "utf8"
  );
  const gitignoreContent = ejs.render(gitignoreTemplate);
  await fs.writeFile(path.join(targetDir, ".gitignore"), gitignoreContent);
}

/**
 * Create a sample block for the block library
 */
async function createSampleBlock(targetDir, options, blockName) {
  const blockDir = path.join(targetDir, "src", "blocks", blockName);
  await fs.mkdir(blockDir, { recursive: true });

  // Create block.json
  const blockJsonTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "block.json.ejs"),
    "utf8"
  );
  const blockJsonContent = ejs.render(blockJsonTemplate, {
    pluginName: options.pluginName,
    pluginSlug: options.pluginSlug,
    blockName: blockName,
  });
  await fs.writeFile(path.join(blockDir, "block.json"), blockJsonContent);

  // Create block JS file
  const blockJsTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", `${blockName}.js.ejs`),
    "utf8"
  );
  const blockJsContent = ejs.render(blockJsTemplate, {
    pluginName: options.pluginName,
    pluginSlug: options.pluginSlug,
    blockName: blockName,
  });
  await fs.writeFile(path.join(blockDir, "index.js"), blockJsContent);

  // Create block editor CSS
  const editorCssTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "editor.css.ejs"),
    "utf8"
  );
  const editorCssContent = ejs.render(editorCssTemplate, {
    pluginSlug: options.pluginSlug,
    blockName: blockName,
  });
  await fs.writeFile(path.join(blockDir, "editor.css"), editorCssContent);

  // Create block style CSS
  const styleCssTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "style.css.ejs"),
    "utf8"
  );
  const styleCssContent = ejs.render(styleCssTemplate, {
    pluginSlug: options.pluginSlug,
    blockName: blockName,
  });
  await fs.writeFile(path.join(blockDir, "style.css"), styleCssContent);

  // For dynamic blocks, add the server-side render function
  if (blockName === "example-dynamic") {
    const dynamicBlockPHPDir = path.join(targetDir, "includes", "blocks");
    await fs.mkdir(dynamicBlockPHPDir, { recursive: true });

    const dynamicBlockPHPTemplate = await fs.readFile(
      path.join(templatesDir, "block-library", "dynamic-block.php.ejs"),
      "utf8"
    );
    const dynamicBlockPHPContent = ejs.render(dynamicBlockPHPTemplate, {
      pluginName: options.pluginName,
      pluginSlug: options.pluginSlug,
      blockName: blockName,
    });
    await fs.writeFile(
      path.join(dynamicBlockPHPDir, `${blockName}.php`),
      dynamicBlockPHPContent
    );
  }
}

/**
 * Create admin page files
 */
async function createAdminPage(targetDir, options) {
  const includesDir = path.join(targetDir, "includes");
  const adminDir = path.join(includesDir, "admin");
  await fs.mkdir(includesDir, { recursive: true });
  await fs.mkdir(adminDir, { recursive: true });

  const adminTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "admin-page.php.ejs"),
    "utf8"
  );
  const adminContent = ejs.render(adminTemplate, {
    pluginName: options.pluginName,
    pluginSlug: options.pluginSlug,
  });
  await fs.writeFile(path.join(adminDir, "admin-page.php"), adminContent);
}

/**
 * Create settings page files
 */
async function createSettingsPage(targetDir, options) {
  const includesDir = path.join(targetDir, "includes");
  const settingsDir = path.join(includesDir, "settings");
  await fs.mkdir(includesDir, { recursive: true });
  await fs.mkdir(settingsDir, { recursive: true });

  const settingsTemplate = await fs.readFile(
    path.join(templatesDir, "block-library", "settings-page.php.ejs"),
    "utf8"
  );
  const settingsContent = ejs.render(settingsTemplate, {
    pluginName: options.pluginName,
    pluginSlug: options.pluginSlug,
  });
  await fs.writeFile(
    path.join(settingsDir, "settings-page.php"),
    settingsContent
  );
}

/**
 * Create wp-env.json configuration
 */
async function createWpEnvConfig(targetDir, options) {
  const wpEnvTemplate = await fs.readFile(
    path.join(templatesDir, "common", "wp-env.json.ejs"),
    "utf8"
  );
  const wpEnvContent = ejs.render(wpEnvTemplate, {
    pluginSlug: options.pluginSlug,
  });
  await fs.writeFile(path.join(targetDir, ".wp-env.json"), wpEnvContent);
}

/**
 * Create wp-now configuration
 */
async function createWpNowConfig(targetDir, options) {
  const wpNowTemplate = await fs.readFile(
    path.join(templatesDir, "common", "wp-now.json.ejs"),
    "utf8"
  );
  const wpNowContent = ejs.render(wpNowTemplate, {
    pluginSlug: options.pluginSlug,
  });
  await fs.writeFile(path.join(targetDir, ".wp-now.json"), wpNowContent);

  // Create wp-now setup script
  const wpNowScriptTemplate = await fs.readFile(
    path.join(templatesDir, "common", "wp-now-setup.sh.ejs"),
    "utf8"
  );
  const wpNowScriptContent = ejs.render(wpNowScriptTemplate, {
    pluginSlug: options.pluginSlug,
  });
  const scriptPath = path.join(targetDir, "wp-now-setup.sh");
  await fs.writeFile(scriptPath, wpNowScriptContent);
  await fs.chmod(scriptPath, 0o755); // Make executable
}
