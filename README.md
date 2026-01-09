## AJAZZ Stream Dock Plugin — VSCode Dock

### Install

This plugin is shipped prebuilt in `../release/it.seggiola.vscdock.sdPlugin`.

### macOS install path

- Copy `../release/it.seggiola.vscdock.sdPlugin` to:
  - `~/Library/Application Support/HotSpot/StreamDock/plugins/it.seggiola.vscdock.sdPlugin`
- Restart AJAZZ Stream Dock.

### Windows install path

- Copy `../release/it.seggiola.vscdock.sdPlugin` to:
  - `%APPDATA%\\HotSpot\\StreamDock\\plugins\\it.seggiola.vscdock.sdPlugin`
- Restart AJAZZ Stream Dock.

### Use

- Add the **Execute Command** action to a key.
- Set:
  - **Port** (default `8787`)
  - **VS Code command** (example: `workbench.action.showCommands`)
- Install the VS Code extension VSIX located at:
  - `../vscode-extension/vscode-dock-extension-0.0.2.vsix`
