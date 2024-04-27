# @captn/joy

The `@captn/joy` package provides a suite of UI components and utilities that facilitate building attractive and consistent interfaces for applications within the Captain framework. Built on top of the MUI Joy library, it extends and customizes its components to fit the specific needs of Captain applications, ensuring seamless integration and enhanced user experiences.

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

## Features

- **Theme Customization**: Extends MUI Joy's theme capabilities to include custom colors and styles specific to the Captain ecosystem.
- **App Frame**: Provides a structured container for application interfaces, integrating essential UI components such as title bars.
- **Title Bar**: Customizable title bar component with window control actions (minimize, maximize, close).
- **Custom Scrollbars**: Enhances the default scrollbar appearance for a more consistent and appealing look across platforms.

## Installation

To add the `@captn/joy` package to your project, run the following command:

```bash
npm install @captn/joy
```

Or with Yarn:

```bash
yarn add @captn/joy
```

## Usage

### Theme Customization

`@captn/joy` extends MUI Joy's theme with additional colors and utility functions for more dynamic theming capabilities.

```javascript
import { ThemeProvider } from '@captn/joy';

function MyApp() {
  return (
    <ThemeProvider>
      {/* Your component tree */}
    </ThemeProvider>
  );
}
```

### App Frame and Title Bar

Embed your application within an `AppFrame` and include a `TitleBar` to handle window controls seamlessly and display your app title.

```javascript
import { AppFrame, TitleBar } from '@captn/joy';
import Typography from "@mui/joy/Typography"

function MyApplication() {
  return (
      <AppFrame titleBar={<TitleBar><Typography>My Custom App</Typography></TitleBar>}>
      {/* Content of your application */}
    </AppFrame>
  );
}
```

### Custom Scrollbars

Use the `CustomScrollbars` component to apply consistent scrollbars throughout your application.

```javascript
import { CustomScrollbars } from '@captn/joy';

function MyScrollableComponent() {
  return (
    <CustomScrollbars>
      {/* Scrollable content here */}
    </CustomScrollbars>
  );
}
```


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the tags on this repository.

## License

This project is licensed under the AGPL 3.0 License - see the [LICENSE](LICENSE) file for details.
