// PHOENIX OS
// HTTP CONNECTOR
//---------------------------------------------------------------------------------------------------------

//import * as controller from '../core/Controller.js';

let _api_root = 'https://api.crumbl.org/Crumbl_API';
let _api_key = {
    key: 'APIKEY',
    value: 'test'
}

const _showToken = true;

let _runningTasks = {};
let _reqCounter = 0;

// settings
let _timeout = 2000;

// api ---------------------------------------------
export function setAPI(root, key) {
    _api_root = root;
    _api_key.api_value = key;
}

// JWT token ---------------------------------------
let _idToken;
export function setIdToken(token) {
    if(_showToken){
        console.log('JWT TOKEN -------------------------------------------------');
        console.log(token)
    }
   
    _idToken = token;
}

export function getIdToken() {
    return _idToken;
}
//--------------------------------------------------

function getApiUri(uri) {
    let string = _api_root + uri;

    // api key
    if (!_idToken){
        if (uri.indexOf('?') === -1) {
            string += '?';
        } else {
            string += '&';
        }
        string += _api_key.key + '=' + _api_key.value;
        return string;
    }else {
        return string;
    }
}

function sendRequest(configuration) {
    return new Promise((resolve, reject) => {
        _reqCounter++;
        configuration.id = 'req-' + _reqCounter;
        // timeout handler 
        const interval = setInterval(() => {
            handleError('timeout', undefined, configuration);
        }, _timeout);
        configuration.timer = interval;
        // abort controller
        configuration.abortController = new AbortController();
        // register task
        _runningTasks[configuration.id] = configuration;
        // send request

        // request headers
        let headers = [
            {name: 'Content-Type', value:'application/json'}
        ];
        const request = {
            method: configuration.method,
            body: configuration.data,
            cache: 'no-cache',
            headers: {}
        }

        // ID TOKEN if exists
        if (_idToken) {
             headers.push({name: 'Authorization', value: 'bearer ' +  _idToken});
             headers.push({name: 'Connection', value: 'keep-alive'});
             headers.push({name: 'accept', value: 'application/json'});
        }
        // append headerse
        for (let i in headers) {
            const name = headers[i]['name'];
            const value = headers[i]['value'];
            request.headers[headers[i]['name']] = headers[i]['value'];
        }

        fetch(configuration.uri, request)
            .then(response => {
                deleteTask(configuration);
                resolve(response);
            })
            .catch(error => {
                resolve(error);
            });
    });
}

export async function getJson(uri, locally, abort, external) {
    if (external){
        uri = uri;
    }else if (!locally) {
        uri = getApiUri(uri);
    }
    if (!abort) {
        abort = true;
    }
    var response = await sendRequest({
        uri: uri,
        method: 'GET',
        type: 'json',
        abort: abort
    });
    if (response.status === 200){
        try {
            return response.json();
        }catch (err){
            console.log(err);
        }
    }else{
        controller.handleFetchError(response);
    }
}

export async function getTemplate(uri) {
    const response = await getHtml(uri);
    const html = await (response.text());
    const template = $(html).filter('template').html();
    return template;
}

export async function get(uri, abort) {
    if (!abort) {
        abort = true;
    }
    var response = await sendRequest({
        uri: getApiUri(uri),
        method: 'GET',
        abort: abort
    });
    return response;
}

export async function post(uri, data) {
    // attention: data has to be stringified Json
    if (typeof data === Object) {
        data = JSON.stringify(data);
    }
    var response = await sendRequest({
        uri: getApiUri(uri),
        method: 'POST',
        abort: false,
        data: data
    });
    if (response.json && typeof response.json === 'function'){
        return response.json();
    }else {
        return response
    }
}

export async function put(uri, data) {
    var response = await sendRequest({
        uri: getApiUri(uri),
        method: 'PUT',
        abort: false,
        data: data
    });
    return response;
}

export async function del(uri) {
    var response = await sendRequest({
        uri: getApiUri(uri),
        method: 'DELETE',
        abort: false
    });
    return response;
}

async function getHtml(uri, abort) {
    if (!abort) {
        abort = true;
    }
    var response = await sendRequest({
        uri: uri,
        method: 'GET',
        type: 'html',
        abort: abort
    });
    return response;
}

function deleteTask(configuration) {
    if (configuration) {
        if (_runningTasks[configuration.id] && _runningTasks[configuration.id].timer) {
            clearInterval(_runningTasks[configuration.id].timer);
            delete _runningTasks[configuration.id];
        }
    }
}

function handleError(type, response, configuration) {
    deleteTask(configuration);
    // TIMEOUT
    if (type === 'timeout') {
    }
    // STATUS
    else if (type === 'status') {
        if (response.status === 400) {

        }
        else if (response.status === 500) {

        }
    }
}

export function abort() {
    const keys = Object.keys(_runningTasks);
    for (let i in keys) {
        let task = _runningTasks[keys[i]];
        if (task.abortController) {
            task.abortController.abort();
            clearInterval(task);
            task = {};
        }
    }
}
