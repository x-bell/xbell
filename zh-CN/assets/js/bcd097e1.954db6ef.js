"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[418],{2032:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>d});var a=n(1318);function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){l(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function r(e,t){if(null==e)return{};var n,a,l=function(e,t){if(null==e)return{};var n,a,l={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(l[n]=e[n]);return l}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(l[n]=e[n])}return l}var p=a.createContext({}),u=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=u(e.components);return a.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},k=a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,i=e.originalType,p=e.parentName,s=r(e,["components","mdxType","originalType","parentName"]),k=u(n),d=l,g=k["".concat(p,".").concat(d)]||k[d]||m[d]||i;return n?a.createElement(g,o(o({ref:t},s),{},{components:n})):a.createElement(g,o({ref:t},s))}));function d(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var i=n.length,o=new Array(i);o[0]=k;var r={};for(var p in t)hasOwnProperty.call(t,p)&&(r[p]=t[p]);r.originalType=e,r.mdxType="string"==typeof e?e:l,o[1]=r;for(var u=2;u<i;u++)o[u]=n[u];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}k.displayName="MDXCreateElement"},8669:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>r,toc:()=>u});var a=n(4219),l=(n(1318),n(2032));const i={title:"Page"},o=void 0,r={unversionedId:"api/page",id:"api/page",title:"Page",description:"page.goto",source:"@site/docs/api/page.mdx",sourceDirName:"api",slug:"/api/page",permalink:"/xbell/zh-CN/docs/api/page",draft:!1,editUrl:"https://github.com/x-bell/xbell/tree/main/website/docs/api/page.mdx",tags:[],version:"current",frontMatter:{title:"Page"},sidebar:"api",previous:{title:"Mocking",permalink:"/xbell/zh-CN/docs/api/mocking"},next:{title:"Locator",permalink:"/xbell/zh-CN/docs/api/locator"}},p={},u=[{value:"page.goto",id:"pagegoto",level:2},{value:"page.goForward",id:"pagegoforward",level:2},{value:"page.goBack",id:"pagegoback",level:2},{value:"page.url",id:"pageurl",level:2},{value:"page.content",id:"pagecontent",level:2},{value:"page.evaluate",id:"pageevaluate",level:2},{value:"page.evaluateHandle",id:"pageevaluatehandle",level:2},{value:"page.screenshot(options?)",id:"pagescreenshotoptions",level:2},{value:"page.click",id:"pageclick",level:2},{value:"page.dblclick",id:"pagedblclick",level:2},{value:"page.focus",id:"pagefocus",level:2},{value:"page.getByText",id:"pagegetbytext",level:2},{value:"page.getByClass",id:"pagegetbyclass",level:2},{value:"page.getByTestId",id:"pagegetbytestid",level:2},{value:"page.queryByText",id:"pagequerybytext",level:2},{value:"page.queryByClass",id:"pagequerybyclass",level:2},{value:"page.queryByTestId",id:"pagequerybytestid",level:2},{value:"page.waitForNavigation",id:"pagewaitfornavigation",level:2},{value:"page.waitForLoadState",id:"pagewaitforloadstate",level:2},{value:"page.waitForRequest",id:"pagewaitforrequest",level:2},{value:"page.waitForResponse",id:"pagewaitforresponse",level:2}],s={toc:u};function m(e){let{components:t,...n}=e;return(0,l.kt)("wrapper",(0,a.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"pagegoto"},"page.goto"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.goto(url, options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"url")," : ",(0,l.kt)("type",null,"string")," The target URL address. e.g. ",(0,l.kt)("a",{parentName:"li",href:"https://github.com"},"https://github.com")," "),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"options?")," : ",(0,l.kt)("type",null,"object"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"timeout?")," : ",(0,l.kt)("type",null,"number")," Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the Page.setDefaultNavigationTimeout() or Page.setDefaultTimeout() methods."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"waitUnitil?")," : ",(0,l.kt)("type",null,'"load" | "documentloaded" | "networkidle" | "commit"')," When to consider navigation succeeded, defaults to load. Given an array of event strings, navigation is considered to be successful after all events have been fired. Events can be either:",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'load'")," : consider navigation to be finished when the load event is fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'domcontentloaded'")," : consider navigation to be finished when the DOMContentLoaded event is fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'networkidle'")," : consider navigation to be finished when there are no more than 0 network connections for at least 500 ms."))))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"Promise<HTTPResponse | null>"))),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"Example"),(0,l.kt)("pre",{parentName:"blockquote"},(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"await page.goto('https://github.com')\n"))),(0,l.kt)("h2",{id:"pagegoforward"},"page.goForward"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.goForward(options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"options?")," ",(0,l.kt)("type",null,"object")),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"timeout?")," ",(0,l.kt)("type",null,"number")," Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the Page.setDefaultNavigationTimeout() or Page.setDefaultTimeout() methods."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"waitUntil?")," When to consider navigation succeeded, defaults to load. Given an array of event strings, navigation is considered to be successful after all events have been fired. Events can be either:",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'load'")," consider navigation to be finished when the load event is fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'domcontentloaded'")," : consider navigation to be finished when the DOMContentLoaded event is fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'networkidle'")," : consider navigation to be finished when there are no more than 0 network connections for at least 500 ms."))))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"Promise<HTTPResponse | null>")))),(0,l.kt)("p",null,"This method navigate to the next page in history."),(0,l.kt)("blockquote",null,(0,l.kt)("p",{parentName:"blockquote"},"Example"),(0,l.kt)("pre",{parentName:"blockquote"},(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"await page.goForward();\n"))),(0,l.kt)("h2",{id:"pagegoback"},"page.goBack"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.goBack(options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"timeout?")," ",(0,l.kt)("type",null,"number")," Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the Page.setDefaultNavigationTimeout() or Page.setDefaultTimeout() methods."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"waitUntil?")," When to consider navigation succeeded, defaults to load. Given an array of event strings, navigation is considered to be successful after all events have been fired. Events can be either:",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'load'")," consider navigation to be finished when the load event is fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'domcontentloaded'")," : consider navigation to be finished when the DOMContentLoaded event is fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'networkidle'")," : consider navigation to be finished when there are no more than 0 network connections for at least 500 ms."))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," Promise<HTTPResponse | null>")),(0,l.kt)("p",null,"This method navigate to the previous page in history."),(0,l.kt)("h2",{id:"pageurl"},"page.url"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.url()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"Promise","<","string",">"))),(0,l.kt)("p",null,"Shortcut for page.mainFrame().url()."),(0,l.kt)("h2",{id:"pagecontent"},"page.content"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.content()")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"Promise","<","string",">"))),(0,l.kt)("p",null,"The full HTML contents of the frame, including the DOCTYPE."),(0,l.kt)("h2",{id:"pageevaluate"},"page.evaluate"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.evaluate(pageFunction, args?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"pageFunction")," ",(0,l.kt)("type",null,"Function | string")," a function that is run within the page")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"args?")," arguments to be passed to the pageFunction")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"Promise","<","Awaited","<","ReturnType","<","typeof pageFunction",">",">",">")," the return value of pageFunction."))),(0,l.kt)("p",null,"Evaluates a function in the page's context and Returns the result."),(0,l.kt)("p",null,"If the function passed to page.evaluteHandle Returns a Promise, the function will wait for the promise to resolve and return its value."),(0,l.kt)("h2",{id:"pageevaluatehandle"},"page.evaluateHandle"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.evaluateHandle(pageFunction, args?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," Promise","<","HandleFor","<","Awaited","<","ReturnType","<","typeof pageFunction",">",">",">",">")),(0,l.kt)("h2",{id:"pagescreenshotoptions"},"page.screenshot(options?)"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"options?")," ",(0,l.kt)("type",null,"object"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"path?")," ",(0,l.kt)("type",null,"string"),"  The file path to save the image to. The screenshot type will be inferred from file extension. If path is a relative path, then it is resolved relative to current working directory. If no path is provided, the image won't be saved to the disk."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"quality?")," ",(0,l.kt)("type",null,"number")," The quality of the image, between 0-100. Not applicable to png images."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"fullPage?")," ",(0,l.kt)("type",null,"boolean")," When true, takes a screenshot of the full scrollable page. Defaults to ",(0,l.kt)("inlineCode",{parentName:"li"},"false"),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"type?")," ",(0,l.kt)("type",null,"'png' | 'jpeg'")," Specify screenshot type, can be either jpeg or png. Defaults to ",(0,l.kt)("inlineCode",{parentName:"li"},"'png'"),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"clip?")," ",(0,l.kt)("type",null,"object")," An object which specifies clipping region of the page. Should have the following fields:",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"x")," ",(0,l.kt)("type",null,"number")," x-coordinate of top-left corner of clip area."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"y"),"  ",(0,l.kt)("type",null,"number")," y-coordinate of top-left corner of clip area."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"width")," ",(0,l.kt)("type",null,"number")," width of clipping area."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"height")," ",(0,l.kt)("type",null,"number")," height of clipping area."))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"omitBackground?")," ",(0,l.kt)("type",null,"boolean"),"  Hides default white background and allows capturing screenshots with transparency. Defaults to false."))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," Promise<Buffer | string>;")),(0,l.kt)("h2",{id:"pageclick"},"page.click"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.click(selector, options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"selector")," ",(0,l.kt)("type",null,"string")," A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"options?")," ",(0,l.kt)("type",null,"object")),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"delay?")," ",(0,l.kt)("type",null,"number")," Time to wait between mousedown and mouseup in milliseconds."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"button?")," ",(0,l.kt)("type",null,"'left' | 'right' | 'middle'")," Defaults to ",(0,l.kt)("inlineCode",{parentName:"li"},"'left'"),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"clickCount?")," ",(0,l.kt)("type",null,"number")," Count of button clicks, defaults to ",(0,l.kt)("inlineCode",{parentName:"li"},"1"),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"position?")," ",(0,l.kt)("type",null,"object")," Offset for the clickable point relative to the top-left corder of the border box.",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"x")," ",(0,l.kt)("type",null,"number")," x-offset for the clickable point relative to the top-left corder of the border box."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"y")," ",(0,l.kt)("type",null,"number")," y-offset for the clickable point relative to the top-left corder of the border box."))))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"Promise","<","void",">")))),(0,l.kt)("p",null,"This method fetches an element with selector, scrolls it into view if needed, and then uses Page.mouse to click in the center of the element. If there's no element matching selector, the method throws an error."),(0,l.kt)("h2",{id:"pagedblclick"},"page.dblclick"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.dblclick(selector, options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"selector")," ",(0,l.kt)("type",null,"string")," A selector to search for element to click. If there are multiple elements satisfying the selector, the first will be clicked")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"options?")," ",(0,l.kt)("type",null,"object")),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"delay?")," ",(0,l.kt)("type",null,"number")," Time to wait between mousedown and mouseup in milliseconds."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"button?")," ",(0,l.kt)("type",null,"'left' | 'right' | 'middle'")," Defaults to ",(0,l.kt)("inlineCode",{parentName:"li"},"'left'"),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"clickCount?")," ",(0,l.kt)("type",null,"number")," Count of button clicks, defaults to ",(0,l.kt)("inlineCode",{parentName:"li"},"1"),"."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"position?")," ",(0,l.kt)("type",null,"object")," Offset for the clickable point relative to the top-left corder of the border box.",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"x")," ",(0,l.kt)("type",null,"number")," x-offset for the clickable point relative to the top-left corder of the border box."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"y")," ",(0,l.kt)("type",null,"number")," y-offset for the clickable point relative to the top-left corder of the border box."))))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"Promise","<","void",">")))),(0,l.kt)("p",null,"This method fetches an element with selector, scrolls it into view if needed, and then uses Page.mouse to dbclick in the center of the element. If there's no element matching selector, the method throws an error."),(0,l.kt)("h2",{id:"pagefocus"},"page.focus"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.focus(selector)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"selector")," ",(0,l.kt)("type",null,"string")," A selector of an element to focus. If there are multiple elements satisfying the selector, the first will be focused."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"Promise","<","void",">"),"\nThis method fetches an element with selector and focuses it. If there's no element matching selector, the method throws an error.")),(0,l.kt)("h2",{id:"pagegetbytext"},"page.getByText"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.getByText(text)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"text")," ",(0,l.kt)("type",null,"string")," The label text."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"Locator"))),(0,l.kt)("h2",{id:"pagegetbyclass"},"page.getByClass"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.getByClass(className)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"className")," ",(0,l.kt)("type",null,"string")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"Locator"))),(0,l.kt)("h2",{id:"pagegetbytestid"},"page.getByTestId"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.getByTestId(testId)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"testId")," ",(0,l.kt)("type",null,"string")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"Locator"))),(0,l.kt)("h2",{id:"pagequerybytext"},"page.queryByText"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.queryByText(text)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"text")," ",(0,l.kt)("type",null,"string")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"ElementHandle"))),(0,l.kt)("h2",{id:"pagequerybyclass"},"page.queryByClass"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.queryByClass(className)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"className")," ",(0,l.kt)("type",null,"string")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"ElementHandle"))),(0,l.kt)("h2",{id:"pagequerybytestid"},"page.queryByTestId"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.queryByTestId(testId)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"testId")," ",(0,l.kt)("type",null,"string")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"ElementHandle"))),(0,l.kt)("h2",{id:"pagewaitfornavigation"},"page.waitForNavigation"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.waitForNavigation(options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"options?")," ",(0,l.kt)("type",null,"object"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"timeout?")," ",(0,l.kt)("type",null,"number")," Maximum navigation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout. The default value can be changed by using the Page.setDefaultNavigationTimeout() or Page.setDefaultTimeout() methods."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"waitUntil?")," When to consider navigation succeeded, defaults to load. Given an array of event strings, navigation is considered to be successful after all events have been fired. Events can be either:",(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'load'")," consider navigation to be finished when the load event is fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'domcontentloaded'")," : consider navigation to be finished when the DOMContentLoaded event is fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"'networkidle'")," : consider navigation to be finished when there are no more than 0 network connections for at least 500 ms."))))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns"),": ",(0,l.kt)("type",null,"Promise<HTTPResponse | null>"),"\nWaits for the page to navigate to a new URL or to reload. It is useful when you run code that will indirectly cause the page to navigate.")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Example")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-javascript"},"const [response] = await Promise.all([\n  page.waitForNavigation(), // The promise resolves after navigation has finished\n  page.click('a.my-link'), // Clicking the link will indirectly cause a navigation\n]);\n")),(0,l.kt)("h2",{id:"pagewaitforloadstate"},"page.waitForLoadState"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.waitForLoadState(state?, options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"state?")," ",(0,l.kt)("type",null,'"load"|"domcontentloaded"|"networkidle"')," Optional load state to wait for, defaults to load. If the state has been already reached while loading current document, the method resolves immediately. Can be one of:"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"load")," wait for the load event to be fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"domcontentloaded")," wait for the DOMContentLoaded event to be fired."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"networkidle")," wait until there are no network connections for at least 500 ms."))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("inlineCode",{parentName:"p"},"options?")," ",(0,l.kt)("type",null,"object")),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"timeout?")," ",(0,l.kt)("type",null,"number")," Maximum operation time in milliseconds, defaults to 30 seconds, pass 0 to disable timeout."))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("p",{parentName:"li"},(0,l.kt)("strong",{parentName:"p"},"Returns")," ",(0,l.kt)("type",null,"Promise","<","void",">")))),(0,l.kt)("h2",{id:"pagewaitforrequest"},"page.waitForRequest"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.waitForRequest(urlOrPredicate, options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"urlOrPredicate")," ",(0,l.kt)("type",null,"string | RegExp | function(Request):boolean | Promise","<","boolean",">")," Request URL string, regex or predicate receiving Request object.#"),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"options?")," ",(0,l.kt)("type",null,"object"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"timeout?")," ",(0,l.kt)("type",null,"number")," Maximum wait time in milliseconds, defaults to 30 seconds, pass 0 to disable the timeout. The default value can be changed by using the page.setDefaultTimeout(timeout) method."))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns")," ",(0,l.kt)("type",null,"Promise","<","Request",">"))),(0,l.kt)("h2",{id:"pagewaitforresponse"},"page.waitForResponse"),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature: page.waitForResponse(urlOrPredicate, options?)")),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"urlOrPredicate")," ",(0,l.kt)("type",null,"string | RegExp | function(Response):boolean | Promise","<","boolean",">")," Request URL string, regex or predicate receiving Response object. When a baseURL via the context options was provided and the passed URL is a path, it gets merged via the new URL() constructor."),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("inlineCode",{parentName:"li"},"options?")," ",(0,l.kt)("type",null,"object"),(0,l.kt)("ul",{parentName:"li"},(0,l.kt)("li",{parentName:"ul"},"timeout? ",(0,l.kt)("type",null,"number")," Maximum wait time in milliseconds, defaults to 30 seconds, pass 0 to disable the timeout. The default value can be changed by using the browserContext.setDefaultTimeout(timeout) or page.setDefaultTimeout(timeout) methods."))),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("strong",{parentName:"li"},"Returns"),": ",(0,l.kt)("type",null,"Promise","<","Response",">"))))}m.isMDXComponent=!0}}]);