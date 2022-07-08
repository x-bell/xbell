
import React from 'react';
import ReactDOM from 'react-dom';

const jsxGetterMap = new Map();

function registerJSXGetter(key, getJsxGetter) {
  jsxGetterMap.set(key, getJsxGetter);
}

window.__create_jsx = (componentInfo) => {
  const jsxMethod = jsxMethodMap.get(componentInfo.key);
  return jsxEle = jsxMethod(componentInfo.payload);
}

window.__xbell_mount = (componentInfo) => {
  ReactDOM.render(
    createJSX(componentInfo),
    document.getElementById('root')
  );
};
