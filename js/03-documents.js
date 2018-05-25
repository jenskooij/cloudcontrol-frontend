function showDocumentDetails (target) {
  var tableRow = target.parentNode.parentNode.parentNode.parentNode.parentNode,
    detailsDiv = tableRow.querySelector('.details'),
    openedDetailsDiv = document.querySelector('.details.active');

  if (openedDetailsDiv !== null && openedDetailsDiv !== detailsDiv) {
    openedDetailsDiv.className = openedDetailsDiv.className.replace('active', '').trim();
  }

  if (detailsDiv.className.indexOf('active') === -1) {
    detailsDiv.className = detailsDiv.className + ' active';
  } else {
    detailsDiv.className = detailsDiv.className.replace('active', '').trim();
  }

  return false;
}

function getParameterByName (name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function textAreaAdjust (o) {
  o.style.height = "1px";
  o.style.height = (25 + o.scrollHeight) + "px";
}

function applyDeleteButtons () {
  "use strict";
  var anchors = document.getElementsByTagName('a'),
    i;

  for (i = 0; i < anchors.length; i += 1) {
    if (anchors[i].className.indexOf('js-deletemultiple') !== -1) {
      anchors[i].onclick = deleteParentLi;
    }
  }
}

function applyAddButtons () {
  "use strict";
  var anchors = document.getElementsByTagName('a'),
    i,
    targetClonable,
    targetDropzone,
    cln,
    cloneableCollection = document.getElementById('cloneableCollection');

  for (i = 0; i < anchors.length; i += 1) {
    if (anchors[i].className.indexOf('js-addmultiple') !== -1) {
      anchors[i].setAttribute('id', 'clone_button_' + i);

      targetClonable = anchors[i];
      while (targetClonable.className.indexOf('form-element') === -1) {
        targetClonable = targetClonable.parentNode;
      }
      targetDropzone = targetClonable.getElementsByTagName('ul')[0];
      targetDropzone.setAttribute('id', 'dropzone_' + i);
      targetClonable = targetDropzone.children[0];

      cln = targetClonable.cloneNode(true);
      cln.setAttribute('id', 'clonable_' + i);

      var elements = cln.getElementsByTagName("script");

      while (elements[0]) {
        elements[0].parentNode.removeChild(elements[0]);
      }

      cloneableCollection.appendChild(cln);

      createCloneable('clone_button_' + i, 'clonable_' + i, 'dropzone_' + i);
    } else if (anchors[i].className.indexOf('js-addrtemultiple') !== -1) {
      anchors[i].onclick = addRte;
    }
  }
}

function addRte (e) {
  "use strict";
  e = e ? e : window.event;
  var target = e.target ? e.target : e.srcElement,
    id = Date.now(),
    wrapperDiv = document.createElement('div'),
    div = document.createElement('div'),
    li = document.createElement('li'),
    textarea = document.createElement('textarea'),
    targetDropzone,
    targetName;
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  while (target.className.indexOf('form-element') === -1) {
    target = target.parentNode;
  }
  targetName = target.getElementsByTagName('textarea')[1].getAttribute('name');
  targetDropzone = target.getElementsByTagName('ul')[0];

  wrapperDiv.className = 'rte form-element';
  div.className = 'summernote';
  div.setAttribute('id', id);
  wrapperDiv.appendChild(div);
  textarea.setAttribute('name', targetName);
  textarea.setAttribute('style', 'display:none;');
  wrapperDiv.appendChild(textarea);
  li.innerHTML = "<a class=\"btn error js-deletemultiple\"><i class=\"fa fa-trash\"></i></a><a class=\"btn move ui-sortable-handle\"><i class=\"fa fa-arrows-v\"></i></a>";
  li.appendChild(wrapperDiv);
  targetDropzone.appendChild(li);

  applyDeleteButtons();

  $('#' + id).summernote({
    height: 300,
    toolbar: [
      ['style', ['bold', 'italic', 'underline', 'clear', 'style']],
      ['font', ['strikethrough', 'superscript', 'subscript']],
      ['para', ['ul', 'ol']],
      ['insert', ['table', 'link', 'picture']],
      ['misc', ['codeview']],
    ]
  });
}

function deleteParentLi (e) {
  "use strict";
  e = e ? e : window.event;
  var target = e.target ? e.target : e.srcElement;
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  while (target.nodeName !== "LI") {
    target = target.parentNode;
  }

  target.parentNode.removeChild(target);
}

function httpGetAsync (theUrl, callback) {
  "use strict";
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
      callback(xmlHttp.responseText);
    }
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function imageSelect (e, imageSelectorId) {
  "use strict";
  var input = document.getElementById(imageSelectorId + "_input"),
    selector = document.getElementById(imageSelectorId + '_imageSelector'),
    i,
    divs,
    target = e;

  while (target.className.indexOf('form-element') === -1) {
    target = target.parentNode;
  }
  divs = target.getElementsByTagName('div');
  input = target.getElementsByTagName('input')[0];
  for (i = 0; i < divs.length; i += 1) {
    if (divs[i].className.indexOf('image-selector') !== -1) {
      selector = divs[i];
    }
  }

  if (selector.children.length === 0) {
    httpGetAsync(cmsSubfolders + '/images.json?' + Date.now(), function (result) {
      var images = JSON.parse(result),
        i,
        imageNode,
        fileNode = document.createElement('input');
      fileNode.setAttribute('type', 'file');
      selector.innerHTML = '';
      selector.appendChild(fileNode);

      createImageUploadable(selector, imageSelectorId);

      for (i = 0; i < images.length; i += 1) {
        imageNode = new Image();
        imageNode.src = subfolders + 'images/' + images[i].set[smallestImage];
        imageNode.className = 'image-selector';
        imageNode.setAttribute("data-value", images[i].file);
        imageNode.setAttribute("data-target-id", imageSelectorId);
        imageNode.onclick = selectImage;
        imageNode.title = images[i].file;
        selector.appendChild(imageNode);
      }
      selector.style.display = 'block';
    });
  } else if (selector.style.display === 'block') {
    selector.style.display = 'none';
  } else {
    selector.style.display = 'block';
  }

}

function selectImage (e) {
  "use strict";
  e = e ? e : window.event;
  var target = e.target ? e.target : e.srcElement;
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
  }

  var targetInput,
    selectedImage,
    formElement,
    divs,
    i;

  formElement = target;
  while (formElement.className.indexOf('form-element') === -1) {
    formElement = formElement.parentNode;
  }
  targetInput = formElement.getElementsByTagName('input')[0];
  divs = formElement.getElementsByTagName('div');
  for (i = 0; i < divs.length; i += 1) {
    if (divs[i].className.indexOf('selected-image') !== -1) {
      selectedImage = divs[i];
    }
  }

  targetInput.setAttribute('value', target.getAttribute('data-value'));
  selectedImage.style.backgroundImage = 'url(\'' + target.getAttribute('src') + '\')';
  target.parentNode.style.display = 'none';
}

