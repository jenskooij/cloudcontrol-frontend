afterDomLoads(function () {
  "use strict";
  var infoMessage = document.querySelector('.infoMessage'),
    infoMessageTimeout,
    afterFadeTimeout;

  if (infoMessage !== null) {
    infoMessage.addEventListener("mouseover", removeInfoMessageTimeout);
    infoMessage.addEventListener("mouseout", addInfoMessageTimeout);
    addInfoMessageTimeout();
  }

  function addInfoMessageTimeout () {
    infoMessageTimeout = setTimeout(function () {
      infoMessage.style.opacity = 0;
      afterFadeTimeout = setTimeout(function () {
        infoMessage.parentNode.removeChild(infoMessage);
        clearTimeout(afterFadeTimeout);
      }, 600);
      clearTimeout(infoMessageTimeout);
    }, 3500);
  }

  function removeInfoMessageTimeout () {
    clearTimeout(infoMessageTimeout);
  }
});