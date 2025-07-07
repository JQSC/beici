# Beici VS Code Extension - API Documentation

## Overview

Beici is a VS Code extension that helps users learn English vocabulary in a gamified way. The extension mimics VS Code's file explorer interface but displays CET-4 vocabulary words instead, allowing users to study English vocabulary while coding.

## Architecture

The extension follows a modular architecture with the following key components:

- **Extension Entry Point**: `extension.js` - Main activation and command registration
- **Tree Data Providers**: `src/TreeDataProvider/` - Handle word list display and management
- **Storage Management**: `src/TreeDataProvider/storage.js` - Persist user progress
- **Constants**: `src/constants/` - Configuration and view constants
- **Assets**: `src/assets/` - Vocabulary data

## Core APIs and Functions

### 1. Extension Entry Point (`extension.js`)

#### `activate(context)`
**Purpose**: Main activation function called when the extension is activated.

**Parameters**:
- `context` (vscode.ExtensionContext): The extension context provided by VS Code

**Usage**:
```javascript
function activate(context) {
    const { registerTreeDataProvider } = vscode.window;
    const { registerCommand } = vscode.commands;
    
    const ViewsContainers = new TreeDataProvider(context);
    
    // Register tree data providers
    registerTreeDataProvider('beici-curreny', ViewsContainers.current);
    registerTreeDataProvider('beici-review', ViewsContainers.review);
    registerTreeDataProvider('beici-completed', ViewsContainers.completed);
    registerTreeDataProvider('beici-favorite', ViewsContainers.favorite);
    
    // Register commands
    registerCommand('beici.markReview', (treeItem) => {
        treeItem[REVIEW] = true;
        return ViewsContainers.addMark(treeItem, REVIEW);
    });
}
```

#### `deactivate()`
**Purpose**: Cleanup function called when the extension is deactivated.

**Usage**:
```javascript
function deactivate() {
    // Cleanup resources if needed
}
```

### 2. ViewsContainers Class (`src/TreeDataProvider/ViewsContainers.js`)

#### Constructor
**Purpose**: Initialize the view container with different word list views.

**Parameters**:
- `context` (vscode.ExtensionContext): Extension context for storage access

**Usage**:
```javascript
const ViewsContainers = new TreeDataProvider(context);
```

#### `addMark(item, markType)`
**Purpose**: Add a mark/category to a word and update storage.

**Parameters**:
- `item` (Object): Word item to mark
- `markType` (String): Type of mark (REVIEW, COMPLETED_VIEW, FAVORITE_VIEW)

**Usage**:
```javascript
// Mark a word for review
ViewsContainers.addMark(wordItem, REVIEW);

// Mark a word as completed
ViewsContainers.addMark(wordItem, COMPLETED_VIEW);

// Mark a word as favorite
ViewsContainers.addMark(wordItem, FAVORITE_VIEW);
```

**Internal Implementation**:
- Updates the word item with timestamp
- Persists changes to storage
- Refreshes all views

### 3. View Class (`src/TreeDataProvider/Views.js`)

#### Constructor
**Purpose**: Create a filtered view of words based on options.

**Parameters**:
- `treeData` (Array): Array of word objects
- `options` (Object): View configuration options
  - `type` (String): View type identifier
  - `filter` (String|Array): Filter criteria
  - `group` (String): Grouping criteria (optional)

**Usage**:
```javascript
// Create a current words view (unlearned words)
const currentView = new View(treeData, {
    type: CURRENT_VIEW,
    filter: [REVIEW, COMPLETED_VIEW, FAVORITE_VIEW]
});

// Create a review view with date grouping
const reviewView = new View(treeData, {
    type: REVIEW,
    filter: REVIEW,
    group: 'date'
});
```

#### `getTreeItem(element)`
**Purpose**: Get the tree item representation for display.

**Parameters**:
- `element` (Object): Word or group object

**Returns**: `vscode.TreeItem` - Tree item for display

**Usage**:
```javascript
const treeItem = view.getTreeItem(wordElement);
```

#### `getChildren(element)`
**Purpose**: Get child elements for tree view.

**Parameters**:
- `element` (Object): Parent element (null for root)

