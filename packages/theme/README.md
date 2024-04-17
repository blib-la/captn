# @captn/theme

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

The `@captn/theme` package is a core component of the Captain framework, designed to manage and provide consistent theming across applications. This package defines a standardized set of color palettes and utility functions to manipulate these colors for various theming purposes.

## Features

- **Comprehensive Color Palette**: Includes a wide range of predefined color shades for primary colors such as grey, blue, teal, and more, allowing for versatile theming options.
- **Dynamic Theme Construction**: Utilizes utility functions from `@captn/utils` to mix colors and dynamically create theme variations.
- **Type Support**: Strongly typed with TypeScript for better development experience and error checking.

## Installation

Install `@captn/theme` using npm:

```shell
npm install @captn/theme
```

Or using Yarn:

```shell
yarn add @captn/theme
```

## Usage

### Importing Color Palette

You can easily import the color palette and use it within your application to maintain consistency:

```ts
import { palette } from '@captn/theme/palette';

console.log(palette.blue[500]); // Outputs: '#296BFA'
```

### Using Mix Colors Function

To create custom theme shades or blend between colors dynamically:

```ts
import { background } from '@captn/theme/palette';

console.log(background.light.body); // Outputs a mixed color between white and grey[50]
console.log(background.dark.body);  // Outputs a mixed color between black and grey[900]
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the tags on this repository.

## License

This project is licensed under the AGPL 3.0 License - see the [LICENSE](LICENSE) file for details.
