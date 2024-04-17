# @captn/react

[![Discord](https://img.shields.io/discord/1091306623819059300?color=7289da&label=Discord&logo=discord&logoColor=fff&style=for-the-badge)](https://discord.com/invite/m3TBB9XEkb)

The `@captn/react` package includes a collection of React hooks that integrate with the Captain framework, simplifying common tasks such as handling actions, managing downloads, and interacting with a vector store directly from React components.

## Features

- **`useCaptainAction`**: Automates the execution of actions like focus, click, and type on elements based on URL parameters.
- **`useObject`**: Provides debounced object values to prevent excessive re-renders and ensure performance optimization.
- **`useRequiredDownloads`**: Manages and tracks the status of required file downloads within an application.
- **`useSDK`**: Facilitates inter-process communication (IPC) with an SDK or server backend from React components.
- **`useVectorStore`**: Enables querying and interacting with a vector store for searching and retrieving data.

## Installation

To add the `@captn/react` package to your project, run the following command:

```bash
npm install @captn/react
```

Or with Yarn:

```bash
yarn add @captn/react
```

## Usage

### useCaptainAction

This hook listens for changes in the URL's `action` query parameter and executes commands on elements identified by their `data-captainid`.

```tsx
import { useCaptainAction } from '@captn/react';

// Component that uses the hook
function MyComponent() {
  useCaptainAction('click:submit-button'); // Automatically clicks the button with `data-captainid="submit-button"`
}
```

### useObject

Debounces an object value to prevent excessive re-renders, useful for optimizing performance in components that rely on rapidly changing state.

```tsx
import { useObject } from '@captn/react';

function MyComponent({ filterOptions }) {
  const debouncedFilterOptions = useObject(filterOptions);

  // Use debouncedFilterOptions for further processing or API calls
}
```

### useRequiredDownloads

Manages downloads specified by the application, tracking progress and completion.

```tsx
import { useRequiredDownloads } from '@captn/react';

function DownloadManager({ downloads }) {
  const {
    isCompleted,
    isDownloading,
    downloadCount,
    percent,
    download,
  } = useRequiredDownloads(downloads);

  // Trigger downloads
  useEffect(() => {
    if (!isCompleted) {
      download();
    }
  }, [isCompleted, download]);

  return (
    <div>
      {isDownloading && <p>Downloading: {percent}% completed</p>}
      {isCompleted && <p>All downloads completed!</p>}
    </div>
  );
}
```

### useSDK

Enables components to communicate with an SDK or server using IPC mechanisms, handling both messages and file operations.

```tsx
import { useSDK } from '@captn/react';

function App() {
  const { send, readFile, writeFile } = useSDK("myAppId", {
    onMessage: message => console.log("Received message:", message),
    onError: error => console.error("Error:", error),
  });

  const handleFileOperations = async () => {
    const filePath = await writeFile('test.txt', 'Hello SDK!', { encoding: 'utf8' });
    const content = await readFile(filePath, 'utf8');
    console.log('File content:', content);
  };

  return (
    <div>
      <button onClick={() => send({ action: "greet", payload: "Hello, SDK!" })}>
        Send Message
      </button>
      <button onClick={handleFileOperations}>
        Test File Operations
      </button>
    </div>
  );
}
```

### useVectorStore

Provides real-time searching capabilities within a vector store, handling query debouncing and state management.

```tsx
import { useVectorStore } from '@captn/react';

function SearchComponent({ query }) {
  const { data, error } = useVectorStore(query, { score_threshold: 0.5 });

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.content}</li>
      ))}
    </ul>
  );
}
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the tags on this repository.

## License

This project is licensed under the AGPL 3.0 License - see the [LICENSE](LICENSE) file for details.
