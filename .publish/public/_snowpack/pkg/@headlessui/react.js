import { r as react } from '../common/index-0ff745df.js';
import { r as reactDom } from '../common/index-1a921524.js';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  it = o[Symbol.iterator]();
  return it.next.bind(it);
}

function match(value, lookup) {
  if (value in lookup) {
    var returnValue = lookup[value];

    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return typeof returnValue === 'function' ? returnValue.apply(void 0, args) : returnValue;
  }

  var error = new Error("Tried to handle \"" + value + "\" but there is no handler defined. Only defined handlers are: " + Object.keys(lookup).map(function (key) {
    return "\"" + key + "\"";
  }).join(', ') + ".");
  if (Error.captureStackTrace) Error.captureStackTrace(error, match);
  throw error;
}

var Features;

(function (Features) {
  /** No features at all */
  Features[Features["None"] = 0] = "None";
  /**
   * When used, this will allow us to use one of the render strategies.
   *
   * **The render strategies are:**
   *    - **Unmount**   _(Will unmount the component.)_
   *    - **Hidden**    _(Will hide the component using the [hidden] attribute.)_
   */

  Features[Features["RenderStrategy"] = 1] = "RenderStrategy";
  /**
   * When used, this will allow the user of our component to be in control. This can be used when
   * you want to transition based on some state.
   */

  Features[Features["Static"] = 2] = "Static";
})(Features || (Features = {}));

var RenderStrategy;

(function (RenderStrategy) {
  RenderStrategy[RenderStrategy["Unmount"] = 0] = "Unmount";
  RenderStrategy[RenderStrategy["Hidden"] = 1] = "Hidden";
})(RenderStrategy || (RenderStrategy = {}));

function render(_ref) {
  var props = _ref.props,
      slot = _ref.slot,
      defaultTag = _ref.defaultTag,
      features = _ref.features,
      _ref$visible = _ref.visible,
      visible = _ref$visible === void 0 ? true : _ref$visible,
      name = _ref.name;
  // Visible always render
  if (visible) return _render(props, slot, defaultTag, name);
  var featureFlags = features != null ? features : Features.None;

  if (featureFlags & Features.Static) {
    var _props$static = props["static"],
        isStatic = _props$static === void 0 ? false : _props$static,
        rest = _objectWithoutPropertiesLoose(props, ["static"]); // When the `static` prop is passed as `true`, then the user is in control, thus we don't care about anything else


    if (isStatic) return _render(rest, slot, defaultTag, name);
  }

  if (featureFlags & Features.RenderStrategy) {
    var _match;

    var _props$unmount = props.unmount,
        unmount = _props$unmount === void 0 ? true : _props$unmount,
        _rest = _objectWithoutPropertiesLoose(props, ["unmount"]);

    var strategy = unmount ? RenderStrategy.Unmount : RenderStrategy.Hidden;
    return match(strategy, (_match = {}, _match[RenderStrategy.Unmount] = function () {
      return null;
    }, _match[RenderStrategy.Hidden] = function () {
      return _render(_extends({}, _rest, {
        hidden: true,
        style: {
          display: 'none'
        }
      }), slot, defaultTag, name);
    }, _match));
  } // No features enabled, just render


  return _render(props, slot, defaultTag, name);
}

function _render(props, slot, tag, name) {
  var _ref2;

  if (slot === void 0) {
    slot = {};
  }

  var _omit = omit(props, ['unmount', 'static']),
      _omit$as = _omit.as,
      Component = _omit$as === void 0 ? tag : _omit$as,
      children = _omit.children,
      _omit$refName = _omit.refName,
      refName = _omit$refName === void 0 ? 'ref' : _omit$refName,
      passThroughProps = _objectWithoutPropertiesLoose(_omit, ["as", "children", "refName"]); // This allows us to use `<HeadlessUIComponent as={MyComponent} refName="innerRef" />`


  var refRelatedProps = props.ref !== undefined ? (_ref2 = {}, _ref2[refName] = props.ref, _ref2) : {};
  var resolvedChildren = typeof children === 'function' ? children(slot) : children; // Allow for className to be a function with the slot as the contents

  if (passThroughProps.className && typeof passThroughProps.className === 'function') {
    passThroughProps.className = passThroughProps.className(slot);
  }

  if (Component === react.Fragment) {
    if (Object.keys(passThroughProps).length > 0) {
      if (!react.isValidElement(resolvedChildren) || Array.isArray(resolvedChildren) && resolvedChildren.length > 1) {
        throw new Error(['Passing props on "Fragment"!', '', "The current component <" + name + " /> is rendering a \"Fragment\".", "However we need to passthrough the following props:", Object.keys(passThroughProps).map(function (line) {
          return "  - " + line;
        }).join('\n'), '', 'You can apply a few solutions:', ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', 'Render a single element as the child so that we can forward the props onto that element.'].map(function (line) {
          return "  - " + line;
        }).join('\n')].join('\n'));
      }

      return react.cloneElement(resolvedChildren, Object.assign({}, // Filter out undefined values so that they don't override the existing values
      mergeEventFunctions(compact(omit(passThroughProps, ['ref'])), resolvedChildren.props, ['onClick']), refRelatedProps));
    }
  }

  return react.createElement(Component, Object.assign({}, omit(passThroughProps, ['ref']), Component !== react.Fragment && refRelatedProps), resolvedChildren);
}
/**
 * We can use this function for the following useCase:
 *
 * <Menu.Item> <button onClick={console.log} /> </Menu.Item>
 *
 * Our `Menu.Item` will have an internal `onClick`, if you passthrough an `onClick` to the actual
 * `Menu.Item` component we will call it correctly. However, when we have an `onClick` on the actual
 * first child, that one should _also_ be called (but before this implementation, it was just
 * overriding the `onClick`). But it is only when we *render* that we have access to the existing
 * props of this component.
 *
 * It's a bit hacky, and not that clean, but it is something internal and we have tests to rely on
 * so that we can refactor this later (if needed).
 */


function mergeEventFunctions(passThroughProps, existingProps, functionsToMerge) {
  var clone = Object.assign({}, passThroughProps);

  var _loop = function _loop() {
    var func = _step.value;

    if (passThroughProps[func] !== undefined && existingProps[func] !== undefined) {
      var _Object$assign;

      Object.assign(clone, (_Object$assign = {}, _Object$assign[func] = function (event) {
        // Props we control
        if (!event.defaultPrevented) passThroughProps[func](event); // Existing props on the component

        if (!event.defaultPrevented) existingProps[func](event);
      }, _Object$assign));
    }
  };

  for (var _iterator = _createForOfIteratorHelperLoose(functionsToMerge), _step; !(_step = _iterator()).done;) {
    _loop();
  }

  return clone;
}
/**
 * This is a hack, but basically we want to keep the full 'API' of the component, but we do want to
 * wrap it in a forwardRef so that we _can_ passthrough the ref
 */


function forwardRefWithAs(component) {
  var _component$displayNam;

  return Object.assign(react.forwardRef(component), {
    displayName: (_component$displayNam = component.displayName) != null ? _component$displayNam : component.name
  });
}

function compact(object) {
  var clone = Object.assign({}, object);

  for (var key in clone) {
    if (clone[key] === undefined) delete clone[key];
  }

  return clone;
}

function omit(object, keysToOmit) {
  if (keysToOmit === void 0) {
    keysToOmit = [];
  }

  var clone = Object.assign({}, object);

  for (var _iterator2 = _createForOfIteratorHelperLoose(keysToOmit), _step2; !(_step2 = _iterator2()).done;) {
    var key = _step2.value;
    if (key in clone) delete clone[key];
  }

  return clone;
}

var useIsoMorphicEffect = typeof window !== 'undefined' ? react.useLayoutEffect : react.useEffect;

var state = {
  serverHandoffComplete: false
};
function useServerHandoffComplete() {
  var _useState = react.useState(state.serverHandoffComplete),
      serverHandoffComplete = _useState[0],
      setServerHandoffComplete = _useState[1];

  react.useEffect(function () {
    if (serverHandoffComplete === true) return;
    setServerHandoffComplete(true);
  }, [serverHandoffComplete]);
  react.useEffect(function () {
    if (state.serverHandoffComplete === false) state.serverHandoffComplete = true;
  }, []);
  return serverHandoffComplete;
}

var ForcePortalRootContext = /*#__PURE__*/react.createContext(false);
function usePortalRoot() {
  return react.useContext(ForcePortalRootContext);
}
function ForcePortalRoot(props) {
  return react.createElement(ForcePortalRootContext.Provider, {
    value: props.force
  }, props.children);
}

function usePortalTarget() {
  var forceInRoot = usePortalRoot();
  var groupTarget = react.useContext(PortalGroupContext);

  var _useState = react.useState(function () {
    // Group context is used, but still null
    if (!forceInRoot && groupTarget !== null) return null; // No group context is used, let's create a default portal root

    if (typeof window === 'undefined') return null;
    var existingRoot = document.getElementById('headlessui-portal-root');
    if (existingRoot) return existingRoot;
    var root = document.createElement('div');
    root.setAttribute('id', 'headlessui-portal-root');
    return document.body.appendChild(root);
  }),
      target = _useState[0],
      setTarget = _useState[1];

  react.useEffect(function () {
    if (forceInRoot) return;
    if (groupTarget === null) return;
    setTarget(groupTarget.current);
  }, [groupTarget, setTarget, forceInRoot]);
  return target;
} // ---


var DEFAULT_PORTAL_TAG = react.Fragment;
function Portal(props) {
  var passthroughProps = props;
  var target = usePortalTarget();

  var _useState2 = react.useState(function () {
    return typeof window === 'undefined' ? null : document.createElement('div');
  }),
      element = _useState2[0];

  var ready = useServerHandoffComplete();
  useIsoMorphicEffect(function () {
    if (!target) return;
    if (!element) return;
    target.appendChild(element);
    return function () {
      if (!target) return;
      if (!element) return;
      target.removeChild(element);

      if (target.childNodes.length <= 0) {
        var _target$parentElement;

        (_target$parentElement = target.parentElement) == null ? void 0 : _target$parentElement.removeChild(target);
      }
    };
  }, [target, element]);
  if (!ready) return null;
  return !target || !element ? null : reactDom.createPortal(render({
    props: passthroughProps,
    defaultTag: DEFAULT_PORTAL_TAG,
    name: 'Portal'
  }), element);
} // ---

