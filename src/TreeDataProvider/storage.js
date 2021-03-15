const fs = require('fs');
const path = require('path');
const CET4_T = require('../assets/CET4_T.json')

//const dbFile = path.join(__dirname, '..', '..', '..', 'huile8-mastered-list.txt');

const directoryName = 'globalStorage';

function updateWorldList(context, world, pass) {

    const globalStoragePathArr = context.globalStoragePath.split(directoryName);
    const storageDirectory = path.join(globalStoragePathArr[0], directoryName, 'CET4_T.json');

    const json = readFile(storageDirectory);

    const { trans, ukphone, usphone, name } = world;

    json.forEach((item)=>{

    })

    console.log('world', world, pass)
    if (pass) {

    }



    const data = [{ "title": "111" }];
    fs.writeFileSync(storageDirectory, JSON.stringify(data));

}

function readFile(path) {
    if (fs.existsSync(path)) {
        return fs.readFileSync(path);
    } else {
        return CET4_T;
    }
}

module.exports = updateWorldList