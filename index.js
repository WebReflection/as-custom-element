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

  var attributeChanged = function attributeChanged(records) {
    var _loop = function _loop(i, length) {
      var _records$i = records[i],
          target = _records$i.target,
          attributeName = _records$i.attributeName,
          oldValue = _records$i.oldValue;
      var newValue = target.getAttribute(attributeName);
      wm.get(target).a[attributeName].forEach(function (attributeChangedCallback) {
        attributeChangedCallback.call(target, attributeName, oldValue, newValue);
      });
    };

    for (var i = 0, length = records.length; i < length; i++) {
      _loop(i);
    }
  };

  var invoke$1 = function invoke(nodes, key, nested) {
    for (var i = 0, length = nodes.length; i < length; i++) {
      var target = nodes[i];

      if (nested) {
        if (target.querySelectorAll) {
          if (wm.has(target)) wm.get(target)[key].forEach(call, target);
          invoke(target.querySelectorAll('*'), key, !nested);
        }
      } else if (wm.has(target)) wm.get(target)[key].forEach(call, target);
    }
  };

  var mainLoop = function mainLoop(records) {
    for (var i = 0, length = records.length; i < length; i++) {
      var _records$i2 = records[i],
          addedNodes = _records$i2.addedNodes,
          removedNodes = _records$i2.removedNodes;
      invoke$1(addedNodes, 'c', true);
      attributeChanged(sao.takeRecords());
      invoke$1(removedNodes, 'd', true);
    }
  };

  var sao = new MutationObserver(attributeChanged);

  var set$1 = function set(target) {
    var sets = {
      a: {},
      c: new Set(),
      d: new Set()
    };
    wm.set(target, sets);
    return sets;
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
      sao.observe(target, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: observedAttributes
      });
      observedAttributes.forEach(function (attributeName) {
        (a[attributeName] || (a[attributeName] = new Set())).add(attributeChangedCallback);
        if (target.hasAttribute(attributeName)) attributeChangedCallback.call(target, attributeName, null, target.getAttribute(attributeName));
      });
    }

    if (disconnectedCallback) d.add(disconnectedCallback);

    if (connectedCallback) {
      c.add(connectedCallback); // if (target.isConnected) // No IE11/Edge support

      if (!(target.ownerDocument.compareDocumentPosition(target) & target.DOCUMENT_POSITION_DISCONNECTED)) connectedCallback.call(target);
    }

    return target;
  });

  function call(back) {
    back.call(this);
  }

  exports.default = index;

  return exports;

}({}).default);
