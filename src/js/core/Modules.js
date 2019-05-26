// PHOENIX OS
// CSS LOADER
//---------------------------------------------------------------------------------------------------------

import * as http from './HttpConnector.js';
import * as utils from './Utils.js';
import { importModule } from "../../polyfills/dynamic-import/importModule.js";

let _moduleData;
let _core_moduleData;
let _custom_moduleData;
let _module_config;
const _modules_path = '/phOs/modules/';
const _activeModules = [];

export async function init() {
    _module_config = await http.getJson('/phOs/phOs_modulesConfig.json', true);
    _custom_moduleData = _module_config.custom_modules;
    _core_moduleData = _module_config.core_modules;
    const data = await http.getJson('/phOs_modules/phOs_modules.json', true);
    _moduleData = utils.clone(data.modules);

    // core modules
    for (let i in _core_moduleData) {
        _activeModules.push(_core_moduleData[i]);
        const coreMod = getModuleData(_core_moduleData[i]);
        coreMod.path = _modules_path + coreMod.id + '/';
        coreMod.classPath = _modules_path + coreMod.id + '/' + coreMod.className + '.js';
        if (coreMod.autoInit === true) {
            const data = getModuleData(coreMod.id);
            if (data) {
                const url = data.classPath;
                const module = await importModule(url);
                module.autoInit()
            }
        }
    }

    // phos modules
    for (let i in _module_config.modules) {
        _activeModules.push(_module_config.modules[i]);
        const mod = getModuleData(_module_config.modules[i]);
        mod.path = _modules_path + mod.id + '/';
        mod.classPath = _modules_path + mod.id + '/' + mod.className + '.js';
        if (mod.autoInit === true) {
            const data = getModuleData(mod.id);
            if (data) {
                const url = data.classPath;
                const module = await importModule(url);
                module.autoInit()
            }
        }
    } 

    // custom modules
    for (let i in _custom_moduleData) {
        const customMod =_custom_moduleData[i];
        _activeModules.push(customMod.id);
        customMod.path = _modules_path + customMod.id + '/';
        customMod.classPath = _modules_path + customMod.id + '/' + customMod.className + '.js';
        if (customMod.autoInit === true) {
            const customModule = await importModule(customMod.classPath);
            customModule.autoInit();
        }
    }

    return _module_config;
}

export function getConfig() {
    return _module_config;
}

export function getActiveModules(){
    return _activeModules;
}

export function getActiveModulesObj() {
    const modules = [];
    for (let i in _module_config.modules) {
        const id = _module_config.modules[i];
        const obj = getModuleData(id);
        modules.push(obj);
    }
    return modules;
}

export function getModuleData(id) {
    if (id) {
        for (let i in _moduleData) {
            if (_moduleData[i].id === id) {
                return _moduleData[i];
            }
        }
    } else {
        return _moduleData;
    }
}