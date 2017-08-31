"use strict";
const cc = require('cloud-control-frontend');

cc.targetCssFile='cms.css';
cc.targetSassFile='cms.build.css';
cc.targetJsFile='cms.build.js';
cc.targetJsMinFile='cms.js';
cc.targetJsPath='./../cloudcontrol/public/js/';
cc.targetCssPath='./../cloudcontrol/public/css/';
cc.run();