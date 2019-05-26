// PHOENIX OS
// CSS LOADER
//---------------------------------------------------------------------------------------------------------

import * as utils from './Utils.js';
import * as http from './HttpConnector.js';

let _scripts = [];
let _variables;

async function loadVariables(){
    const data = await http.getJson('/css/variables.json', true);
    _variables = data.css;
}

export async function getVariables(){
    if (_variables){
        return _variables;
    }else {
        await loadVariables();
        return _variables;
    }
}

export function loadCss(path) {
    return new Promise(function (resolve, reject) {
        if (getCss(path)) {
            // already imported
            resolve();
        } else {
            const id = utils.generateGUID();
            _scripts.push({
                href: path,
                id: id
            });
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = path;
            link.id = id;
            link.type = 'text/css';
            link.media = 'screen';
            $('head').append($(link));
            link.onload = function () {
                resolve();
            };
        }
    });
}

export function removeCss(path){
    const css = getCss(path);
    if (css){
        const node = document.getElementById(css.obj.id);
        node.parentNode.removeChild(node);
        _scripts.splice(css.index, 1);
    }
}

function getCss(path) {
    for (let i in _scripts) {
        if (_scripts[i].href === path) {
            return {
                obj: _scripts[i],
                index: parseInt(i)
            }
        }
    }
}