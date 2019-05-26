// PHOENIX OS
// SCROLLABLE
//---------------------------------------------------------------------------------------------------------

let _instances = {};
const _scrollTime = 200;

export function add(element, config) {
    const id = config.id;
    element.attr('scrollable-id', config.id);



    if (!_instances[id]) {
        _instances[id] = {
            obj: null,
            $: element,
            historyScroll: true,
            scroll: {
                top: 0,
                left: 0,
            }
        }
    } else {
        _instances[id].$ = element;
        _instances[id].scroll = { top: 0, left: 0 };
    }

    let autoHide = 'never';
    if (config.autoHide){
        autoHide = config.autoHide;
    }
    let className = 'os-theme-dark';
    if (config.className){
        className = className + ' ' + config.className;
    }
    
    const scroll = element.overlayScrollbars({
        className: className,
        overflowBehavior: {
            x: 'hidden',
            y: 'scroll'
        },
        scrollbars: {
            visibility: 'auto',    //visible || hidden || auto || v || h || a
            autoHide: autoHide,     //never || scroll || leave || n || s || l
            autoHideDelay: 300,    //number
            dragScrolling: true,   //true || false
            clickScrolling: false, //true || false
            touchSupport: true     //true || false,
        },
        className: className,    // add custom class for css
        callbacks: {
            onInitialized: function () {

                const id = $(this.getElements().target).attr('scrollable-id');
                const instance = _instances[id];
                instance.obj = this;

            },
            onScroll: function () {
                setScroll(this);
            },
            onScrollStop: function () {
                setScroll(this);
            },
            onContentSizeChanged: function () {
                setScroll(this);
            },
            onDirectionChanged: function () {
                setScroll(this);
            },
            onUpdated: function () {
                setScroll(this);
                const id = $(this.getElements().target).attr('scrollable-id');
                const instance = _instances[id];
                if (instance.scrollOnload && instance.scrollOnload.top) {
                    scrollTop(this, instance.scrollOnload.top);
                    instance.scrollOnload = false;
                }
            }
        }
    });

    if (config.handleColor){
        element.find('.os-scrollbar-handle').css('background', config.handleColor);
    }
}

function setScroll(obj) {
    const scroll = obj.scroll();
    const id = $(obj.getElements().target).attr('scrollable-id');
    const instance = _instances[id];
    instance.scroll.top = scroll.y.position;
    instance.scroll.left = scroll.x.position;
}

export function getScrollTop(id) {
    if (_instances[id]) {
        return _instances[id].scroll.top;
    }
}

export function captureScrolls() {
    let scrolls = {};
    const keys = Object.keys(_instances);
    for (var i in keys) {
        const inst = _instances[keys[i]];
        scrolls[keys[i]] = inst.scroll;
    }
    return scrolls;
}

export function get_instances() {
    return _instances;
}

export function setScrolls(state) {
    const keys = Object.keys(state);
    for (let i in keys) {
        const instance = _instances[keys[i]];
        if (instance) {
            instance.scrollOnload = {};
            instance.scrollOnload.top = state[keys[i]]['top'];
            instance.scrollOnload.left = state[keys[i]]['left'];
        }
    }
}

function scrollTop(obj, val, time) {
    if (!time) {
        time = _scrollTime;
    }
    setTimeout(() => {
        const state = obj.getState();
        if (state.contentScrollSize.height > val) {
            obj.scroll({ x: 0, y: val }, time)
        } else {
            scrollTop(obj, val, time);
        }
    }, time);
}