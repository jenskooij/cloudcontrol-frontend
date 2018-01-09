afterDomLoads(function () {
    "use strict";
    var editButtons = document.querySelectorAll('.ccEditDocumentButton'),
        i,
        editModal = null,
        iframe;

    function closeModal(e) {
        e = e ? e : window.event;
        e.preventDefault();
        iframe.className = 'ccDocumentEditorHidden';
        iframe.style.animation='1s ease-out 0s 1 slideOutToRight';
        setTimeout(function () {
            document.getElementsByTagName('body')[0].removeChild(editModal);
            editModal = null;
        }, 1000);
    }

    function iframeLoaded(e) {
        e = e ? e : window.event;
        var target = e.target ? e.target : e.srcElement;

        if (target.contentWindow.location.href.indexOf('edit-document') === -1 && target.contentWindow.location.href !== 'about:blank') {
            iframe.allowTransparency = false;
            iframe.setAttribute('src', 'about:blank');
            iframe.style.backgroundColor='#fff';
            closeModal();
            setTimeout(function () {
                window.location.reload(true);
            }, 1000);
        } else if (target.contentWindow.location.href.indexOf('edit-document') !== -1) {
            var innerDoc = target.contentDocument || target.contentWindow.document;
            if (innerDoc !== null) {
                innerDoc.querySelector('.mainNav-toggle').style.display='none';
                innerDoc.getElementById('backButton').addEventListener('click', closeModal);
            }
        }
    }

    function checkModalExists(target) {
        if (editModal !== null) {
            return;
        }
        var modal;
        modal = document.createElement('div');
        modal.style.display='block';
        modal.style.position='fixed';
        modal.style.right='0';
        modal.style.top='0';
        modal.style.height='100%';
        modal.style.width='100%';
        modal.style.backgroundColor='rgba(0,0,0,0.5)';
        modal.style.textAlign='right';
        modal.style.zIndex=256;

        iframe = document.createElement('iframe');
        iframe.style.height='100%';
        iframe.style.width='50%';
        if (getWindowWidth() < 1290) {
            iframe.style.width='100%';
        }
        iframe.style.animation='1s ease-out 0s 1 slideInFromRight';
        iframe.addEventListener('load', iframeLoaded);
        iframe.setAttribute('src', target.getAttribute('data-href'));

        modal.appendChild(iframe);

        document.getElementsByTagName('body')[0].appendChild(modal);
        editModal = modal;
    }

    function getWindowWidth() {
        return Math.max(
            document.body.scrollWidth,
            document.documentElement.scrollWidth,
            document.body.offsetWidth,
            document.documentElement.offsetWidth,
            document.documentElement.clientWidth
        );
    }

    function toggleCCDocumentEditor(e) {
        e = e ? e : window.event;
        var target = e.target ? e.target : e.srcElement;

        checkModalExists(target);
    }

    if (editButtons !== null) {
        for (i = 0; i < editButtons.length; i += 1) {
            editButtons[i].addEventListener('click', toggleCCDocumentEditor);
            editButtons[i].className = 'ccEditDocumentButton active';
        }
    }
});