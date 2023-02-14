/**
 * Weakly references Custom Elements like callbacks to a specific `Element`.
 * While all fields are optional, if `attributeChangedCallback` is defined
 * it is expected that `observedAttributes` is also available with at least
 * one attribute to observe.
 */
type LifeCycle<T> = {
  connectedCallback?(this: T): void;
  disconnectedCallback?(this: T): void;
  attributeChangedCallback?(this: T, name:string, oldValue:string | null, newValue:string | null): void;
  observedAttributes?: string[];
};

/**
 * Attach any `LifeCycle` behavior to any `Element`
 */
export const upgrade:<T extends Element> (element: T, lifeCycle: LifeCycle<T>) => T;

/**
 * Remove any `LifeCycle` behavior previously attached to an `Element`
 */
export const downgrade:<T extends Element> (element: T, lifeCycle: LifeCycle<T>) => T;
