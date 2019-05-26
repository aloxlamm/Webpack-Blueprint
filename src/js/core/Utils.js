// PHOENIX OS
// UTILS
// --------------------------------------------------------------------------------------------------

export function generateGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

export function clone(src) {
    return Object.assign({}, src);
}

export function async_timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getUrlParam(string) {
    let url = new URL(window.location.href);
    let searchParams = new URLSearchParams(url.search);
    return searchParams.get(string);
}

export function randomInt(max, min) {
    max++;
    return Math.floor((Math.random()) * (max - min)) + min;
}

export async function sha256(string) {
    const msgBuffer = new TextEncoder('utf-8').encode(string);
    if (crypto && crypto.subtle) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
        return hashHex;
    } else {
        return string;
    }
}

export function randomHexColor() {
    return Math.floor(Math.random() * 16777215).toString(16);
}

export function firstCharToLowerCase(string) {
    let array = string.split('');
    const first = array[0].toString().toLowerCase();
    array.splice(0, 1, first);
    return array.join('');
}