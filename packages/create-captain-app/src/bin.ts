#!/usr/bin/env node

import * as fs from "fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import chalk from "chalk";
import { execa } from "execa";
import meow from "meow";
import { v4 } from "uuid";

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

const id = v4();

export async function currentGitUserName() {
	try {
		const { stdout } = await execa("git", ["config", "user.name"]);
		return stdout;
	} catch (error) {
		console.error("Error fetching Git user name:", error.message);
		return null;
	}
}

export async function currentGitUserEmail() {
	try {
		const { stdout } = await execa("git", ["config", "user.email"]);
		return stdout;
	} catch (error) {
		console.error("Error fetching Git user name:", error.message);
		return null;
	}
}

export function createCaptainMd(username: string) {
	return `---
id: ${id}
label: My Captain App
language: en
type: app
creatorID: ${username}
icon: Image
iconColor: "#DB2777"
parameters:
    width: 800
    height: 1024
    minWidth: 800
    minHeight: 1024
---

open the app named My Captain App
`;
}

const newFolder = path.join(CWD, name);

try {
	const username = await currentGitUserName();
	const userEmail = await currentGitUserEmail();
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

	const packagePath = path.join(newFolder, "package.json");
	await writeFile(path.join(newFolder, "captain.md"), createCaptainMd(username));
	const package_ = await readFile(packagePath, "utf-8");
	const packageJson = JSON.parse(package_);
	packageJson.name = id;
	packageJson.version = "1.0.0";
	packageJson.author = { name: username };
	if (userEmail) {
		packageJson.author.email = userEmail;
	}

	await writeFile(packagePath, JSON.stringify(packageJson, null, 2));

	await execa("npm", ["install"], { cwd: newFolder, stdout: "inherit" });
	await execa("git", ["init"], { cwd: newFolder, stdout: "inherit" });

	console.log(chalk.green("Your new Captain app is ready!"));
} catch (error) {
	console.error(error);
	process.exit(1);
}
