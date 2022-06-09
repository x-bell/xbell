"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4092],{2032:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return f}});var r=n(1318);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),u=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),p=u(n),f=o,b=p["".concat(c,".").concat(f)]||p[f]||d[f]||i;return n?r.createElement(b,a(a({ref:t},s),{},{components:n})):r.createElement(b,a({ref:t},s))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=p;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:o,a[1]=l;for(var u=2;u<i;u++)a[u]=n[u];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},482:function(e,t,n){n.r(t),n.d(t,{assets:function(){return s},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return d}});var r=n(6763),o=n(7021),i=(n(1318),n(2032)),a=["components"],l={sidebar_position:4},c=void 0,u={unversionedId:"debug/index",id:"debug/index",title:"index",description:"\u8c03\u8bd5",source:"@site/docs/debug/index.md",sourceDirName:"debug",slug:"/debug/",permalink:"/xbell/docs/debug/",draft:!1,editUrl:"https://github.com/x-bell/xbell/tree/main/website/docs/debug/index.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"\u6570\u636e\u9a71\u52a8\u6d4b\u8bd5 - DDT",permalink:"/xbell/docs/data"},next:{title:"API(\u5f85\u8865\u5145...)",permalink:"/xbell/docs/api"}},s={},d=[{value:"\u8c03\u8bd5",id:"\u8c03\u8bd5",level:2},{value:"VSCode \u63d2\u4ef6",id:"vscode-\u63d2\u4ef6",level:2}],p={toc:d};function f(e){var t=e.components,l=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},p,l,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"\u8c03\u8bd5"},"\u8c03\u8bd5"),(0,i.kt)("p",null,"XBell \u5728\u8fd0\u884c\u65f6\uff0c\u4f1a\u6e05\u7a7a\u7ec8\u7aef\u7684\u6253\u5370\uff0c\u5982\u679c\u9700\u8981\u67e5\u770b\u81ea\u5df1\u7684\u4e00\u4e9b console\uff0c\u53ef\u4ee5\u901a\u8fc7\u4e0b\u9762\u547d\u4ee4\u8fd0\u884c"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"$ xbell --debug\n")),(0,i.kt)("h2",{id:"vscode-\u63d2\u4ef6"},"VSCode \u63d2\u4ef6"),(0,i.kt)("p",null,"VSCode \u5546\u5e97\u641c\u7d22 XBell\uff0c\u5b89\u88c5"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"VSCode\u63d2\u4ef6",src:n(5599).Z,width:"2210",height:"642"})),(0,i.kt)("p",null,"\u8bbe\u7f6e\u540e\u65ad\u70b9\u540e\uff0c\u70b9\u51fb Case \u4e0a\u7684\u300c\u8c03\u8bd5\u300d\uff0c\u8fdb\u5165 debug \u6a21\u5f0f"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"VSCode\u63d2\u4ef6",src:n(8815).Z,width:"2602",height:"1584"})))}f.isMDXComponent=!0},8815:function(e,t,n){t.Z=n.p+"assets/images/xbell-vscode-debug-dc22a17dcaf7d61f2ab32d756eb15998.png"},5599:function(e,t,n){t.Z=n.p+"assets/images/xbell-vscode-d303324cf72e8bfe1f195200bd6f0d64.png"}}]);