const vscode = require('vscode');
const TreeDataProvider = require('./src/TreeDataProvider/ViewsContainers');
const { CURRENT_VIEW, REVIEW, COMPLETED_VIEW, FAVORITE_VIEW } = require('./src/constants/viewConstants');

function activate(context) {

    const { registerTreeDataProvider } = vscode.window;
    const { registerCommand } = vscode.commands;

    const ViewsContainers = new TreeDataProvider(context);

    //注册菜单展开时事件
    registerTreeDataProvider('beici-curreny', ViewsContainers.current);
    registerTreeDataProvider('beici-review', ViewsContainers.review);
    registerTreeDataProvider('beici-completed', ViewsContainers.completed);
    registerTreeDataProvider('beici-favorite', ViewsContainers.favorite);

    //标记加入已学列表
    registerCommand('beici.markReview', (treeItem) =>
        ViewsContainers.addMark(treeItem, REVIEW)
    )

    //标记加入已斩列表
    registerCommand('beici.markCompleted', (treeItem) =>
        ViewsContainers.addMark(treeItem, COMPLETED_VIEW)
    )

    //标记加入收藏
    registerCommand('beici.markFavorite', (treeItem) =>
        ViewsContainers.back(treeItem, FAVORITE_VIEW)
    )




}

// 卸载执行
function deactivate() { }

module.exports = {
    activate,
    deactivate
}
