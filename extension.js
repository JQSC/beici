const vscode = require('vscode');

const NodeDependenciesProvider = require('./src/TreeDataProvider');

function activate(context) {
console.log('context: ', context);

    const { registerTreeDataProvider } = vscode.window;
    const { registerCommand } = vscode.commands;

    

    const nodeDependenciesProvider = new NodeDependenciesProvider(vscode.workspace.rootPath);

    //注册菜单展开时事件
    registerTreeDataProvider('beici-curreny', nodeDependenciesProvider);
    registerTreeDataProvider('beici-review', nodeDependenciesProvider);

    //注册菜单中项目的点击事件
    registerCommand('beici-curreny.worldCount', () =>
        nodeDependenciesProvider.refresh()
    );






}

// 卸载执行
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