var DEFAULT_GROUP_TAG = react.Fragment;
var PortalGroupContext = /*#__PURE__*/react.createContext(null);

function Group(props) {
  var target = props.target,
      passthroughProps = _objectWithoutPropertiesLoose(props, ["target"]);

  return react.createElement(PortalGroupContext.Provider, {
    value: target
  }, render({
    props: passthroughProps,
    defaultTag: DEFAULT_GROUP_TAG,
    name: 'Popover.Group'
  }));
} // ---


Portal.Group = Group;

function useSyncRefs() {
  for (var _len = arguments.length, refs = new Array(_len), _key = 0; _key < _len; _key++) {
    refs[_key] = arguments[_key];
  }

  var cache = react.useRef(refs);
  react.useEffect(function () {
    cache.current = refs;
  }, [refs]);
  return react.useCallback(function (value) {
    for (var _iterator = _createForOfIteratorHelperLoose(cache.current), _step; !(_step = _iterator()).done;) {
      var ref = _step.value;
      if (ref == null) continue;
      if (typeof ref === 'function') ref(value);else ref.current = value;
    }
  }, [cache]);
}

// TODO: This must already exist somewhere, right? 🤔
// Ref: https://www.w3.org/TR/uievents-key/#named-key-attribute-values
var Keys;

(function (Keys) {
  Keys["Space"] = " ";
  Keys["Enter"] = "Enter";
  Keys["Escape"] = "Escape";
  Keys["Backspace"] = "Backspace";
  Keys["ArrowLeft"] = "ArrowLeft";
  Keys["ArrowUp"] = "ArrowUp";
  Keys["ArrowRight"] = "ArrowRight";
  Keys["ArrowDown"] = "ArrowDown";
  Keys["Home"] = "Home";
  Keys["End"] = "End";
  Keys["PageUp"] = "PageUp";
  Keys["PageDown"] = "PageDown";
  Keys["Tab"] = "Tab";
})(Keys || (Keys = {}));

// See: https://github.com/facebook/react/issues/7711
// See: https://github.com/facebook/react/pull/20612
// See: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#concept-fe-disabled (2.)
function isDisabledReactIssue7711(element) {
  var _ref, _parent;

  var parent = element.parentElement;
  var legend = null;

  while (parent && !(parent instanceof HTMLFieldSetElement)) {
    if (parent instanceof HTMLLegendElement) legend = parent;
    parent = parent.parentElement;
  }

  var isParentDisabled = (_ref = ((_parent = parent) == null ? void 0 : _parent.getAttribute('disabled')) === '') != null ? _ref : false;
  if (isParentDisabled && isFirstLegend(legend)) return false;
  return isParentDisabled;
}

function isFirstLegend(element) {
  if (!element) return false;
  var previous = element.previousElementSibling;

  while (previous !== null) {
    if (previous instanceof HTMLLegendElement) return false;
    previous = previous.previousElementSibling;
  }

  return true;
}

// didn't take care of the Suspense case. To fix this we used the approach the @reach-ui/auto-id
// uses.
//
// Credits: https://github.com/reach/reach-ui/blob/develop/packages/auto-id/src/index.tsx

var id = 0;

function generateId() {
  return ++id;
}

function useId() {
  var ready = useServerHandoffComplete();

  var _useState = react.useState(ready ? generateId : null),
      id = _useState[0],
      setId = _useState[1];

  useIsoMorphicEffect(function () {
    if (id === null) setId(generateId());
  }, [id]);
  return id != null ? '' + id : undefined;
}

function useWindowEvent(type, listener, options) {
  var listenerRef = react.useRef(listener);
  listenerRef.current = listener;
  react.useEffect(function () {
    function handler(event) {
      listenerRef.current.call(window, event);
    }

    window.addEventListener(type, handler, options);
    return function () {
      return window.removeEventListener(type, handler, options);
    };
  }, [type, options]);
}

//  - https://stackoverflow.com/a/30753870

var focusableSelector = /*#__PURE__*/['[contentEditable=true]', '[tabindex]', 'a[href]', 'area[href]', 'button:not([disabled])', 'iframe', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])'].map( function (selector) {
  return selector + ":not([tabindex='-1'])";
}).join(',');
var Focus;

(function (Focus) {
  /** Focus the first non-disabled element */
  Focus[Focus["First"] = 1] = "First";
  /** Focus the previous non-disabled element */

  Focus[Focus["Previous"] = 2] = "Previous";
  /** Focus the next non-disabled element */

  Focus[Focus["Next"] = 4] = "Next";
  /** Focus the last non-disabled element */

  Focus[Focus["Last"] = 8] = "Last";
  /** Wrap tab around */

  Focus[Focus["WrapAround"] = 16] = "WrapAround";
  /** Prevent scrolling the focusable elements into view */

  Focus[Focus["NoScroll"] = 32] = "NoScroll";
})(Focus || (Focus = {}));

var FocusResult;

(function (FocusResult) {
  /** Something went wrong while trying to focus. */
  FocusResult[FocusResult["Error"] = 0] = "Error";
  /** When `Focus.WrapAround` is enabled, going from position `N` to `N+1` where `N` is the last index in the array, then we overflow. */

  FocusResult[FocusResult["Overflow"] = 1] = "Overflow";
  /** Focus was successful. */

  FocusResult[FocusResult["Success"] = 2] = "Success";
  /** When `Focus.WrapAround` is enabled, going from position `N` to `N-1` where `N` is the first index in the array, then we underflow. */

  FocusResult[FocusResult["Underflow"] = 3] = "Underflow";
})(FocusResult || (FocusResult = {}));

var Direction;

(function (Direction) {
  Direction[Direction["Previous"] = -1] = "Previous";
  Direction[Direction["Next"] = 1] = "Next";
})(Direction || (Direction = {}));

function getFocusableElements(container) {
  if (container === void 0) {
    container = document.body;
  }

  if (container == null) return [];
  return Array.from(container.querySelectorAll(focusableSelector));
}
var FocusableMode;

(function (FocusableMode) {
  /** The element itself must be focusable. */
  FocusableMode[FocusableMode["Strict"] = 0] = "Strict";
  /** The element should be inside of a focusable element. */

  FocusableMode[FocusableMode["Loose"] = 1] = "Loose";
})(FocusableMode || (FocusableMode = {}));

function isFocusableElement(element, mode) {
  var _match;

  if (mode === void 0) {
    mode = FocusableMode.Strict;
  }

  if (element === document.body) return false;
  return match(mode, (_match = {}, _match[FocusableMode.Strict] = function () {
    return element.matches(focusableSelector);
  }, _match[FocusableMode.Loose] = function () {
    var next = element;

    while (next !== null) {
      if (next.matches(focusableSelector)) return true;
      next = next.parentElement;
    }

    return false;
  }, _match));
}
function focusElement(element) {
  element == null ? void 0 : element.focus({
    preventScroll: true
  });
}
function focusIn(container, focus) {
  var elements = Array.isArray(container) ? container : getFocusableElements(container);
  var active = document.activeElement;

  var direction = function () {
    if (focus & (Focus.First | Focus.Next)) return Direction.Next;
    if (focus & (Focus.Previous | Focus.Last)) return Direction.Previous;
    throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last');
  }();

  var startIndex = function () {
    if (focus & Focus.First) return 0;
    if (focus & Focus.Previous) return Math.max(0, elements.indexOf(active)) - 1;
    if (focus & Focus.Next) return Math.max(0, elements.indexOf(active)) + 1;
    if (focus & Focus.Last) return elements.length - 1;
    throw new Error('Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last');
  }();

  var focusOptions = focus & Focus.NoScroll ? {
    preventScroll: true
  } : {};
  var offset = 0;
  var total = elements.length;
  var next = undefined;

  do {
    var _next;

    // Guard against infinite loops
    if (offset >= total || offset + total <= 0) return FocusResult.Error;
    var nextIdx = startIndex + offset;

    if (focus & Focus.WrapAround) {
      nextIdx = (nextIdx + total) % total;
    } else {
      if (nextIdx < 0) return FocusResult.Underflow;
      if (nextIdx >= total) return FocusResult.Overflow;
    }

    next = elements[nextIdx]; // Try the focus the next element, might not work if it is "hidden" to the user.

    (_next = next) == null ? void 0 : _next.focus(focusOptions); // Try the next one in line

    offset += direction;
  } while (next !== document.activeElement); // This is a little weird, but let me try and explain: There are a few scenario's
  // in chrome for example where a focused `<a>` tag does not get the default focus
  // styles and sometimes they do. This highly depends on whether you started by
  // clicking or by using your keyboard. When you programmatically add focus `anchor.focus()`
  // then the active element (document.activeElement) is this anchor, which is expected.
  // However in that case the default focus styles are not applied *unless* you
  // also add this tabindex.


  if (!next.hasAttribute('tabindex')) next.setAttribute('tabindex', '0');
  return FocusResult.Success;
}

function useIsMounted() {
  var mounted = react.useRef(false);
  react.useEffect(function () {
    mounted.current = true;
    return function () {
      mounted.current = false;
    };
  }, []);
  return mounted;
}

var Features$1;

(function (Features) {
  /** No features enabled for the `useFocusTrap` hook. */
  Features[Features["None"] = 1] = "None";
  /** Ensure that we move focus initially into the container. */

  Features[Features["InitialFocus"] = 2] = "InitialFocus";
  /** Ensure that pressing `Tab` and `Shift+Tab` is trapped within the container. */

  Features[Features["TabLock"] = 4] = "TabLock";
  /** Ensure that programmatically moving focus outside of the container is disallowed. */

  Features[Features["FocusLock"] = 8] = "FocusLock";
  /** Ensure that we restore the focus when unmounting the component that uses this `useFocusTrap` hook. */

  Features[Features["RestoreFocus"] = 16] = "RestoreFocus";
  /** Enable all features. */

  Features[Features["All"] = 30] = "All";
})(Features$1 || (Features$1 = {}));