function createUploadable (element, fileSelectorId) {
  var uploadInput = element.getElementsByTagName('input')[0],
    form = uploadInput.parentNode;

  uploadInput.onclick = function (e) {
    this.value = null;
  };

  uploadInput.addEventListener('change', function (e) {
    var file,
      formData,
      xhr,
      fileNode,
      filenameNode,
      iconNode,
      fileJson;
    if (this.files !== null && this.files[0] !== null) {
      file = this.files[0];
      formData = new FormData();
      formData.append("file", file, file.name);
      xhr = new XMLHttpRequest();
      xhr.open("POST", cmsSubfolders + '/files/new-ajax', true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          fileJson = JSON.parse(xhr.responseText);

          fileNode = document.createElement('li');
          fileNode.className = 'file-selector';
          fileNode.setAttribute("data-value", fileJson.file);
          fileNode.setAttribute("data-file-type", fileJson.type);
          fileNode.setAttribute("data-target-id", fileSelectorId);
          fileNode.onclick = selectFile;
          fileNode.title = file.file;

          filenameNode = document.createTextNode(fileJson.file);
          iconNode = document.createElement('i');
          iconNode.className = 'fa fa-' + iconByFileType(fileJson.type);

          fileNode.appendChild(iconNode);
          fileNode.appendChild(filenameNode);
          element.appendChild(fileNode);
          uploadInput.style.display = 'block';
          fileNode.click();
        }
      };
      xhr.send(formData);
      uploadInput.style.display = 'none';
    }
  }, false);
}

