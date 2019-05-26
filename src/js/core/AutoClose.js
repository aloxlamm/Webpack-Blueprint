// PHOENIX OS
// AUTO CLOSE
//---------------------------------------------------------------------------------------------------------

import * as utils from './Utils.js';

export function addAutocloseListener() {
    $(window).on('click contextmenu', (event) => {
        const clickedElement = $(event.target);
        let targetElement;
        let excludeElement;

        if (clickedElement.attr('autoclose') !== undefined) {
            targetElement = clickedElement;
        } else if (clickedElement.closest('*[autoclose]').length > 0) {
            targetElement = clickedElement.closest('*[autoclose]');
        } else {
            targetElement = undefined;
        }

        // exclude targets
        if (clickedElement.attr('autoclose-excl') !== undefined || clickedElement.closest('*[autoclose-excl]').length > 0) {
            let id;
            if (clickedElement.attr('autoclose-excl') !== undefined) {
                id = clickedElement.attr('autoclose-excl');
            } else {
                id = clickedElement.closest('*[autoclose-excl]').attr('autoclose-excl');
            }
            targetElement = $('*[autoclose="' + id + '"]');
        }

        if (targetElement === undefined) {
            const activeItems = $('body').find('*[autoclose]');
            activeItems.each(function () {
                const this_trigger = $(this);
                this_trigger.trigger('click');
            });
        } else {
            const otherActiveItems = $('body').find('*[autoclose]').not(targetElement);
            otherActiveItems.each(function () {
                const this_trigger = $(this);
                this_trigger.trigger('click');
            });
        }
    });
}

export function addAutoclose(element, excludeTarget) {
    const id = utils.generateGUID();
    element.attr('autoclose', id);
    if (excludeTarget) {
        excludeTarget.attr('autoclose-excl', id);
    }
}

export function removeAutoclose(element) {
    element.removeAttr('autoclose');
    $('body').find('*[autoclose-excl]').removeAttr('autoclose-excl');
}