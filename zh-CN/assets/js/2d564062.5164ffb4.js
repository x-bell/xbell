"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3255],{2032:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(1318);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),u=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,i=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),d=u(n),m=a,b=d["".concat(i,".").concat(m)]||d[m]||p[m]||l;return n?r.createElement(b,s(s({ref:t},c),{},{components:n})):r.createElement(b,s({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,s=new Array(l);s[0]=d;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var u=2;u<l;u++)s[u]=n[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4469:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(1318),a=n(6184);const l="tabItem_Ifv_";function s(e){let{children:t,hidden:n,className:s}=e;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(l,s),hidden:n},t)}},5523:(e,t,n)=>{n.d(t,{Z:()=>m});var r=n(4219),a=n(1318),l=n(6184),s=n(9183),o=n(9137),i=n(7101),u=n(8420);const c="tabList_zLeU",p="tabItem_e9qt";function d(e){var t,n;const{lazy:s,block:d,defaultValue:m,values:b,groupId:v,className:f}=e,y=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=b?b:y.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),w=(0,o.l)(g,((e,t)=>e.value===t.value));if(w.length>0)throw new Error('Docusaurus error: Duplicate values "'+w.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const h=null===m?m:null!=(t=null!=m?m:null==(n=y.find((e=>e.props.default)))?void 0:n.props.value)?t:y[0].props.value;if(null!==h&&!g.some((e=>e.value===h)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+h+'" but none of its children has the corresponding value. Available values are: '+g.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:j}=(0,i.U)(),[x,T]=(0,a.useState)(h),N=[],{blockElementScrollPositionUntilNextRender:O}=(0,u.o5)();if(null!=v){const e=k[v];null!=e&&e!==x&&g.some((t=>t.value===e))&&T(e)}const E=e=>{const t=e.currentTarget,n=N.indexOf(t),r=g[n].value;r!==x&&(O(t),T(r),null!=v&&j(v,String(r)))},C=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var r;const t=N.indexOf(e.currentTarget)+1;n=null!=(r=N[t])?r:N[0];break}case"ArrowLeft":{var a;const t=N.indexOf(e.currentTarget)-1;n=null!=(a=N[t])?a:N[N.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:(0,l.Z)("tabs-container",c)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":d},f)},g.map((e=>{let{value:t,label:n,attributes:s}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:x===t?0:-1,"aria-selected":x===t,key:t,ref:e=>N.push(e),onKeyDown:C,onFocus:E,onClick:E},s,{className:(0,l.Z)("tabs__item",p,null==s?void 0:s.className,{"tabs__item--active":x===t})}),null!=n?n:t)}))),s?(0,a.cloneElement)(y.filter((e=>e.props.value===x))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},y.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==x})))))}function m(e){const t=(0,s.Z)();return a.createElement(d,(0,r.Z)({key:String(t)},e))}},9899:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>u,toc:()=>p});var r=n(4219),a=(n(1318),n(2032)),l=n(5523),s=n(4469);const o={sidebar_position:2},i="\u5feb\u901f\u5f00\u59cb",u={unversionedId:"get-started",id:"get-started",title:"\u5feb\u901f\u5f00\u59cb",description:"\u7b80\u4ecb",source:"@site/i18n/zh-CN/docusaurus-plugin-content-docs/current/get-started.mdx",sourceDirName:".",slug:"/get-started",permalink:"/xbell/zh-CN/docs/get-started",draft:!1,editUrl:"https://github.com/x-bell/xbell/tree/main/website/docs/get-started.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"docs",previous:{title:"Guide",permalink:"/xbell/zh-CN/docs/category/guide"},next:{title:"\u5355\u5143\u6d4b\u8bd5",permalink:"/xbell/zh-CN/docs/unit-testing"}},c={},p=[{value:"\u7b80\u4ecb",id:"\u7b80\u4ecb",level:2},{value:"\u5b89\u88c5",id:"\u5b89\u88c5",level:2},{value:"Writing Tests",id:"writing-tests",level:2},{value:"Way 1: Node.js Testing",id:"way-1-nodejs-testing",level:3},{value:"Way 2: Browser Testing",id:"way-2-browser-testing",level:3},{value:"Way 3: Nodejs &amp; Browser",id:"way-3-nodejs--browser",level:3}],d={toc:p};function m(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"\u5feb\u901f\u5f00\u59cb"},"\u5feb\u901f\u5f00\u59cb"),(0,a.kt)("h2",{id:"\u7b80\u4ecb"},"\u7b80\u4ecb"),(0,a.kt)("p",null,"XBell \u662f\u4e00\u4e2a\u73b0\u4ee3 Web \u6d4b\u8bd5\u6846\u67b6\uff0c\u5b83\u5f88\u597d\u5730\u7ed3\u5408\u4e86\u5355\u5143\u6d4b\u8bd5\u548c E2E \u6d4b\u8bd5\u3002"),(0,a.kt)("p",null,"\u540c\u65f6\u4f60\u53ef\u4ee5\u81ea\u7531\u5730\u9009\u62e9\u5728 Node.js \u6216\u6d4f\u89c8\u5668\u4e2d\u8fdb\u884c\u6d4b\u8bd5\u3002"),(0,a.kt)("h2",{id:"\u5b89\u88c5"},"\u5b89\u88c5"),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(s.Z,{value:"npm",label:"npm",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ npm create xbell\n\n# install browsers\n$ npm run install:browser\n\n$ npm test\n"))),(0,a.kt)(s.Z,{value:"yarn",label:"yarn",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn create xbell\n\n# install browsers\n$ yarn install:browser\n\n$ yarn test\n"))),(0,a.kt)(s.Z,{value:"pnpm",label:"pnpm",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ pnpm create xbell\n\n# install browsers\n$ pnpm install:browser\n\n$ pnpm test\n")))),(0,a.kt)("h2",{id:"writing-tests"},"Writing Tests"),(0,a.kt)("h3",{id:"way-1-nodejs-testing"},"Way 1: Node.js Testing"),(0,a.kt)("p",null,"Test the code in nodejs"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="test-nodejs.test.js"',title:'"test-nodejs.test.js"'},"import { test, expect } from 'xbell';\n// import to nodejs\nimport { add } from './add';\n\ntest('test the code in nodejs', () => {\n  expect(add(1, 1)).toBe(2);\n});\n\n")),(0,a.kt)("h3",{id:"way-2-browser-testing"},"Way 2: Browser Testing"),(0,a.kt)("p",null,"Test the code in browser"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="test-browser.test.js"',title:'"test-browser.test.js"'},"import { test } from 'xbell';\n\ntest.browser('test the code in browser', async ({ expect }) => {\n  // 1. import to browser\n  const { add } = await import('./add');\n  // 2. expect in browser\n  expect(add(1, 1)).toBe(2);\n});\n")),(0,a.kt)("h3",{id:"way-3-nodejs--browser"},"Way 3: Nodejs & Browser"),(0,a.kt)("p",null,"You can even run some code in NodeJS and some in the browser in just one case."),(0,a.kt)("p",null,"Alternatively, you can run the code in browser, make assertions in nodejs."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},"import { test } from 'xbell';\n\ntest('test the code in browser', async ({ page }) => {\n  // browser page\n  await page.evalute(async () => {\n    // 1. import to browser\n    const { add } = await import('./add');\n    // 2. render to browser\n    document.body.innerHTML = `<div>result is ${result}</div>`;\n  });\n\n  // 3. assetion in nodejs\n  await expect(page).toMatchSnapShot({\n    name: 'result-screenshot'\n  });\n});\n")))}m.isMDXComponent=!0}}]);