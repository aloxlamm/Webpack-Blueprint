// PHOENIX OS
// TIMEMACHINE
//---------------------------------------------------------------------------------------------------------

import * as router from './Router.js';
import * as scrollable from './Scrollable.js';
import * as controller from './Controller.js';
import * as customController from '../core.custom/CustomController.js';

let _state = {};

const _log = false;
let _historyLength = 0;
let _actualRoute = null;
let _title = customController._metaTitlePrefix;
if (_title === undefined){
    _title = '';
}

// register event
const historyBackEvent = new Event('historyBack');

window.onpopstate = function (event) {
    if (_log) {
        console.log('HISTORY --> POP STATE');
        console.log(event.state);
    }

    if (event.state.overlay && event.state.overlay === true) {
        if ($('body').find('cr-overlay')[0]) {
            $('body').find('cr-overlay')[0].historyBack();
        }
    } else {
        const keys = Object.keys(event.state);
        for (let i in keys) {
            const key = keys[i];
            const val = event.state[key];
            _state[key] = val;
            if (key === 'scrollables') {
                scrollable.setScrolls(val);
            } else if (key === 'layout') {
                const layout = controller.getLayout();
                layout.setStates(val);
            }
        }
        $(window).trigger('historyBack');
    }
};

export function pushState(route) {
    if (!route) {
        route = _actualRoute;
    } else {
        _actualRoute = route;
    }
    captureElements();
    if (_log) {
        console.log('HISTORY --> PUSH STATE');
        console.log(_state);
    }
    _historyLength++;
    window.history.pushState(_state, _title, route);
}

export function replaceState(uri) {
    if (_log) {
        console.log('HISTORY --> REPLACE STATE');
        console.log(_state);
    }
    let newUri = null;
    if (uri){
        newUri = uri;
    }
    window.history.replaceState(_state, _title, newUri);
}

export function back() {
    if (_historyLength > 1) {
        window.history.back();
    } else {
        router.navigate('startpage');
    }
}

export function setStateValue(key, value) {
    _state[key] = value;
    replaceState();
}

export function setStateValues(arr) {
    for (let i in arr) {
        const pair = arr[i];
        _state[pair.key] = pair.value;
    }
    replaceState();
}

function captureElements() {
    _state['route'] = _actualRoute;
    _state['scrollables'] = scrollable.captureScrolls();
    //_state['overlay'] = overlay.isOpen();
    if (controller.getLayout()) {
        const layout = controller.getLayout();
    }
    replaceState();
}

export function initPage(route){
    captureElements();
    replaceState(route);
}