'use strict';
const sdo = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('shared-document-observer'));

const wm = new WeakMap;
const {observer} = sdo;

const attributeChanged = (records, mo) => {
  for (let i = 0, {length} = records; i < length; i++) {
    const {target, attributeName, oldValue} = records[i];
    change(wm.get(target).a.get(mo), target, attributeName, oldValue);
  }
};

const change = (attributeChangedCallback, target, attributeName, oldValue) => {
  attributeChangedCallback.call(
    target,
    attributeName,
    oldValue,
    target.getAttribute(attributeName)
  );
};

const fallback = () => {};

const invoke = (nodes, key) => {
  for (let i = 0, {length} = nodes; i < length; i++) {
    const target = nodes[i], info = wm.get(target);
    if (info) {
      if (key === 'd')
        info.a.forEach(takeRecords);
      info[key].forEach(call, target);
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
  const sets = {a: new Map, c: new Set, d: new Set};
  wm.set(target, sets);
  return sets;
};

const takeRecords = (_, mo) => {
  attributeChanged(mo.takeRecords(), mo);
};

sdo.add(mainLoop);

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
  mainLoop(observer.takeRecords());
  const {a, c, d} = wm.get(target) || set(target);
  if (observedAttributes) {
    const mo = new MutationObserver(attributeChanged);
    mo.observe(target, {
      attributes: true,
      attributeFilter: observedAttributes,
      attributeOldValue: true
    });
    a.set(mo, attributeChangedCallback || fallback);
    observedAttributes.forEach(attributeName => {
      if (target.hasAttribute(attributeName))
        change(attributeChangedCallback || fallback, target, attributeName, null);
    });
  }
  c.add(connectedCallback || fallback);
  d.add(disconnectedCallback || fallback);
  // if (target.isConnected) // No IE11/Edge support
  if (!(
    target.ownerDocument.compareDocumentPosition(target) &
    target.DOCUMENT_POSITION_DISCONNECTED
  ))
    (connectedCallback || fallback).call(target);
  return target;
};

function call(back) {
  back.call(this);
}