function useFocusTrap(container, features, _temp) {
  if (features === void 0) {
    features = Features$1.All;
  }

  var _ref = _temp === void 0 ? {} : _temp,
      initialFocus = _ref.initialFocus,
      containers = _ref.containers;

  var restoreElement = react.useRef(typeof window !== 'undefined' ? document.activeElement : null);
  var previousActiveElement = react.useRef(null);
  var mounted = useIsMounted();
  var featuresRestoreFocus = Boolean(features & Features$1.RestoreFocus);
  var featuresInitialFocus = Boolean(features & Features$1.InitialFocus); // Capture the currently focused element, before we enable the focus trap.

  react.useEffect(function () {
    if (!featuresRestoreFocus) return;
    restoreElement.current = document.activeElement;
  }, [featuresRestoreFocus]); // Restore the focus when we unmount the component.

  react.useEffect(function () {
    if (!featuresRestoreFocus) return;
    return function () {
      focusElement(restoreElement.current);
      restoreElement.current = null;
    };
  }, [featuresRestoreFocus]); // Handle initial focus

  react.useEffect(function () {
    if (!featuresInitialFocus) return;
    if (!container.current) return;
    var activeElement = document.activeElement;

    if (initialFocus == null ? void 0 : initialFocus.current) {
      if ((initialFocus == null ? void 0 : initialFocus.current) === activeElement) {
        previousActiveElement.current = activeElement;
        return; // Initial focus ref is already the active element
      }
    } else if (container.current.contains(activeElement)) {
      previousActiveElement.current = activeElement;
      return; // Already focused within Dialog
    } // Try to focus the initialFocus ref


    if (initialFocus == null ? void 0 : initialFocus.current) {
      focusElement(initialFocus.current);
    } else {
      if (focusIn(container.current, Focus.First) === FocusResult.Error) {
        console.warn('There are no focusable elements inside the <FocusTrap />');
      }
    }

    previousActiveElement.current = document.activeElement;
  }, [container, initialFocus, featuresInitialFocus]); // Handle `Tab` & `Shift+Tab` keyboard events

  useWindowEvent('keydown', function (event) {
    if (!(features & Features$1.TabLock)) return;
    if (!container.current) return;
    if (event.key !== Keys.Tab) return;
    event.preventDefault();

    if (focusIn(container.current, (event.shiftKey ? Focus.Previous : Focus.Next) | Focus.WrapAround) === FocusResult.Success) {
      previousActiveElement.current = document.activeElement;
    }
  }); // Prevent programmatically escaping the container

  useWindowEvent('focus', function (event) {
    if (!(features & Features$1.FocusLock)) return;
    var allContainers = new Set(containers == null ? void 0 : containers.current);
    allContainers.add(container);
    if (!allContainers.size) return;
    var previous = previousActiveElement.current;
    if (!previous) return;
    if (!mounted.current) return;
    var toElement = event.target;

    if (toElement && toElement instanceof HTMLElement) {
      if (!contains(allContainers, toElement)) {
        event.preventDefault();
        event.stopPropagation();
        focusElement(previous);
      } else {
        previousActiveElement.current = toElement;
        focusElement(toElement);
      }
    } else {
      focusElement(previousActiveElement.current);
    }
  }, true);
}

function contains(containers, element) {
  for (var _iterator = _createForOfIteratorHelperLoose(containers), _step; !(_step = _iterator()).done;) {
    var _container$current;

    var container = _step.value;
    if ((_container$current = container.current) == null ? void 0 : _container$current.contains(element)) return true;
  }

  return false;
}

var interactables = /*#__PURE__*/new Set();
var originals = /*#__PURE__*/new Map();

function inert(element) {
  element.setAttribute('aria-hidden', 'true'); // @ts-expect-error `inert` does not exist on HTMLElement (yet!)

  element.inert = true;
}

function restore(element) {
  var original = originals.get(element);
  if (!original) return;
  if (original['aria-hidden'] === null) element.removeAttribute('aria-hidden');else element.setAttribute('aria-hidden', original['aria-hidden']); // @ts-expect-error `inert` does not exist on HTMLElement (yet!)

  element.inert = original.inert;
}

function useInertOthers(container, enabled) {
  if (enabled === void 0) {
    enabled = true;
  }

  useIsoMorphicEffect(function () {
    if (!enabled) return;
    if (!container.current) return;
    var element = container.current; // Mark myself as an interactable element

    interactables.add(element); // Restore elements that now contain an interactable child

    for (var _iterator = _createForOfIteratorHelperLoose(originals.keys()), _step; !(_step = _iterator()).done;) {
      var original = _step.value;

      if (original.contains(element)) {
        restore(original);
        originals["delete"](original);
      }
    } // Collect direct children of the body


    document.querySelectorAll('body > *').forEach(function (child) {
      if (!(child instanceof HTMLElement)) return; // Skip non-HTMLElements
      // Skip the interactables, and the parents of the interactables

      for (var _iterator2 = _createForOfIteratorHelperLoose(interactables), _step2; !(_step2 = _iterator2()).done;) {
        var interactable = _step2.value;
        if (child.contains(interactable)) return;
      } // Keep track of the elements


      if (interactables.size === 1) {
        originals.set(child, {
          'aria-hidden': child.getAttribute('aria-hidden'),
          // @ts-expect-error `inert` does not exist on HTMLElement (yet!)
          inert: child.inert
        }); // Mutate the element

        inert(child);
      }
    });
    return function () {
      // Inert is disabled on the current element
      interactables["delete"](element); // We still have interactable elements, therefore this one and its parent
      // will become inert as well.

      if (interactables.size > 0) {
        // Collect direct children of the body
        document.querySelectorAll('body > *').forEach(function (child) {
          if (!(child instanceof HTMLElement)) return; // Skip non-HTMLElements
          // Skip already inert parents

          if (originals.has(child)) return; // Skip the interactables, and the parents of the interactables

          for (var _iterator3 = _createForOfIteratorHelperLoose(interactables), _step3; !(_step3 = _iterator3()).done;) {
            var interactable = _step3.value;
            if (child.contains(interactable)) return;
          }

          originals.set(child, {
            'aria-hidden': child.getAttribute('aria-hidden'),
            // @ts-expect-error `inert` does not exist on HTMLElement (yet!)
            inert: child.inert
          }); // Mutate the element

          inert(child);
        });
      } else {
        for (var _iterator4 = _createForOfIteratorHelperLoose(originals.keys()), _step4; !(_step4 = _iterator4()).done;) {
          var _element = _step4.value;
          // Restore
          restore(_element); // Cleanup

          originals["delete"](_element);
        }
      }
    };
  }, [enabled]);
}

var DescriptionContext = /*#__PURE__*/react.createContext(null);

function useDescriptionContext() {
  var context = react.useContext(DescriptionContext);

  if (context === null) {
    var err = new Error('You used a <Description /> component, but it is not inside a relevant parent.');
    if (Error.captureStackTrace) Error.captureStackTrace(err, useDescriptionContext);
    throw err;
  }

  return context;
}

function useDescriptions() {
  var _useState = react.useState([]),
      descriptionIds = _useState[0],
      setDescriptionIds = _useState[1];

  return [// The actual id's as string or undefined
  descriptionIds.length > 0 ? descriptionIds.join(' ') : undefined, // The provider component
  react.useMemo(function () {
    return function DescriptionProvider(props) {
      var register = react.useCallback(function (value) {
        setDescriptionIds(function (existing) {
          return [].concat(existing, [value]);
        });
        return function () {
          return setDescriptionIds(function (existing) {
            var clone = existing.slice();
            var idx = clone.indexOf(value);
            if (idx !== -1) clone.splice(idx, 1);
            return clone;
          });
        };
      }, []);
      var contextBag = react.useMemo(function () {
        return {
          register: register,
          slot: props.slot,
          name: props.name,
          props: props.props
        };
      }, [register, props.slot, props.name, props.props]);
      return react.createElement(DescriptionContext.Provider, {
        value: contextBag
      }, props.children);
    };
  }, [setDescriptionIds])];
} // ---

var DEFAULT_DESCRIPTION_TAG = 'p';
function Description(props) {
  var context = useDescriptionContext();
  var id = "headlessui-description-" + useId();
  useIsoMorphicEffect(function () {
    return context.register(id);
  }, [id, context.register]);
  var passThroughProps = props;

  var propsWeControl = _extends({}, context.props, {
    id: id
  });

  return render({
    props: _extends({}, passThroughProps, propsWeControl),
    slot: context.slot || {},
    defaultTag: DEFAULT_DESCRIPTION_TAG,
    name: context.name || 'Description'
  });
}

var Context = /*#__PURE__*/react.createContext(null);
Context.displayName = 'OpenClosedContext';
var State;

(function (State) {
  State[State["Open"] = 0] = "Open";
  State[State["Closed"] = 1] = "Closed";
})(State || (State = {}));

function useOpenClosed() {
  return react.useContext(Context);
}
function OpenClosedProvider(_ref) {
  var value = _ref.value,
      children = _ref.children;
  return react.createElement(Context.Provider, {
    value: value
  }, children);
}

var StackContext = /*#__PURE__*/react.createContext(function () {});
StackContext.displayName = 'StackContext';
var StackMessage;

(function (StackMessage) {
  StackMessage[StackMessage["Add"] = 0] = "Add";
  StackMessage[StackMessage["Remove"] = 1] = "Remove";
})(StackMessage || (StackMessage = {}));

function useStackContext() {
  return react.useContext(StackContext);
}
function StackProvider(_ref) {
  var children = _ref.children,
      onUpdate = _ref.onUpdate,
      type = _ref.type,
      element = _ref.element;
  var parentUpdate = useStackContext();
  var notify = react.useCallback(function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    // Notify our layer
    onUpdate == null ? void 0 : onUpdate.apply(void 0, args); // Notify the parent

    parentUpdate.apply(void 0, args);
  }, [parentUpdate, onUpdate]);
  useIsoMorphicEffect(function () {
    notify(StackMessage.Add, type, element);
    return function () {
      return notify(StackMessage.Remove, type, element);
    };
  }, [notify, type, element]);
  return react.createElement(StackContext.Provider, {
    value: notify
  }, children);
}

var _reducers;
var DialogStates;

(function (DialogStates) {
  DialogStates[DialogStates["Open"] = 0] = "Open";
  DialogStates[DialogStates["Closed"] = 1] = "Closed";
})(DialogStates || (DialogStates = {}));

var ActionTypes;

(function (ActionTypes) {
  ActionTypes[ActionTypes["SetTitleId"] = 0] = "SetTitleId";
})(ActionTypes || (ActionTypes = {}));

var reducers = (_reducers = {}, _reducers[ActionTypes.SetTitleId] = function (state, action) {
  if (state.titleId === action.id) return state;
  return _extends({}, state, {
    titleId: action.id
  });
}, _reducers);
var DialogContext = /*#__PURE__*/react.createContext(null);
DialogContext.displayName = 'DialogContext';

