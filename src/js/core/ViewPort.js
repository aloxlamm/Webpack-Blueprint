// PHOENIX OS
// VIEWPORTS
// --------------------------------------------------------------------------------------------------

const viewPorts = [
    {
        id: 'screen',
        minWidth: 900,
        maxWidth: 1000000,
        mobileView: false
    },
    {
        id: 'tablet',
        minWidth: 600,
        maxWidth: 899,
        mobileView: true
    },
    {
        id: 'mobile',
        minWidth: 0,
        maxWidth: 599,
        mobileView: true
    }
]

let screenWidth = $(window).width();
let screenHeight = $(window).height();
let scrollTop = $(window).scrollTop();
let mobileView = undefined;
let device = undefined;
let storedTop;

export function init(){
    setViewPortParams();
    addViewportListeners();
}

function addViewportListeners() {
    $(document).ready(() => {
        setViewPortParams();
    });

    $(window).resize(() => {
        setViewPortParams();
    });

    $(window).scroll(() => {
        setViewPortParams();
    });
}

function setViewPortParams() {
    screenWidth = $(window).width();
    screenHeight = $(window).height();
    scrollTop = $(window).scrollTop();

    for (let i in viewPorts) {
        const viewPort = viewPorts[i];
        if (viewPort.minWidth < screenWidth && screenWidth < viewPort.maxWidth) {
            mobileView = viewPort.mobileView;
            device = viewPort.id;
        }
    }
}

export function saveScroll() {
    storedTop = scrollTop;
}

export function scrollTo(top) {
    $(window).scrollTop(top);
}

export function scrollToSaved() {
    $(window).scrollTop(thi.storedTop);
}

export function getMobileView() {
    return mobileView;
}

export function getScrollTop() {
    return scrollTop;
}

export function getWidth() {
    return screenWidth;
}

export function getHeight() {
    return screenHeight;
}

export function getDevice() {
    return device;
}

export function addFixedBody(){
    $('body').addClass('fixedBody');
}

export function removeFixedBody(){
    $('body').removeClass('fixedBody');
}