# Create Captain App

`create-captain-app` is a command-line utility designed to streamline the process of creating applications using Captain, an Electron app framework. It enables users to generate projects from a variety of customizable templates that can be exported as static websites, supporting a wide range of web technologies.

## Features

- **Versatility**: Supports multiple front-end frameworks, including Next.js, Svelte, Vue.js, and basic HTML + CSS.
- **Simplicity**: Allows easy project generation with a single command, akin to `create-react-app` or `create-next-app`.
- **Template-based**: Offers a selection of templates to kick-start your project, each customizable to meet specific needs.

## Prerequisites

- **Node.js**: Version 20 or later must be installed on your system.
- **Git**: Required for version control.

## Installation

Install `create-captain-app` using the following command:

```bash
npx create-captain-app [app-name] [--template <template-url> | -t <template-url>]
```

## Usage

To create a new Captain application, specify the name of your app and optionally, a template URL:

```bash
npx create-captain-app my-captain-app
npx create-captain-app my-next-app --template https://github.com/blib-la/captain-next-app-example
```

### Default Settings

- **App Name**: If not specified, `create-captain-app` defaults to using "my-captain-app" as the project name.
- **Template**: If no template URL is provided, the default Next.js template for Captain will be used.

### Template Selection

Specify any GitHub repository URL hosting a Captain-compatible template to use:

```bash
npx create-captain-app my-vue-app --template https://github.com/some-user/some-captain-vue-template
```

## Creating Custom Templates

To develop a custom template, ensure your project aligns with Captain requirements and can be exported as a static site. Consult the [default starter app](https://github.com/blib-la/captain-starter-app) for setup guidance.

## Configuring Your Project

After project setup, adjust the metadata in the `captain.md` file to match your project specifics. This file uses YAML frontmatter for configuration:

- **Preserve the Default ID**: The initial `id` matches the `packageJson.name` and is uniquely set by our CLI. We recommend keeping the default settings to avoid conflicts.

## Building Your App

Depending on your chosen template, begin by modifying the source files. For example, our Next.js starter app features a simple random cat generator powered by Stable Diffusion XL (SDXL).