function useDialogContext(component) {
  var context = react.useContext(DialogContext);

  if (context === null) {
    var err = new Error("<" + component + " /> is missing a parent <" + Dialog.displayName + " /> component.");
    if (Error.captureStackTrace) Error.captureStackTrace(err, useDialogContext);
    throw err;
  }

  return context;
}

function stateReducer(state, action) {
  return match(action.type, reducers, state, action);
} // ---


var DEFAULT_DIALOG_TAG = 'div';
var DialogRenderFeatures = Features.RenderStrategy | Features.Static;
var DialogRoot = /*#__PURE__*/forwardRefWithAs(function Dialog(props, ref) {
  var open = props.open,
      onClose = props.onClose,
      initialFocus = props.initialFocus,
      rest = _objectWithoutPropertiesLoose(props, ["open", "onClose", "initialFocus"]);

  var _useState = react.useState(0),
      nestedDialogCount = _useState[0],
      setNestedDialogCount = _useState[1];

  var usesOpenClosedState = useOpenClosed();

  if (open === undefined && usesOpenClosedState !== null) {
    var _match;

    // Update the `open` prop based on the open closed state
    open = match(usesOpenClosedState, (_match = {}, _match[State.Open] = true, _match[State.Closed] = false, _match));
  }

  var containers = react.useRef(new Set());
  var internalDialogRef = react.useRef(null);
  var dialogRef = useSyncRefs(internalDialogRef, ref); // Validations

  var hasOpen = props.hasOwnProperty('open') || usesOpenClosedState !== null;
  var hasOnClose = props.hasOwnProperty('onClose');

  if (!hasOpen && !hasOnClose) {
    throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");
  }

  if (!hasOpen) {
    throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");
  }

  if (!hasOnClose) {
    throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");
  }

  if (typeof open !== 'boolean') {
    throw new Error("You provided an `open` prop to the `Dialog`, but the value is not a boolean. Received: " + open);
  }

  if (typeof onClose !== 'function') {
    throw new Error("You provided an `onClose` prop to the `Dialog`, but the value is not a function. Received: " + onClose);
  }

  var dialogState = open ? DialogStates.Open : DialogStates.Closed;

  var visible = function () {
    if (usesOpenClosedState !== null) {
      return usesOpenClosedState === State.Open;
    }

    return dialogState === DialogStates.Open;
  }();

  var _useReducer = react.useReducer(stateReducer, {
    titleId: null,
    descriptionId: null
  }),
      state = _useReducer[0],
      dispatch = _useReducer[1];

  var close = react.useCallback(function () {
    return onClose(false);
  }, [onClose]);
  var setTitleId = react.useCallback(function (id) {
    return dispatch({
      type: ActionTypes.SetTitleId,
      id: id
    });
  }, [dispatch]);
  var ready = useServerHandoffComplete();
  var enabled = ready && dialogState === DialogStates.Open;
  var hasNestedDialogs = nestedDialogCount > 1; // 1 is the current dialog

  var hasParentDialog = react.useContext(DialogContext) !== null; // If there are multiple dialogs, then you can be the root, the leaf or one
  // in between. We only care abou whether you are the top most one or not.

  var position = !hasNestedDialogs ? 'leaf' : 'parent';
  useFocusTrap(internalDialogRef, enabled ? match(position, {
    parent: Features$1.RestoreFocus,
    leaf: Features$1.All
  }) : Features$1.None, {
    initialFocus: initialFocus,
    containers: containers
  });
  useInertOthers(internalDialogRef, hasNestedDialogs ? enabled : false); // Handle outside click

  useWindowEvent('mousedown', function (event) {
    var _internalDialogRef$cu;

    var target = event.target;
    if (dialogState !== DialogStates.Open) return;
    if (hasNestedDialogs) return;
    if ((_internalDialogRef$cu = internalDialogRef.current) == null ? void 0 : _internalDialogRef$cu.contains(target)) return;
    close();
  }); // Handle `Escape` to close

  useWindowEvent('keydown', function (event) {
    if (event.key !== Keys.Escape) return;
    if (dialogState !== DialogStates.Open) return;
    if (hasNestedDialogs) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  }); // Scroll lock

  react.useEffect(function () {
    if (dialogState !== DialogStates.Open) return;
    if (hasParentDialog) return;
    var overflow = document.documentElement.style.overflow;
    var paddingRight = document.documentElement.style.paddingRight;
    var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.paddingRight = scrollbarWidth + "px";
    return function () {
      document.documentElement.style.overflow = overflow;
      document.documentElement.style.paddingRight = paddingRight;
    };
  }, [dialogState, hasParentDialog]); // Trigger close when the FocusTrap gets hidden

  react.useEffect(function () {
    if (dialogState !== DialogStates.Open) return;
    if (!internalDialogRef.current) return;
    var observer = new IntersectionObserver(function (entries) {
      for (var _iterator = _createForOfIteratorHelperLoose(entries), _step; !(_step = _iterator()).done;) {
        var entry = _step.value;

        if (entry.boundingClientRect.x === 0 && entry.boundingClientRect.y === 0 && entry.boundingClientRect.width === 0 && entry.boundingClientRect.height === 0) {
          close();
        }
      }
    });
    observer.observe(internalDialogRef.current);
    return function () {
      return observer.disconnect();
    };
  }, [dialogState, internalDialogRef, close]);

  var _useDescriptions = useDescriptions(),
      describedby = _useDescriptions[0],
      DescriptionProvider = _useDescriptions[1];

  var id = "headlessui-dialog-" + useId();
  var contextBag = react.useMemo(function () {
    return [{
      dialogState: dialogState,
      close: close,
      setTitleId: setTitleId
    }, state];
  }, [dialogState, state, close, setTitleId]);
  var slot = react.useMemo(function () {
    return {
      open: dialogState === DialogStates.Open
    };
  }, [dialogState]);
  var propsWeControl = {
    ref: dialogRef,
    id: id,
    role: 'dialog',
    'aria-modal': dialogState === DialogStates.Open ? true : undefined,
    'aria-labelledby': state.titleId,
    'aria-describedby': describedby,
    onClick: function onClick(event) {
      event.stopPropagation();
    }
  };
  var passthroughProps = rest;
  return react.createElement(StackProvider, {
    type: "Dialog",
    element: internalDialogRef,
    onUpdate: react.useCallback(function (message, type, element) {
      var _match2;

      if (type !== 'Dialog') return;
      match(message, (_match2 = {}, _match2[StackMessage.Add] = function () {
        containers.current.add(element);
        setNestedDialogCount(function (count) {
          return count + 1;
        });
      }, _match2[StackMessage.Remove] = function () {
        containers.current.add(element);
        setNestedDialogCount(function (count) {
          return count - 1;
        });
      }, _match2));
    }, [])
  }, react.createElement(ForcePortalRoot, {
    force: true
  }, react.createElement(Portal, null, react.createElement(DialogContext.Provider, {
    value: contextBag
  }, react.createElement(Portal.Group, {
    target: internalDialogRef
  }, react.createElement(ForcePortalRoot, {
    force: false
  }, react.createElement(DescriptionProvider, {
    slot: slot,
    name: "Dialog.Description"
  }, render({
    props: _extends({}, passthroughProps, propsWeControl),
    slot: slot,
    defaultTag: DEFAULT_DIALOG_TAG,
    features: DialogRenderFeatures,
    visible: visible,
    name: 'Dialog'
  }))))))));
}); // ---

var DEFAULT_OVERLAY_TAG = 'div';
var Overlay = /*#__PURE__*/forwardRefWithAs(function Overlay(props, ref) {
  var _useDialogContext = useDialogContext([Dialog.displayName, Overlay.name].join('.')),
      _useDialogContext$ = _useDialogContext[0],
      dialogState = _useDialogContext$.dialogState,
      close = _useDialogContext$.close;

  var overlayRef = useSyncRefs(ref);
  var id = "headlessui-dialog-overlay-" + useId();
  var handleClick = react.useCallback(function (event) {
    if (isDisabledReactIssue7711(event.currentTarget)) return event.preventDefault();
    event.preventDefault();
    event.stopPropagation();
    close();
  }, [close]);
  var slot = react.useMemo(function () {
    return {
      open: dialogState === DialogStates.Open
    };
  }, [dialogState]);
  var propsWeControl = {
    ref: overlayRef,
    id: id,
    'aria-hidden': true,
    onClick: handleClick
  };
  var passthroughProps = props;
  return render({
    props: _extends({}, passthroughProps, propsWeControl),
    slot: slot,
    defaultTag: DEFAULT_OVERLAY_TAG,
    name: 'Dialog.Overlay'
  });
}); // ---

var DEFAULT_TITLE_TAG = 'h2';

function Title(props) {
  var _useDialogContext2 = useDialogContext([Dialog.displayName, Title.name].join('.')),
      _useDialogContext2$ = _useDialogContext2[0],
      dialogState = _useDialogContext2$.dialogState,
      setTitleId = _useDialogContext2$.setTitleId;

  var id = "headlessui-dialog-title-" + useId();
  react.useEffect(function () {
    setTitleId(id);
    return function () {
      return setTitleId(null);
    };
  }, [id, setTitleId]);
  var slot = react.useMemo(function () {
    return {
      open: dialogState === DialogStates.Open
    };
  }, [dialogState]);
  var propsWeControl = {
    id: id
  };
  var passthroughProps = props;
  return render({
    props: _extends({}, passthroughProps, propsWeControl),
    slot: slot,
    defaultTag: DEFAULT_TITLE_TAG,
    name: 'Dialog.Title'
  });
} // ---


var Dialog = /*#__PURE__*/Object.assign(DialogRoot, {
  Overlay: Overlay,
  Title: Title,
  Description: Description
});

function resolveType(props) {
  var _props$as;

  if (props.type) return props.type;
  var tag = (_props$as = props.as) != null ? _props$as : 'button';
  if (typeof tag === 'string' && tag.toLowerCase() === 'button') return 'button';
  return undefined;
}

function useResolveButtonType(props, ref) {
  var _useState = react.useState(function () {
    return resolveType(props);
  }),
      type = _useState[0],
      setType = _useState[1];

  useIsoMorphicEffect(function () {
    setType(resolveType(props));
  }, [props.type, props.as]);
  useIsoMorphicEffect(function () {
    if (type) return;
    if (!ref.current) return;

    if (ref.current instanceof HTMLButtonElement && !ref.current.hasAttribute('type')) {
      setType('button');
    }
  }, [type, ref]);
  return type;
}

