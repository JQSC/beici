const vscode = require('vscode');
const CET4_T = require('../assets/CET4_T.json')


class View {

    constructor(context) {
        this.context = context;
        this.changeTreeDataEmitter = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.changeTreeDataEmitter.event;
        this.treeData = CET4_T.map((item) => new WorldItem(item));
    }

    //处理每一项元素
    getTreeItem(element) {
        return element
    }

    getChildren(element) {
        if (!element) {
            return this.treeData;
        } else {
            return Promise.resolve([]);
        }
    }

    refresh() {
        this.changeTreeDataEmitter.fire(undefined);
    }

    push(treeItem) {
        this.treeData.push(treeItem)
        this.refresh();
    }

    remove(treeItem) {
        this.treeData = this.treeData.filter(item => {
            if (treeItem.label == item.label) {
                console.log(123)
            }
            return treeItem.label != item.label
        });
        this.refresh();
    }
}

class WorldItem extends vscode.TreeItem {
    constructor(world) {
        const { name, trans, usphone, ukphone } = world;
        super(name);
        this.name = name;
        this.trans = trans;
        this.usphone = usphone;
        this.ukphone = ukphone;

        this.description = transString(trans);
        this.tooltip = [
            `${name}`,
            `美：[${usphone}] 英：[${ukphone}]`,
            ...trans.map((translation) => `${translation};`)
        ].join('\n')

    }
}


function transString(trans) {
    let res = '';
    for (let v of trans.values()) {
        res += (v + ';');
    }
    return res;
}

module.exports = View