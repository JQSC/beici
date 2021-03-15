const vscode = require('vscode');

const TreeDataProvider = require('./src/TreeDataProvider/ViewsContainers');

function activate(context) {

    const { registerTreeDataProvider } = vscode.window;
    const { registerCommand } = vscode.commands;

    const ViewsContainers = new TreeDataProvider(context);

    //注册菜单展开时事件
    registerTreeDataProvider('beici-curreny', ViewsContainers.currentTreeData);
    registerTreeDataProvider('beici-review', ViewsContainers.reviewTreeData);

    //注册菜单中项目的点击事件
    registerCommand('beici-curreny.refresh', (treeItem) =>
        ViewsContainers.refresh(treeItem)
    )

    registerCommand('beici-curreny.complete', (treeItem) =>
        ViewsContainers.complete(treeItem)
    )

    registerCommand('beici-review.back', (treeItem) =>
        ViewsContainers.back(treeItem)
    )




}

// 卸载执行
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