function disposables() {
  var disposables = [];
  var api = {
    requestAnimationFrame: function (_requestAnimationFrame) {
      function requestAnimationFrame() {
        return _requestAnimationFrame.apply(this, arguments);
      }

      requestAnimationFrame.toString = function () {
        return _requestAnimationFrame.toString();
      };

      return requestAnimationFrame;
    }(function () {
      var raf = requestAnimationFrame.apply(void 0, arguments);
      api.add(function () {
        return cancelAnimationFrame(raf);
      });
    }),
    nextFrame: function nextFrame() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      api.requestAnimationFrame(function () {
        api.requestAnimationFrame.apply(api, args);
      });
    },
    setTimeout: function (_setTimeout) {
      function setTimeout() {
        return _setTimeout.apply(this, arguments);
      }

      setTimeout.toString = function () {
        return _setTimeout.toString();
      };

      return setTimeout;
    }(function () {
      var timer = setTimeout.apply(void 0, arguments);
      api.add(function () {
        return clearTimeout(timer);
      });
    }),
    add: function add(cb) {
      disposables.push(cb);
    },
    dispose: function dispose() {
      for (var _iterator = _createForOfIteratorHelperLoose(disposables.splice(0)), _step; !(_step = _iterator()).done;) {
        var dispose = _step.value;
        dispose();
      }
    }
  };
  return api;
}

function useDisposables() {
  // Using useState instead of useRef so that we can use the initializer function.
  var _useState = react.useState(disposables),
      d = _useState[0];

  react.useEffect(function () {
    return function () {
      return d.dispose();
    };
  }, [d]);
  return d;
}

function useComputed(cb, dependencies) {
  var _useState = react.useState(cb),
      value = _useState[0],
      setValue = _useState[1];

  var cbRef = react.useRef(cb);
  useIsoMorphicEffect(function () {
    cbRef.current = cb;
  }, [cb]);
  useIsoMorphicEffect(function () {
    return setValue(cbRef.current);
  }, [cbRef, setValue].concat(dependencies));
  return value;
}

function assertNever(x) {
  throw new Error('Unexpected object: ' + x);
}

var Focus$1;

(function (Focus) {
  /** Focus the first non-disabled item. */
  Focus[Focus["First"] = 0] = "First";
  /** Focus the previous non-disabled item. */

  Focus[Focus["Previous"] = 1] = "Previous";
  /** Focus the next non-disabled item. */

  Focus[Focus["Next"] = 2] = "Next";
  /** Focus the last non-disabled item. */

  Focus[Focus["Last"] = 3] = "Last";
  /** Focus a specific item based on the `id` of the item. */

  Focus[Focus["Specific"] = 4] = "Specific";
  /** Focus no items at all. */

  Focus[Focus["Nothing"] = 5] = "Nothing";
})(Focus$1 || (Focus$1 = {}));

function calculateActiveIndex(action, resolvers) {
  var items = resolvers.resolveItems();
  if (items.length <= 0) return null;
  var currentActiveIndex = resolvers.resolveActiveIndex();
  var activeIndex = currentActiveIndex != null ? currentActiveIndex : -1;

  var nextActiveIndex = function () {
    switch (action.focus) {
      case Focus$1.First:
        return items.findIndex(function (item) {
          return !resolvers.resolveDisabled(item);
        });

      case Focus$1.Previous:
        {
          var idx = items.slice().reverse().findIndex(function (item, idx, all) {
            if (activeIndex !== -1 && all.length - idx - 1 >= activeIndex) return false;
            return !resolvers.resolveDisabled(item);
          });
          if (idx === -1) return idx;
          return items.length - 1 - idx;
        }

      case Focus$1.Next:
        return items.findIndex(function (item, idx) {
          if (idx <= activeIndex) return false;
          return !resolvers.resolveDisabled(item);
        });

      case Focus$1.Last:
        {
          var _idx = items.slice().reverse().findIndex(function (item) {
            return !resolvers.resolveDisabled(item);
          });

          if (_idx === -1) return _idx;
          return items.length - 1 - _idx;
        }

      case Focus$1.Specific:
        return items.findIndex(function (item) {
          return resolvers.resolveId(item) === action.id;
        });

      case Focus$1.Nothing:
        return null;

      default:
        assertNever(action);
    }
  }();

  return nextActiveIndex === -1 ? currentActiveIndex : nextActiveIndex;
}

var _reducers$1;
var ListboxStates;

(function (ListboxStates) {
  ListboxStates[ListboxStates["Open"] = 0] = "Open";
  ListboxStates[ListboxStates["Closed"] = 1] = "Closed";
})(ListboxStates || (ListboxStates = {}));

var ActionTypes$1;

(function (ActionTypes) {
  ActionTypes[ActionTypes["OpenListbox"] = 0] = "OpenListbox";
  ActionTypes[ActionTypes["CloseListbox"] = 1] = "CloseListbox";
  ActionTypes[ActionTypes["SetDisabled"] = 2] = "SetDisabled";
  ActionTypes[ActionTypes["SetOrientation"] = 3] = "SetOrientation";
  ActionTypes[ActionTypes["GoToOption"] = 4] = "GoToOption";
  ActionTypes[ActionTypes["Search"] = 5] = "Search";
  ActionTypes[ActionTypes["ClearSearch"] = 6] = "ClearSearch";
  ActionTypes[ActionTypes["RegisterOption"] = 7] = "RegisterOption";
  ActionTypes[ActionTypes["UnregisterOption"] = 8] = "UnregisterOption";
})(ActionTypes$1 || (ActionTypes$1 = {}));

var reducers$1 = (_reducers$1 = {}, _reducers$1[ActionTypes$1.CloseListbox] = function (state) {
  if (state.disabled) return state;
  if (state.listboxState === ListboxStates.Closed) return state;
  return _extends({}, state, {
    activeOptionIndex: null,
    listboxState: ListboxStates.Closed
  });
}, _reducers$1[ActionTypes$1.OpenListbox] = function (state) {
  if (state.disabled) return state;
  if (state.listboxState === ListboxStates.Open) return state;
  return _extends({}, state, {
    listboxState: ListboxStates.Open
  });
}, _reducers$1[ActionTypes$1.SetDisabled] = function (state, action) {
  if (state.disabled === action.disabled) return state;
  return _extends({}, state, {
    disabled: action.disabled
  });
}, _reducers$1[ActionTypes$1.SetOrientation] = function (state, action) {
  if (state.orientation === action.orientation) return state;
  return _extends({}, state, {
    orientation: action.orientation
  });
}, _reducers$1[ActionTypes$1.GoToOption] = function (state, action) {
  if (state.disabled) return state;
  if (state.listboxState === ListboxStates.Closed) return state;
  var activeOptionIndex = calculateActiveIndex(action, {
    resolveItems: function resolveItems() {
      return state.options;
    },
    resolveActiveIndex: function resolveActiveIndex() {
      return state.activeOptionIndex;
    },
    resolveId: function resolveId(item) {
      return item.id;
    },
    resolveDisabled: function resolveDisabled(item) {
      return item.dataRef.current.disabled;
    }
  });
  if (state.searchQuery === '' && state.activeOptionIndex === activeOptionIndex) return state;
  return _extends({}, state, {
    searchQuery: '',
    activeOptionIndex: activeOptionIndex
  });
}, _reducers$1[ActionTypes$1.Search] = function (state, action) {
  if (state.disabled) return state;
  if (state.listboxState === ListboxStates.Closed) return state;
  var searchQuery = state.searchQuery + action.value.toLowerCase();
  var match = state.options.findIndex(function (option) {
    var _option$dataRef$curre;

    return !option.dataRef.current.disabled && ((_option$dataRef$curre = option.dataRef.current.textValue) == null ? void 0 : _option$dataRef$curre.startsWith(searchQuery));
  });
  if (match === -1 || match === state.activeOptionIndex) return _extends({}, state, {
    searchQuery: searchQuery
  });
  return _extends({}, state, {
    searchQuery: searchQuery,
    activeOptionIndex: match
  });
}, _reducers$1[ActionTypes$1.ClearSearch] = function (state) {
  if (state.disabled) return state;
  if (state.listboxState === ListboxStates.Closed) return state;
  if (state.searchQuery === '') return state;
  return _extends({}, state, {
    searchQuery: ''
  });
}, _reducers$1[ActionTypes$1.RegisterOption] = function (state, action) {
  return _extends({}, state, {
    options: [].concat(state.options, [{
      id: action.id,
      dataRef: action.dataRef
    }])
  });
}, _reducers$1[ActionTypes$1.UnregisterOption] = function (state, action) {
  var nextOptions = state.options.slice();
  var currentActiveOption = state.activeOptionIndex !== null ? nextOptions[state.activeOptionIndex] : null;
  var idx = nextOptions.findIndex(function (a) {
    return a.id === action.id;
  });
  if (idx !== -1) nextOptions.splice(idx, 1);
  return _extends({}, state, {
    options: nextOptions,
    activeOptionIndex: function () {
      if (idx === state.activeOptionIndex) return null;
      if (currentActiveOption === null) return null; // If we removed the option before the actual active index, then it would be out of sync. To
      // fix this, we will find the correct (new) index position.

      return nextOptions.indexOf(currentActiveOption);
    }()
  });
}, _reducers$1);
var ListboxContext = /*#__PURE__*/react.createContext(null);
ListboxContext.displayName = 'ListboxContext';

function useListboxContext(component) {
  var context = react.useContext(ListboxContext);

  if (context === null) {
    var err = new Error("<" + component + " /> is missing a parent <" + Listbox.name + " /> component.");
    if (Error.captureStackTrace) Error.captureStackTrace(err, useListboxContext);
    throw err;
  }

  return context;
}

function stateReducer$1(state, action) {
  return match(action.type, reducers$1, state, action);
} // ---


