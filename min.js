self.asCustomElement=function(e){"use strict";var t=new Set,a=new MutationObserver((function(e){t.forEach(n,e)}));function n(e){e(this,a)}a.observe(document,{subtree:!0,childList:!0}),t.observer=a;var r=new WeakMap,o=t.observer,c=function(e,t){for(var a=0,n=e.length;a<n;a++){var o=e[a],c=o.target,i=o.attributeName,d=o.oldValue;u(r.get(c).a.get(t),c,i,d)}},u=function(e,t,a,n){e.call(t,a,n,t.getAttribute(a))},i=function(){},d=function e(t,a){for(var n=0,o=t.length;n<o;n++){var c=t[n],u=r.get(c);u&&("d"===a&&u.a.forEach(s),u[a].forEach(f,c)),e(c.children||[],a)}},l=function(e){for(var t=0,a=e.length;t<a;t++){var n=e[t],r=n.addedNodes,o=n.removedNodes;d(r,"c"),d(o,"d")}},s=function(e,t){c(t.takeRecords(),t)};t.add(l);function f(e){e.call(this)}return e.default=function(e,t){var a=t.connectedCallback,n=t.disconnectedCallback,d=t.observedAttributes,s=t.attributeChangedCallback;l(o.takeRecords());var f=r.get(e)||function(e){var t={a:new Map,c:new Set,d:new Set};return r.set(e,t),t}(e),v=f.a,b=f.c,h=f.d;if(d){var g=new MutationObserver(c);g.observe(e,{attributes:!0,attributeFilter:d,attributeOldValue:!0}),v.set(g,s||i),d.forEach((function(t){e.hasAttribute(t)&&u(s||i,e,t,null)}))}return b.add(a||i),h.add(n||i),e.ownerDocument.compareDocumentPosition(e)&e.DOCUMENT_POSITION_DISCONNECTED||(a||i).call(e),e},e}({}).default;