const vscode = require('vscode');
const fs = require('fs');
const CET4_T = require('../assets/CET4_T.json')

class WorldProvider {

    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData = new vscode.EventEmitter();
    }

    //处理每一项元素
    getTreeItem(element) {
        return element
    }

    getChildren(element) {
        if (!element) {
            return Promise.resolve(CET4_T.map((item) => new WorldItem(item)));
        } else {
            return Promise.resolve([]);
        }

        // if (!this.workspaceRoot) {
        //     vscode.window.showInformationMessage('No dependency in empty workspace');
        //     return Promise.resolve([]);
        // }

        // if (element) {
        //     return Promise.resolve(
        //         this.getDepsInPackageJson(
        //             path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
        //         )
        //     );
        // } else {
        //     const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
        //     if (this.pathExists(packageJsonPath)) {
        //         return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
        //     } else {
        //         vscode.window.showInformationMessage('Workspace has no package.json');
        //         return Promise.resolve([]);
        //     }
        // }
    }

    getDepsInPackageJson(packageJsonPath) {
        // if (this.pathExists(packageJsonPath)) {
        //     const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

        //     const toDep = (devDependencie) => {
        //         const [moduleName, version] = devDependencie
        //         if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
        //             return new Dependency(
        //                 moduleName,
        //                 version,
        //                 vscode.TreeItemCollapsibleState.Collapsed
        //             );
        //         } else {
        //             return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
        //         }
        //     };

        //     const devDeps = packageJson.devDependencies
        //         ? Object.entries(packageJson.devDependencies).map(devDependencie =>
        //             toDep(devDependencie)
        //         )
        //         : [];
        //     console.log('devDeps: ', devDeps);

        //     return devDeps
        // } else {
        //     return [];
        // }
    }

    pathExists(p) {
        try {
            fs.accessSync(p);
        } catch (err) {
            return false;
        }
        return true;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }


}

class WorldItem extends vscode.TreeItem {
    constructor(world) {
        const { name, trans, usphone, ukphone } = world;
        super(name);
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

module.exports = WorldProvider