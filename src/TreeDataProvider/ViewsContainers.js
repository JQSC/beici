const View = require('./Views');
const { update, get } = require('./storage');

const { CURRENT_VIEW, REVIEW } = require('../constants/viewConstants');

class ViewsContainers {

    constructor(context) {
        this.context = context;
        this.currentTreeData = new View(context, CURRENT_VIEW);
        this.reviewTreeData = new View(context, REVIEW);
    }

    //单词加入复习列表
    complete(item) {
        update(this.context, item, true);
        this.currentTreeData.remove(item);
        this.reviewTreeData.push(item);
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