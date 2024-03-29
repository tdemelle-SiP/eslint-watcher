#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const baseDir = process.cwd(); // Path to the user's project directory



// Function to create or update .eslintrc.cjs
function createOrUpdateESLintConfig() {
  console.log('Creating or updating .eslintrc.cjs...');

  const oldConfigPath = path.join(baseDir, '.eslintrc.js');
  const newConfigPath = path.join(baseDir, '.eslintrc.cjs');

  // If an old .eslintrc.js file exists, rename it to .eslintrc.cjs
  if (fs.existsSync(oldConfigPath)) {
    fs.renameSync(oldConfigPath, newConfigPath);
    console.log('Renamed .eslintrc.js to .eslintrc.cjs.');
  }

  const eslintConfigContent = `
  module.exports = {
    "env": {
      "browser": true,
      "es2021": true,
      "node": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    "parserOptions": {
      "ecmaVersion": 2021,
      "sourceType": "module",
      "ecmaFeatures": {
        "jsx": true
      }
    },
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "rules": {
      // Add your custom rules here
    }
  };
`;

  try {
    fs.writeFileSync(newConfigPath, eslintConfigContent);
    console.log('.eslintrc.cjs has been created or updated.');
  } catch (error) {
    console.error('Error creating or updating .eslintrc.cjs:', error);
  }
  console.log('.eslintrc.cjs has been created or updated.');
}

// Function to create .vscode/tasks.json if it doesn't exist
function createVSCodeTasks() {
  console.log('Creating .vscode/tasks.json...');
  const vscodeDirectoryPath = path.join(baseDir, '.vscode');
  const tasksFilePath = path.join(vscodeDirectoryPath, 'tasks.json');

  if (!fs.existsSync(vscodeDirectoryPath)) {
    fs.mkdirSync(vscodeDirectoryPath);
    console.log('.vscode directory created.');
  }

  const tasksConfig = {
    version: '2.0.0',
    tasks: [
      {
        label: 'Start ESLint Watcher',
        type: 'shell',
        command: 'node node_modules/eslint-watcher/scripts/eslint-watcher.js',
        isBackground: true,
        problemMatcher: {
          owner: 'custom',
          pattern: {
            regexp: '.*',
            file: 1,
            location: 2,
            message: 3
          },
          background: {
            activeOnStart: true,
            beginsPattern: '.*',
            endsPattern: '.*'
          }
        },
        presentation: {
          reveal: 'always',
          panel: 'new',
          group: 'eslint-watcher'
        },
        runOptions: {
          runOn: 'folderOpen'
        }
      }
    ]
  };

  fs.writeFileSync(tasksFilePath, JSON.stringify(tasksConfig, null, 2));
  console.log('VSCode tasks.json has been created.');
}

// Function to check if ESLint is locally installed in the project
function isESLintLocallyInstalled() {
  console.log('Checking if ESLint is locally installed...');
  const localESLintPath = path.join(baseDir, 'node_modules', 'eslint');
  if (fs.existsSync(localESLintPath)) {
    console.log('ESLint is already installed locally.');
    return true;
  } else {
    console.log('ESLint is not installed locally. Installing now...');
    return false;
  }
}

// Function to install ESLint
function installESLint() {
  try {
    console.log('Installing ESLint...');
    execSync('npm install eslint', { stdio: 'inherit' });
    console.log('ESLint installation complete.');
  } catch (error) {
    console.error('Error installing ESLint:', error);
  }
}

// Main function to run all setup steps
function setup() {
  console.log('Starting setup...');
  if (!isESLintLocallyInstalled()) {
    installESLint();
  }
  createOrUpdateESLintConfig();
  createVSCodeTasks();
  console.log(`
  +--------------------------------------------------------+
  |                                                        |
  |   Setup complete. Please restart Virtual Studio Code   |
  |       and the watcher should start automagically.      |
  |                                                        |
  +--------------------------------------------------------+
  `);}

setup();

console.log('Setup script has finished.');