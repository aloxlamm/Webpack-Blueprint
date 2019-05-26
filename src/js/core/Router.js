// PHOENIX OS
// ROUTER
//---------------------------------------------------------------------------------------------------------

import * as timemachine from './TimeMachine.js';
import * as scrollable from './Scrollable.js';

let _routes = [];
let _mode = 'history';
let _root = '/';
let interval;
let _noListener = false;

// register event
const routeChangedEvent = new Event('routeChanged');


export function config(options) {
    _mode = options && options.mode && options.mode == 'history'
        && !!(history.pushState) ? 'history' : 'hash';
    _root = options && options.root ? '/' + clearSlashes(options.root) + '/' : '/';
    return;
}

function clearSlashes(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
}

export function replace(route) {
    clearInterval(interval);
    timemachine.replaceState(_root + clearSlashes(route));
    listen();
}

export function getFragment(index) {
    let fragment = '';
    fragment = clearSlashes(decodeURI(location.pathname + location.search));
    fragment = fragment.replace(/\?(.*)$/, '');
    fragment = _root != '/' ? fragment.replace(_root, '') : fragment;
    const fr = clearSlashes(fragment);

    if (index === undefined) {
        return fr;
    } else {
        return fr.split('/')[index];
    }
}

export function add(re, handler) {
    if (typeof re == 'function') {
        handler = re;
        re = '';
    }
    _routes.push({ re: re, handler: handler });
}

export function remove(param) {
    for (let i = 0, r; i < _routes.length, r = _routes[i]; i++) {
        if (r.handler === param || r.re.toString() === param.toString()) {
            _routes.splice(i, 1);
        }
    }
}

export function check(f) {
    let fragment = f || getFragment();
    for (let i = 0; i < _routes.length; i++) {
        let match = fragment.match(_routes[i].re);
        if (match) {
            match.shift();
            _routes[i].handler.apply({}, match);
        }
    }
}

export function listen() {
    var current = getFragment();
    var fn = function () {
        if (current !== getFragment()) {
            current = getFragment();
            $(window).trigger('routeChanged');
            check(current);
        }
    }
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(fn, 50);
    return this;
}

export function navigate(path) {
    path = path ? path : '';
    timemachine.pushState(_root + clearSlashes(path), path);
}

export function flush() {
    _routes = [];
    _mode = null;
    _root = '/';
    return this;
}

export function getRoutes() {
    return _routes;
}

export function initPage() {
    const actualRoute = _root + getFragment();
    timemachine.initPage(actualRoute);
}