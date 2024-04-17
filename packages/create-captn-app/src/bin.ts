#!/usr/bin/env node

import * as fs from "fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import chalk from "chalk";
import { execa } from "execa";
import meow from "meow";

import { downloadAndExtractRepo, getRepoInfo, hasRepo } from "./template.js";

const { input, flags } = meow(
	`
	Usage
	  $ npx create captain-app <input>

	Options
	  --template, -t  Use a template repository

	Examples
	  $ npx create captain-app
	  $ npx create captain-app my-chatbot
	  $ npx create captain-app my-chatbot -t https://github.com/some-user/some-captain-app
`,
	{
		importMeta: import.meta,
		flags: {
			template: {
				type: "string",
				shortFlag: "t",
				default: "https://github.com/blib-la/captain-starter-app",
			},
		},
	}
);

// Npx create
const [name = "my-captain-app"] = input;
const { template } = flags;
console.log(chalk.green("Welcome to the Captain App Creator!"));

const CWD = process.cwd();

console.log(chalk.blue(`Setting up your new Captain app using ${template}`));

export function exitWithRepositoryError() {
	console.error(
		`Could not locate the repository for ${chalk.red(
			`"${template}"`
		)}. Please check that the repository exists and try again.`
	);
	process.exit(1);
}

const newFolder = path.join(CWD, name);

try {
	if (fs.existsSync(newFolder)) {
		console.error(
			`Folder already exists ${chalk.red(
				`"${newFolder}"`
			)}. Please delete it or choose a different name.`
		);
		process.exit(1);
	}

	await mkdir(newFolder, { recursive: true });

	const repoInfo = await getRepoInfo(new URL(template));
	if (!repoInfo) {
		exitWithRepositoryError();
	}

	const found = hasRepo(repoInfo);
	if (!found) {
		exitWithRepositoryError();
	}

	await downloadAndExtractRepo(newFolder, repoInfo);
	const gitFolder = path.join(newFolder, ".git");
	if (fs.existsSync(gitFolder)) {
		await rm(gitFolder, { recursive: true });
	}

	await execa("npm", ["install"], { cwd: newFolder, stdout: "inherit" });
	await execa("git", ["init"], { cwd: newFolder, stdout: "inherit" });

	console.log(chalk.green("Your new Captain app is ready!"));
} catch (error) {
	console.error(error);
	process.exit(1);
}
