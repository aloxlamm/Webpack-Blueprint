// PHOENIX OS
// CONTROLLER
//---------------------------------------------------------------------------------------------------------

import * as router from './Router.js';
import * as http from './HttpConnector.js';
import * as modules from './Modules.js';
import * as utils from './Utils.js';
import * as customController from '../core.custom/CustomController.js';

let _activeModules = [];
const _startRoute = 'login';
let _mainWrapper = $('phos-main');
let _modulesLoaded = false;
let layout;
const routeHandler = customController.routeHandler;
let _routes = [];
let _overlay_is_open = false;
let _metaTitlePrefix;

let _activeList = false;

// initial route -->
let _actualRoute = {
    "uri-pattern": "home",
    "meta-title": "Startseite",
    "layout": {
        "type": "default",
        "subtype": "default"
    },
    "init-cmd": "init_home"
}


export async function initPage() {
    _activeModules = modules.getActiveModules();
    const routes = await http.getJson('/phOs/phOs_routes.json', true);
    _metaTitlePrefix = customController._metaTitlePrefix;
    addRoutes(routes);

    
    let fragment = router.getFragment();


    if (fragment === '') {
        fragment = _startRoute;
        router.navigate(_startRoute);
    }
    _actualRoute = getRoute(router.getFragment(0));
    if (!_actualRoute) {
        router.replace('home');
        initPage();
    } else {/*  */
        //   router.initPage();
    }

    if (_activeModules.indexOf('layout') !== -1) {
        layout = await initLayout();
    }

    router.check();
    router.listen();
}

function addRoutes(data) {
    for (let i in data.routes) {
        const route = data.routes[i];
        const pattern = new RegExp(route["uri-pattern"]);
        _routes.push(route);
        router.add(pattern, () => {
            initContent();
        });
    }
}

function getRoute(route) {
    for (let i in _routes) {
        if (_routes[i]["uri-pattern"] === route) {
            return _routes[i];
        }
    }
}

export function getActualRoute() {
    return _actualRoute;
}

function initContent() {
    if (_overlay_is_open === false) {
        _actualRoute = getRoute(router.getFragment(0));
        if (!_actualRoute) {
            router.navigate('home');
        }
        if (!_modulesLoaded) {
            customController.loadContainers();
            _modulesLoaded = true;
        } else {
            changeView();
        }

        const fragments = router.getFragment().split('/');
        const main = fragments[0];
        let category = fragments[1];
        if (!category) {
            category = '';
        }

        if (typeof routeHandler['init_' + main] === 'function') {
            routeHandler['init_' + main](category);
        } else {
            routeNotFound()
        }

        customController.initializeContainers();
        setMetaTtile();
    } else {
        _overlay_is_open = false;
        overlay.close();
    }
}

function setMetaTtile() {
    document.title = _metaTitlePrefix + ' - ' + _actualRoute["meta-title"];
}

async function initLayout() {
    const layout = _mainWrapper.phos_initLayout();
    return await layout.init();
}

function changeView() {
    if (_actualRoute.layout.type === layout._type) {
        layout.changeSubtype();
    } else {
        initPage();
    }
}

function routeNotFound() {
    router.navigate(_startRoute);
}

export function search(value) {
    customController.search(value);
}

export function getActualView() {
    return _actualView;
}

export function getLayout() {
    return layout;
}

export function openFromList(domainId) {
    if (domainId) {
        customController.openFromList(domainId);
    }
}

export function createContent() {
    customController.createContent();
}

export function handleFetchError(response) {
    customController.handleFetchError(response);
}

export function setActiveList(list) {
    _activeList = list;
}

export function getActiveList() {
    return _activeList;
}