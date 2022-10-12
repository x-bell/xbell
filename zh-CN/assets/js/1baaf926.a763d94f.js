"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3186],{2032:(e,t,r)=>{r.d(t,{Zo:()=>s,kt:()=>f});var n=r(1318);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),i=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):p(p({},t),e)),r},s=function(e){var t=i(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),m=i(r),f=a,d=m["".concat(l,".").concat(f)]||m[f]||u[f]||o;return r?n.createElement(d,p(p({ref:t},s),{},{components:r})):n.createElement(d,p({ref:t},s))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,p=new Array(o);p[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,p[1]=c;for(var i=2;i<o;i++)p[i]=r[i];return n.createElement.apply(null,p)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4893:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>p,default:()=>u,frontMatter:()=>o,metadata:()=>c,toc:()=>i});var n=r(4219),a=(r(1318),r(2032));const o={sidebar_label:"\u65ad\u8a00"},p="\u65ad\u8a00\u88c5\u9970\u5668",c={unversionedId:"api/expect-decorator",id:"api/expect-decorator",title:"\u65ad\u8a00\u88c5\u9970\u5668",description:"Expect.NoPageError",source:"@site/docs/api/expect-decorator.md",sourceDirName:"api",slug:"/api/expect-decorator",permalink:"/xbell/zh-CN/docs/api/expect-decorator",draft:!1,editUrl:"https://github.com/x-bell/xbell/tree/main/website/docs/api/expect-decorator.md",tags:[],version:"current",frontMatter:{sidebar_label:"\u65ad\u8a00"},sidebar:"api",previous:{title:"\u7528\u4f8b",permalink:"/xbell/zh-CN/docs/api/decorator"},next:{title:"\u67e5\u8be2",permalink:"/xbell/zh-CN/docs/api/query"}},l={},i=[{value:"Expect.NoPageError",id:"expectnopageerror",level:2},{value:"Expect.ToMatchSnapshot",id:"expecttomatchsnapshot",level:2}],s={toc:i};function u(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"\u65ad\u8a00\u88c5\u9970\u5668"},"\u65ad\u8a00\u88c5\u9970\u5668"),(0,a.kt)("h2",{id:"expectnopageerror"},"Expect.NoPageError"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u65ad\u8a00\u9875\u9762\u65e0\u62a5\u9519")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { Expect } from 'xbell';\n@Case('demo\u7528\u4f8b')\n@Expect.NoPageError()\nasync testCase() {\n   // ...\n}\n")),(0,a.kt)("h2",{id:"expecttomatchsnapshot"},"Expect.ToMatchSnapshot"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u9875\u9762\u622a\u56fe\u5e76\u5bf9\u6bd4")),(0,a.kt)("p",null,"\u521d\u6b21\u8fd0\u884c\u53ea\u4f1a\u8fdb\u884c\u622a\u56fe\u5b58\u5728 ",(0,a.kt)("inlineCode",{parentName:"p"},"__snapshots__/<groupName>/<caseName>/")," \u76ee\u5f55\u4e0b\uff0c\u8fd9\u65f6\u5019\u9700\u8981\u4eba\u5de5\u53bb\u786e\u8ba4\u622a\u56fe\u662f\u5426\u65e0\u8bef\u3002\u4ece\u7b2c\u4e8c\u6b21\u5f00\u59cb\uff0c\u5c06\u4f1a\u5bf9",(0,a.kt)("inlineCode",{parentName:"p"},"__snapshots__"),"\u5df2\u6709\u7684\u622a\u56fe\u53bb\u8fdb\u884c\u5bf9\u6bd4\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"@Case('demo\u7528\u4f8b')\n@Expect.ToMatchSnapshot({ name: '\u5c4f\u5e55\u622a\u56fe' })\nasync testCase() {\n   // ...\n}\n")),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"\u53c2\u6570")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"snapshotOptions",(0,a.kt)("ul",{parentName:"li"},(0,a.kt)("li",{parentName:"ul"},"name: sring\uff08\u5feb\u7167\u540d\u79f0)"),(0,a.kt)("li",{parentName:"ul"},"maxDiffPixels: number(\u5141\u8bb8 diff \u7684\u50cf\u7d20\u503c\uff0c\u9ed8\u8ba4\u4e3a 0)"),(0,a.kt)("li",{parentName:"ul"},"maxDiffPixelRatio: number(\u5141\u8bb8 diff \u7684\u50cf\u7d20\u6bd4\u4f8b\uff1a0~1\uff0c\u82e5\u5df2\u7ecf\u8bbe\u7f6e\u4e86 maxDiffPixels\uff0c\u5219\u4e0d\u751f\u6548)")))))}u.isMDXComponent=!0}}]);