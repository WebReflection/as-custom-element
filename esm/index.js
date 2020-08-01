import QSAO from 'qsa-observer';

const attributes = new WeakMap;
const lifecycle = new WeakMap;

const attributeChanged = (records, mo) => {
  for (let i = 0, {length} = records; i < length; i++) {
    const {target, attributeName, oldValue} = records[i];
    const newValue = target.getAttribute(attributeName);
    attributes.get(mo).call(target, attributeName, oldValue, newValue);
  }
};

const set = element => {
  const sets = {c: new Set, d: new Set};
  lifecycle.set(element, sets);
  return sets;
};

const {flush} = QSAO({
  query: ['*'],
  handle(element, connected) {
    if (lifecycle.has(element))
      lifecycle.get(element)[connected ? 'c' : 'd'].forEach(call, element);
  }
});

export default (
  element,
  {
    connectedCallback,
    disconnectedCallback,
    observedAttributes,
    attributeChangedCallback
  }
) => {
  flush();
  const {c, d} = lifecycle.get(element) || set(element);
  if (observedAttributes) {
    const mo = new MutationObserver(attributeChanged);
    mo.observe(element, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: observedAttributes.map(attributeName => {
        if (element.hasAttribute(attributeName))
          attributeChangedCallback.call(
            element,
            attributeName,
            null,
            element.getAttribute(attributeName)
          );
        return attributeName;
      })
    });
    attributes.set(mo, attributeChangedCallback);

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

function call(back) {
  back.call(this);
}
