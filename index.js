self.asCustomElement = (function (exports) {
  'use strict';

  var set = new Set();
  var observer = new MutationObserver(function (records) {
    set.forEach(invoke, records);
  });
  observer.observe(document, {
    subtree: true,
    childList: true
  });
  set.observer = observer;

  function invoke(callback) {
    callback(this, observer);
  }

  var wm = new WeakMap();
  var observer$1 = set.observer;

  var attributeChanged = function attributeChanged(records, mo) {
    for (var i = 0, length = records.length; i < length; i++) {
      var _records$i = records[i],
          target = _records$i.target,
          attributeName = _records$i.attributeName,
          oldValue = _records$i.oldValue;
      change(wm.get(target).a.get(mo), target, attributeName, oldValue);
    }
  };

  var change = function change(attributeChangedCallback, target, attributeName, oldValue) {
    attributeChangedCallback.call(target, attributeName, oldValue, target.getAttribute(attributeName));
  };

  var fallback = function fallback() {};

  var invoke$1 = function invoke(nodes, key) {
    for (var i = 0, length = nodes.length; i < length; i++) {
      var target = nodes[i],
          info = wm.get(target);

      if (info) {
        if (key === 'd') info.a.forEach(takeRecords);
        info[key].forEach(call, target);
      }

      invoke(target.children || [], key);
    }
  };

  var mainLoop = function mainLoop(records) {
    for (var i = 0, length = records.length; i < length; i++) {
      var _records$i2 = records[i],
          addedNodes = _records$i2.addedNodes,
          removedNodes = _records$i2.removedNodes;
      invoke$1(addedNodes, 'c');
      invoke$1(removedNodes, 'd');
    }
  };

  var set$1 = function set(target) {
    var sets = {
      a: new Map(),
      c: new Set(),
      d: new Set()
    };
    wm.set(target, sets);
    return sets;
  };

  var takeRecords = function takeRecords(_, mo) {
    attributeChanged(mo.takeRecords(), mo);
  };

  set.add(mainLoop);
  var index = (function (target, _ref) {
    var connectedCallback = _ref.connectedCallback,
        disconnectedCallback = _ref.disconnectedCallback,
        observedAttributes = _ref.observedAttributes,
        attributeChangedCallback = _ref.attributeChangedCallback;
    mainLoop(observer$1.takeRecords());

    var _ref2 = wm.get(target) || set$1(target),
        a = _ref2.a,
        c = _ref2.c,
        d = _ref2.d;

    if (observedAttributes) {
      var mo = new MutationObserver(attributeChanged);
      mo.observe(target, {
        attributes: true,
        attributeFilter: observedAttributes,
        attributeOldValue: true
      });
      a.set(mo, attributeChangedCallback || fallback);
      observedAttributes.forEach(function (attributeName) {
        if (target.hasAttribute(attributeName)) change(attributeChangedCallback || fallback, target, attributeName, null);
      });
    }

    c.add(connectedCallback || fallback);
    d.add(disconnectedCallback || fallback); // if (target.isConnected) // No IE11/Edge support

    if (!(target.ownerDocument.compareDocumentPosition(target) & target.DOCUMENT_POSITION_DISCONNECTED)) (connectedCallback || fallback).call(target);
    return target;
  });

  function call(back) {
    back.call(this);
  }

  exports.default = index;

  return exports;

}({}).default);