function createImageUploadable (element, imageSelectorId) {
  var uploadInput = element.getElementsByTagName('input')[0];

  console.log(uploadInput);

  uploadInput.onclick = function (e) {
    this.value = null;
  };

  uploadInput.addEventListener('change', function (e) {
    var file,
      formData,
      xhr,
      imageNode;
    if (this.files !== null && this.files[0] !== null) {
      file = this.files[0];
      formData = new FormData();
      formData.append("file", file, file.name);
      xhr = new XMLHttpRequest();
      xhr.open("POST", cmsSubfolders + '/images/new-ajax', true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var image = JSON.parse(xhr.responseText);
          imageNode = new Image();
          imageNode.src = subfolders + 'images/' + image.set[smallestImage];
          imageNode.className = 'image-selector';
          imageNode.setAttribute("data-value", image.file);
          imageNode.setAttribute("data-target-id", imageSelectorId);
          imageNode.onclick = selectImage;
          imageNode.title = image.file;
          element.appendChild(imageNode);
          uploadInput.style.display = 'block';
          imageNode.click();
        }
      };
      xhr.send(formData);
      uploadInput.style.display = 'none';
    }
  }, false);
}

function updateFileList (fileSelectorId, selector) {
  httpGetAsync(cmsSubfolders + '/files.json?' + Date.now(), function (result) {
    var files = JSON.parse(result),
      i,
      fileNode,
      filenameNode,
      iconNode;

    for (i = 0; i < files.length; i += 1) {
      fileNode = document.createElement('li');
      fileNode.className = 'file-selector';
      fileNode.setAttribute("data-value", files[i].file);
      fileNode.setAttribute("data-file-type", files[i].type);
      fileNode.setAttribute("data-target-id", fileSelectorId);
      fileNode.onclick = selectFile;
      fileNode.title = files[i].file;

      filenameNode = document.createTextNode(files[i].file);
      iconNode = document.createElement('i');
      iconNode.className = 'fa fa-' + iconByFileType(files[i].type);

      fileNode.appendChild(iconNode);
      fileNode.appendChild(filenameNode);
      selector.appendChild(fileNode);
    }
    createSearchAble(selector, 'data-value');
    createUploadable(selector, fileSelectorId);
    selector.style.display = 'block';
  });
}

function fileSelect (e, fileSelectorId) {
  "use strict";
  var input = document.getElementById(fileSelectorId + "_input"),
    selector = document.getElementById(fileSelectorId + '_fileSelector'),
    haveIchecked = false,
    uls,
    i,
    target = e;

  while (target.className.indexOf('form-element') === -1) {
    target = target.parentNode;
  }
  uls = target.getElementsByTagName('ul');
  input = target.getElementsByTagName('input')[0];
  for (i = 0; i < uls.length; i += 1) {
    if (uls[i].className.indexOf('file-selector') !== -1) {
      selector = uls[i];
    }
  }

  if (selector.children.length === 3 && haveIchecked === false) {
    haveIchecked = true;
    updateFileList(fileSelectorId, selector);
  } else if (selector.style.display === 'block') {
    selector.style.display = 'none';
  } else {
    selector.style.display = 'block';
  }
}

function documentSelect (e, documentSelectorId) {
  "use strict";
  var input = document.getElementById(documentSelectorId + "_input"),
    selector = document.getElementById(documentSelectorId + '_documentSelector'),
    haveIchecked = false,
    target = e,
    uls,
    i;

  while (target.className.indexOf('form-element') === -1) {
    target = target.parentNode;
  }
  uls = target.getElementsByTagName('ul');
  input = target.getElementsByTagName('input')[0];
  for (i = 0; i < uls.length; i += 1) {
    if (uls[i].className.indexOf('document-selector') !== -1) {
      selector = uls[i];
    }
  }

  if (selector.children.length === 2 && haveIchecked === false) {
    haveIchecked = true;
    httpGetAsync(cmsSubfolders + '/documents.json?' + Date.now(), function (result) {
      var documents = JSON.parse(result);

      parseDocuments(documents, selector, '/', '/', documentSelectorId);

      createSearchAble(selector, 'data-searchable');
      selector.style.display = 'block';
    });
  } else if (selector.style.display === 'block') {
    selector.style.display = 'none';
  } else {
    selector.style.display = 'block';
  }
}

