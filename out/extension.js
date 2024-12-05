"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    // 注册活动栏视图
    vscode.window.registerTreeDataProvider('excludedFilesView', new ExcludedFilesProvider(context));
    console.log('Congratulations, your extension "toggle-excluded-files" is now active!');
    // 注册命令：切换文件隐藏状态
    context.subscriptions.push(vscode.commands.registerCommand('extension.toggleFileState', async (fileKey) => {
        const config = vscode.workspace.getConfiguration();
        const currentSetting = config.get('files.exclude') || {};
        // 切换当前文件的隐藏状态
        currentSetting[fileKey] = !currentSetting[fileKey];
        // 更新配置
        await config.update('files.exclude', currentSetting, vscode.ConfigurationTarget.Workspace);
    }));
}
class ExcludedFilesProvider {
    context;
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor(context) {
        this.context = context;
        vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration('files.exclude')) {
                this.refresh();
            }
        });
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    async getChildren() {
        const config = vscode.workspace.getConfiguration();
        const currentSetting = config.get('files.exclude') || {};
        return Object.keys(currentSetting).map((fileKey) => new FileItem(fileKey, currentSetting[fileKey], vscode.TreeItemCollapsibleState.None, {
            command: 'extension.toggleFileState',
            title: '',
            arguments: [fileKey],
        }));
    }
}
class FileItem extends vscode.TreeItem {
    label;
    isExcluded;
    collapsibleState;
    command;
    constructor(label, isExcluded, collapsibleState, command) {
        super(label, collapsibleState);
        this.label = label;
        this.isExcluded = isExcluded;
        this.collapsibleState = collapsibleState;
        this.command = command;
        // 动态添加图标
        this.iconPath = new vscode.ThemeIcon(this.isExcluded ? 'check' : 'circle-outline');
        this.contextValue = this.isExcluded ? 'excluded' : 'included';
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map