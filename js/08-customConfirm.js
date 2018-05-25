afterDomLoads(function () {
  "use strict";
  var allConfirms = document.querySelectorAll('[data-confirm]');

  function doConfirm (e, target) {
    var confirmDialog, confirmationText, confirmText, declineText, destination;
    e.preventDefault();
    e.stopPropagation();

    console.log('confirming: ' + target.getAttribute('href'));

    confirmationText = target.getAttribute('data-confirm');
    confirmText = target.hasAttribute('data-confirm-text') ? target.getAttribute('data-confirm-text') : 'Confirm';
    declineText = target.hasAttribute('data-decline-text') ? target.getAttribute('data-decline-text') : 'Decline';
    destination = target.getAttribute('href');

    confirmDialog = generateConfirmDialog(confirmationText, confirmText, declineText, destination);

    document.getElementsByTagName('body')[0].appendChild(confirmDialog);
  }

  function generateConfirmDialog (confirmationText, confirmText, declineText, destination) {
    var wrapper, container, text, confirmButton, declineButton;

    wrapper = document.createElement('div');
    wrapper.className = 'custom-confirm-wrapper';

    container = document.createElement('div');
    container.className = 'custom-confirm-container';

    text = document.createElement('h2');
    text.innerText = confirmationText;

    confirmButton = document.createElement('button');
    confirmButton.className = 'btn error';
    confirmButton.innerText = confirmText;

    declineButton = document.createElement('button');
    declineButton.className = 'btn reset';
    declineButton.innerText = declineText;

    container.appendChild(text);
    container.appendChild(declineButton);
    container.appendChild(confirmButton);
    wrapper.appendChild(container);

    declineButton.addEventListener('click', function () {
      document.getElementsByTagName('body')[0].removeChild(wrapper);
    });

    confirmButton.addEventListener('click', function () {
      window.location = destination;
    });

    return wrapper;
  }

  function confirmClickListener (e) {
    e = e ? e : window.event;
    var target = e.target ? e.target : e.srcElement,
      parent = target.parentNode;

    if (target.hasAttribute('data-confirm')) {
      doConfirm(e, target);
      return false;
    }

    if (parent.hasAttribute('data-confirm')) {
      doConfirm(e, parent);
      return false;
    }

    return true;
  }

  if (allConfirms !== false) {
    document.addEventListener('click', confirmClickListener, false);
  }
});