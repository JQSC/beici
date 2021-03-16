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
        this.current = new View(this.treeData, { filter: 'name' });
        this.review = new View(this.treeData, { filter: REVIEW, group: 'date' });
        this.completed = new View(this.treeData, { filter: COMPLETED_VIEW });
        this.favorite = new View(this.treeData, { filter: FAVORITE_VIEW });

        this.changeTreeDataEmitter = new vscode.EventEmitter();
    }

    //对单词增加分组标记
    addMark(item, type) {
        for (let tree of this.treeData) {
            if (tree.name == item.name) {
                tree.date = new Date().getTime();
                tree[type] = true;
                update(this.context, tree);
                break;
            }
        }

        this.current.refresh(this.treeData);
        this.review.refresh(this.treeData)
        this.completed.refresh(this.treeData);
        this.favorite.refresh(this.treeData)
    }

    //单词从复习列表回到学习列表
    back(item) {
        update(this.context, item, false);
        this.currentTreeData.push(item);
        this.reviewTreeData.remove(item);
    }

    refresh() { }

}

class ViewsContainers2 {

    constructor(context) {
        this.context = context;
        //原始数据
        this.treeData = get(this.context);
        //分类
        this.current_original = [];
        this.review_original = [];
        this.completed_original = [];
        this.favorite_original = [];

        for (let item of this.treeData) {
            let isCurrent = true;
            //一个单词可以有多个状态，可以显示到多个分组中
            if (item[REVIEW]) {
                this.review_original.push(item);
                isCurrent = false;
            }
            if (item[COMPLETED_VIEW]) {
                this.completed_original.push(item);
                isCurrent = false;
            }
            if (item[FAVORITE_VIEW]) {
                this.favorite_original.push(item);
                isCurrent = false;
            }
            if (isCurrent) {
                this.current_original.push(item);
            }
        }
        this.current = new View(this.current_original);
        this.review = new View(this.review_original, { group: 'date' });
        this.completed = new View(this.completed_original);
        this.favorite = new View(this.favorite_original);
    }

    //对单词增加分组标记
    addMark(item, type) {

        console.log('item', item)

        item[type] = true;
        update(this.context, item);

        switch (type) {
            case REVIEW:
                this.review_original.push();
                this.current_original.remove();
                break;
            case COMPLETED_VIEW:
                this.review_original.push();
                this.current_original.remove();
                break;
            case FAVORITE_VIEW:
                this.review_original.push();
                this.current_original.remove();
                break;
            default:
                this.review_original.push();
                this.current_original.remove();
                break;
        }


    }

    //单词从复习列表回到学习列表
    back(item) {
        update(this.context, item, false);
        this.currentTreeData.push(item);
        this.reviewTreeData.remove(item);
    }

    refresh() { }

}


module.exports = ViewsContainers