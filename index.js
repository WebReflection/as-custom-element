self.asCustomElement = (function (exports) {
  'use strict';

  var TRUE = true,
    FALSE = false;
  var QSA = 'querySelectorAll';

  /**
   * Start observing a generic document or root element.
   * @param {Function} callback triggered per each dis/connected node
   * @param {Element?} root by default, the global document to observe
   * @param {Function?} MO by default, the global MutationObserver
   * @returns {MutationObserver}
   */
  var notify = function notify(callback, root, MO) {
    var loop = function loop(nodes, added, removed, connected, pass) {
      for (var i = 0, length = nodes.length; i < length; i++) {
        var node = nodes[i];
        if (pass || QSA in node) {
          if (connected) {
            if (!added.has(node)) {
              added.add(node);
              removed["delete"](node);
              callback(node, connected);
            }
          } else if (!removed.has(node)) {
            removed.add(node);
            added["delete"](node);
            callback(node, connected);
          }
          if (!pass) loop((node.shadowRoot || node)[QSA]('*'), added, removed, connected, TRUE);
        }
      }
    };
    var observer = new (MO || MutationObserver)(function (records) {
      for (var added = new Set(), removed = new Set(), i = 0, length = records.length; i < length; i++) {
        var _records$i = records[i],
          addedNodes = _records$i.addedNodes,
          removedNodes = _records$i.removedNodes;
        loop(removedNodes, added, removed, FALSE, FALSE);
        loop(addedNodes, added, removed, TRUE, FALSE);
      }
    });
    observer.observe(root || document, {
      subtree: TRUE,
      childList: TRUE
    });
    return observer;
  };

  var lifecycle = new WeakMap();
  var attributeChanged = function attributeChanged(records, mo) {
    var _loop = function _loop() {
      var _records$i = records[i],
        target = _records$i.target,
        attributeName = _records$i.attributeName,
        oldValue = _records$i.oldValue;
      if (lifecycle.has(target)) {
        var _lifecycle$get = lifecycle.get(target),
          a = _lifecycle$get.a;
        var newValue = target.getAttribute(attributeName);
        a.forEach(function (observedAttributes, attributeChangedCallback) {
          if (-1 < observedAttributes.indexOf(attributeName)) attributeChangedCallback.call(target, attributeName, oldValue, newValue);
        });
      } else mo.disconnect();
    };
    for (var i = 0, length = records.length; i < length; i++) {
      _loop();
    }
  };
  notify(function (element, connected) {
    if (lifecycle.has(element)) lifecycle.get(element)[connected ? 'c' : 'd'].forEach(call, element);
  });
  var upgrade = function upgrade(element, _ref) {
    var upgradedCallback = _ref.upgradedCallback,
      connectedCallback = _ref.connectedCallback,
      disconnectedCallback = _ref.disconnectedCallback,
      observedAttributes = _ref.observedAttributes,
      attributeChangedCallback = _ref.attributeChangedCallback;
    if (!lifecycle.has(element)) lifecycle.set(element, {
      a: new Map(),
      c: new Set(),
      d: new Set()
    });
    if (upgradedCallback) upgradedCallback.call(element);
    var _lifecycle$get2 = lifecycle.get(element),
      a = _lifecycle$get2.a,
      c = _lifecycle$get2.c,
      d = _lifecycle$get2.d;
    if (attributeChangedCallback) {
      var mo = new MutationObserver(attributeChanged);
      mo.observe(element, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: observedAttributes.map(function (attributeName) {
          var value = element.getAttribute(attributeName);
          if (value != null) attributeChangedCallback.call(element, attributeName, null, value);
          return attributeName;
        })
      });
      a.set(attributeChangedCallback, observedAttributes);
    }
    if (disconnectedCallback) d.add(disconnectedCallback);
    if (connectedCallback) {
      c.add(connectedCallback);
      if (!(element.ownerDocument.compareDocumentPosition(element) & element.DOCUMENT_POSITION_DISCONNECTED)) connectedCallback.call(element);
    }
    return element;
  };
  var downgrade = function downgrade(element, _ref2) {
    var downgradedCallback = _ref2.downgradedCallback,
      connectedCallback = _ref2.connectedCallback,
      disconnectedCallback = _ref2.disconnectedCallback,
      attributeChangedCallback = _ref2.attributeChangedCallback;
    if (lifecycle.has(element)) {
      var _lifecycle$get3 = lifecycle.get(element),
        a = _lifecycle$get3.a,
        c = _lifecycle$get3.c,
        d = _lifecycle$get3.d;
      if (attributeChangedCallback) a["delete"](attributeChangedCallback);
      if (disconnectedCallback) d["delete"](disconnectedCallback);
      if (connectedCallback) c["delete"](connectedCallback);
      if (a.size + d.size + c.size < 1) lifecycle["delete"](element);
      if (downgradedCallback) downgradedCallback.call(element);
    }
    return element;
  };
  function call(back) {
    back.call(this);
  }

  exports.downgrade = downgrade;
  exports.upgrade = upgrade;

  return exports;

})({});
