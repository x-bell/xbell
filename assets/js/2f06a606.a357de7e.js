"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2669],{2032:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>d});var a=n(1318);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},r=Object.keys(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(a=0;a<r.length;a++)n=r[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var p=a.createContext({}),s=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=s(e.components);return a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},c=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,r=e.originalType,p=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),c=s(n),d=l,k=c["".concat(p,".").concat(d)]||c[d]||m[d]||r;return n?a.createElement(k,o(o({ref:t},u),{},{components:n})):a.createElement(k,o({ref:t},u))}));function d(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var r=n.length,o=new Array(r);o[0]=c;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:l,o[1]=i;for(var s=2;s<r;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}c.displayName="MDXCreateElement"},4469:(e,t,n)=>{n.d(t,{Z:()=>o});var a=n(1318),l=n(6184);const r="tabItem_Ifv_";function o(e){let{children:t,hidden:n,className:o}=e;return a.createElement("div",{role:"tabpanel",className:(0,l.Z)(r,o),hidden:n},t)}},5523:(e,t,n)=>{n.d(t,{Z:()=>d});var a=n(4219),l=n(1318),r=n(6184),o=n(9183),i=n(9137),p=n(7101),s=n(8420);const u="tabList_zLeU",m="tabItem_e9qt";function c(e){var t,n;const{lazy:o,block:c,defaultValue:d,values:k,groupId:g,className:b}=e,v=l.Children.map(e.children,(e=>{if((0,l.isValidElement)(e)&&"value"in e.props)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),y=null!=k?k:v.map((e=>{let{props:{value:t,label:n,attributes:a}}=e;return{value:t,label:n,attributes:a}})),h=(0,i.l)(y,((e,t)=>e.value===t.value));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((e=>e.value)).join(", ")+'" found in <Tabs>. Every value needs to be unique.');const f=null===d?d:null!=(t=null!=d?d:null==(n=v.find((e=>e.props.default)))?void 0:n.props.value)?t:v[0].props.value;if(null!==f&&!y.some((e=>e.value===f)))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+f+'" but none of its children has the corresponding value. Available values are: '+y.map((e=>e.value)).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");const{tabGroupChoices:N,setTabGroupChoices:x}=(0,p.U)(),[j,w]=(0,l.useState)(f),T=[],{blockElementScrollPositionUntilNextRender:B}=(0,s.o5)();if(null!=g){const e=N[g];null!=e&&e!==j&&y.some((t=>t.value===e))&&w(e)}const O=e=>{const t=e.currentTarget,n=T.indexOf(t),a=y[n].value;a!==j&&(B(t),w(a),null!=g&&x(g,String(a)))},C=e=>{var t;let n=null;switch(e.key){case"ArrowRight":{var a;const t=T.indexOf(e.currentTarget)+1;n=null!=(a=T[t])?a:T[0];break}case"ArrowLeft":{var l;const t=T.indexOf(e.currentTarget)-1;n=null!=(l=T[t])?l:T[T.length-1];break}}null==(t=n)||t.focus()};return l.createElement("div",{className:(0,r.Z)("tabs-container",u)},l.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":c},b)},y.map((e=>{let{value:t,label:n,attributes:o}=e;return l.createElement("li",(0,a.Z)({role:"tab",tabIndex:j===t?0:-1,"aria-selected":j===t,key:t,ref:e=>T.push(e),onKeyDown:C,onFocus:O,onClick:O},o,{className:(0,r.Z)("tabs__item",m,null==o?void 0:o.className,{"tabs__item--active":j===t})}),null!=n?n:t)}))),o?(0,l.cloneElement)(v.filter((e=>e.props.value===j))[0],{className:"margin-top--md"}):l.createElement("div",{className:"margin-top--md"},v.map(((e,t)=>(0,l.cloneElement)(e,{key:t,hidden:e.props.value!==j})))))}function d(e){const t=(0,o.Z)();return l.createElement(c,(0,a.Z)({key:String(t)},e))}},9671:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>p,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>m});var a=n(4219),l=(n(1318),n(2032)),r=n(5523),o=n(4469);const i={title:"Expect"},p=void 0,s={unversionedId:"api/expect",id:"api/expect",title:"Expect",description:"toBe",source:"@site/docs/api/expect.mdx",sourceDirName:"api",slug:"/api/expect",permalink:"/xbell/docs/api/expect",draft:!1,editUrl:"https://github.com/x-bell/xbell/tree/main/website/docs/api/expect.mdx",tags:[],version:"current",frontMatter:{title:"Expect"},sidebar:"api",previous:{title:"CLI",permalink:"/xbell/docs/api/cli"},next:{title:"Mocking",permalink:"/xbell/docs/api/mocking"}},u={},m=[{value:'toBe<tag type="node.js" /><tag type="browser" />',id:"tobe",level:3},{value:'toBeDefined<tag type="node.js" /><tag type="browser" />',id:"tobedefined",level:3},{value:'toBeUndefined <tag type="node.js" /><tag type="browser" />',id:"tobeundefined-",level:3},{value:'toBeNull <tag type="node.js" /><tag type="browser" />',id:"tobenull-",level:3},{value:"toBeTruthy",id:"tobetruthy",level:3},{value:"toBeFalsy",id:"tobefalsy",level:3},{value:"toBeTypeOf",id:"tobetypeof",level:3},{value:"toBeLessThan",id:"tobelessthan",level:3},{value:"toBeLessThanOrEqual",id:"tobelessthanorequal",level:3},{value:"toBeNaN",id:"tobenan",level:3},{value:"toHaveProperty",id:"tohaveproperty",level:3},{value:'isVisible <tag type="node.js" />',id:"isvisible-",level:3}],c={toc:m};function d(e){let{components:t,...n}=e;return(0,l.kt)("wrapper",(0,a.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h3",{id:"tobe"},"toBe",(0,l.kt)("tag",{type:"node.js"}),(0,l.kt)("tag",{type:"browser"})),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBe(expected)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"any")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"expected")," ",(0,l.kt)("type",null,"any"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)("p",null,'"toBe" is used to compare whether the primitive values are equal or whether objects belong to the same reference.'),(0,l.kt)(r.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"node.js",label:"node.js",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"import { test, expect } from 'xbell';\n\nconst man = {\n  name: 'Mike',\n  bag: ['vodka'],\n};\n\ntest('check primitives value', () => {\n  expect(man.name).toBe('Mike');\n});\n\ntest('check reference value', () => {\n  const bagRef = man.bag;\n\n  expect(man.bag).toBe(bagRef);\n  expect(man.bag).not.toBe(['vodka']);\n});\n\n"))),(0,l.kt)(o.Z,{value:"browser",label:"browser",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="man.js"',title:'"man.js"'},"export const man = {\n  name: 'Mike',\n  bag: ['vodka'],\n};\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="man.test.js"',title:'"man.test.js"'},"import { test } from 'xbell';\n\ntest.browser('check primitives value', ({ expect }) => {\n  const { man } = await import('./man');\n\n  expect(man.name).toBe('Mike');\n});\n\ntest.browser('check reference value', ({ expect }) => {\n  const { man } = await import('./man');\n\n  const bagRef = man.bag;\n\n  expect(man.bag).toBe(bagRef);\n  expect(man.bag).not.toBe(['vodka']);\n});\n"))),(0,l.kt)(o.Z,{value:"mixed",label:"mixed",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="man.js"',title:'"man.js"'},"export const man = {\n  name: 'Mike',\n  bag: ['vodka'],\n};\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="man.test.js"',title:'"man.test.js"'},"import { test, expect } from 'xbell';\n\ntest('check primitives value', async ({ page }) => {\n  const nameHandle = await page.evaluate(async () => {\n    const { man } = await import('./man');\n    return man.name;\n  });\n  expect(nameHandle.toValue()).toBe('Mike');\n});\n\ntest('check reference value', async ({ page }) => {\n  const bagHanlde = await page.evaluate(async () => {\n    const { man } = await import('./man');\n    return man.bag;\n  });\n  \n  expect(bagHanlde.toValue()).not.toBe(['vodka']);\n  // NOTE: should use equal\n  expect(bagHanlde.toValue()).toEqual(['vodka']);\n});\n")))),(0,l.kt)("h3",{id:"tobedefined"},"toBeDefined",(0,l.kt)("tag",{type:"node.js"}),(0,l.kt)("tag",{type:"browser"})),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeDefined()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"any"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"toBeDefined()")," is used to assert that the value is not equal to ",(0,l.kt)("inlineCode",{parentName:"p"},"undefined")," , same as ",(0,l.kt)("inlineCode",{parentName:"p"},".not.toBe(undefined)")," ."),(0,l.kt)("p",null,"Usually used to check if a function has a return value."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"import { test, expect } from 'xbell';\n\nfunction createSomething() {\n  return Math.random();\n}\n\ntest('it always creates something', () => {\n  expect(createSomething()).toBeDefined();\n});\n")),(0,l.kt)("h3",{id:"tobeundefined-"},"toBeUndefined ",(0,l.kt)("tag",{type:"node.js"}),(0,l.kt)("tag",{type:"browser"})),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeUndefined()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"any"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"toBeUndefined()")," is used to assert that the value is ",(0,l.kt)("inlineCode",{parentName:"p"},"undefined")," , same as ",(0,l.kt)("inlineCode",{parentName:"p"},"toBe(undefined)")," ."),(0,l.kt)("p",null,"Usually used to check if a function returns undefined."),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"import { test, expect } from 'xbell';\n\nfunction getName(person) {\n  return person?.name;\n}\n\ntest('getName returns undefined when passed a empty value', () => {\n  expect(getName()).toBeUndefined();\n});\n")),(0,l.kt)("h3",{id:"tobenull-"},"toBeNull ",(0,l.kt)("tag",{type:"node.js"}),(0,l.kt)("tag",{type:"browser"})),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeNull()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"any"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)("p",null,(0,l.kt)("inlineCode",{parentName:"p"},"toBeNull()")," asserts that the value is ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," , same as ",(0,l.kt)("inlineCode",{parentName:"p"},"toBe(null)")," ."),(0,l.kt)(r.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"node.js",label:"node.js",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"import { test, expect } from 'xbell';\n\nfunction getSomething(make) {\n  if (make) {\n    return Math.random();\n  }\n\n  return null;\n}\n\ntest('get something is null', () => {\n  expect(getSomething()).toBeNull();\n});\n"))),(0,l.kt)(o.Z,{value:"browser",label:"browser",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="something.js"',title:'"something.js"'},"export function getSomething(make) {\n  if (make) {\n    return Math.random();\n  }\n\n  return null;\n}\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="something.test.js"',title:'"something.test.js"'},"import { test } from 'xbell';\n\ntest.browser('get something is null', ({ expect }) => {\n  const { getSomething } = await import('./something');\n\n  expect(getSomething()).toBeNull();\n});\n")))),(0,l.kt)("h3",{id:"tobetruthy"},"toBeTruthy"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeTruthy()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"any"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)(r.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"node.js",label:"node.js",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"import { test, expect } from 'xbell';\n\nfunction createSomething() {\n  return 1 + Math.random();\n}\n\ntest('createSomething returns value to be truthy', () => {\n  expect(createSomething()).toBeTruthy();\n});\n"))),(0,l.kt)(o.Z,{value:"browser",label:"browser",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="something.js"',title:'"something.js"'},"export function createSomething() {\n  return 1 + Math.random();\n}\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="something.test.js"',title:'"something.test.js"'},"import { test } from 'xbell';\n\ntest.browser('createSomething returns value to be truthy', ({ expect }) => {\n  const { createSomething } = await import('./something');\n\n  expect(createSomething()).toBeTruthy();\n});\n")))),(0,l.kt)("h3",{id:"tobefalsy"},"toBeFalsy"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeFalsy()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"any"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)(r.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"node.js",label:"node.js",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"import { test, expect } from 'xbell';\n\nfunction createNothing() {\n  return null;\n}\n\ntest('createSomething returns value to be falsy', () => {\n  expect(createNothing()).toBeFalsy();\n});\n"))),(0,l.kt)(o.Z,{value:"browser",label:"browser",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="something.js"',title:'"something.js"'},"export function createNothing() {\n  return null;\n}\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="something.test.js"',title:'"something.test.js"'},"import { test } from 'xbell';\n\ntest.browser('createSomething returns value to be truthy', ({ expect }) => {\n  const { createNothing } = await import('./something');\n\n  expect(createNothing()).toBeFalsy();\n});\n")))),(0,l.kt)("h3",{id:"tobetypeof"},"toBeTypeOf"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeTypeOf(type)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"any")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"type")," ",(0,l.kt)("type",null,"{'function' | 'number' | 'string' | 'object' | 'boolean' | 'undefined' | 'symbol' | 'bigint'}"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)(r.Z,{mdxType:"Tabs"},(0,l.kt)(o.Z,{value:"nodejs",label:"nodejs",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"  import { test } from 'xbell';\n\n  class Dog {\n    eat() {}\n  }\n\n  test('the dog has a method of eating', ({ expect }) => {\n    const dog = new Dog();\n\n    expect(dog.eat).toBeTypeOf('function');\n  });\n"))),(0,l.kt)(o.Z,{value:"browser",label:"browser",mdxType:"TabItem"},(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="uploader.js"',title:'"uploader.js"'},"export class Uploader {\n  upload(file) {\n    return Promise.resolve(URL.createObjectURL(file));\n  }\n}\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="uploader.test.js"',title:'"uploader.test.js"'},"import { test } from 'xbell';\n\ntest.browser('upload property is a function', ({ expect }) => {\n  const { Uploader } = await import('./uploader');\n  const uploader = new Uploader();\n\n  expect(uploader.upload).toBeTypeOf('function');\n});\n")))),(0,l.kt)("h3",{id:"tobelessthan"},"toBeLessThan"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeLessThan(num)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"number")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"num")," ",(0,l.kt)("type",null,"number"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)("h3",{id:"tobelessthanorequal"},"toBeLessThanOrEqual"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeLessThanOrEqual(num)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"number")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"num")," ",(0,l.kt)("type",null,"number"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)("h3",{id:"tobenan"},"toBeNaN"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toBeNaN()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"number"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)("h3",{id:"tohaveproperty"},"toHaveProperty"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).toHaveProperty(key, value?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"number")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"key")," ",(0,l.kt)("type",null,"string")," object's key"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"value?")," ",(0,l.kt)("type",null,"any"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")),(0,l.kt)("h3",{id:"isvisible-"},"isVisible ",(0,l.kt)("tag",{type:"node.js"})),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: expect(received).isVisible()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"received")," ",(0,l.kt)("type",null,"locator | elementHandle"))),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"void")))}d.isMDXComponent=!0}}]);