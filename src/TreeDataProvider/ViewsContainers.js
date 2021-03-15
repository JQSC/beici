const View = require('./Views');
const updateWorldList = require('./storage');

class ViewsContainers {

    constructor(context) {
        this.context = context;
        this.currentTreeData = new View();
        this.reviewTreeData = new View();
    }

    //单词加入复习列表
    complete(item) {
        updateWorldList(this.context, item, true);
        this.currentTreeData.remove(item);
        this.reviewTreeData.push(item);
    }

    //单词从复习列表回到学习列表
    back(item) {
        updateWorldList(this.context, item, false);
        this.currentTreeData.push(item);
        this.reviewTreeData.remove(item);
    }

    refresh() { }

}


module.exports = ViewsContainers