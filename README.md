# As Custom Element

The easiest way to add Custom Elements like callback to any node.

Compatible with modern browsers, as well as IE11, and no polyfills are needed.

```js
import asCustomElement from 'as-custom-element';

const setup = {
  // lifecycle callbacks
  connectedCallback() {},
  disconnectedCallback() {},

  // attributes related helpers
  observedAttributes: ['one', 'or', 'more'],
  attributeChangedCallback(attributeName, oldValue, newValue) {}
};

asCustomElement(document.querySelector('#any'), setup);
```
