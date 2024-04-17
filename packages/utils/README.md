# @captn/utils

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

The `@captn/utils` package is a crucial component of the Captain suite of utilities, providing essential helper functions and constants designed to facilitate application development within the Captain ecosystem. This includes handling downloads, string manipulation, color processing, and interacting with HTML elements.

## Features

- **Constants Module**: Defines various constants used throughout the Captain applications, ensuring consistency across different modules.
- **String Utilities**: Includes functions for parsing action strings, constructing URIs with custom protocols, and more.
- **Color Utilities**: Provides functions for determining optimal contrast colors, calculating luminance, converting color formats, and mixing colors.
- **Action Utilities**: Facilitates performing actions on HTML elements based on unique identifiers.
- **Type Definitions**: Utilizes TypeScript for enhanced code quality and developer experience with clear interfaces and utility types.

## Installation

Install `@captn/utils` using npm:

```shell
npm install @captn/utils
```

Or using Yarn:

```shell
yarn add @captn/utils
```

## Usage

### Constants

```ts
import { ERROR_KEY, ACTION_KEY } from '@captn/utils/constants';

console.log(ERROR_KEY);  // Outputs: 'ERROR'
console.log(ACTION_KEY); // Outputs: 'ACTION'
```

### String Utilities

**Get Action Arguments**

```ts
import { getActionArguments } from '@captn/utils/string';

const action = getActionArguments("click:item-id");
console.log(action); // Outputs: { command: 'click', captainId: 'item-id', value: undefined, options: undefined }
```

**Local File URI Construction**

```ts
import { localFile } from '@captn/utils/string';

const fileURI = localFile('/path/to/file', { localProtocol: 'file' });
console.log(fileURI); // Outputs: 'file:///path/to/file'
```

### Color Utilities

**Get Contrast Color**

```ts
import { getContrastColor } from '@captn/utils/color';

const contrastColor = getContrastColor("#ffffff");
console.log(contrastColor); // Outputs: 'black'
```

**Hex to RGB Conversion**

```ts
import { hexToRGB } from '@captn/utils/color';

const rgb = hexToRGB("#ff0000");
console.log(rgb); // Outputs: [255, 0, 0]
```

**Mix Colors**

```ts
import { mixColors } from '@captn/utils/color';

const mixedColor = mixColors("#ffffff", "#000000", 0.5);
console.log(mixedColor); // Outputs: '#808080' (a shade of gray)
```

### Action Utilities

```ts
import { performElementAction } from '@captn/utils/actions';

// Assuming an element with `data-captainid="submit-button"` exists
performElementAction("submit-button", element => element.click());
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the tags on this repository.

## License

This project is licensed under the AGPL 3.0 License - see the [LICENSE](LICENSE) file for details.
