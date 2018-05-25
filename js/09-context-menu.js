afterDomLoads(function () {
  "use strict";
  var allContextMenus = document.querySelectorAll('.context-menu'),
    i;

  function toggleContextMenu (contextMenu) {
    contextMenu.className = 'context-menu active';
  }

  function contextMenuClickListener (e) {
    e = e ? e : window.event;
    var target = e.target ? e.target : e.srcElement,
      parent = target.parentNode;

    for (i = 0; i < allContextMenus.length; i += 1) {
      allContextMenus[i].className = 'context-menu';
    }

    if (target.className === 'context-menu' || target.className === 'context-menu active') {
      toggleContextMenu(target);
      return false;
    }

    if (parent.className === 'context-menu' || parent.className === 'context-menu active') {
      toggleContextMenu(parent);
      return false;
    }

    return true;
  }

  if (allContextMenus !== false) {
    document.addEventListener('click', contextMenuClickListener, false);
  }
});