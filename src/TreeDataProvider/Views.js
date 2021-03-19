const vscode = require('vscode');
const { CURRENT_VIEW, REVIEW, COMPLETED_VIEW, FAVORITE_VIEW } = require('../constants/viewConstants');
const path = require('path');
const zhanSvg = path.join(__dirname, '..', '..', 'resources', 'dark', 'zhan.svg');

class View {

    constructor(treeData, options) {
        this.changeTreeDataEmitter = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.changeTreeDataEmitter.event;
        this.type = options.type;
        //options 规则
        this.options = options;
        this.treeData = this.setTreeDataByOptions(treeData)

    }

    setTreeDataByOptions(data) {
        const { filter, group } = this.options || {};
        const treeData = data.filter((item) => {
            if (filter instanceof Array) {
                let isCurrent = true;
                for (let key of filter) {
                    if (item[key]) {
                        isCurrent = false;
                        break;
                    }
                }
                return isCurrent
            }
            return item[filter]
        });
        let list = [];

        if (group) {
            const map = {};
            for (let item of treeData) {
                const key = getDate(item[group]);
                if (map[key]) {
                    map[key].push(item)
                } else {
                    map[key] = [item]
                }
            }

            for (let key in map) {
                list.push({ name: key, children: map[key] })
            }
        } else {
            list = treeData;
        }
        return list
    }

    //获取元素内容
    getTreeItem(element) {
        if (element.children) {
            return new WordGroup(element, this.type);
        } else {
            return new WorldItem(element, this.type);
        }
    }

    // 获取子节点
    getChildren(element) {
        if (!element) {
            return this.treeData;
        } else {
            return element.children;
        }
    }

    refresh(data) {
        this.treeData = this.setTreeDataByOptions(data)
        this.changeTreeDataEmitter.fire(undefined);
    }

    push(treeItem) {
        const key = getDate(new Date());
        const lastItem = this.treeData[this.treeData.length - 1];
        if (lastItem.name == key) {
            lastItem.children.push(treeItem)
        } else {
            this.treeData.push({
                name: key,
                children: [treeItem]
            })
        }
        this.refresh();
    }

    remove(treeItem) {
        this.treeData = this.treeData.filter(item => {
            return treeItem.name != item.name
        });
        this.refresh();
    }
}

class WorldItem extends vscode.TreeItem {
    constructor(world, type) {
        const { name, trans, usphone, ukphone } = world;
        //'[斩] '
        super(name);
        this.iconPath = (type == REVIEW && world.COMPLETED_VIEW && world.REVIEW) ? zhanSvg : '';
        this.contextValue = 'world';
        this.description = transString(trans);
        this.tooltip = [
            `${name}`,
            `美：[${usphone}] 英：[${ukphone}]`,
            ...trans.map((translation) => `${translation};`)
        ].join('\n')

    }
}


class WordGroup extends vscode.TreeItem {
    constructor(element) {
        super(element.name);
        this.description = `共${element.children.length}个`;
        this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    };
}


function getDate(timestamp) {
    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return year + '-' + month + '-' + day;
}

function transString(trans) {
    let res = '';
    for (let v of trans.values()) {
        res += (v + ';');
    }
    return res;
}

module.exports = View