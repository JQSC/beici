const vscode = require('vscode');
const CET4_T = require('../assets/CET4_T.json')
const { update, get } = require('./storage');
const { CURRENT_VIEW, REVIEW } = require('../constants/viewConstants');

class View {

    constructor(content, viewType) {
        this.changeTreeDataEmitter = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.changeTreeDataEmitter.event;
        this.treeData = this.getTreeDataByStorage(content, viewType);
    }

    getTreeDataByStorage(content, viewType) {
        const data = get(content);
        const pass = viewType === REVIEW ? true : false;
        const list = [];

        for (let item of data) {
            if (pass == !!item.pass) {
                list.push(new WorldItem(item))
            }
        }
        return list
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