"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[135],{8449:function(e,n,t){t.d(n,{H:function(){return d},Z:function(){return m}});var a=t(1318),r=t(6995),l=t(5251),o=(0,t(1391).Z)({typography:{fontFamily:"PingFang SC"},palette:{primary:{main:"#6b8fe6"},secondary:{main:"#f50057"}}}),i=t(5928),c=t(5999),u=t(9455),s=a.createContext({userInfo:null,setUserInfo:function(){},logout:function(){}});var m=s,p="__user__info__",f=function(e){var n=e.children,t=(0,i.TH)(),c=(0,u.Z)(t.pathname),m=a.useMemo((function(){return function(e){try{return JSON.parse(e)}catch(n){return null}}(window.localStorage.getItem(p))}),[]),f=a.useState((null==m?void 0:m.env)===c?m:null),d=f[0],x=f[1],v=function(e){if(c){var n=Object.assign({},e,{env:c});x(n),console.log("userInfoWithEnv",n),window.localStorage.setItem(p,JSON.stringify(n))}};return a.createElement(r.Z,{theme:o},a.createElement(l.wT,{maxSnack:3,autoHideDuration:2e3},a.createElement(s.Provider,{value:{userInfo:d,setUserInfo:v,logout:function(){window.localStorage.removeItem(p),v(null)}}},n)))},d=function(e){var n=e.children;return a.createElement(c.Z,null,(function(){return a.createElement(f,null,n)}))}},9:function(e,n,t){var a=t(1318),r=t(4898),l=t(9970),o=t(8098),i=t(1710),c=t(280),u=t(3326),s=t(1180),m=t(9324),p=t(9182),f=t(1478),d=t(5455),x=t(2658),v=t(5928),Z=t(9779),g=t(8449),h=[{title:"\u573a\u666f",link:"test-site/"}],E=["\u9000\u51fa\u8d26\u53f7"];n.Z=function(){var e=a.useContext(g.Z),n=e.userInfo,t=e.logout,y=a.useState(null),k=y[0],w=y[1],b=a.useState(null),S=b[0],C=b[1],I=(0,Z.Z)().siteConfig,z=(0,v.k6)(),O=null!=n&&n.avatar?I.baseUrl+n.avatar:void 0,U=function(){w(null)},W=function(){C(null)},_=function(){W(),t()};return a.createElement(r.Z,{position:"static"},a.createElement(l.Z,{maxWidth:"xl"},a.createElement(o.Z,{disableGutters:!0},a.createElement(d.Z,{sx:{display:{xs:"none",md:"flex"},mr:1}}),a.createElement(i.Z,{variant:"h6",noWrap:!0,component:"a",href:"/xbell/",sx:{mr:2,display:{xs:"none",md:"flex"},fontFamily:"monospace",fontWeight:700,letterSpacing:".3rem",color:"inherit",textDecoration:"none"}},"X-BELL"),a.createElement(c.Z,{sx:{flexGrow:1,display:{xs:"flex",md:"none"}}},a.createElement(u.Z,{size:"large","aria-label":"account of current user","aria-controls":"menu-appbar","aria-haspopup":"true",onClick:function(e){w(e.currentTarget)},color:"inherit"},a.createElement(x.Z,null)),a.createElement(s.Z,{id:"menu-appbar",anchorEl:k,anchorOrigin:{vertical:"bottom",horizontal:"left"},keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"left"},open:Boolean(k),onClose:U,sx:{display:{xs:"block",md:"none"}}},h.map((function(e){return a.createElement(m.Z,{key:e.title,onClick:function(){U(),z.push(I.baseUrl+e.link)}},a.createElement(i.Z,{textAlign:"center"},e.title))})))),a.createElement(d.Z,{sx:{display:{xs:"flex",md:"none"},mr:1}}),a.createElement(i.Z,{variant:"h5",noWrap:!0,component:"a",href:"",sx:{mr:2,display:{xs:"flex",md:"none"},flexGrow:1,fontFamily:"monospace",fontWeight:700,letterSpacing:".3rem",color:"inherit",textDecoration:"none"}},"X-BELL"),a.createElement(c.Z,{sx:{flexGrow:1,display:{xs:"none",md:"flex"}}},h.map((function(e){return a.createElement(p.Z,{key:e.title,onClick:function(){U(),z.push(I.baseUrl+e.link)},sx:{my:2,color:"white",display:"block"}},e.title)}))),!(null==n||!n.username)&&a.createElement(c.Z,{sx:{flexGrow:0}},a.createElement(u.Z,{onClick:function(e){C(e.currentTarget)},sx:{p:0}},a.createElement(f.Z,{alt:"\u5934\u50cf",src:O})),a.createElement(s.Z,{sx:{mt:"45px"},id:"menu-appbar",anchorEl:S,anchorOrigin:{vertical:"top",horizontal:"right"},keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:Boolean(S),onClose:W},E.map((function(e){return a.createElement(m.Z,{key:e,onClick:_},a.createElement(i.Z,{textAlign:"center"},e))})))))))}},8370:function(e,n,t){t.d(n,{Z:function(){return B}});var a,r,l,o,i,c,u,s,m,p=t(6763),f=t(2870),d=t(1318),x=t(2696),v=t(4747),Z=t(9948),g=t(1710),h=t(5096),E=t(4778),y=(0,x.Z)(h.Z)(a||(a=(0,f.Z)(["\n  margin-bottom: 20px;\n  padding: 12px;\n  margin-right: 12px;\n"]))),k=x.Z.img(r||(r=(0,f.Z)(["\n  width: 250px;\n"]))),w=x.Z.div(l||(l=(0,f.Z)(["\n  font-size: 24px;\n  margin-top: 8px;\n  text-align: center;\n"]))),b=function(e){var n=e.username,t=e.avatar;return d.createElement(y,{elevation:3},d.createElement(k,{src:(0,E.Z)(t)}),d.createElement(w,null,n))},S=t(8974),C=t(3326),I=t(5903),z=(0,x.Z)(h.Z)(o||(o=(0,f.Z)(["\n  height: 55px;\n  width: 550px;\n  display: flex;\n  flex-direction: row;\n  padding: 4px 14px;\n"]))),O=function(e){var n=e.onSearch,t=void 0===n?function(){}:n,a=d.useState(""),r=a[0],l=a[1];return d.createElement(z,{elevation:3},d.createElement(S.Z,{value:r,onChange:function(e){return l(e.target.value)},onKeyUp:function(e){13!==e.charCode&&"Enter"!==e.key||t(r)},placeholder:"\u641c\u7d22\u8054\u7cfb\u4eba",fullWidth:!0,disableUnderline:!0}),d.createElement(C.Z,{onClick:function(){return t(r)}},d.createElement(I.Z,null)))},U=t(5270),W=x.Z.div(i||(i=(0,f.Z)(["\n  padding: 12px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n"]))),_=x.Z.div(c||(c=(0,f.Z)(["\n  margin-top: 24px;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  justify-content: center;\n"]))),G=(0,x.Z)(Z.Z)(u||(u=(0,f.Z)(["\n  margin-top: 40px;\n"]))),T=x.Z.div(s||(s=(0,f.Z)(["\n  margin-top: 40px;\n"]))),B=(x.Z.div(m||(m=(0,f.Z)(["\n"]))),function(e){var n=e.dataSource,t=void 0===n?[]:n,a=d.useState(""),r=a[0],l=a[1],o=(0,v.Z)((function(){return e=r,new Promise((function(n){setTimeout((function(){var a=e?t.filter((function(n){return n.username.includes(e)})):t;n(a)}),1500)}));var e}),{refreshDeps:[r]}),i=o.loading,c=o.data,u=i?d.createElement(G,null):null!=c&&c.length?c.map((function(e){return d.createElement(b,(0,p.Z)({key:e.username},e))})):d.createElement(T,null,d.createElement(U.Z,{color:"warning",sx:{fontSize:100}}),d.createElement(g.Z,{color:"GrayText"},"\u627e\u4e0d\u5230\u8054\u7cfb\u4eba"));return d.createElement(W,null,d.createElement(O,{onSearch:l}),d.createElement(_,{className:"list-container"},u))})},6741:function(e,n,t){t.r(n);var a=t(1318),r=t(8370),l=t(9),o=t(8449),i=[{username:"\u76ae\u5361\u4e18",avatar:"avatar/pikachu.png"},{username:"\u53ef\u8fbe\u9e2d",avatar:"avatar/psyduck.png"},{username:"\u4f0a\u5e03",avatar:"avatar/eevee.png"},{username:"\u5c0f\u706b\u9f99",avatar:"avatar/charmander.png"},{username:"\u9a6c\u91cc\u5965",avatar:"avatar/super_mario.png"},{username:"\u5999\u86d9\u79cd\u5b50",avatar:"avatar/bullbasaur.png"},{username:"\u80d6\u4e01",avatar:"avatar/jigglypuff.png"},{username:"\u6770\u5c3c\u9f9f",avatar:"avatar/squirtle.png"},{username:"\u55b5\u55b5",avatar:"avatar/meowth.png"},{username:"\u5361\u6bd4\u517d",avatar:"avatar/snorlax.png"}];n.default=function(){return a.createElement(o.H,null,a.createElement(l.Z,null),a.createElement(r.Z,{dataSource:i}))}},9455:function(e,n,t){function a(e){return e.split("test-site/").pop().split("/")[0]}t.d(n,{Z:function(){return a}})}}]);