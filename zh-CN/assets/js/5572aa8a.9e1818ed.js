"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5483],{2032:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>d});var r=n(1318);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var i=r.createContext({}),u=function(e){var t=r.useContext(i),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},p=function(e){var t=u(e.components);return r.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),m=u(n),d=o,f=m["".concat(i,".").concat(d)]||m[d]||s[d]||a;return n?r.createElement(f,l(l({ref:t},p),{},{components:n})):r.createElement(f,l({ref:t},p))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=m;var c={};for(var i in t)hasOwnProperty.call(t,i)&&(c[i]=t[i]);c.originalType=e,c.mdxType="string"==typeof e?e:o,l[1]=c;for(var u=2;u<a;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4143:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>l,default:()=>s,frontMatter:()=>a,metadata:()=>c,toc:()=>u});var r=n(4219),o=(n(1318),n(2032));const a={sidebar_position:2},l="\u7ec4\u4ef6\u6d4b\u8bd5",c={unversionedId:"component-testing",id:"component-testing",title:"\u7ec4\u4ef6\u6d4b\u8bd5",description:"\u6b64\u5904\u7684\u7ec4\u4ef6\u6d4b\u8bd5\u662f\u6307\u57fa\u4e8e\u524d\u7aef\u6846\u67b6\u4e4b\u4e0a\u7684\u5355\u5143\u6d4b\u8bd5\uff0c\u5982 react\u3001vue \u7b49\u3002",source:"@site/i18n/zh-CN/docusaurus-plugin-content-docs/current/component-testing.mdx",sourceDirName:".",slug:"/component-testing",permalink:"/xbell/zh-CN/docs/component-testing",draft:!1,editUrl:"https://github.com/x-bell/xbell/tree/main/website/docs/component-testing.mdx",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"docs",previous:{title:"\u5355\u5143\u6d4b\u8bd5",permalink:"/xbell/zh-CN/docs/unit-testing"},next:{title:"\u7aef\u5230\u7aef\u6d4b\u8bd5",permalink:"/xbell/zh-CN/docs/e2e-testing"}},i={},u=[{value:"React",id:"react",level:2},{value:"Vue",id:"vue",level:2}],p={toc:u};function s(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"\u7ec4\u4ef6\u6d4b\u8bd5"},"\u7ec4\u4ef6\u6d4b\u8bd5"),(0,o.kt)("p",null,"\u6b64\u5904\u7684\u7ec4\u4ef6\u6d4b\u8bd5\u662f\u6307\u57fa\u4e8e\u524d\u7aef\u6846\u67b6\u4e4b\u4e0a\u7684\u5355\u5143\u6d4b\u8bd5\uff0c\u5982 react\u3001vue \u7b49\u3002"),(0,o.kt)("h2",{id:"react"},"React"),(0,o.kt)("p",null,"XBell \u63d0\u4f9b\u4e86\u5f00\u7bb1\u5373\u7528\u7684 react \u63d2\u4ef6\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ npm install xbell @xbell/react\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},"import { test } from '@xbell/react';\n\ntest('react example', async ({ expect, fn, mount }) => {\n  const { default: Button } = await import('./Button');\n  const handleClick = fn();\n\n  mount(<Button onClick={handleClick}>\u6309\u94ae</Button>);\n\n  expect(handleClick).toHaveBeenCalled();\n});\n")),(0,o.kt)("h2",{id:"vue"},"Vue"),(0,o.kt)("p",null,"XBell \u63d0\u4f9b\u4e86\u5f00\u7bb1\u5373\u7528\u7684 vue \u63d2\u4ef6\u3002"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ npm install xbell @xbell/vue\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-jsx"},"import { test } from '@xbell/vue';\n\ntest('react example', async ({ expect, fn, mount }) => {\n  const { default: Button } = await import('./button');\n  const handleClick = fn();\n\n  mount(<Button onClick={handleClick}>\u6309\u94ae</Button>);\n\n  expect(handleClick).toHaveBeenCalled();\n});\n")))}s.isMDXComponent=!0}}]);