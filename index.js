self.asCustomElement = (function (exports) {
  'use strict';

  var asCE = (function (root, upgrade) {
    var wm = new WeakMap();
    var ao = new WeakMap();

    var attributeChanged = function attributeChanged(records, mo) {
      for (var i = 0, length = records.length; i < length; i++) {
        var _records$i = records[i],
            target = _records$i.target,
            attributeName = _records$i.attributeName,
            oldValue = _records$i.oldValue;
        var newValue = target.getAttribute(attributeName);
        ao.get(mo).call(target, attributeName, oldValue, newValue);
      }
    };

    var invoke = function invoke(nodes, key, parsed, isQSA) {
      for (var i = 0, length = nodes.length; i < length; i++) {
        var target = nodes[i];

        if (!parsed.has(target) && (isQSA || 'querySelectorAll' in target)) {
          parsed.add(target);
          if (wm.has(target)) wm.get(target)[key].forEach(call, target);else if (key === 'c') upgrade(target);
          invoke(target.querySelectorAll('*'), key, parsed, true);
        }
      }
    };

    var mainLoop = function mainLoop(records) {
      for (var i = 0, length = records.length; i < length; i++) {
        var _records$i2 = records[i],
            addedNodes = _records$i2.addedNodes,
            removedNodes = _records$i2.removedNodes;
        invoke(addedNodes, 'c', new Set(), false);
        invoke(removedNodes, 'd', new Set(), false);
      }
    };

    var set = function set(target) {
      var sets = {
        c: new Set(),
        d: new Set()
      };
      wm.set(target, sets);
      return sets;
    };

    var sdo = new MutationObserver(mainLoop);
    sdo.observe(root, {
      childList: true,
      subtree: true
    });
    return function (target, _ref) {
      var connectedCallback = _ref.connectedCallback,
          disconnectedCallback = _ref.disconnectedCallback,
          observedAttributes = _ref.observedAttributes,
          attributeChangedCallback = _ref.attributeChangedCallback;
      mainLoop(sdo.takeRecords());

      var _ref2 = wm.get(target) || set(target),
          c = _ref2.c,
          d = _ref2.d;

      if (observedAttributes) {
        var mo = new MutationObserver(attributeChanged);
        mo.observe(target, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: observedAttributes.map(function (attributeName) {
            if (target.hasAttribute(attributeName)) attributeChangedCallback.call(target, attributeName, null, target.getAttribute(attributeName));
            return attributeName;
          })
        });
        ao.set(mo, attributeChangedCallback);
      }

      if (disconnectedCallback) d.add(disconnectedCallback);

      if (connectedCallback) {
        c.add(connectedCallback);
        if (!(target.ownerDocument.compareDocumentPosition(target) & target.DOCUMENT_POSITION_DISCONNECTED)) connectedCallback.call(target);
      }

      return target;
    };
  });

  function call(back) {
    back.call(this);
  }

  var index = asCE(document, function () {});

  exports.default = index;

  return exports;

}({}).default);
