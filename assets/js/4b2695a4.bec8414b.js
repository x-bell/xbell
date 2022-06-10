"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[145],{2457:function(e,t,n){var r=n(2590);t.Z=void 0;var a=r(n(9777)),l=n(7429),o=(0,a.default)((0,l.jsx)("path",{d:"M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28zM3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21zm6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15zm7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12zM14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38z"}),"Fingerprint");t.Z=o},8449:function(e,t,n){n.d(t,{H:function(){return d},Z:function(){return m}});var r=n(1318),a=n(6995),l=n(5251),o=(0,n(1391).Z)({typography:{fontFamily:"PingFang SC"},palette:{primary:{main:"#6b8fe6"},secondary:{main:"#f50057"}}}),i=n(5928),c=n(5999),s=n(9455),u=r.createContext({userInfo:null,setUserInfo:function(){},logout:function(){}});var m=u,f="__user__info__",p=function(e){var t=e.children,n=(0,i.TH)(),c=(0,s.Z)(n.pathname),m=r.useMemo((function(){return function(e){try{return JSON.parse(e)}catch(t){return null}}(window.localStorage.getItem(f))}),[]),p=r.useState((null==m?void 0:m.env)===c?m:null),d=p[0],E=p[1],x=function(e){if(c){var t=Object.assign({},e,{env:c});E(t),console.log("userInfoWithEnv",t),window.localStorage.setItem(f,JSON.stringify(t))}};return r.createElement(a.Z,{theme:o},r.createElement(l.wT,{maxSnack:3,autoHideDuration:2e3},r.createElement(u.Provider,{value:{userInfo:d,setUserInfo:x,logout:function(){window.localStorage.removeItem(f),x(null)}}},t)))},d=function(e){var t=e.children;return r.createElement(c.Z,null,(function(){return r.createElement(p,null,t)}))}},9:function(e,t,n){var r=n(1318),a=n(4898),l=n(9970),o=n(8098),i=n(1710),c=n(280),s=n(3326),u=n(1180),m=n(9324),f=n(9182),p=n(1478),d=n(5455),E=n(2658),x=n(5928),Z=n(9779),v=n(8449),h=[{title:"\u573a\u666f",link:"test-site/"}],g=["\u9000\u51fa\u8d26\u53f7"];t.Z=function(){var e=r.useContext(v.Z),t=e.userInfo,n=e.logout,k=r.useState(null),b=k[0],y=k[1],C=r.useState(null),w=C[0],_=C[1],S=(0,Z.Z)().siteConfig,z=(0,x.k6)(),I=null!=t&&t.avatar?S.baseUrl+t.avatar:void 0,U=function(){y(null)},N=function(){_(null)},O=function(){N(),n()};return r.createElement(a.Z,{position:"static"},r.createElement(l.Z,{maxWidth:"xl"},r.createElement(o.Z,{disableGutters:!0},r.createElement(d.Z,{sx:{display:{xs:"none",md:"flex"},mr:1}}),r.createElement(i.Z,{variant:"h6",noWrap:!0,component:"a",href:"/xbell/",sx:{mr:2,display:{xs:"none",md:"flex"},fontFamily:"monospace",fontWeight:700,letterSpacing:".3rem",color:"inherit",textDecoration:"none"}},"X-BELL"),r.createElement(c.Z,{sx:{flexGrow:1,display:{xs:"flex",md:"none"}}},r.createElement(s.Z,{size:"large","aria-label":"account of current user","aria-controls":"menu-appbar","aria-haspopup":"true",onClick:function(e){y(e.currentTarget)},color:"inherit"},r.createElement(E.Z,null)),r.createElement(u.Z,{id:"menu-appbar",anchorEl:b,anchorOrigin:{vertical:"bottom",horizontal:"left"},keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"left"},open:Boolean(b),onClose:U,sx:{display:{xs:"block",md:"none"}}},h.map((function(e){return r.createElement(m.Z,{key:e.title,onClick:function(){U(),z.push(S.baseUrl+e.link)}},r.createElement(i.Z,{textAlign:"center"},e.title))})))),r.createElement(d.Z,{sx:{display:{xs:"flex",md:"none"},mr:1}}),r.createElement(i.Z,{variant:"h5",noWrap:!0,component:"a",href:"",sx:{mr:2,display:{xs:"flex",md:"none"},flexGrow:1,fontFamily:"monospace",fontWeight:700,letterSpacing:".3rem",color:"inherit",textDecoration:"none"}},"X-BELL"),r.createElement(c.Z,{sx:{flexGrow:1,display:{xs:"none",md:"flex"}}},h.map((function(e){return r.createElement(f.Z,{key:e.title,onClick:function(){U(),z.push(S.baseUrl+e.link)},sx:{my:2,color:"white",display:"block"}},e.title)}))),!(null==t||!t.username)&&r.createElement(c.Z,{sx:{flexGrow:0}},r.createElement(s.Z,{onClick:function(e){_(e.currentTarget)},sx:{p:0}},r.createElement(p.Z,{alt:"\u5934\u50cf",src:I})),r.createElement(u.Z,{sx:{mt:"45px"},id:"menu-appbar",anchorEl:w,anchorOrigin:{vertical:"top",horizontal:"right"},keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:Boolean(w),onClose:N},g.map((function(e){return r.createElement(m.Z,{key:e,onClick:O},r.createElement(i.Z,{textAlign:"center"},e))})))))))}},6267:function(e,t,n){n.d(t,{Z:function(){return d}});var r=n(1318),a=n(5096),l=n(9182),o=n(2457),i=n(9779),c=n(5928),s="root_G__e",u="card_BN3j",m="avatar_CUaX",f="username_K_sB",p=n(8449),d=function(e){var t=e.env,n=r.useContext(p.Z).userInfo,d=(0,i.Z)().siteConfig,E=(0,c.k6)();return r.createElement("div",{className:s},null!=n&&n.username?r.createElement("div",{className:u},r.createElement(a.Z,{className:m},r.createElement("img",{width:250,src:d.baseUrl+n.avatar})),r.createElement("div",{className:f},n.username)):r.createElement("div",{className:u},r.createElement("img",{width:250,src:d.baseUrl+"img/xbell.svg"}),r.createElement(l.Z,{size:"large",color:"primary",startIcon:r.createElement(o.Z,null),onClick:function(){E.push(d.baseUrl+"test-site/"+t+"/login")}},"\u53bb\u767b\u5f55")))}},6693:function(e,t,n){n.r(t),n.d(t,{default:function(){return i}});var r=n(1318),a=n(9),l=n(6267),o=n(8449);function i(){return r.createElement(o.H,null,r.createElement(a.Z,null),r.createElement(l.Z,{env:"dev"}))}},9455:function(e,t,n){function r(e){return e.split("test-site/").pop().split("/")[0]}n.d(t,{Z:function(){return r}})}}]);