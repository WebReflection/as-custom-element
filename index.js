self.asCustomElement = (function (exports) {
  'use strict';

  var elements = function elements(element) {
    return 'querySelectorAll' in element;
  };

  var filter = [].filter;
  var QSAO = (function (options) {
    var live = new WeakMap();

    var callback = function callback(records) {
      var query = options.query;

      if (query.length) {
        for (var i = 0, length = records.length; i < length; i++) {
          loop(filter.call(records[i].addedNodes, elements), true, query);
          loop(filter.call(records[i].removedNodes, elements), false, query);
        }
      }
    };

    var flush = function flush() {
      callback(observer.takeRecords());
    };

    var loop = function loop(elements, connected, query) {
      var set = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();

      var _loop = function _loop(_selectors, _element, i, length) {
        if (!set.has(_element = elements[i])) {
          set.add(_element);

          if (connected) {
            for (var q, m = matches(_element), _i = 0, _length = query.length; _i < _length; _i++) {
              if (m.call(_element, q = query[_i])) {
                if (!live.has(_element)) live.set(_element, new Set());
                _selectors = live.get(_element);

                if (!_selectors.has(q)) {
                  _selectors.add(q);

                  options.handle(_element, connected, q);
                }
              }
            }
          } else if (live.has(_element)) {
            _selectors = live.get(_element);
            live["delete"](_element);

            _selectors.forEach(function (q) {
              options.handle(_element, connected, q);
            });
          }

          loop(_element.querySelectorAll(query), connected, query, set);
        }

        selectors = _selectors;
        element = _element;
      };

      for (var selectors, element, i = 0, length = elements.length; i < length; i++) {
        _loop(selectors, element, i);
      }
    };

    var matches = function matches(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };

    var parse = function parse(elements) {
      var connected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      loop(elements, connected, options.query);
    };

    var observer = new MutationObserver(callback);
    var root = options.root || document;
    var query = options.query;
    observer.observe(root, {
      childList: true,
      subtree: true
    });
    if (query.length) parse(root.querySelectorAll(query));
    return {
      flush: flush,
      observer: observer,
      parse: parse
    };
  });

  var attributes = new WeakMap();
  var lifecycle = new WeakMap();
  var query = [];

  var attributeChanged = function attributeChanged(records, mo) {
    for (var i = 0, length = records.length; i < length; i++) {
      var _records$i = records[i],
          target = _records$i.target,
          attributeName = _records$i.attributeName,
          oldValue = _records$i.oldValue;
      var newValue = target.getAttribute(attributeName);
      attributes.get(mo).call(target, attributeName, oldValue, newValue);
    }
  };

  var set = function set(element) {
    var sets = {
      c: new Set(),
      d: new Set()
    };
    lifecycle.set(element, sets);
    return sets;
  };

  var _QSAO = QSAO({
    query: query,
    handle: function handle(element, connected) {
      if (lifecycle.has(element)) lifecycle.get(element)[connected ? 'c' : 'd'].forEach(call, element);
    }
  }),
      flush = _QSAO.flush,
      parse = _QSAO.parse;

  var index = (function (element, _ref) {
    var connectedCallback = _ref.connectedCallback,
        disconnectedCallback = _ref.disconnectedCallback,
        observedAttributes = _ref.observedAttributes,
        attributeChangedCallback = _ref.attributeChangedCallback;
    flush();
    var tagName = element.tagName;
    if (query.indexOf(tagName) < 0) query.push(tagName);

    var _ref2 = lifecycle.get(element) || set(element),
        c = _ref2.c,
        d = _ref2.d;

    if (observedAttributes) {
      var mo = new MutationObserver(attributeChanged);
      mo.observe(element, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: observedAttributes.map(function (attributeName) {
          if (element.hasAttribute(attributeName)) attributeChangedCallback.call(element, attributeName, null, element.getAttribute(attributeName));
          return attributeName;
        })
      });
      attributes.set(mo, attributeChangedCallback);
    }

    if (disconnectedCallback) d.add(disconnectedCallback);

    if (connectedCallback) {
      c.add(connectedCallback);
      if (!(element.ownerDocument.compareDocumentPosition(element) & element.DOCUMENT_POSITION_DISCONNECTED)) parse([element]);
    }

    return element;
  });

  function call(back) {
    back.call(this);
  }

  exports.default = index;

  return exports;

}({}).default);
