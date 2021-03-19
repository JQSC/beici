const fs = require('fs');
const path = require('path');
const CET4_T = require('../assets/CET4_T.json')

const directoryName = 'globalStorage';
const fileName = 'CET4_T.json';

function update(context, treeData) {

    const globalStoragePathArr = context.globalStoragePath.split(directoryName);
    const storageDirectory = path.join(globalStoragePathArr[0], directoryName, fileName);

    fs.writeFileSync(storageDirectory, JSON.stringify(treeData));

}

function readFile(path) {

    if (fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, { encoding: 'utf-8' }));
    } else {
        return CET4_T;
    }
}


function get(context) {
    const globalStoragePathArr = context.globalStoragePath.split(directoryName);
    const storageDirectory = path.join(globalStoragePathArr[0], directoryName, fileName);

    return readFile(storageDirectory);
}


module.exports = {
    update,
    get
}