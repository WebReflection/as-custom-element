# As Custom Element

The easiest way to add Custom Elements like callback to any node.

Compatible with [modern browsers](https://webreflection.github.io/as-custom-element/test/), as well as [IE11](https://webreflection.github.io/as-custom-element/test/ie/), and no polyfills are needed.

```js
import asCustomElement from 'as-custom-element';

const setup = {
  // lifecycle callbacks
  connectedCallback() {
    console.log(this, 'is connected');
  },
  disconnectedCallback() {},

  // attributes related helpers
  observedAttributes: ['one', 'or', 'more'],
  attributeChangedCallback(attributeName, oldValue, newValue) {}
};

asCustomElement(document.querySelector('#any'), setup);
```
