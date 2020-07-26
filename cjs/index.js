'use strict';
const wm = new WeakMap;

const attributeChanged = records => {
  for (let i = 0, {length} = records; i < length; i++) {
    const {attributeName, oldValue, target} = records[i];
    const newValue = target.getAttribute(attributeName);
    wm.get(target).a.forEach(callback => {
      callback.call(target, attributeName, oldValue, newValue);
    });
  }
};

const fallback = () => {};

const invoke = (nodes, key) => {
  for (let i = 0, {length} = nodes; i < length; i++) {
    const target = nodes[i];
    if (wm.has(target)) {
      if (key === 'd')
        wm.get(target).o.forEach(takeRecords);
      wm.get(target)[key].forEach(call, target);
    }
    invoke(target.children || [], key);
  }
};

const mainLoop = records => {
  for (let i = 0, {length} = records; i < length; i++) {
    const {addedNodes, removedNodes} = records[i];
    invoke(addedNodes, 'c');
    invoke(removedNodes, 'd');
  }
};

const set = target => {
  const sets = {a: new Set, c: new Set, d: new Set, o: new Set};
  wm.set(target, sets);
  return sets;
};

const takeRecords = mo => {
  attributeChanged(mo.takeRecords());
};

const mo = new MutationObserver(mainLoop);

mo.observe(
  document,
  {childList: true, subtree: true}
);

module.exports = (
  target,
  {
    // connected/disconnected
    connectedCallback,
    disconnectedCallback,
    // attributes to be notified about
    observedAttributes,
    attributeChangedCallback
  }
) => {
  mainLoop(mo.takeRecords());
  const {a, c, d, o} = wm.get(target) || set(target);
  if (observedAttributes) {
    const mo = new MutationObserver(attributeChanged);
    mo.observe(target, {
      attributes: true,
      attributeFilter: observedAttributes,
      attributeOldValue: true
    });
    a.add(attributeChangedCallback || fallback);
    o.add(mo);
    observedAttributes.forEach(attributeName => {
      if (target.hasAttribute(attributeName))
        (attributeChangedCallback || fallback)
          .call(target, attributeName, null, target.getAttribute(attributeName));
    });
  }
  c.add(connectedCallback || fallback);
  d.add(disconnectedCallback || fallback);
  // if (target.isConnected) // No IE11/Edge support
  if (target.ownerDocument.contains(target))
    (connectedCallback || fallback).call(target);
  return target;
};

function call(back) {
  back.call(this);
}
