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
 * Generate a classic WordPress plugin
 * @param {string} targetDir - Target directory for the plugin
 * @param {object} options - Plugin options
 */
export async function generateClassicPlugin(targetDir, options) {
  // Create plugin main file
  const mainPluginFile = `${options.pluginSlug}.php`;
  const mainPluginTemplate = await fs.readFile(
    path.join(templatesDir, "classic", "main-plugin.php.ejs"),
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

  // Create includes directory
  const includesDir = path.join(targetDir, "includes");
  await fs.mkdir(includesDir, { recursive: true });

  // If admin page is requested, create admin page
  if (options.includeAdminPage) {
    await createAdminPage(targetDir, options);
  }

  // If settings page is requested, create settings page
  if (options.includeSettingsPage) {
    await createSettingsPage(targetDir, options);
  }

  // Create README.md
  const readmeTemplate = await fs.readFile(
    path.join(templatesDir, "common", "readme.md.ejs"),
    "utf8"
  );
  const readmeContent = ejs.render(readmeTemplate, {
    pluginName: options.pluginName,
    pluginDescription: options.pluginDescription,
    pluginType: "classic",
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
}

/**
 * Create admin page files
 */
async function createAdminPage(targetDir, options) {
  const adminDir = path.join(targetDir, "includes", "admin");
  await fs.mkdir(adminDir, { recursive: true });

  const adminTemplate = await fs.readFile(
    path.join(templatesDir, "classic", "admin-page.php.ejs"),
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
  const settingsDir = path.join(targetDir, "includes", "settings");
  await fs.mkdir(settingsDir, { recursive: true });

  const settingsTemplate = await fs.readFile(
    path.join(templatesDir, "classic", "settings-page.php.ejs"),
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
