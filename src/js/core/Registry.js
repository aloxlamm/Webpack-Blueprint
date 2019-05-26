// PHOENIX OS
// REGISTRY
//---------------------------------------------------------------------------------------------------------

let _instances = [];
const _instanceTypes = [];

export function addInstanceType(str){
    _instanceTypes.push(str);
}

export function registerInstance(instance, instanceType) {
    if (instance._wrapper && instance._id){
        instance._wrapper.attr('phos-' + instanceType + '-id', instance._id);
    }else {
        console.log('REGISTRY: register instance -> wrapper or id missinng');
    }
    _instances[instance._id] = instance;
    _instances[instance._instanceType] = instanceType;
}

export function clearInstances() {
    _instances = {};
}

export function getInstance(id) {
    return _instances[id];
}

export function getInstanceFromDom(target, type) {
    if (target.attr('phos-' + type + '-id') !== undefined) {
        return getInstance(target.attr('phos-' + type + '-id'));
    } else {
        return getInstance(target.closest('*[phos-' + type + '-id]').attr('phos-' + type + '-id'));
    }
}

function getInstancesByType(type) {
    let inst = [];
    for (let i in _instances) {
        if (_instances[i].instanceType === type) {
            inst.push(_instances[i]);
        }
    }
    return inst;
}

export function cleanup() {
    let activeInstances = {};
    for (let i in _instanceTypes) {
        const instances = getInstancesByType(_instanceTypes[i]);
        for (let ii in instances) {
            const selector = '*[phos-' + instances[ii]._instanceType + '-id=' + instances[ii]._id + ']';
            if ($('body').find(selector).length > 0) {
                activeInstances[instances[ii]._id] = instances[ii];
            }
        }
    }
    _instances = activeInstances;
}

export function getInstances(){
    return _instances;
}