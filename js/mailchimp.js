(function ($) {
    window.fnames = new Array();
    window.ftypes = new Array();
    fnames[0] = 'EMAIL';
    ftypes[0] = 'email';
    fnames[1] = 'FNAME';
    ftypes[1] = 'text';
    fnames[2] = 'LNAME';
    ftypes[2] = 'text';
    fnames[3] = 'ADDRESS';
    ftypes[3] = 'address';
    fnames[4] = 'PHONE';
    ftypes[4] = 'phone';
}(jQuery))
var $mcj = jQuery.noConflict(true);

document.addEventListener("DOMContentLoaded", function() {

    // Mutation observers

    const successResponse = document.getElementById("mce-success-response");
    const errorResponse = document.getElementById("mce-error-response");

    const successObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                onElementPopulatedSuccess();
                break;
            }
        }
    });

    const errorObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                onElementPopulatedError();
                break;
            }
        }
    });

    const config = { childList: true, subtree: true };
    successObserver.observe(successResponse, config);
    errorObserver.observe(errorResponse, config);

    // Modals

    const modalGetUpdates = document.getElementById('modalGetUpdates');
    const modalGetUpdatesMessage = document.getElementById('modalGetUpdatesMessage');
    const closeModalGetUpdates = document.getElementById('closeModalGetUpdates');
    const closeModalGetUpdatesMessage = document.getElementById('closeModalGetUpdatesMessage');

    document.getElementById('get-updates-btn').addEventListener('click', function (event) {
        event.preventDefault();
        showModal(modalGetUpdates);
    });

    closeModalGetUpdates.onclick = function () {
        var modalGetUpdates = document.getElementById('modalGetUpdates');
        hideModal(modalGetUpdates);
    }

    closeModalGetUpdatesMessage.onclick = function () {
        var modalGetUpdatesMessage = document.getElementById('modalGetUpdatesMessage');
        hideModal(modalGetUpdatesMessage);
    }

    function showModal(modal) {
        modal.classList.add('modal-display');
        setTimeout(function() {
            modal.classList.add('modal-visible');
        }, 50);
    }

    function hideModal(modal) {
        modal.classList.remove('modal-visible');
        setTimeout(function() {
            modal.classList.remove('modal-display');
        }, 500);
    }

    function onElementPopulatedSuccess() {

        hideModal(modalGetUpdates);
        showModal(modalGetUpdatesMessage);
        const mailchimpResponse = document.getElementById("mailchimp-response");
        mailchimpResponse.textContent = $('#mce-success-response').text();
        clearFormInputs('mc-embedded-subscribe-form');
    }

    function onElementPopulatedError() {
        hideModal(modalGetUpdates);
        showModal(modalGetUpdatesMessage);
        const mailchimpResponse = document.getElementById("mailchimp-response");
        mailchimpResponse.textContent = $('#mce-error-response').text();
        clearFormInputs('mc-embedded-subscribe-form');
    }

    function clearFormInputs(formId) {
        const form = document.getElementById(formId);
        const inputs = form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });

        $('#modal-input-firstname').removeClass('form-group-focus');
        $('#modal-input-lastname').removeClass('form-group-focus');
        $('#modal-input-email').removeClass('form-group-focus');
        $('#mce-success-response').textContent = '';
        $('#mce-error-response').textContent = '';
    }
});

