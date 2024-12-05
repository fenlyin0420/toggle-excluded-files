import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // 注册活动栏视图
    vscode.window.registerTreeDataProvider(
        'excludedFilesView',
        new ExcludedFilesProvider(context)
    );
    console.log('Congratulations, your extension "toggle-excluded-files" is now active!');

    // 注册命令：切换文件隐藏状态
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.toggleFileState', async (fileKey: string) => {
            const config = vscode.workspace.getConfiguration();
            const currentSetting = config.get<Record<string, boolean>>('files.exclude') || {};

            // 切换当前文件的隐藏状态
            currentSetting[fileKey] = !currentSetting[fileKey];

            // 更新配置
            await config.update('files.exclude', currentSetting, vscode.ConfigurationTarget.Workspace);
        })
    );
}

class ExcludedFilesProvider implements vscode.TreeDataProvider<FileItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<FileItem | undefined | void> = new vscode.EventEmitter<FileItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<FileItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private context: vscode.ExtensionContext) {
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('files.exclude')) {
                this.refresh();
            }
        });
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: FileItem): vscode.TreeItem {
        return element;
    }

    async getChildren(): Promise<FileItem[]> {
        const config = vscode.workspace.getConfiguration();
        const currentSetting = config.get<Record<string, boolean>>('files.exclude') || {};

        return Object.keys(currentSetting).map(
            (fileKey) =>
                new FileItem(
                    fileKey,
                    currentSetting[fileKey],
                    vscode.TreeItemCollapsibleState.None,
                    {
                        command: 'extension.toggleFileState',
                        title: '',
                        arguments: [fileKey],
                    }
                )
        );
    }
}

class FileItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private readonly isExcluded: boolean,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly command?: vscode.Command
    ) {
        super(label, collapsibleState);

        // 动态添加图标
        this.iconPath = new vscode.ThemeIcon(this.isExcluded ? 'check' : 'circle-outline');
        this.contextValue = this.isExcluded ? 'excluded' : 'included';
    }
}

export function deactivate() {}
