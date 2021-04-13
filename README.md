# As Custom Element

The easiest way to add Custom Elements like callbacks to any node.

Compatible with [modern browsers](https://webreflection.github.io/as-custom-element/test/), as well as [IE11](https://webreflection.github.io/as-custom-element/test/ie/), and no polyfills are needed, for a minified size less than *0.8K*.

```js
import {upgrade, downgrade} from 'as-custom-element';

const someBehavior = {
  // lifecycle callbacks
  connectedCallback() {
    console.log(this, 'is connected');
  },
  disconnectedCallback() {},

  // attributes related helpers
  observedAttributes: ['one', 'or', 'more'],
  attributeChangedCallback(attributeName, oldValue, newValue) {}
};

upgrade(document.querySelector('#any'), someBehavior);

// to drop the behavior at any time
downgrade(document.querySelector('#any'), someBehavior);
```
