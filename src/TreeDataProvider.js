const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

class NodeDependenciesProvider {

    constructor(workspaceRoot) {
        this.workspaceRoot = workspaceRoot;
        this._onDidChangeTreeData=new vscode.EventEmitter();
    }

    getTreeItem(element) {
        return element
    }

    getChildren(element) {
        console.log('element: ', element);

        if (!this.workspaceRoot) {
            vscode.window.showInformationMessage('No dependency in empty workspace');
            return Promise.resolve([]);
        }

        if (element) {
            return Promise.resolve(
                this.getDepsInPackageJson(
                    path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
                )
            );
        } else {
            const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
            if (this.pathExists(packageJsonPath)) {
                return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
            } else {
                vscode.window.showInformationMessage('Workspace has no package.json');
                return Promise.resolve([]);
            }
        }
    }

    getDepsInPackageJson(packageJsonPath) {
        if (this.pathExists(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

            const toDep = (devDependencie) => {
                const [moduleName, version] = devDependencie
                if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
                    return new Dependency(
                        moduleName,
                        version,
                        vscode.TreeItemCollapsibleState.Collapsed
                    );
                } else {
                    return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
                }
            };

            const devDeps = packageJson.devDependencies
                ? Object.entries(packageJson.devDependencies).map(devDependencie =>
                    toDep(devDependencie)
                )
                : [];
            console.log('devDeps: ', devDeps);

            return devDeps
        } else {
            return [];
        }
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


class Dependency extends vscode.TreeItem {
    constructor(
        label,
        version,
        collapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${label}-${version}`;
        this.description = version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };
}


module.exports = NodeDependenciesProvider