var DEFAULT_LISTBOX_TAG = react.Fragment;
function Listbox(props) {
  var _match;

  var value = props.value,
      onChange = props.onChange,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$horizontal = props.horizontal,
      horizontal = _props$horizontal === void 0 ? false : _props$horizontal,
      passThroughProps = _objectWithoutPropertiesLoose(props, ["value", "onChange", "disabled", "horizontal"]);

  var orientation = horizontal ? 'horizontal' : 'vertical';
  var reducerBag = react.useReducer(stateReducer$1, {
    listboxState: ListboxStates.Closed,
    propsRef: {
      current: {
        value: value,
        onChange: onChange
      }
    },
    labelRef: react.createRef(),
    buttonRef: react.createRef(),
    optionsRef: react.createRef(),
    disabled: disabled,
    orientation: orientation,
    options: [],
    searchQuery: '',
    activeOptionIndex: null
  });
  var _reducerBag$ = reducerBag[0],
      listboxState = _reducerBag$.listboxState,
      propsRef = _reducerBag$.propsRef,
      optionsRef = _reducerBag$.optionsRef,
      buttonRef = _reducerBag$.buttonRef,
      dispatch = reducerBag[1];
  useIsoMorphicEffect(function () {
    propsRef.current.value = value;
  }, [value, propsRef]);
  useIsoMorphicEffect(function () {
    propsRef.current.onChange = onChange;
  }, [onChange, propsRef]);
  useIsoMorphicEffect(function () {
    return dispatch({
      type: ActionTypes$1.SetDisabled,
      disabled: disabled
    });
  }, [disabled]);
  useIsoMorphicEffect(function () {
    return dispatch({
      type: ActionTypes$1.SetOrientation,
      orientation: orientation
    });
  }, [orientation]); // Handle outside click

  useWindowEvent('mousedown', function (event) {
    var _buttonRef$current, _optionsRef$current;

    var target = event.target;
    if (listboxState !== ListboxStates.Open) return;
    if ((_buttonRef$current = buttonRef.current) == null ? void 0 : _buttonRef$current.contains(target)) return;
    if ((_optionsRef$current = optionsRef.current) == null ? void 0 : _optionsRef$current.contains(target)) return;
    dispatch({
      type: ActionTypes$1.CloseListbox
    });

    if (!isFocusableElement(target, FocusableMode.Loose)) {
      var _buttonRef$current2;

      event.preventDefault();
      (_buttonRef$current2 = buttonRef.current) == null ? void 0 : _buttonRef$current2.focus();
    }
  });
  var slot = react.useMemo(function () {
    return {
      open: listboxState === ListboxStates.Open,
      disabled: disabled
    };
  }, [listboxState, disabled]);
  return react.createElement(ListboxContext.Provider, {
    value: reducerBag
  }, react.createElement(OpenClosedProvider, {
    value: match(listboxState, (_match = {}, _match[ListboxStates.Open] = State.Open, _match[ListboxStates.Closed] = State.Closed, _match))
  }, render({
    props: passThroughProps,
    slot: slot,
    defaultTag: DEFAULT_LISTBOX_TAG,
    name: 'Listbox'
  })));
} // ---

var DEFAULT_BUTTON_TAG = 'button';
var Button = /*#__PURE__*/forwardRefWithAs(function Button(props, ref) {
  var _state$optionsRef$cur;

  var _useListboxContext = useListboxContext([Listbox.name, Button.name].join('.')),
      state = _useListboxContext[0],
      dispatch = _useListboxContext[1];

  var buttonRef = useSyncRefs(state.buttonRef, ref);
  var id = "headlessui-listbox-button-" + useId();
  var d = useDisposables();
  var handleKeyDown = react.useCallback(function (event) {
    switch (event.key) {
      // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
      case Keys.Space:
      case Keys.Enter:
      case Keys.ArrowDown:
        event.preventDefault();
        dispatch({
          type: ActionTypes$1.OpenListbox
        });
        d.nextFrame(function () {
          if (!state.propsRef.current.value) dispatch({
            type: ActionTypes$1.GoToOption,
            focus: Focus$1.First
          });
        });
        break;

      case Keys.ArrowUp:
        event.preventDefault();
        dispatch({
          type: ActionTypes$1.OpenListbox
        });
        d.nextFrame(function () {
          if (!state.propsRef.current.value) dispatch({
            type: ActionTypes$1.GoToOption,
            focus: Focus$1.Last
          });
        });
        break;
    }
  }, [dispatch, state, d]);
  var handleKeyUp = react.useCallback(function (event) {
    switch (event.key) {
      case Keys.Space:
        // Required for firefox, event.preventDefault() in handleKeyDown for
        // the Space key doesn't cancel the handleKeyUp, which in turn
        // triggers a *click*.
        event.preventDefault();
        break;
    }
  }, []);
  var handleClick = react.useCallback(function (event) {
    if (isDisabledReactIssue7711(event.currentTarget)) return event.preventDefault();

    if (state.listboxState === ListboxStates.Open) {
      dispatch({
        type: ActionTypes$1.CloseListbox
      });
      d.nextFrame(function () {
        var _state$buttonRef$curr;

        return (_state$buttonRef$curr = state.buttonRef.current) == null ? void 0 : _state$buttonRef$curr.focus({
          preventScroll: true
        });
      });
    } else {
      event.preventDefault();
      dispatch({
        type: ActionTypes$1.OpenListbox
      });
    }
  }, [dispatch, d, state]);
  var labelledby = useComputed(function () {
    if (!state.labelRef.current) return undefined;
    return [state.labelRef.current.id, id].join(' ');
  }, [state.labelRef.current, id]);
  var slot = react.useMemo(function () {
    return {
      open: state.listboxState === ListboxStates.Open,
      disabled: state.disabled
    };
  }, [state]);
  var passthroughProps = props;
  var propsWeControl = {
    ref: buttonRef,
    id: id,
    type: useResolveButtonType(props, state.buttonRef),
    'aria-haspopup': true,
    'aria-controls': (_state$optionsRef$cur = state.optionsRef.current) == null ? void 0 : _state$optionsRef$cur.id,
    'aria-expanded': state.disabled ? undefined : state.listboxState === ListboxStates.Open,
    'aria-labelledby': labelledby,
    disabled: state.disabled,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onClick: handleClick
  };
  return render({
    props: _extends({}, passthroughProps, propsWeControl),
    slot: slot,
    defaultTag: DEFAULT_BUTTON_TAG,
    name: 'Listbox.Button'
  });
}); // ---

var DEFAULT_LABEL_TAG = 'label';

function Label(props) {
  var _useListboxContext2 = useListboxContext([Listbox.name, Label.name].join('.')),
      state = _useListboxContext2[0];

  var id = "headlessui-listbox-label-" + useId();
  var handleClick = react.useCallback(function () {
    var _state$buttonRef$curr2;

    return (_state$buttonRef$curr2 = state.buttonRef.current) == null ? void 0 : _state$buttonRef$curr2.focus({
      preventScroll: true
    });
  }, [state.buttonRef]);
  var slot = react.useMemo(function () {
    return {
      open: state.listboxState === ListboxStates.Open,
      disabled: state.disabled
    };
  }, [state]);
  var propsWeControl = {
    ref: state.labelRef,
    id: id,
    onClick: handleClick
  };
  return render({
    props: _extends({}, props, propsWeControl),
    slot: slot,
    defaultTag: DEFAULT_LABEL_TAG,
    name: 'Listbox.Label'
  });
} // ---


var DEFAULT_OPTIONS_TAG = 'ul';
var OptionsRenderFeatures = Features.RenderStrategy | Features.Static;
var Options = /*#__PURE__*/forwardRefWithAs(function Options(props, ref) {
  var _state$options$state$;

  var _useListboxContext3 = useListboxContext([Listbox.name, Options.name].join('.')),
      state = _useListboxContext3[0],
      dispatch = _useListboxContext3[1];

  var optionsRef = useSyncRefs(state.optionsRef, ref);
  var id = "headlessui-listbox-options-" + useId();
  var d = useDisposables();
  var searchDisposables = useDisposables();
  var usesOpenClosedState = useOpenClosed();

  var visible = function () {
    if (usesOpenClosedState !== null) {
      return usesOpenClosedState === State.Open;
    }

    return state.listboxState === ListboxStates.Open;
  }();

  useIsoMorphicEffect(function () {
    var container = state.optionsRef.current;
    if (!container) return;
    if (state.listboxState !== ListboxStates.Open) return;
    if (container === document.activeElement) return;
    container.focus({
      preventScroll: true
    });
  }, [state.listboxState, state.optionsRef]);
  var handleKeyDown = react.useCallback(function (event) {
    searchDisposables.dispose();

    switch (event.key) {
      // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
      // @ts-expect-error Fallthrough is expected here
      case Keys.Space:
        if (state.searchQuery !== '') {
          event.preventDefault();
          event.stopPropagation();
          return dispatch({
            type: ActionTypes$1.Search,
            value: event.key
          });
        }

      // When in type ahead mode, fallthrough

      case Keys.Enter:
        event.preventDefault();
        event.stopPropagation();
        dispatch({
          type: ActionTypes$1.CloseListbox
        });

        if (state.activeOptionIndex !== null) {
          var dataRef = state.options[state.activeOptionIndex].dataRef;
          state.propsRef.current.onChange(dataRef.current.value);
        }

        disposables().nextFrame(function () {
          var _state$buttonRef$curr3;

          return (_state$buttonRef$curr3 = state.buttonRef.current) == null ? void 0 : _state$buttonRef$curr3.focus({
            preventScroll: true
          });
        });
        break;

      case match(state.orientation, {
        vertical: Keys.ArrowDown,
        horizontal: Keys.ArrowRight
      }):
        event.preventDefault();
        event.stopPropagation();
        return dispatch({
          type: ActionTypes$1.GoToOption,
          focus: Focus$1.Next
        });

      case match(state.orientation, {
        vertical: Keys.ArrowUp,
        horizontal: Keys.ArrowLeft
      }):
        event.preventDefault();
        event.stopPropagation();
        return dispatch({
          type: ActionTypes$1.GoToOption,
          focus: Focus$1.Previous
        });

      case Keys.Home:
      case Keys.PageUp:
        event.preventDefault();
        event.stopPropagation();
        return dispatch({
          type: ActionTypes$1.GoToOption,
          focus: Focus$1.First
        });

      case Keys.End:
      case Keys.PageDown:
        event.preventDefault();
        event.stopPropagation();
        return dispatch({
          type: ActionTypes$1.GoToOption,
          focus: Focus$1.Last
        });

      case Keys.Escape:
        event.preventDefault();
        event.stopPropagation();
        dispatch({
          type: ActionTypes$1.CloseListbox
        });
        return d.nextFrame(function () {
          var _state$buttonRef$curr4;

          return (_state$buttonRef$curr4 = state.buttonRef.current) == null ? void 0 : _state$buttonRef$curr4.focus({
            preventScroll: true
          });
        });

      case Keys.Tab:
        event.preventDefault();
        event.stopPropagation();
        break;

      default:
        if (event.key.length === 1) {
          dispatch({
            type: ActionTypes$1.Search,
            value: event.key
          });
          searchDisposables.setTimeout(function () {
            return dispatch({
              type: ActionTypes$1.ClearSearch
            });
          }, 350);
        }

        break;
    }
  }, [d, dispatch, searchDisposables, state]);
  var labelledby = useComputed(function () {
    var _state$labelRef$curre, _state$labelRef$curre2, _state$buttonRef$curr5;

    return (_state$labelRef$curre = (_state$labelRef$curre2 = state.labelRef.current) == null ? void 0 : _state$labelRef$curre2.id) != null ? _state$labelRef$curre : (_state$buttonRef$curr5 = state.buttonRef.current) == null ? void 0 : _state$buttonRef$curr5.id;
  }, [state.labelRef.current, state.buttonRef.current]);
  var slot = react.useMemo(function () {
    return {
      open: state.listboxState === ListboxStates.Open
    };
  }, [state]);
  var propsWeControl = {
    'aria-activedescendant': state.activeOptionIndex === null ? undefined : (_state$options$state$ = state.options[state.activeOptionIndex]) == null ? void 0 : _state$options$state$.id,
    'aria-labelledby': labelledby,
    'aria-orientation': state.orientation,
    id: id,
    onKeyDown: handleKeyDown,
    role: 'listbox',
    tabIndex: 0,
    ref: optionsRef
  };
  var passthroughProps = props;
  return render({
    props: _extends({}, passthroughProps, propsWeControl),
    slot: slot,
    defaultTag: DEFAULT_OPTIONS_TAG,
    features: OptionsRenderFeatures,
    visible: visible,
    name: 'Listbox.Options'
  });
}); // ---