**Returns**: `Array` - Array of child elements

**Usage**:
```javascript
const children = view.getChildren(); // Get root elements
const groupChildren = view.getChildren(groupElement); // Get group children
```

#### `refresh(data)`
**Purpose**: Refresh the view with new data.

**Parameters**:
- `data` (Array): Updated word data

**Usage**:
```javascript
view.refresh(updatedWordData);
```

### 4. Storage API (`src/TreeDataProvider/storage.js`)

#### `get(context)`
**Purpose**: Retrieve word data from storage.

**Parameters**:
- `context` (vscode.ExtensionContext): Extension context

**Returns**: `Array` - Array of word objects

**Usage**:
```javascript
const wordData = get(context);
```

#### `update(context, treeData)`
**Purpose**: Save word data to storage.

**Parameters**:
- `context` (vscode.ExtensionContext): Extension context
- `treeData` (Array): Word data to save

**Usage**:
```javascript
update(context, modifiedWordData);
```

#### `readFile(path)`
**Purpose**: Read and parse JSON file.

**Parameters**:
- `path` (String): File path

**Returns**: `Array|Object` - Parsed JSON data or default CET4_T data

**Usage**:
```javascript
const data = readFile('/path/to/file.json');
```

### 5. Tree Item Classes

#### `WorldItem` Class
**Purpose**: Represents a single word in the tree view.

**Properties**:
- `label` (String): Word text
- `description` (String): Word translation
- `tooltip` (String): Detailed word information
- `iconPath` (String): Path to icon file
- `contextValue` (String): Context for menu actions

**Usage**:
```javascript
const wordItem = new WorldItem(wordData, viewType);
```

#### `WordGroup` Class
**Purpose**: Represents a group of words (e.g., by date).

**Properties**:
- `label` (String): Group name
- `description` (String): Group description
- `collapsibleState` (vscode.TreeItemCollapsibleState): Expansion state

**Usage**:
```javascript
const groupItem = new WordGroup(groupData);
```

## Data Models

### Word Object Structure
```javascript
{
  "name": "example",           // Word text
  "trans": ["例子", "实例"],    // Chinese translations
  "usphone": "ɪg'zæmpl",      // US pronunciation
  "ukphone": "ɪg'zɑːmpl",     // UK pronunciation
  "date": 1234567890,         // Timestamp when marked
  "REVIEW": true,             // Review flag
  "COMPLETED_VIEW": false,    // Completed flag
  "FAVORITE_VIEW": false      // Favorite flag
}
```

### View Configuration Options
```javascript
{
  "type": "CURRENT_VIEW",              // View type
  "filter": ["REVIEW", "COMPLETED"],   // Filter criteria
  "group": "date"                      // Grouping field
}
```

## Command APIs

### Available Commands

#### `beici.markReview`
**Purpose**: Mark a word for review.
**Context**: Available on current word list items.
**Usage**: Right-click on word → "复习"

#### `beici.markFavorite`
**Purpose**: Add word to favorites.
**Context**: Available on current and review word items.
**Usage**: Right-click on word → "收藏"

#### `beici.curreny.markCompleted`
**Purpose**: Mark word as completed from current list.
**Context**: Available on current word list items.
**Usage**: Right-click on word → "斩"

#### `beici.review.markCompleted`
**Purpose**: Mark word as completed from review list.
**Context**: Available on review word list items.
**Usage**: Right-click on word → "斩"

#### `beici.completed.markCancel`
**Purpose**: Remove word from completed list.
**Context**: Available on completed word list items.
**Usage**: Right-click on word → "取消"

#### `beici.favorite.markCancel`
**Purpose**: Remove word from favorites.
**Context**: Available on favorite word list items.
**Usage**: Right-click on word → "取消"

#### `beici.sort`
**Purpose**: Sort review list by time (descending).
**Context**: Available in review view title.
**Usage**: Click sort button in review view

## Usage Examples

### 1. Basic Word Learning Workflow

```javascript
// 1. User sees word in current list
// 2. User marks word for review
const wordItem = getCurrentWordItem();
executeCommand('beici.markReview', wordItem);

// 3. Word moves to review list
// 4. User studies and marks as completed
executeCommand('beici.review.markCompleted', wordItem);

// 5. Word moves to completed list
```