function parseDocuments (documents, targetContainer, path, readablePath, documentSelectorId) {
  var i,
    documentNode,
    documentNameNode,
    pathNode,
    iconNode = document.createElement('i');
  iconNode.className = 'fa fa-file-text-o';

  for (i = 0; i < documents.length; i += 1) {
    if (documents[i].type === 'document') {
      documentNode = document.createElement('li');
      documentNameNode = document.createTextNode(documents[i].title);
      pathNode = document.createElement('span');
      pathNode.innerText = readablePath;
      pathNode.className = 'path';
      documentNode.appendChild(iconNode);
      documentNode.appendChild(pathNode);
      documentNode.appendChild(documentNameNode);

      documentNode.setAttribute("data-value", path + documents[i].slug);
      documentNode.setAttribute("data-searchable", readablePath + documents[i].title);
      documentNode.setAttribute("data-target-id", documentSelectorId);

      documentNode.onclick = selectDocument;

      targetContainer.appendChild(documentNode);
    } else if (documents[i].type === 'folder') {
      parseDocuments(documents[i].content, targetContainer, path + documents[i].slug + '/', readablePath + documents[i].title + '/', documentSelectorId);
    }
  }
}

function createSearchAble (element, searchDataValue) {
  "use strict";
  var searchBox = element.getElementsByTagName('input')[0],
    searchAbles = [],
    noResults,
    i;

  for (i = 0; i < element.children.length; i += 1) {
    if (element.children[i].hasAttribute(searchDataValue)) {
      searchAbles.push(element.children[i]);
    }
    if (element.children[i].className.indexOf('no-results') !== -1) {
      noResults = element.children[i];
    }
  }

  searchBox.oninput = function (e) {
    e = e ? e : window.event;
    var target = e.target ? e.target : e.srcElement,
      query = target.value.toLowerCase(),
      resultsFound = false;
    // Hide all
    noResults.style.display = 'none';
    for (i = 0; i < searchAbles.length; i += 1) {
      searchAbles[i].style.display = 'none';
    }
    // search
    for (i = 0; i < searchAbles.length; i += 1) {
      if (searchAbles[i].getAttribute(searchDataValue).toLowerCase().indexOf(query) !== -1) {
        searchAbles[i].style.display = 'block';
        resultsFound = true;
      }
    }
    if (resultsFound === false) {
      noResults.style.display = 'block';
    }
  };
  searchBox.onpropertychange = searchBox.oninput;
}

function selectFile (e) {
  "use strict";
  e = e ? e : window.event;
  var target = e.target ? e.target : e.srcElement;
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  var targetInput = document.getElementById(target.getAttribute('data-target-id') + '_input'),
    selectedFile = document.getElementById(target.getAttribute('data-target-id') + '_selectedFile'),
    iconNode,
    formElement,
    divs,
    i;

  formElement = target;
  while (formElement.className.indexOf('form-element') === -1) {
    formElement = formElement.parentNode;
  }
  targetInput = formElement.getElementsByTagName('input')[0];
  divs = formElement.getElementsByTagName('div');
  for (i = 0; i < divs.length; i += 1) {
    if (divs[i].className.indexOf('selected-file') !== -1) {
      selectedFile = divs[i];
    }
  }

  targetInput.setAttribute('value', target.getAttribute('data-value'));

  iconNode = document.createElement('i');
  iconNode.className = 'fa fa-' + iconByFileType(target.getAttribute('data-file-type'));

  selectedFile.innerHTML = '';
  selectedFile.appendChild(iconNode);

  target.parentNode.style.display = 'none';
}

function selectDocument (e) {
  "use strict";
  e = e ? e : window.event;
  var target = e.target ? e.target : e.srcElement;
  if (typeof e.preventDefault === 'function') {
    e.preventDefault();
  }
  if (target.nodeName === 'SPAN') {
    target = target.parentNode;
  }
  var targetInput = document.getElementById(target.getAttribute('data-target-id') + '_input'),
    selectedFile = document.getElementById(target.getAttribute('data-target-id') + '_selectedDocument'),
    iconNode,
    formElement,
    divs,
    i;

  formElement = target;
  while (formElement.className.indexOf('form-element') === -1) {
    formElement = formElement.parentNode;
  }
  targetInput = formElement.getElementsByTagName('input')[0];
  divs = formElement.getElementsByTagName('div');
  for (i = 0; i < divs.length; i += 1) {
    if (divs[i].className.indexOf('selected-file-type') !== -1) {
      selectedFile = divs[i];
    }
  }

  targetInput.setAttribute('value', target.getAttribute('data-value'));

  iconNode = document.createElement('i');
  iconNode.className = 'fa fa-file-text-o';

  selectedFile.innerHTML = '';
  selectedFile.appendChild(iconNode);

  target.parentNode.style.display = 'none';
}

