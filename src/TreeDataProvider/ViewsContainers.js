const View = require('./Views');
const vscode = require('vscode');
const { update, get } = require('./storage');

const { CURRENT_VIEW, REVIEW, COMPLETED_VIEW, FAVORITE_VIEW } = require('../constants/viewConstants');


class ViewsContainers {

    constructor(context) {
        this.context = context;
        //原始数据
        this.treeData = get(this.context);
        //分类
        this.current = new View(this.treeData, { type: CURRENT_VIEW, filter: [REVIEW, COMPLETED_VIEW, FAVORITE_VIEW] });
        this.review = new View(this.treeData, { type: REVIEW, filter: REVIEW, group: 'date' });
        this.completed = new View(this.treeData, { type: COMPLETED_VIEW, filter: COMPLETED_VIEW, group: 'date' });
        this.favorite = new View(this.treeData, { type: FAVORITE_VIEW, filter: FAVORITE_VIEW });

        this.changeTreeDataEmitter = new vscode.EventEmitter();
    }

    //对单词增加分组标记
    addMark(item) {
        for (let tree of this.treeData) {
            if (tree.name == item.name) {
                tree.date = new Date().getTime();
                Object.assign(tree, item);
                break;
            }
        }

        update(this.context, this.treeData);

        this.current.refresh(this.treeData);
        this.review.refresh(this.treeData)
        this.completed.refresh(this.treeData);
        this.favorite.refresh(this.treeData)
    }


    refresh() { }

}

module.exports = ViewsContainers