import {notify} from 'element-notifier';

const lifecycle = new WeakMap;

const attributeChanged = (records, mo) => {
  for (let i = 0, {length} = records; i < length; i++) {
    const {target, attributeName, oldValue} = records[i];
    if (lifecycle.has(target)) {
      const {a} = lifecycle.get(target);
      const newValue = target.getAttribute(attributeName);
      a.forEach((observedAttributes, attributeChangedCallback) => {
        if (-1 < observedAttributes.indexOf(attributeName))
          attributeChangedCallback.call(target, attributeName, oldValue, newValue);
      });
    }
    else
      mo.disconnect();
  }
};

notify((element, connected) => {
  if (lifecycle.has(element))
    lifecycle.get(element)[connected ? 'c' : 'd'].forEach(call, element);
});

export const upgrade = (
  element,
  {
    upgradedCallback,
    connectedCallback,
    disconnectedCallback,
    observedAttributes,
    attributeChangedCallback
  }
) => {
  if (!lifecycle.has(element))
    lifecycle.set(element, {a: new Map, c: new Set, d: new Set});
  if (upgradedCallback)
    upgradedCallback.call(element);
  const {a, c, d} = lifecycle.get(element);
  if (attributeChangedCallback) {
    const mo = new MutationObserver(attributeChanged);
    mo.observe(element, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: observedAttributes.map(attributeName => {
        const value = element.getAttribute(attributeName);
        if (value != null)
          attributeChangedCallback.call(
            element,
            attributeName,
            null,
            value
          );
        return attributeName;
      })
    });
    a.set(attributeChangedCallback, observedAttributes);
  }
  if (disconnectedCallback)
    d.add(disconnectedCallback);
  if (connectedCallback) {
    c.add(connectedCallback);
    if (!(
      element.ownerDocument.compareDocumentPosition(element) &
      element.DOCUMENT_POSITION_DISCONNECTED
    ))
      connectedCallback.call(element);
  }
  return element;
};

export const downgrade = (
  element,
  {
    downgradedCallback,
    connectedCallback,
    disconnectedCallback,
    attributeChangedCallback
  }
) => {
  if (lifecycle.has(element)) {
    const {a, c, d} = lifecycle.get(element);
    if (attributeChangedCallback)
      a.delete(attributeChangedCallback);
    if (disconnectedCallback)
      d.delete(disconnectedCallback);
    if (connectedCallback)
      c.delete(connectedCallback);
    if ((a.size + d.size + c.size) < 1)
      lifecycle.delete(element);
    if (downgradedCallback)
      downgradedCallback.call(element);
  }
  return element;
};

function call(back) {
  back.call(this);
}
