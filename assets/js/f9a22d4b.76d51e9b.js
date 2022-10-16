"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9469],{2032:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var i=n(1318);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function r(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},l=Object.keys(e);for(i=0;i<l.length;i++)n=l[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(i=0;i<l.length;i++)n=l[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=i.createContext({}),p=function(e){var t=i.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):r(r({},t),e)),n},u=function(e){var t=p(e.components);return i.createElement(o.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},c=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),c=p(n),d=a,k=c["".concat(o,".").concat(d)]||c[d]||m[d]||l;return n?i.createElement(k,r(r({ref:t},u),{},{components:n})):i.createElement(k,r({ref:t},u))}));function d(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,r=new Array(l);r[0]=c;var s={};for(var o in t)hasOwnProperty.call(t,o)&&(s[o]=t[o]);s.originalType=e,s.mdxType="string"==typeof e?e:a,r[1]=s;for(var p=2;p<l;p++)r[p]=n[p];return i.createElement.apply(null,r)}return i.createElement.apply(null,n)}c.displayName="MDXCreateElement"},8508:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>r,default:()=>m,frontMatter:()=>l,metadata:()=>s,toc:()=>p});var i=n(4219),a=(n(1318),n(2032));const l={title:"Test"},r=void 0,s={unversionedId:"api/test",id:"api/test",title:"Test",description:"test",source:"@site/docs/api/test.mdx",sourceDirName:"api",slug:"/api/test",permalink:"/xbell/docs/api/test",draft:!1,editUrl:"https://github.com/x-bell/xbell/tree/main/website/docs/api/test.mdx",tags:[],version:"current",frontMatter:{title:"Test"},sidebar:"api",next:{title:"Config",permalink:"/xbell/docs/api/config"}},o={},p=[{value:"test",id:"test",level:2},{value:"test.each",id:"testeach",level:3},{value:"test.batch",id:"testbatch",level:3},{value:"test.todo",id:"testtodo",level:3},{value:"test.only",id:"testonly",level:3},{value:"test.skip",id:"testskip",level:3},{value:"test.browser",id:"testbrowser",level:2},{value:"test.browser.each",id:"testbrowsereach",level:3},{value:"test.browser.batch",id:"testbrowserbatch",level:3},{value:"test.browser.todo",id:"testbrowsertodo",level:3},{value:"test.browser.only",id:"testbrowseronly",level:3},{value:"test.browser.skip",id:"testbrowserskip",level:3},{value:"describe",id:"describe",level:2},{value:"describe.skip",id:"describeskip",level:3},{value:"describe.only",id:"describeonly",level:3},{value:"describe.todo",id:"describetodo",level:3}],u={toc:p};function m(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,i.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"test"},"test"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"test")," is the most basic tool method in ",(0,a.kt)("strong",{parentName:"p"},"XBell")," for declaring and writing test case."),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import test from 'xbell';\n\ntest('goto github', async ({ page }) => {\n  await page.goto('https://github.com');\n});\n")),(0,a.kt)("h3",{id:"testeach"},"test.each"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.each(items)(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"items")," ",(0,a.kt)("type",null,"T[]")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"(item: T) => string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments & { item: T }) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("p",null,"Generate multiple test cases."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { test } from 'xbell';\n\ntest.each([1, 2, 3])(\n  (item, index) => `case data is ${item}, index is ${index}`,\n  ({ expect, item }) => {\n    expect(item).toBe(index + 1);\n  }\n);\n")),(0,a.kt)("h3",{id:"testbatch"},"test.batch"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.batch(items)(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"items")," ",(0,a.kt)("type",null,"T[]")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments & { item: T }) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("p",null,"Unlike ",(0,a.kt)("inlineCode",{parentName:"p"},"test.each")," ,  ",(0,a.kt)("inlineCode",{parentName:"p"},"test.batch")," only generates one test case, so if one item fails, this test case will fail."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { test } from 'xbell';\n\ntest.batch([1, 2, 3])(\n  'item is equal to the index plus one',\n  ({ expect, item }) => {\n    expect(item).toBe(index + 1);\n  }\n);\n")),(0,a.kt)("h3",{id:"testtodo"},"test.todo"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.todo(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"test.todo('goto github', async (page) => {\n  await page.goto('https://github.com');\n});\n")),(0,a.kt)("h3",{id:"testonly"},"test.only"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.only(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"test.only('goto github', async (page) => {\n  await page.goto('https://github.com');\n});\n")),(0,a.kt)("h3",{id:"testskip"},"test.skip"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.skip(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"test.skip('goto github', async (page) => {\n  await page.goto('https://github.com');\n});\n")),(0,a.kt)("h2",{id:"testbrowser"},"test.browser"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.browser(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { test } from 'xbell';\n\ntest.browser('one plus one equals two', async ({ page, expect }) => {\n  const { add } = await import('./add.ts');\n  expect(add(1, 1)).toBe(2);\n});\n")),(0,a.kt)("h3",{id:"testbrowsereach"},"test.browser.each"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.browser.each(items)(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"items")," ",(0,a.kt)("type",null,"T[]")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"(item: T) => string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments & { item: T }) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("p",null,"Generate multiple test cases."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { test } from 'xbell';\n\ntest.browser.each([1, 2, 3])(\n  (item, index) => `case data is ${item}, index is ${index}`,\n  ({ expect, item }) => {\n    expect(item).toBe(index + 1);\n  }\n);\n")),(0,a.kt)("h3",{id:"testbrowserbatch"},"test.browser.batch"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.browser.batch(items)(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"items")," ",(0,a.kt)("type",null,"T[]")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments & { item: T }) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("p",null,"Unlike ",(0,a.kt)("inlineCode",{parentName:"p"},"test.each")," ,  ",(0,a.kt)("inlineCode",{parentName:"p"},"test.batch")," only generates one test case, so if one item fails, this test case will fail."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"import { test } from 'xbell';\n\ntest.browser.batch([1, 2, 3])(\n  'item is equal to the index plus one',\n  ({ expect, item }) => {\n    expect(item).toBe(index + 1);\n  }\n);\n")),(0,a.kt)("h3",{id:"testbrowsertodo"},"test.browser.todo"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.browser.todo(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"test.browser.todo('goto github', async (page) => {\n  await page.goto('https://github.com');\n});\n")),(0,a.kt)("h3",{id:"testbrowseronly"},"test.browser.only"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.browser.only(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"test.browser.only('goto github', async (page) => {\n  await page.goto('https://github.com');\n});\n")),(0,a.kt)("h3",{id:"testbrowserskip"},"test.browser.skip"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: test.browser.skip(displayName, testFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"displayName")," ",(0,a.kt)("type",null,"string")," case name"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testFunction")," ",(0,a.kt)("type",null,"(args: TestArguments) => void | Promise","<","void",">"," ")," test function")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"test.browser.skip('goto github', async (page) => {\n  await page.goto('https://github.com');\n});\n")),(0,a.kt)("h2",{id:"describe"},"describe"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: describe(description, testGroupFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"description")," : ",(0,a.kt)("type",null,"string")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testGroupFunction")," : ",(0,a.kt)("type",null,"() => void;"))),(0,a.kt)("h3",{id:"describeskip"},"describe.skip"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: describe.skip(description, testGroupFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"description")," : ",(0,a.kt)("type",null,"string")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testGroupFunction")," : ",(0,a.kt)("type",null,"() => void;"))),(0,a.kt)("h3",{id:"describeonly"},"describe.only"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: describe.only(description, testGroupFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"description")," : ",(0,a.kt)("type",null,"string")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testGroupFunction")," : ",(0,a.kt)("type",null,"() => void;"))),(0,a.kt)("h3",{id:"describetodo"},"describe.todo"),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Signature: describe.todo(description, testGroupFunction)")),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"description")," : ",(0,a.kt)("type",null,"string")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"testGroupFunction")," : ",(0,a.kt)("type",null,"() => void;"))))}m.isMDXComponent=!0}}]);