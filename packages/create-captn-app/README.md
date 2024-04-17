# Create Captain App

`create-captain-app` is a command-line utility that simplifies the creation of Captain-based Electron applications by providing a straightforward way to generate projects from a range of customizable templates. Captain is an Electron app framework designed for creating applications that can be exported as static websites, supporting a variety of web technologies.

## Features

- **Versatility**: Supports multiple front-end frameworks including Next.js, Svelte, Vue.js, and basic HTML + CSS.
- **Simplicity**: Easily generate new projects with a single command, similar to `create-react-app` or `create-next-app`.
- **Flexibility**: Create static exportable Electron apps using any web technology that supports static site generation.
- **Template-based**: Start with a template that best fits your project needs, modifying it as required.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (20 or later).
- **Git**: Git is required.

## Installation

To use `create-captain-app`, run the following command:

```bash
npx create-captain-app [app-name] [--template <template-url> | -t <template-url>]
```

## Usage

Create a new Captain application by specifying the name of your new app and optionally, the template URL:

```bash
npx create-captain-app my-captain-app
npx create-captain-app my-next-app --template https://github.com/blib-la/captain-next-app-example
```
### Default App Name

If you do not specify an application name, create-captain-app will automatically use "my-captain-app" as the default project name.

### Default Template

If no template is specified, `create-captain-app` will use the default Next.js template configured for Captain.

### Selecting a Template

You can specify any GitHub repository URL that contains a Captain-compatible template:

```bash
npx create-captain-app my-vue-app --template https://github.com/some-user/some-captain-vue-template
```

## Custom Templates

To create a custom template, ensure your project is compatible with Captain and can be exported as a static site. For guidance, refer to the [default starter app](https://github.com/blib-la/captain-starter-app).
