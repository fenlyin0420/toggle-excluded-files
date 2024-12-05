import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 创建一个 Status Bar 按钮
    const toggleButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    toggleButton.text = "$(eye)";  // 使用 eye 图标
    toggleButton.tooltip = "Click to hide/show excluded files";
    toggleButton.command = "extension.toggleExcludedFiles";
    toggleButton.show();

    // 注册命令
    const disposable = vscode.commands.registerCommand('extension.toggleExcludedFiles', async () => {
        const config = vscode.workspace.getConfiguration();
        const currentSetting = config.get<Record<string, boolean>>('files.exclude') || {};
        let newSetting = {
            ...currentSetting,
        };
		for (let key in newSetting) {
			newSetting[key] = !newSetting[key];
		}
        await config.update('files.exclude', newSetting, vscode.ConfigurationTarget.Workspace);
        vscode.window.showInformationMessage(`Toggled file exclusion setting.`);
    });

    context.subscriptions.push(disposable, toggleButton);
}

export function deactivate() {}
