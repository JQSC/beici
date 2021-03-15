const fs = require('fs');
const path = require('path');
const CET4_T = require('../assets/CET4_T.json')

const directoryName = 'globalStorage';
const fileName = 'CET4_T.json';

function update(context, world, pass) {

    const globalStoragePathArr = context.globalStoragePath.split(directoryName);
    const storageDirectory = path.join(globalStoragePathArr[0], directoryName, fileName);
    const { trans, ukphone, usphone, name } = world;

    let json = readFile(storageDirectory);

    json.map((item) => {
        if (item.name === name) {
            item.date = new Date().getTime();
            item.pass = pass;
        }
        return item;
    })

    fs.writeFileSync(storageDirectory, JSON.stringify(json));
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