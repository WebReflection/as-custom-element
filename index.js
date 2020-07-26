self.asCustomElement = (function (exports) {
  'use strict';

  var wm = new WeakMap();

  var attributeChanged = function attributeChanged(records) {
    var _loop = function _loop(i, length) {
      var _records$i = records[i],
          attributeName = _records$i.attributeName,
          oldValue = _records$i.oldValue,
          target = _records$i.target;
      var newValue = target.getAttribute(attributeName);
      wm.get(target).a.forEach(function (callback) {
        callback.call(target, attributeName, oldValue, newValue);
      });
    };

    for (var i = 0, length = records.length; i < length; i++) {
      _loop(i);
    }
  };

  var fallback = function fallback() {};

  var invoke = function invoke(nodes, key) {
    for (var i = 0, length = nodes.length; i < length; i++) {
      var target = nodes[i];

      if (wm.has(target)) {
        if (key === 'd') wm.get(target).o.forEach(takeRecords);
        wm.get(target)[key].forEach(call, target);
      }

      invoke(target.children || [], key);
    }
  };

  var mainLoop = function mainLoop(records) {
    for (var i = 0, length = records.length; i < length; i++) {
      var _records$i2 = records[i],
          addedNodes = _records$i2.addedNodes,
          removedNodes = _records$i2.removedNodes;
      invoke(addedNodes, 'c');
      invoke(removedNodes, 'd');
    }
  };

  var set = function set(target) {
    var sets = {
      a: new Set(),
      c: new Set(),
      d: new Set(),
      o: new Set()
    };
    wm.set(target, sets);
    return sets;
  };

  var takeRecords = function takeRecords(mo) {
    attributeChanged(mo.takeRecords());
  };

  var mo = new MutationObserver(mainLoop);
  mo.observe(document, {
    childList: true,
    subtree: true
  });
  var index = (function (target, _ref) {
    var connectedCallback = _ref.connectedCallback,
        disconnectedCallback = _ref.disconnectedCallback,
        observedAttributes = _ref.observedAttributes,
        attributeChangedCallback = _ref.attributeChangedCallback;
    mainLoop(mo.takeRecords());

    var _ref2 = wm.get(target) || set(target),
        a = _ref2.a,
        c = _ref2.c,
        d = _ref2.d,
        o = _ref2.o;

    if (observedAttributes) {
      var _mo = new MutationObserver(attributeChanged);

      _mo.observe(target, {
        attributes: true,
        attributeFilter: observedAttributes,
        attributeOldValue: true
      });

      a.add(attributeChangedCallback || fallback);
      o.add(_mo);
      observedAttributes.forEach(function (attributeName) {
        if (target.hasAttribute(attributeName)) (attributeChangedCallback || fallback).call(target, attributeName, null, target.getAttribute(attributeName));
      });
    }

    c.add(connectedCallback || fallback);
    d.add(disconnectedCallback || fallback); // if (target.isConnected) // No IE11/Edge support

    if (target.ownerDocument.contains(target)) (connectedCallback || fallback).call(target);
    return target;
  });

  function call(back) {
    back.call(this);
  }

  exports.default = index;

  return exports;

}({}).default);