var DEFAULT_OPTION_TAG = 'li';

function Option(props) {
  var _props$disabled2 = props.disabled,
      disabled = _props$disabled2 === void 0 ? false : _props$disabled2,
      value = props.value,
      passthroughProps = _objectWithoutPropertiesLoose(props, ["disabled", "value"]);

  var _useListboxContext4 = useListboxContext([Listbox.name, Option.name].join('.')),
      state = _useListboxContext4[0],
      dispatch = _useListboxContext4[1];

  var id = "headlessui-listbox-option-" + useId();
  var active = state.activeOptionIndex !== null ? state.options[state.activeOptionIndex].id === id : false;
  var selected = state.propsRef.current.value === value;
  var bag = react.useRef({
    disabled: disabled,
    value: value
  });
  useIsoMorphicEffect(function () {
    bag.current.disabled = disabled;
  }, [bag, disabled]);
  useIsoMorphicEffect(function () {
    bag.current.value = value;
  }, [bag, value]);
  useIsoMorphicEffect(function () {
    var _document$getElementB, _document$getElementB2;

    bag.current.textValue = (_document$getElementB = document.getElementById(id)) == null ? void 0 : (_document$getElementB2 = _document$getElementB.textContent) == null ? void 0 : _document$getElementB2.toLowerCase();
  }, [bag, id]);
  var select = react.useCallback(function () {
    return state.propsRef.current.onChange(value);
  }, [state.propsRef, value]);
  useIsoMorphicEffect(function () {
    dispatch({
      type: ActionTypes$1.RegisterOption,
      id: id,
      dataRef: bag
    });
    return function () {
      return dispatch({
        type: ActionTypes$1.UnregisterOption,
        id: id
      });
    };
  }, [bag, id]);
  useIsoMorphicEffect(function () {
    var _document$getElementB3;

    if (state.listboxState !== ListboxStates.Open) return;
    if (!selected) return;
    dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Specific,
      id: id
    });
    (_document$getElementB3 = document.getElementById(id)) == null ? void 0 : _document$getElementB3.focus == null ? void 0 : _document$getElementB3.focus();
  }, [state.listboxState]);
  useIsoMorphicEffect(function () {
    if (state.listboxState !== ListboxStates.Open) return;
    if (!active) return;
    var d = disposables();
    d.nextFrame(function () {
      var _document$getElementB4;

      return (_document$getElementB4 = document.getElementById(id)) == null ? void 0 : _document$getElementB4.scrollIntoView == null ? void 0 : _document$getElementB4.scrollIntoView({
        block: 'nearest'
      });
    });
    return d.dispose;
  }, [id, active, state.listboxState]);
  var handleClick = react.useCallback(function (event) {
    if (disabled) return event.preventDefault();
    select();
    dispatch({
      type: ActionTypes$1.CloseListbox
    });
    disposables().nextFrame(function () {
      var _state$buttonRef$curr6;

      return (_state$buttonRef$curr6 = state.buttonRef.current) == null ? void 0 : _state$buttonRef$curr6.focus({
        preventScroll: true
      });
    });
  }, [dispatch, state.buttonRef, disabled, select]);
  var handleFocus = react.useCallback(function () {
    if (disabled) return dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Nothing
    });
    dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Specific,
      id: id
    });
  }, [disabled, id, dispatch]);
  var handleMove = react.useCallback(function () {
    if (disabled) return;
    if (active) return;
    dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Specific,
      id: id
    });
  }, [disabled, active, id, dispatch]);
  var handleLeave = react.useCallback(function () {
    if (disabled) return;
    if (!active) return;
    dispatch({
      type: ActionTypes$1.GoToOption,
      focus: Focus$1.Nothing
    });
  }, [disabled, active, dispatch]);
  var slot = react.useMemo(function () {
    return {
      active: active,
      selected: selected,
      disabled: disabled
    };
  }, [active, selected, disabled]);
  var propsWeControl = {
    id: id,
    role: 'option',
    tabIndex: disabled === true ? undefined : -1,
    'aria-disabled': disabled === true ? true : undefined,
    'aria-selected': selected === true ? true : undefined,
    disabled: undefined,
    onClick: handleClick,
    onFocus: handleFocus,
    onPointerMove: handleMove,
    onMouseMove: handleMove,
    onPointerLeave: handleLeave,
    onMouseLeave: handleLeave
  };
  return render({
    props: _extends({}, passthroughProps, propsWeControl),
    slot: slot,
    defaultTag: DEFAULT_OPTION_TAG,
    name: 'Listbox.Option'
  });
} // ---


Listbox.Button = Button;
Listbox.Label = Label;
Listbox.Options = Options;
Listbox.Option = Option;

function useIsInitialRender() {
  var initial = react.useRef(true);
  react.useEffect(function () {
    initial.current = false;
  }, []);
  return initial.current;
}

function once(cb) {
  var state = {
    called: false
  };
  return function () {
    if (state.called) return;
    state.called = true;
    return cb.apply(void 0, arguments);
  };
}

function addClasses(node) {
  var _node$classList;

  for (var _len = arguments.length, classes = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    classes[_key - 1] = arguments[_key];
  }

  node && classes.length > 0 && (_node$classList = node.classList).add.apply(_node$classList, classes);
}

function removeClasses(node) {
  var _node$classList2;

  for (var _len2 = arguments.length, classes = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    classes[_key2 - 1] = arguments[_key2];
  }

  node && classes.length > 0 && (_node$classList2 = node.classList).remove.apply(_node$classList2, classes);
}

var Reason;

(function (Reason) {
  Reason["Finished"] = "finished";
  Reason["Cancelled"] = "cancelled";
})(Reason || (Reason = {}));

function waitForTransition(node, done) {
  var d = disposables();
  if (!node) return d.dispose; // Safari returns a comma separated list of values, so let's sort them and take the highest value.

  var _getComputedStyle = getComputedStyle(node),
      transitionDuration = _getComputedStyle.transitionDuration,
      transitionDelay = _getComputedStyle.transitionDelay;

  var _map = [transitionDuration, transitionDelay].map(function (value) {
    var _value$split$filter$m = value.split(',') // Remove falsy we can't work with
    .filter(Boolean) // Values are returned as `0.3s` or `75ms`
    .map(function (v) {
      return v.includes('ms') ? parseFloat(v) : parseFloat(v) * 1000;
    }).sort(function (a, z) {
      return z - a;
    }),
        _value$split$filter$m2 = _value$split$filter$m[0],
        resolvedValue = _value$split$filter$m2 === void 0 ? 0 : _value$split$filter$m2;

    return resolvedValue;
  }),
      durationMs = _map[0],
      delaysMs = _map[1]; // Waiting for the transition to end. We could use the `transitionend` event, however when no
  // actual transition/duration is defined then the `transitionend` event is not fired.
  //
  // TODO: Downside is, when you slow down transitions via devtools this timeout is still using the
  // full 100% speed instead of the 25% or 10%.


  if (durationMs !== 0) {
    d.setTimeout(function () {
      done(Reason.Finished);
    }, durationMs + delaysMs);
  } else {
    // No transition is happening, so we should cleanup already. Otherwise we have to wait until we
    // get disposed.
    done(Reason.Finished);
  } // If we get disposed before the timeout runs we should cleanup anyway


  d.add(function () {
    return done(Reason.Cancelled);
  });
  return d.dispose;
}

function transition(node, base, from, to, entered, done) {
  var d = disposables();

  var _done = done !== undefined ? once(done) : function () {};

  removeClasses.apply(void 0, [node].concat(entered));
  addClasses.apply(void 0, [node].concat(base, from));
  d.nextFrame(function () {
    removeClasses.apply(void 0, [node].concat(from));
    addClasses.apply(void 0, [node].concat(to));
    d.add(waitForTransition(node, function (reason) {
      removeClasses.apply(void 0, [node].concat(to, base));
      addClasses.apply(void 0, [node].concat(entered));
      return _done(reason);
    }));
  }); // Once we get disposed, we should ensure that we cleanup after ourselves. In case of an unmount,
  // the node itself will be nullified and will be a no-op. In case of a full transition the classes
  // are already removed which is also a no-op. However if you go from enter -> leave mid-transition
  // then we have some leftovers that should be cleaned.

  d.add(function () {
    return removeClasses.apply(void 0, [node].concat(base, from, to, entered));
  }); // When we get disposed early, than we should also call the done method but switch the reason.

  d.add(function () {
    return _done(Reason.Cancelled);
  });
  return d.dispose;
}

function useSplitClasses(classes) {
  if (classes === void 0) {
    classes = '';
  }

  return react.useMemo(function () {
    return classes.split(' ').filter(function (className) {
      return className.trim().length > 1;
    });
  }, [classes]);
}

var TransitionContext = /*#__PURE__*/react.createContext(null);
TransitionContext.displayName = 'TransitionContext';
var TreeStates;

