import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

import axios from "axios";
import * as tar from "tar";

/**
 * The following functions are adapted from the Next.js GitHub repository.
 * These functions are used to handle the downloading and extraction of repository examples.
 * Original source can be found at:
 * https://github.com/vercel/next.js/blob/31921728989c75aa53398adcbeb0c23c16bc53a4/packages/create-next-app/helpers/examples.ts
 *
 * Modifications were made to fit the specific use case of this application and its integration with GitHub's API.
 */

export interface RepoInfo {
	username: string;
	name: string;
	branch: string;
	filePath: string;
}

async function downloadTarStream(url: string) {
	const res = await fetch(url);

	if (!res.body) {
		throw new Error(`Failed to download: ${url}`);
	}

	return Readable.fromWeb(res.body as import("stream/web").ReadableStream);
}

export async function isUrlOk(url: string): Promise<boolean> {
	try {
		const response = await fetch(url, { method: "HEAD" });
		return response.status === 200;
	} catch {
		return false;
	}
}

export function hasRepo({ username, name, branch, filePath }: RepoInfo): Promise<boolean> {
	const contentsUrl = `https://api.github.com/repos/${username}/${name}/contents`;
	const packagePath = `${filePath ? `/${filePath}` : ""}/package.json`;

	return isUrlOk(contentsUrl + packagePath + `?ref=${branch}`);
}

export async function downloadAndExtractRepo(
	root: string,
	{ username, name, branch, filePath }: RepoInfo
) {
	await pipeline(
		await downloadTarStream(`https://codeload.github.com/${username}/${name}/tar.gz/${branch}`),
		tar.x({
			cwd: root,
			strip: filePath ? filePath.split("/").length + 1 : 1,
			filter: p =>
				p.startsWith(
					`${name}-${branch.replace(/\//g, "-")}${filePath ? `/${filePath}/` : "/"}`
				),
		})
	);
}

export async function getRepoInfo(url: URL, examplePath?: string): Promise<RepoInfo | undefined> {
	const [, username, name, t, _branch, ...file] = url.pathname.split("/");
	const filePath = examplePath ? examplePath.replace(/^\//, "") : file.join("/");

	if (
		// Support repos whose entire purpose is to be a Next.js example, e.g.
		// https://github.com/:username/:my-cool-nextjs-example-repo-name.
		t === undefined ||
		// Support GitHub URL that ends with a trailing slash, e.g.
		// https://github.com/:username/:my-cool-nextjs-example-repo-name/
		// In this case "t" will be an empty string while the next part "_branch" will be undefined
		(t === "" && _branch === undefined)
	) {
		try {
			const { data } = await axios.get(`https://api.github.com/repos/${username}/${name}`);

			return { username, name, branch: data.default_branch, filePath };
		} catch {
			return;
		}
	}

	// If examplePath is available, the branch name takes the entire path
	const branch = examplePath
		? `${_branch}/${file.join("/")}`.replace(new RegExp(`/${filePath}|/$`), "")
		: _branch;

	if (username && name && branch && t === "tree") {
		return { username, name, branch, filePath };
	}
}
