(this.webpackJsonpmixtures=this.webpackJsonpmixtures||[]).push([[0],{12:function(e,t,n){},14:function(e,t,n){"use strict";n.r(t);var c=n(1),r=n.n(c),s=n(6),a=n.n(s),i=n(3),l=(n(12),n(7)),o=n(0);var u=function(e){for(var t=e.layers,n=void 0===t?[]:t,c=e.selected,r=void 0!==c&&c,s=e.onClick,a=Object(l.a)(n);a.length<4;)a.push(0);return Object(o.jsx)("div",{className:"tube ".concat(r?"selected":""),onClick:s,children:a.map((function(e,t){return Object(o.jsx)("div",{className:"layer color-"+e},t)}))})},j=[[[1,1,1,4],[4,4,4,1],[2,2,2,2],[3,3,3,3],[],[]],[[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4],[],[]],[[1,2,3,4],[1,2,3,4],[1,2,3,4],[1,2,3,4],[5,6,6,5],[6,6,5,5],[],[]]];var h=function(){var e=Object(c.useState)(JSON.parse(JSON.stringify(j[0]))),t=Object(i.a)(e,2),n=t[0],r=t[1],s=Object(c.useState)(-1),a=Object(i.a)(s,2),l=a[0],h=a[1],d=Object(c.useState)(!1),b=Object(i.a)(d,2),f=b[0],O=b[1],v=Object(c.useState)(0),p=Object(i.a)(v,2),m=p[0],g=p[1];return Object(o.jsxs)("div",{className:"App",children:[Object(o.jsxs)("div",{className:"header",children:[Object(o.jsxs)("h1",{children:["Level: ",m+1," ",f&&" - completed!"]}),Object(o.jsx)("button",{onClick:function(){return r(JSON.parse(JSON.stringify(j[m])))},className:"restartBtn",children:"Restart Level"}),Object(o.jsx)("button",{onClick:function(){for(var e=[],t=4+Math.ceil(7*Math.random()),n="",c=1;c<=t;c++)n+=c.toString().repeat(4);for(var s=n.split("").sort((function(){return Math.random()-.5})),a=0;a<4*t;a++){var i=Math.floor(a/4);e[i]=e[i]||[],e[i].push(s[a])}e.push([],[]),r(e),O(!1),h(-1),g(m+1)},className:"restartBtn",children:"Setup Random Level"}),f&&j[m+1]&&Object(o.jsx)("button",{onClick:function(){r(JSON.parse(JSON.stringify(j[m+1]))),O(!1),h(-1),g(m+1)},className:"nextLevelBtn",children:"Next  Level"})]}),Object(o.jsx)("div",{className:"level",children:n.map((function(e,t){return Object(o.jsx)(u,{layers:e,selected:t===l,onClick:function(){return function(e){if(-1===l)h(e);else{if(e!==l){for(var t=n[l],c=n[e];0!==t.length&&4!==c.length&&(t[t.length-1]===c[c.length-1]||0===c.length);)c.push(t.pop());r(n)}h(-1)}n.reduce((function(e,t){return e&&t.length%4===0&&t.every((function(e){return e===t[0]}))}),!0)&&O(!0)}(t)}},t)}))})]})},d=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,15)).then((function(t){var n=t.getCLS,c=t.getFID,r=t.getFCP,s=t.getLCP,a=t.getTTFB;n(e),c(e),r(e),s(e),a(e)}))};a.a.render(Object(o.jsx)(r.a.StrictMode,{children:Object(o.jsx)(h,{})}),document.getElementById("root")),d()}},[[14,1,2]]]);
//# sourceMappingURL=main.407a8b2a.chunk.js.map