### 2. Programmatic Word Management

```javascript
// Get current word data
const context = getExtensionContext();
const wordData = get(context);

// Filter words by status
const reviewWords = wordData.filter(word => word.REVIEW);
const completedWords = wordData.filter(word => word.COMPLETED_VIEW);

// Update word status
const wordToUpdate = wordData.find(word => word.name === 'example');
wordToUpdate.FAVORITE_VIEW = true;
wordToUpdate.date = new Date().getTime();

// Save changes
update(context, wordData);
```

### 3. Custom View Creation

```javascript
// Create a custom view for difficult words
const difficultWords = new View(wordData, {
    type: 'DIFFICULT',
    filter: (word) => word.reviewCount > 3,
    group: 'difficulty'
});

// Register the view
vscode.window.registerTreeDataProvider('beici-difficult', difficultWords);
```

## Development Guide

### Setting Up Development Environment

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build and Test**:
   ```bash
   npm run lint
   npm run pretest
   npm run test
   ```

3. **Package Extension**:
   ```bash
   npm run publish
   ```

### Adding New Features

#### Adding a New Word List View

1. **Define Constants**:
   ```javascript
   // src/constants/viewConstants.js
   const NEW_VIEW = 'NEW_VIEW';
   ```

2. **Create View Instance**:
   ```javascript
   // src/TreeDataProvider/ViewsContainers.js
   this.newView = new View(this.treeData, {
       type: NEW_VIEW,
       filter: NEW_VIEW
   });
   ```

3. **Register View**:
   ```javascript
   // extension.js
   registerTreeDataProvider('beici-new-view', ViewsContainers.newView);
   ```

4. **Update package.json**:
   ```json
   {
     "contributes": {
       "views": {
         "beici-explorer": [{
           "id": "beici-new-view",
           "name": "New View"
         }]
       }
     }
   }
   ```

#### Adding New Commands

1. **Define Command**:
   ```javascript
   // extension.js
   registerCommand('beici.newCommand', (treeItem) => {
       // Command implementation
       return ViewsContainers.handleNewCommand(treeItem);
   });
   ```

2. **Add to package.json**:
   ```json
   {
     "contributes": {
       "commands": [{
         "command": "beici.newCommand",
         "title": "New Command"
       }]
     }
   }
   ```

### Testing

#### Unit Tests
```javascript
// test/suite/extension.test.js
suite('Word Management Tests', () => {
    test('Mark word for review', () => {
        const word = { name: 'test', trans: ['测试'] };
        const result = markWordForReview(word);
        assert.strictEqual(result.REVIEW, true);
    });
});
```

#### Integration Tests
```javascript
// Test command execution
const result = await vscode.commands.executeCommand('beici.markReview', wordItem);
assert.ok(result);
```

## Configuration

### Extension Settings

Currently, the extension doesn't expose user settings, but future versions could include:

```json
{
  "beici.autoPlay": {
    "type": "boolean",
    "default": false,
    "description": "Auto-play word pronunciation"
  },
  "beici.dailyGoal": {
    "type": "number",
    "default": 20,
    "description": "Daily learning goal"
  }
}
```

## File Structure

```
beici/
├── extension.js              # Main extension entry point
├── package.json             # Extension manifest
├── src/
│   ├── TreeDataProvider/
│   │   ├── ViewsContainers.js # Main view container
│   │   ├── Views.js          # Individual view logic
│   │   └── storage.js        # Storage management
│   ├── constants/
│   │   └── viewConstants.js  # View constants
│   └── assets/
│       └── CET4_T.json       # Vocabulary data
├── test/
│   ├── runTest.js           # Test runner
│   └── suite/
│       ├── extension.test.js # Extension tests
│       └── index.js         # Test configuration
└── resources/               # Icons and assets
```

## Contributing

### Code Style
- Use ES6+ features
- Follow VS Code extension conventions
- Include JSDoc comments for public APIs
- Maintain consistent naming conventions

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Update documentation
5. Submit pull request

## License and Support

This extension is open source. For support or contributions, please refer to the project repository.