function iconByFileType (fileType) {
  if (fileType.indexOf('image') !== -1) {
    return 'file-image-o';
  } else if (fileType.indexOf('pdf') !== -1) {
    return 'file-pdf-o';
  } else if (fileType.indexOf('audio') !== -1) {
    return 'file-audio-o';
  } else if (fileType.indexOf('text') !== -1) {
    return 'file-text-o';
  } else if (fileType.indexOf('x-msdownload') !== -1) {
    return 'windows';
  } else if (fileType.indexOf(array(
      'application/vnd.ms-excel',
      'application/msexcel',
      'application/xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.google-apps.spreadsheet'
    )) !== -1) {
    return 'file-excel-o';
  } else if (fileType.indexOf(array(
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )) !== -1) {
    return 'file-word-o';
  } else if (fileType.indexOf(array(
      'application/x-rar-compressed',
      'application/x-zip-compressed',
      'application/zip'
    )) !== -1) {
    return 'file-archive-o';
  }
  return 'file-o';
}

function processRtes () {
  var divs = document.getElementsByTagName('div'),
    i,
    code;
  for (i = 0; i < divs.length; i += 1) {
    if (divs[i].className.indexOf('note-editable panel-body') !== -1) {
      code = divs[i].innerHTML;

      var formElement = divs[i];
      while (formElement.className.indexOf('form-element') === -1) {
        formElement = formElement.parentNode;
      }
      var targetTextarea = formElement.getElementsByTagName('textarea')[1];
      targetTextarea.innerHTML = code;
    }
  }
  window.onbeforeunload = null;
  return true;
}

function addDynamicBrick (e, isStatic, dropzoneId) {
  "use strict";
  var slug,
    divs,
    i,
    id,
    myBrickSlug,
    url;
  if (isStatic === 'true') {
    slug = e.parentNode.getElementsByTagName('input')[0].value;
    myBrickSlug = e.parentNode.getElementsByTagName('input')[1].value;
    url = cmsSubfolders + '/documents/get-brick?slug=' + slug + "&static=" + isStatic + "&myBrickSlug=" + myBrickSlug;
  } else {
    slug = e.parentNode.getElementsByTagName('select')[0].value;
    url = cmsSubfolders + '/documents/get-brick?slug=' + slug + "&static=" + isStatic;
  }

  httpGetAsync(url, function (result) {
    var resultObject = JSON.parse(result);
    var li = document.createElement('li');
    li.className = 'brick form-element';
    li.innerHTML = resultObject.body;
    document.getElementById(dropzoneId).appendChild(li);

    $(".sortable").sortable({
      placeholder: "ui-state-highlight",
      axis: "y",
      forcePlaceholderSize: true,
      tolerance: "pointer",
      handle: "a.move",
      stop: function (event, ui) {
        window.onbeforeunload = function (e) {
          return 'You have unsaved changes. Are you sure you want to leave this page?';
        };
      }
    });
    applyDeleteButtons();
    applyAddButtons();

    for (i = 0; i < resultObject.rteList.length; i += 1) {
      id = resultObject.rteList[i];
      console.log($('#' + id));
      $('#' + id).summernote({
        height: 300,
        toolbar: [
          //[groupname, [button list]]

          ['style', ['bold', 'italic', 'underline', 'clear', 'style']],
          ['font', ['strikethrough', 'superscript', 'subscript']],
          ['para', ['ul', 'ol']],
          ['insert', ['table', 'link', 'picture']],
          ['misc', ['codeview']],
        ]
      });
    }

    divs = li.getElementsByTagName('div');
    for (i = 0; i < divs.length; i += 1) {
      if (divs[i].className.indexOf('summernote') !== -1) {
        id = divs[i].getAttribute('id');
        $('#' + id).summernote({
          height: 300,
          toolbar: [
            //[groupname, [button list]]

            ['style', ['bold', 'italic', 'underline', 'clear', 'style']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['para', ['ul', 'ol']],
            ['insert', ['table', 'link', 'picture']],
            ['misc', ['codeview']],
          ]
        });
      }
    }
  });
}

