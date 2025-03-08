import { execa } from "execa";
import path from "path";
import fs from "fs-extra";
import ora from "ora";
import chalk from "chalk";

/**
 * Generate a WordPress block plugin using @wordpress/create-block
 * @param {string} targetDir - Target directory for the plugin
 * @param {object} options - Plugin options
 */
export async function generateWithWpCreateBlock(targetDir, options) {
  const spinner = ora(
    "Using @wordpress/create-block to scaffold the plugin..."
  ).start();

  try {
    // Prepare create-block options
    const createBlockArgs = [
      "@wordpress/create-block@latest",
      options.pluginSlug,
    ];

    // Add dynamic variant if requested
    if (options.blockVariant === "dynamic") {
      createBlockArgs.push("--variant=dynamic");
    }

    // Add namespace if provided
    if (options.namespace && options.namespace.trim() !== "") {
      createBlockArgs.push(`--namespace=${options.namespace}`);
    }

    // Add title if different from the slug
    if (options.pluginName && options.pluginName !== options.pluginSlug) {
      createBlockArgs.push(`--title="${options.pluginName}"`);
    }

    // Add description if provided
    if (options.pluginDescription && options.pluginDescription.trim() !== "") {
      createBlockArgs.push(`--description="${options.pluginDescription}"`);
    }

    // Execute create-block
    await execa("npx", createBlockArgs, {
      cwd: path.dirname(targetDir),
      stdio: "inherit",
    });

    // The targetDir path should now point to the created plugin directory
    const createdPluginDir = path.join(
      path.dirname(targetDir),
      options.pluginSlug
    );

    // Add wp-env.json if requested
    if (options.includeWpEnv) {
      await createWpEnvConfig(createdPluginDir, options);
    }

    // Add wp-now configuration if requested
    if (options.includeWpNow) {
      await createWpNowConfig(createdPluginDir, options);
    }

    spinner.succeed("Block plugin created with @wordpress/create-block");

    console.log(`\n${chalk.green("Block plugin created successfully!")} 🎉`);
    console.log(`\nNext steps:`);
    console.log(`  ${chalk.cyan("cd")} ${options.pluginSlug}`);
    console.log(`  ${chalk.cyan("npm")} run start`);

    if (options.includeWpEnv) {
      console.log(`  ${chalk.cyan("wp-env")} start`);
    }

    return createdPluginDir;
  } catch (error) {
    spinner.fail(
      `Failed to create block with @wordpress/create-block: ${error.message}`
    );
    throw error;
  }
}

/**
 * Create wp-env.json configuration
 */
async function createWpEnvConfig(targetDir, options) {
  const wpEnvConfig = {
    core: null,
    plugins: ["."],
    config: {
      WP_DEBUG: true,
      SCRIPT_DEBUG: true,
    },
  };

  await fs.writeFile(
    path.join(targetDir, ".wp-env.json"),
    JSON.stringify(wpEnvConfig, null, 2)
  );
}

/**
 * Create wp-now configuration
 */
async function createWpNowConfig(targetDir, options) {
  const wpNowConfig = {
    name: options.pluginSlug,
    type: "plugin",
  };

  await fs.writeFile(
    path.join(targetDir, ".wp-now.json"),
    JSON.stringify(wpNowConfig, null, 2)
  );

  // Create wp-now setup script
  const wpNowScriptContent = `#!/bin/bash
echo "Setting up ${options.pluginSlug} plugin..."
cd "$(dirname "$0")"
wp-now start
`;

  const scriptPath = path.join(targetDir, "wp-now-setup.sh");
  await fs.writeFile(scriptPath, wpNowScriptContent);
  await fs.chmod(scriptPath, 0o755); // Make executable
}
