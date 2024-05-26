#!/usr/bin/env node

import * as fs from "fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { VectorStoreDocument } from "@captn/utils/types";
import chalk from "chalk";
import { execa } from "execa";
import { globby } from "globby";
import matter from "gray-matter";
import humanizeString from "humanize-string";
import YAML from "js-yaml";
import meow from "meow";
import { Except } from "type-fest";
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
const id = v4();

console.log(chalk.blue(`Setting up your new Captain app using ${template}`));

export function exitWithRepositoryError() {
	console.error(
		`Could not locate the repository for ${chalk.red(
			`"${template}"`
		)}. Please check that the repository exists and try again.`
	);
	process.exit(1);
}

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

export function createCaptainMd(data: Except<VectorStoreDocument["payload"], "content">) {
	return `---
${YAML.dump(data)}
---

open the app named ${data.label}
`;
}

export function createCaptainReadme(name: string) {
	return `# ${name}

This project is developed using [Captain](https://github.com/blib-la/captain), and was initialized with the [\`create-captain-app\`](https://github.com/blib-la/captn/tree/main/packages/create-captain-app) tool.

## Getting Started

Begin by launching the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
\`\`\`

Navigate to [http://localhost:3000](http://localhost:3000) in your web browser to view the application.

Modify the source files as needed; the application will automatically update to reflect changes. To ensure full functionality with Captain's core features, build and install the application within Captain after changes.

## Learn More

For additional information on Captain and how to utilize it effectively, consider the following resources:

- [Captain Features and API](https://github.com/blib-la/captain) - Detailed documentation on the capabilities and usage of Captain.
- [Captn SDK](https://github.com/blib-la/captn) - Access the SDK needed for extending Captain's functionalities.

Please note that this project is currently in ALPHA phase, and ongoing developments and enhancements are expected.

---

This version maintains a concise structure while adjusting the flow to better suit the alpha stage of the project, emphasizing the process of starting development, the necessity of building within Captain for full integration, and pointing to essential resources.
`;
}

const newFolder = path.join(CWD, name).replaceAll("\\", "/");

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

	const [captainMD] = await globby([newFolder], {
		expandDirectories: {
			files: ["captain.md"],
		},
	});
	let captainMDContent = "---\ntype: app\n---\n\n";
	try {
		captainMDContent = await readFile(captainMD, "utf8");
	} catch (error) {
		console.log(error);
	}

	const { data } = matter(captainMDContent);

	await writeFile(
		captainMD,
		createCaptainMd({
			language: "en",
			...data,
			id,
			creatorID: username,
			label: humanizeString(name),
			type: "app",
		})
	);
	await writeFile(path.join(newFolder, "README.md"), createCaptainReadme(humanizeString(name)));
	const packagePath = path.join(newFolder, "package.json");
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
