#!/usr/bin/env node

import { program } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";

import { generateClassicPlugin } from "./generators/classic-plugin.js";
import { generateBlockPlugin } from "./generators/block-plugin.js";
import { generateBlockLibrary } from "./generators/block-library.js";
import { generateWithWpCreateBlock } from "./generators/wp-create-block.js";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CLI Configuration
program
  .name("wp-plugin-env-gen")
  .description(
    "CLI tool for scaffolding WordPress plugin development environments"
  )
  .version("1.0.0");

program
  .command("create")
  .description("Create a new WordPress plugin")
  .action(async () => {
    try {
      const answers = await inquirer.prompt([
        {
          type: "input",
          name: "pluginName",
          message: "Plugin Name:",
          validate: (input) =>
            input.trim() !== "" ? true : "Plugin name is required",
        },
        {
          type: "input",
          name: "pluginSlug",
          message: "Plugin Slug (used for directories and file names):",
          default: (input) =>
            input.pluginName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        },
        {
          type: "input",
          name: "pluginDescription",
          message: "Plugin Description:",
          default: "A custom WordPress plugin",
        },
        {
          type: "list",
          name: "pluginType",
          message: "Plugin Type:",
          choices: [
            { name: "Classic Plugin (PHP-only)", value: "classic" },
            { name: "Block Plugin (single block)", value: "block" },
            { name: "Block Library (multiple blocks)", value: "block-library" },
            {
              name: "Official WordPress Block (@wordpress/create-block)",
              value: "wp-create-block",
            },
          ],
        },
        {
          type: "list",
          name: "blockVariant",
          message: "Block Variant:",
          choices: [
            { name: "Static Block", value: "static" },
            { name: "Dynamic Block", value: "dynamic" },
          ],
          when: (answers) => answers.pluginType === "wp-create-block",
        },
        {
          type: "input",
          name: "namespace",
          message: "Block Namespace (optional):",
          default: "create-block",
          when: (answers) => answers.pluginType === "wp-create-block",
        },
        {
          type: "confirm",
          name: "includeAdminPage",
          message: "Include Admin Page:",
          default: false,
          when: (answers) => answers.pluginType !== "wp-create-block",
        },
        {
          type: "confirm",
          name: "includeSettingsPage",
          message: "Include Settings Page:",
          default: false,
          when: (answers) => answers.pluginType !== "wp-create-block",
        },
        {
          type: "confirm",
          name: "includeWpEnv",
          message: "Include wp-env configuration:",
          default: true,
        },
        {
          type: "confirm",
          name: "includeWpNow",
          message: "Include wp-now integration:",
          default: true,
        },
        {
          type: "confirm",
          name: "initGit",
          message: "Initialize Git repository:",
          default: true,
        },
      ]);

      const spinner = ora("Generating plugin...").start();

      try {
        // Create the plugin directory
        const targetDir = path.join(process.cwd(), answers.pluginSlug);

        // Check if directory exists
        if (fs.existsSync(targetDir)) {
          spinner.fail(`Directory ${answers.pluginSlug} already exists.`);
          return;
        }

        // For wp-create-block, we don't need to create the directory as the tool will do it
        if (answers.pluginType !== "wp-create-block") {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        let pluginDir = targetDir;

        // Generate plugin based on type
        switch (answers.pluginType) {
          case "classic":
            await generateClassicPlugin(targetDir, answers);
            break;
          case "block":
            await generateBlockPlugin(targetDir, answers);
            break;
          case "block-library":
            await generateBlockLibrary(targetDir, answers);
            break;
          case "wp-create-block":
            pluginDir = await generateWithWpCreateBlock(targetDir, answers);
            break;
        }

        // Initialize Git repository if requested
        if (answers.initGit) {
          const { execa } = await import("execa");
          try {
            await execa("git", ["init"], { cwd: pluginDir });
            await execa("git", ["add", "."], { cwd: pluginDir });
            await execa(
              "git",
              ["commit", "-m", "Initial commit from wp-plugin-env-gen"],
              { cwd: pluginDir }
            );
            spinner.succeed(`Git repository initialized in ${pluginDir}`);
          } catch (error) {
            spinner.warn(
              "Could not initialize Git repository. Please make sure Git is installed."
            );
          }
        }

        spinner.succeed(
          `Plugin ${chalk.green(answers.pluginName)} created successfully!`
        );
        console.log(`\nNext steps:`);
        console.log(`  ${chalk.cyan("cd")} ${answers.pluginSlug}`);
        if (answers.pluginType !== "classic") {
          console.log(`  ${chalk.cyan("npm")} install`);
          console.log(`  ${chalk.cyan("npm")} run start`);
        }
        if (answers.includeWpEnv) {
          console.log(`  ${chalk.cyan("wp-env")} start`);
        }
      } catch (error) {
        spinner.fail(`Error generating plugin: ${error.message}`);
        console.error(error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Parse command line arguments
program.parse(process.argv);

// If no command is provided, show help
if (!process.argv.slice(2).length) {
  program.help();
}
