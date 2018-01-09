afterDomLoads(function () {
    "use strict";
    var mainNavToggle = document.getElementById('mainNav_toggle'),
        header = document.getElementById('header');
    if (mainNavToggle !== null) {
        mainNavToggle.onclick = function (e) {
            if (header.className.indexOf('active') !== -1) {
                header.className = header.className.replace(' active', '');
            } else {
                header.className = header.className + ' active';
            }
        };
    }
});