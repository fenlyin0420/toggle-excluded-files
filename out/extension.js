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
    // 创建一个 Status Bar 按钮
    const toggleButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    toggleButton.text = "$(eye) Toggle Excluded Files"; // 使用 eye 图标
    toggleButton.tooltip = "Click to hide/show excluded files";
    toggleButton.command = "extension.toggleExcludedFiles";
    toggleButton.show();
    // 注册命令
    const disposable = vscode.commands.registerCommand('extension.toggleExcludedFiles', async () => {
        const config = vscode.workspace.getConfiguration();
        const currentSetting = config.get('files.exclude') || {};
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
function deactivate() { }
//# sourceMappingURL=extension.js.map