(function (TreeStates) {
  TreeStates["Visible"] = "visible";
  TreeStates["Hidden"] = "hidden";
})(TreeStates || (TreeStates = {}));

function useTransitionContext() {
  var context = react.useContext(TransitionContext);

  if (context === null) {
    throw new Error('A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.');
  }

  return context;
}

function useParentNesting() {
  var context = react.useContext(NestingContext);

  if (context === null) {
    throw new Error('A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.');
  }

  return context;
}

var NestingContext = /*#__PURE__*/react.createContext(null);
NestingContext.displayName = 'NestingContext';

function hasChildren(bag) {
  if ('children' in bag) return hasChildren(bag.children);
  return bag.current.filter(function (_ref) {
    var state = _ref.state;
    return state === TreeStates.Visible;
  }).length > 0;
}

function useNesting(done) {
  var doneRef = react.useRef(done);
  var transitionableChildren = react.useRef([]);
  var mounted = useIsMounted();
  react.useEffect(function () {
    doneRef.current = done;
  }, [done]);
  var unregister = react.useCallback(function (childId, strategy) {
    var _match;

    if (strategy === void 0) {
      strategy = RenderStrategy.Hidden;
    }

    var idx = transitionableChildren.current.findIndex(function (_ref2) {
      var id = _ref2.id;
      return id === childId;
    });
    if (idx === -1) return;
    match(strategy, (_match = {}, _match[RenderStrategy.Unmount] = function () {
      transitionableChildren.current.splice(idx, 1);
    }, _match[RenderStrategy.Hidden] = function () {
      transitionableChildren.current[idx].state = TreeStates.Hidden;
    }, _match));

    if (!hasChildren(transitionableChildren) && mounted.current) {
      doneRef.current == null ? void 0 : doneRef.current();
    }
  }, [doneRef, mounted, transitionableChildren]);
  var register = react.useCallback(function (childId) {
    var child = transitionableChildren.current.find(function (_ref3) {
      var id = _ref3.id;
      return id === childId;
    });

    if (!child) {
      transitionableChildren.current.push({
        id: childId,
        state: TreeStates.Visible
      });
    } else if (child.state !== TreeStates.Visible) {
      child.state = TreeStates.Visible;
    }

    return function () {
      return unregister(childId, RenderStrategy.Unmount);
    };
  }, [transitionableChildren, unregister]);
  return react.useMemo(function () {
    return {
      children: transitionableChildren,
      register: register,
      unregister: unregister
    };
  }, [register, unregister, transitionableChildren]);
}

function noop() {}

var eventNames = ['beforeEnter', 'afterEnter', 'beforeLeave', 'afterLeave'];

function ensureEventHooksExist(events) {
  var result = {};

  for (var _iterator = _createForOfIteratorHelperLoose(eventNames), _step; !(_step = _iterator()).done;) {
    var _events$name;

    var name = _step.value;
    result[name] = (_events$name = events[name]) != null ? _events$name : noop;
  }

  return result;
}

function useEvents(events) {
  var eventsRef = react.useRef(ensureEventHooksExist(events));
  react.useEffect(function () {
    eventsRef.current = ensureEventHooksExist(events);
  }, [events]);
  return eventsRef;
} // ---


var DEFAULT_TRANSITION_CHILD_TAG = 'div';
var TransitionChildRenderFeatures = Features.RenderStrategy;

function TransitionChild(props) {
  var _match3;

  var beforeEnter = props.beforeEnter,
      afterEnter = props.afterEnter,
      beforeLeave = props.beforeLeave,
      afterLeave = props.afterLeave,
      enter = props.enter,
      enterFrom = props.enterFrom,
      enterTo = props.enterTo,
      entered = props.entered,
      leave = props.leave,
      leaveFrom = props.leaveFrom,
      leaveTo = props.leaveTo,
      rest = _objectWithoutPropertiesLoose(props, ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave", "enter", "enterFrom", "enterTo", "entered", "leave", "leaveFrom", "leaveTo"]);

  var container = react.useRef(null);

  var _useState = react.useState(TreeStates.Visible),
      state = _useState[0],
      setState = _useState[1];

  var strategy = rest.unmount ? RenderStrategy.Unmount : RenderStrategy.Hidden;

  var _useTransitionContext = useTransitionContext(),
      show = _useTransitionContext.show,
      appear = _useTransitionContext.appear;

  var _useParentNesting = useParentNesting(),
      register = _useParentNesting.register,
      unregister = _useParentNesting.unregister;

  var initial = useIsInitialRender();
  var id = useId();
  var isTransitioning = react.useRef(false);
  var nesting = useNesting(function () {
    // When all children have been unmounted we can only hide ourselves if and only if we are not
    // transitioning ourselves. Otherwise we would unmount before the transitions are finished.
    if (!isTransitioning.current) {
      setState(TreeStates.Hidden);
      unregister(id);
      events.current.afterLeave();
    }
  });
  useIsoMorphicEffect(function () {
    if (!id) return;
    return register(id);
  }, [register, id]);
  useIsoMorphicEffect(function () {
    var _match2;

    // If we are in another mode than the Hidden mode then ignore
    if (strategy !== RenderStrategy.Hidden) return;
    if (!id) return; // Make sure that we are visible

    if (show && state !== TreeStates.Visible) {
      setState(TreeStates.Visible);
      return;
    }

    match(state, (_match2 = {}, _match2[TreeStates.Hidden] = function () {
      return unregister(id);
    }, _match2[TreeStates.Visible] = function () {
      return register(id);
    }, _match2));
  }, [state, id, register, unregister, show, strategy]);
  var enterClasses = useSplitClasses(enter);
  var enterFromClasses = useSplitClasses(enterFrom);
  var enterToClasses = useSplitClasses(enterTo);
  var enteredClasses = useSplitClasses(entered);
  var leaveClasses = useSplitClasses(leave);
  var leaveFromClasses = useSplitClasses(leaveFrom);
  var leaveToClasses = useSplitClasses(leaveTo);
  var events = useEvents({
    beforeEnter: beforeEnter,
    afterEnter: afterEnter,
    beforeLeave: beforeLeave,
    afterLeave: afterLeave
  });
  var ready = useServerHandoffComplete();
  react.useEffect(function () {
    if (ready && state === TreeStates.Visible && container.current === null) {
      throw new Error('Did you forget to passthrough the `ref` to the actual DOM node?');
    }
  }, [container, state, ready]); // Skipping initial transition

  var skip = initial && !appear;
  useIsoMorphicEffect(function () {
    var node = container.current;
    if (!node) return;
    if (skip) return;
    isTransitioning.current = true;
    if (show) events.current.beforeEnter();
    if (!show) events.current.beforeLeave();
    return show ? transition(node, enterClasses, enterFromClasses, enterToClasses, enteredClasses, function (reason) {
      isTransitioning.current = false;
      if (reason === Reason.Finished) events.current.afterEnter();
    }) : transition(node, leaveClasses, leaveFromClasses, leaveToClasses, enteredClasses, function (reason) {
      isTransitioning.current = false;
      if (reason !== Reason.Finished) return; // When we don't have children anymore we can safely unregister from the parent and hide
      // ourselves.

      if (!hasChildren(nesting)) {
        setState(TreeStates.Hidden);
        unregister(id);
        events.current.afterLeave();
      }
    });
  }, [events, id, isTransitioning, unregister, nesting, container, skip, show, enterClasses, enterFromClasses, enterToClasses, leaveClasses, leaveFromClasses, leaveToClasses]);
  var propsWeControl = {
    ref: container
  };
  var passthroughProps = rest;
  return react.createElement(NestingContext.Provider, {
    value: nesting
  }, react.createElement(OpenClosedProvider, {
    value: match(state, (_match3 = {}, _match3[TreeStates.Visible] = State.Open, _match3[TreeStates.Hidden] = State.Closed, _match3))
  }, render({
    props: _extends({}, passthroughProps, propsWeControl),
    defaultTag: DEFAULT_TRANSITION_CHILD_TAG,
    features: TransitionChildRenderFeatures,
    visible: state === TreeStates.Visible,
    name: 'Transition.Child'
  })));
}

function Transition(props) {
  // @ts-expect-error
  var show = props.show,
      _props$appear = props.appear,
      appear = _props$appear === void 0 ? false : _props$appear,
      unmount = props.unmount,
      passthroughProps = _objectWithoutPropertiesLoose(props, ["show", "appear", "unmount"]);

  var usesOpenClosedState = useOpenClosed();

  if (show === undefined && usesOpenClosedState !== null) {
    var _match4;

    show = match(usesOpenClosedState, (_match4 = {}, _match4[State.Open] = true, _match4[State.Closed] = false, _match4));
  }

  if (![true, false].includes(show)) {
    throw new Error('A <Transition /> is used but it is missing a `show={true | false}` prop.');
  }

  var _useState2 = react.useState(show ? TreeStates.Visible : TreeStates.Hidden),
      state = _useState2[0],
      setState = _useState2[1];

  var nestingBag = useNesting(function () {
    setState(TreeStates.Hidden);
  });
  var initial = useIsInitialRender();
  var transitionBag = react.useMemo(function () {
    return {
      show: show,
      appear: appear || !initial
    };
  }, [show, appear, initial]);
  react.useEffect(function () {
    if (show) {
      setState(TreeStates.Visible);
    } else if (!hasChildren(nestingBag)) {
      setState(TreeStates.Hidden);
    }
  }, [show, nestingBag]);
  var sharedProps = {
    unmount: unmount
  };
  return react.createElement(NestingContext.Provider, {
    value: nestingBag
  }, react.createElement(TransitionContext.Provider, {
    value: transitionBag
  }, render({
    props: _extends({}, sharedProps, {
      as: react.Fragment,
      children: react.createElement(TransitionChild, Object.assign({}, sharedProps, passthroughProps))
    }),
    defaultTag: react.Fragment,
    features: TransitionChildRenderFeatures,
    visible: state === TreeStates.Visible,
    name: 'Transition'
  })));
}

Transition.Child = function Child(props) {
  var hasTransitionContext = react.useContext(TransitionContext) !== null;
  var hasOpenClosedContext = useOpenClosed() !== null;
  return !hasTransitionContext && hasOpenClosedContext ? react.createElement(Transition, Object.assign({}, props)) : react.createElement(TransitionChild, Object.assign({}, props));
};

Transition.Root = Transition;

export { Dialog, Listbox, Transition };
