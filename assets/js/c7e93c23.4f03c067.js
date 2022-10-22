"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2687],{2032:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>m});var r=n(1318);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=r.createContext({}),u=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(i.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,i=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=u(n),m=a,b=p["".concat(i,".").concat(m)]||p[m]||d[m]||l;return n?r.createElement(b,s(s({ref:t},c),{},{components:n})):r.createElement(b,s({ref:t},c))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,s=new Array(l);s[0]=p;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:a,s[1]=o;for(var u=2;u<l;u++)s[u]=n[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},4469:(e,t,n)=>{n.d(t,{Z:()=>s});var r=n(1318),a=n(6184);const l="tabItem_Ifv_";function s(e){let{children:t,hidden:n,className:s}=e;return r.createElement("div",{role:"tabpanel",className:(0,a.Z)(l,s),hidden:n},t)}},5523:(e,t,n)=>{n.d(t,{Z:()=>m});var r=n(4219),a=n(1318),l=n(6184),s=n(9183),o=n(9137),i=n(7101),u=n(8420);const c="tabList_zLeU",d="tabItem_e9qt";function p(e){var t,n;const{lazy:s,block:p,defaultValue:m,values:b,groupId:v,className:g}=e,w=a.Children.map(e.children,(e=>{if((0,a.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),f=null!=b?b:w.map((e=>{let{props:{value:t,label:n,attributes:r}}=e;return{value:t,label:n,attributes:r}})),y=(0,o.l)(f,((e,t)=>e.value===t.value));if(y.length>0)throw new Error('Docusaurus error: Duplicate values "'+y.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const h=null===m?m:null!=(t=null!=m?m:null==(n=w.find((e=>e.props.default)))?void 0:n.props.value)?t:w[0].props.value;if(null!==h&&!f.some((e=>e.value===h)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+h+'" but none of its children has the corresponding value. Available values are: '+f.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:k,setTabGroupChoices:x}=(0,i.U)(),[j,T]=(0,a.useState)(h),O=[],{blockElementScrollPositionUntilNextRender:N}=(0,u.o5)();if(null!=v){const e=k[v];null!=e&&e!==j&&f.some((t=>t.value===e))&&T(e)}const E=e=>{const t=e.currentTarget,n=O.indexOf(t),r=f[n].value;r!==j&&(N(t),T(r),null!=v&&x(v,String(r)))},I=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var r;const t=O.indexOf(e.currentTarget)+1;n=null!=(r=O[t])?r:O[0];break}case"ArrowLeft":{var a;const t=O.indexOf(e.currentTarget)-1;n=null!=(a=O[t])?a:O[O.length-1];break}}null==(t=n)||t.focus()};return a.createElement("div",{className:(0,l.Z)("tabs-container",c)},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,l.Z)("tabs",{"tabs--block":p},g)},f.map((e=>{let{value:t,label:n,attributes:s}=e;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:j===t?0:-1,"aria-selected":j===t,key:t,ref:e=>O.push(e),onKeyDown:I,onFocus:E,onClick:E},s,{className:(0,l.Z)("tabs__item",d,null==s?void 0:s.className,{"tabs__item--active":j===t})}),null!=n?n:t)}))),s?(0,a.cloneElement)(w.filter((e=>e.props.value===j))[0],{className:"margin-top--md"}):a.createElement("div",{className:"margin-top--md"},w.map(((e,t)=>(0,a.cloneElement)(e,{key:t,hidden:e.props.value!==j})))))}function m(e){const t=(0,s.Z)();return a.createElement(p,(0,r.Z)({key:String(t)},e))}},6869:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>u,toc:()=>d});var r=n(4219),a=(n(1318),n(2032)),l=n(5523),s=n(4469);const o={sidebar_position:2},i="Getting started",u={unversionedId:"get-started",id:"get-started",title:"Getting started",description:"Overview",source:"@site/docs/get-started.mdx",sourceDirName:".",slug:"/get-started",permalink:"/xbell/docs/get-started",draft:!1,editUrl:"https://github.com/x-bell/xbell/tree/main/website/docs/get-started.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"docs",previous:{title:"Guide",permalink:"/xbell/docs/category/guide"},next:{title:"Unit Testing",permalink:"/xbell/docs/unit-testing"}},c={},d=[{value:"Overview",id:"overview",level:2},{value:"Installation",id:"installation",level:2},{value:"Writing Tests",id:"writing-tests",level:2},{value:"Way 1: Node.js Testing",id:"way-1-nodejs-testing",level:3},{value:"Way 2: Browser Testing",id:"way-2-browser-testing",level:3},{value:"Way 3: Nodejs &amp; Browser",id:"way-3-nodejs--browser",level:3}],p={toc:d};function m(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"getting-started"},"Getting started"),(0,a.kt)("h2",{id:"overview"},"Overview"),(0,a.kt)("p",null,"XBell is a modern web testing framework that combines unit testing with end-to-end testing."),(0,a.kt)("p",null,"You can freely switch between Node.js and Browser environments to test your code in one case."),(0,a.kt)("h2",{id:"installation"},"Installation"),(0,a.kt)(l.Z,{mdxType:"Tabs"},(0,a.kt)(s.Z,{value:"npm",label:"npm",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ npm install xbell\n\n# install browser\n$ npx xbell install browser\n\n$ npx xbell\n"))),(0,a.kt)(s.Z,{value:"yarn",label:"yarn",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ yarn add xbell\n\n# install browser\n$ npx xbell install browser\n\n$ yarn test\n"))),(0,a.kt)(s.Z,{value:"pnpm",label:"pnpm",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ pnpm add xbell\n\n# install browsers\n$ pnpm exec xbell install browser\n\n$ pnpm exec xbell\n")))),(0,a.kt)("h2",{id:"writing-tests"},"Writing Tests"),(0,a.kt)("h3",{id:"way-1-nodejs-testing"},"Way 1: Node.js Testing"),(0,a.kt)("p",null,"Test the code in nodejs"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="test-nodejs.test.js"',title:'"test-nodejs.test.js"'},"import { test, expect } from 'xbell';\n// import to nodejs\nimport { add } from './add';\n\ntest('test the code in nodejs', () => {\n  expect(add(1, 1)).toBe(2);\n});\n\n")),(0,a.kt)("h3",{id:"way-2-browser-testing"},"Way 2: Browser Testing"),(0,a.kt)("p",null,"Test the code in browser"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="test-browser.test.js"',title:'"test-browser.test.js"'},"import { test } from 'xbell';\n\ntest.browser('test the code in browser', async ({ expect }) => {\n  // 1. import to browser\n  const { add } = await import('./add');\n  // 2. expect in browser\n  expect(add(1, 1)).toBe(2);\n});\n")),(0,a.kt)("h3",{id:"way-3-nodejs--browser"},"Way 3: Nodejs & Browser"),(0,a.kt)("p",null,"You can even run some code in NodeJS and some in the browser in just one case."),(0,a.kt)("p",null,"Alternatively, you can run the code in browser, make assertions in nodejs."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-javascript"},"import { test } from 'xbell';\n\ntest('test the code in browser', async ({ page }) => {\n  // browser page\n  await page.evalute(async () => {\n    // 1. import to browser\n    const { add } = await import('./add');\n    // 2. render to browser\n    document.body.innerHTML = `<div>result is ${result}</div>`;\n  });\n\n  // 3. assetion in nodejs\n  await expect(page).toMatchSnapShot({\n    name: 'result-screenshot'\n  });\n});\n")))}m.isMDXComponent=!0}}]);