import { r as react, c as createCommonjsModule, g as getDefaultExportFromCjs } from '../common/index-0ff745df.js';
import { p as propTypes } from '../common/index-89cdc518.js';
import { G as Grid$1, w as withComponents, b as DragDropProvider$1, c as GroupingPanel$1, T as TableRowDetail$1, d as InlineSummaryItem, e as TableGroupRow$1, f as TableSelection$1, g as Table$2, m as makeVirtualTable, h as TableFilterRow$1, i as TableHeaderRow$1, j as TableBandHeader$1, k as TableEditRow$1, l as TableEditColumn$1, n as TableColumnVisibility$1, o as TableColumnReordering$1, p as Toolbar$3, q as TableTreeColumn$1, r as SearchPanel$1, s as TableFixedColumns$1, t as TableSummaryRow$1, u as TableInlineCellEditing$1, v as ExportPanel$1, C as ColumnChooser$1, x as PagingPanel$1, y as TableLayout$1, z as StaticTableLayout, A as Sizer, B as firstRowOnPage, H as lastRowOnPage, V as VirtualTableLayout$1, J as Draggable, K as DragSource, L as getCellGeometries, M as calculateStartPage } from '../common/dx-react-grid.es-5ede858f.js';
import { w as withStyles, a as alpha, _ as _objectWithoutProperties$1, c as clsx, u as useForkRef, b as useTheme, s as setRef, d as _defineProperty$1, e as _slicedToArray$1, f as deepmerge, g as emphasize, l as lighten, h as darken } from '../common/useForkRef-69a58d47.js';
import { i as interopRequireWildcard, a as interopRequireDefault, c as colorManipulator } from '../common/withStyles-08caf30b.js';
import { c as capitalize, d as debounce$1, u as useFormControl$1, F as FormControlContext } from '../common/InputBase-6aebeb02.js';
import { c as createChainedFunction, P as Portal, u as useTheme$1, G as Grow, o as ownerDocument, a as ownerWindow, b as Popover, L as List$2, S as SvgIcon } from '../common/OutlinedInput-feda9675.js';
import { u as useControlled, c as createSvgIcon$1, a as useFormControl, M as Menu$1 } from '../common/Menu-b6a1a042.js';
import { i as isMuiElement } from '../common/isMuiElement-252f18e1.js';
import { u as useEventCallback, L as ListContext } from '../common/ListContext-eec9e983.js';
import { B as ButtonBase, u as useIsFocusVisible, L as ListItem, _ as __pika_web_default_export_for_treeshaking__$2 } from '../common/index-851d5ab4.js';
import { _ as __pika_web_default_export_for_treeshaking__$1 } from '../common/index-9e1d492c.js';
import { _ as __pika_web_default_export_for_treeshaking__ } from '../common/index-e919db92.js';
import { _ as _extends$2 } from '../common/hoist-non-react-statics.cjs-a71ad280.js';
import { r as reactDom } from '../common/index-1a921524.js';

function deprecatedPropType(validator, reason) {
  {
    return function () {
      return null;
    };
  }
}

var styles = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      textAlign: 'center',
      flex: '0 0 auto',
      fontSize: theme.typography.pxToRem(24),
      padding: 12,
      borderRadius: '50%',
      overflow: 'visible',
      // Explicitly set the default value to solve a bug on IE 11.
      color: theme.palette.action.active,
      transition: theme.transitions.create('background-color', {
        duration: theme.transitions.duration.shortest
      }),
      '&:hover': {
        backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      },
      '&$disabled': {
        backgroundColor: 'transparent',
        color: theme.palette.action.disabled
      }
    },

    /* Styles applied to the root element if `edge="start"`. */
    edgeStart: {
      marginLeft: -12,
      '$sizeSmall&': {
        marginLeft: -3
      }
    },

    /* Styles applied to the root element if `edge="end"`. */
    edgeEnd: {
      marginRight: -12,
      '$sizeSmall&': {
        marginRight: -3
      }
    },

    /* Styles applied to the root element if `color="inherit"`. */
    colorInherit: {
      color: 'inherit'
    },

    /* Styles applied to the root element if `color="primary"`. */
    colorPrimary: {
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    },

    /* Styles applied to the root element if `color="secondary"`. */
    colorSecondary: {
      color: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    },

    /* Pseudo-class applied to the root element if `disabled={true}`. */
    disabled: {},

    /* Styles applied to the root element if `size="small"`. */
    sizeSmall: {
      padding: 3,
      fontSize: theme.typography.pxToRem(18)
    },

    /* Styles applied to the children container element. */
    label: {
      width: '100%',
      display: 'flex',
      alignItems: 'inherit',
      justifyContent: 'inherit'
    }
  };
};
/**
 * Refer to the [Icons](/components/icons/) section of the documentation
 * regarding the available icon options.
 */

var IconButton = /*#__PURE__*/react.forwardRef(function IconButton(props, ref) {
  var _props$edge = props.edge,
      edge = _props$edge === void 0 ? false : _props$edge,
      children = props.children,
      classes = props.classes,
      className = props.className,
      _props$color = props.color,
      color = _props$color === void 0 ? 'default' : _props$color,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$disableFocusRi = props.disableFocusRipple,
      disableFocusRipple = _props$disableFocusRi === void 0 ? false : _props$disableFocusRi,
      _props$size = props.size,
      size = _props$size === void 0 ? 'medium' : _props$size,
      other = _objectWithoutProperties$1(props, ["edge", "children", "classes", "className", "color", "disabled", "disableFocusRipple", "size"]);

  return /*#__PURE__*/react.createElement(ButtonBase, _extends$2({
    className: clsx(classes.root, className, color !== 'default' && classes["color".concat(capitalize(color))], disabled && classes.disabled, size === "small" && classes["size".concat(capitalize(size))], {
      'start': classes.edgeStart,
      'end': classes.edgeEnd
    }[edge]),
    centerRipple: true,
    focusRipple: !disableFocusRipple,
    disabled: disabled,
    ref: ref
  }, other), /*#__PURE__*/react.createElement("span", {
    className: classes.label
  }, children));
});
var IconButton$1 = withStyles(styles, {
  name: 'MuiIconButton'
})(IconButton);

/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1-lts
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

var timeoutDuration = function () {
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      return 1;
    }
  }
  return 0;
}();

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the reference node of the reference object, or the reference object itself.
 * @method
 * @memberof Popper.Utils
 * @param {Element|Object} reference - the reference element (the popper will be relative to this)
 * @returns {Element} parent
 */
function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
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

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop);
    var marginLeft = parseFloat(styles.marginLeft);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicitly asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

    // flips variation if reference element overflows boundaries
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    // flips variation if popper content overflows boundaries
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

function flipPlacement(placement, theme) {
  var direction = theme && theme.direction || 'ltr';

  if (direction === 'ltr') {
    return placement;
  }

  switch (placement) {
    case 'bottom-end':
      return 'bottom-start';

    case 'bottom-start':
      return 'bottom-end';

    case 'top-end':
      return 'top-start';

    case 'top-start':
      return 'top-end';

    default:
      return placement;
  }
}

function getAnchorEl(anchorEl) {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}

var useEnhancedEffect = typeof window !== 'undefined' ? react.useLayoutEffect : react.useEffect;
var defaultPopperOptions = {};
/**
 * Poppers rely on the 3rd party library [Popper.js](https://popper.js.org/docs/v1/) for positioning.
 */

var Popper$1 = /*#__PURE__*/react.forwardRef(function Popper$1(props, ref) {
  var anchorEl = props.anchorEl,
      children = props.children,
      container = props.container,
      _props$disablePortal = props.disablePortal,
      disablePortal = _props$disablePortal === void 0 ? false : _props$disablePortal,
      _props$keepMounted = props.keepMounted,
      keepMounted = _props$keepMounted === void 0 ? false : _props$keepMounted,
      modifiers = props.modifiers,
      open = props.open,
      _props$placement = props.placement,
      initialPlacement = _props$placement === void 0 ? 'bottom' : _props$placement,
      _props$popperOptions = props.popperOptions,
      popperOptions = _props$popperOptions === void 0 ? defaultPopperOptions : _props$popperOptions,
      popperRefProp = props.popperRef,
      style = props.style,
      _props$transition = props.transition,
      transition = _props$transition === void 0 ? false : _props$transition,
      other = _objectWithoutProperties$1(props, ["anchorEl", "children", "container", "disablePortal", "keepMounted", "modifiers", "open", "placement", "popperOptions", "popperRef", "style", "transition"]);

  var tooltipRef = react.useRef(null);
  var ownRef = useForkRef(tooltipRef, ref);
  var popperRef = react.useRef(null);
  var handlePopperRef = useForkRef(popperRef, popperRefProp);
  var handlePopperRefRef = react.useRef(handlePopperRef);
  useEnhancedEffect(function () {
    handlePopperRefRef.current = handlePopperRef;
  }, [handlePopperRef]);
  react.useImperativeHandle(popperRefProp, function () {
    return popperRef.current;
  }, []);

  var _React$useState = react.useState(true),
      exited = _React$useState[0],
      setExited = _React$useState[1];

  var theme = useTheme();
  var rtlPlacement = flipPlacement(initialPlacement, theme);
  /**
   * placement initialized from prop but can change during lifetime if modifiers.flip.
   * modifiers.flip is essentially a flip for controlled/uncontrolled behavior
   */

  var _React$useState2 = react.useState(rtlPlacement),
      placement = _React$useState2[0],
      setPlacement = _React$useState2[1];

  react.useEffect(function () {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });
  var handleOpen = react.useCallback(function () {
    if (!tooltipRef.current || !anchorEl || !open) {
      return;
    }

    if (popperRef.current) {
      popperRef.current.destroy();
      handlePopperRefRef.current(null);
    }

    var handlePopperUpdate = function handlePopperUpdate(data) {
      setPlacement(data.placement);
    };

    var resolvedAnchorEl = getAnchorEl(anchorEl);

    var popper = new Popper(getAnchorEl(anchorEl), tooltipRef.current, _extends$2({
      placement: rtlPlacement
    }, popperOptions, {
      modifiers: _extends$2({}, disablePortal ? {} : {
        // It's using scrollParent by default, we can use the viewport when using a portal.
        preventOverflow: {
          boundariesElement: 'window'
        }
      }, modifiers, popperOptions.modifiers),
      // We could have been using a custom modifier like react-popper is doing.
      // But it seems this is the best public API for this use case.
      onCreate: createChainedFunction(handlePopperUpdate, popperOptions.onCreate),
      onUpdate: createChainedFunction(handlePopperUpdate, popperOptions.onUpdate)
    }));
    handlePopperRefRef.current(popper);
  }, [anchorEl, disablePortal, modifiers, open, rtlPlacement, popperOptions]);
  var handleRef = react.useCallback(function (node) {
    setRef(ownRef, node);
    handleOpen();
  }, [ownRef, handleOpen]);

  var handleEnter = function handleEnter() {
    setExited(false);
  };

  var handleClose = function handleClose() {
    if (!popperRef.current) {
      return;
    }

    popperRef.current.destroy();
    handlePopperRefRef.current(null);
  };

  var handleExited = function handleExited() {
    setExited(true);
    handleClose();
  };

  react.useEffect(function () {
    return function () {
      handleClose();
    };
  }, []);
  react.useEffect(function () {
    if (!open && !transition) {
      // Otherwise handleExited will call this.
      handleClose();
    }
  }, [open, transition]);

  if (!keepMounted && !open && (!transition || exited)) {
    return null;
  }

  var childProps = {
    placement: placement
  };

  if (transition) {
    childProps.TransitionProps = {
      in: open,
      onEnter: handleEnter,
      onExited: handleExited
    };
  }

  return /*#__PURE__*/react.createElement(Portal, {
    disablePortal: disablePortal,
    container: container
  }, /*#__PURE__*/react.createElement("div", _extends$2({
    ref: handleRef,
    role: "tooltip"
  }, other, {
    style: _extends$2({
      // Prevents scroll issue, waiting for Popper.js to add this style once initiated.
      position: 'fixed',
      // Fix Popper.js display issue
      top: 0,
      left: 0,
      display: !open && keepMounted && !transition ? 'none' : null
    }, style)
  }), typeof children === 'function' ? children(childProps) : children));
});

/**
 * Private module reserved for @material-ui/x packages.
 */

function useId(idOverride) {
  var _React$useState = react.useState(idOverride),
      defaultId = _React$useState[0],
      setDefaultId = _React$useState[1];

  var id = idOverride || defaultId;
  react.useEffect(function () {
    if (defaultId == null) {
      // Fallback to this default id when possible.
      // Use the random value for client-side rendering only.
      // We can't use it server-side.
      setDefaultId("mui-".concat(Math.round(Math.random() * 1e5)));
    }
  }, [defaultId]);
  return id;
}

function round(value) {
  return Math.round(value * 1e5) / 1e5;
}

function arrowGenerator() {
  return {
    '&[x-placement*="bottom"] $arrow': {
      top: 0,
      left: 0,
      marginTop: '-0.71em',
      marginLeft: 4,
      marginRight: 4,
      '&::before': {
        transformOrigin: '0 100%'
      }
    },
    '&[x-placement*="top"] $arrow': {
      bottom: 0,
      left: 0,
      marginBottom: '-0.71em',
      marginLeft: 4,
      marginRight: 4,
      '&::before': {
        transformOrigin: '100% 0'
      }
    },
    '&[x-placement*="right"] $arrow': {
      left: 0,
      marginLeft: '-0.71em',
      height: '1em',
      width: '0.71em',
      marginTop: 4,
      marginBottom: 4,
      '&::before': {
        transformOrigin: '100% 100%'
      }
    },
    '&[x-placement*="left"] $arrow': {
      right: 0,
      marginRight: '-0.71em',
      height: '1em',
      width: '0.71em',
      marginTop: 4,
      marginBottom: 4,
      '&::before': {
        transformOrigin: '0 0'
      }
    }
  };
}

var styles$1 = function styles(theme) {
  return {
    /* Styles applied to the Popper component. */
    popper: {
      zIndex: theme.zIndex.tooltip,
      pointerEvents: 'none' // disable jss-rtl plugin

    },

    /* Styles applied to the Popper component if `interactive={true}`. */
    popperInteractive: {
      pointerEvents: 'auto'
    },

    /* Styles applied to the Popper component if `arrow={true}`. */
    popperArrow: arrowGenerator(),

    /* Styles applied to the tooltip (label wrapper) element. */
    tooltip: {
      backgroundColor: alpha(theme.palette.grey[700], 0.9),
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.common.white,
      fontFamily: theme.typography.fontFamily,
      padding: '4px 8px',
      fontSize: theme.typography.pxToRem(10),
      lineHeight: "".concat(round(14 / 10), "em"),
      maxWidth: 300,
      wordWrap: 'break-word',
      fontWeight: theme.typography.fontWeightMedium
    },

    /* Styles applied to the tooltip (label wrapper) element if `arrow={true}`. */
    tooltipArrow: {
      position: 'relative',
      margin: '0'
    },

    /* Styles applied to the arrow element. */
    arrow: {
      overflow: 'hidden',
      position: 'absolute',
      width: '1em',
      height: '0.71em'
      /* = width / sqrt(2) = (length of the hypotenuse) */
      ,
      boxSizing: 'border-box',
      color: alpha(theme.palette.grey[700], 0.9),
      '&::before': {
        content: '""',
        margin: 'auto',
        display: 'block',
        width: '100%',
        height: '100%',
        backgroundColor: 'currentColor',
        transform: 'rotate(45deg)'
      }
    },

    /* Styles applied to the tooltip (label wrapper) element if the tooltip is opened by touch. */
    touch: {
      padding: '8px 16px',
      fontSize: theme.typography.pxToRem(14),
      lineHeight: "".concat(round(16 / 14), "em"),
      fontWeight: theme.typography.fontWeightRegular
    },

    /* Styles applied to the tooltip (label wrapper) element if `placement` contains "left". */
    tooltipPlacementLeft: _defineProperty$1({
      transformOrigin: 'right center',
      margin: '0 24px '
    }, theme.breakpoints.up('sm'), {
      margin: '0 14px'
    }),

    /* Styles applied to the tooltip (label wrapper) element if `placement` contains "right". */
    tooltipPlacementRight: _defineProperty$1({
      transformOrigin: 'left center',
      margin: '0 24px'
    }, theme.breakpoints.up('sm'), {
      margin: '0 14px'
    }),

    /* Styles applied to the tooltip (label wrapper) element if `placement` contains "top". */
    tooltipPlacementTop: _defineProperty$1({
      transformOrigin: 'center bottom',
      margin: '24px 0'
    }, theme.breakpoints.up('sm'), {
      margin: '14px 0'
    }),

    /* Styles applied to the tooltip (label wrapper) element if `placement` contains "bottom". */
    tooltipPlacementBottom: _defineProperty$1({
      transformOrigin: 'center top',
      margin: '24px 0'
    }, theme.breakpoints.up('sm'), {
      margin: '14px 0'
    })
  };
};
var hystersisOpen = false;
var hystersisTimer = null;
var Tooltip = /*#__PURE__*/react.forwardRef(function Tooltip(props, ref) {
  var _props$arrow = props.arrow,
      arrow = _props$arrow === void 0 ? false : _props$arrow,
      children = props.children,
      classes = props.classes,
      _props$disableFocusLi = props.disableFocusListener,
      disableFocusListener = _props$disableFocusLi === void 0 ? false : _props$disableFocusLi,
      _props$disableHoverLi = props.disableHoverListener,
      disableHoverListener = _props$disableHoverLi === void 0 ? false : _props$disableHoverLi,
      _props$disableTouchLi = props.disableTouchListener,
      disableTouchListener = _props$disableTouchLi === void 0 ? false : _props$disableTouchLi,
      _props$enterDelay = props.enterDelay,
      enterDelay = _props$enterDelay === void 0 ? 100 : _props$enterDelay,
      _props$enterNextDelay = props.enterNextDelay,
      enterNextDelay = _props$enterNextDelay === void 0 ? 0 : _props$enterNextDelay,
      _props$enterTouchDela = props.enterTouchDelay,
      enterTouchDelay = _props$enterTouchDela === void 0 ? 700 : _props$enterTouchDela,
      idProp = props.id,
      _props$interactive = props.interactive,
      interactive = _props$interactive === void 0 ? false : _props$interactive,
      _props$leaveDelay = props.leaveDelay,
      leaveDelay = _props$leaveDelay === void 0 ? 0 : _props$leaveDelay,
      _props$leaveTouchDela = props.leaveTouchDelay,
      leaveTouchDelay = _props$leaveTouchDela === void 0 ? 1500 : _props$leaveTouchDela,
      onClose = props.onClose,
      onOpen = props.onOpen,
      openProp = props.open,
      _props$placement = props.placement,
      placement = _props$placement === void 0 ? 'bottom' : _props$placement,
      _props$PopperComponen = props.PopperComponent,
      PopperComponent = _props$PopperComponen === void 0 ? Popper$1 : _props$PopperComponen,
      PopperProps = props.PopperProps,
      title = props.title,
      _props$TransitionComp = props.TransitionComponent,
      TransitionComponent = _props$TransitionComp === void 0 ? Grow : _props$TransitionComp,
      TransitionProps = props.TransitionProps,
      other = _objectWithoutProperties$1(props, ["arrow", "children", "classes", "disableFocusListener", "disableHoverListener", "disableTouchListener", "enterDelay", "enterNextDelay", "enterTouchDelay", "id", "interactive", "leaveDelay", "leaveTouchDelay", "onClose", "onOpen", "open", "placement", "PopperComponent", "PopperProps", "title", "TransitionComponent", "TransitionProps"]);

  var theme = useTheme$1();

  var _React$useState = react.useState(),
      childNode = _React$useState[0],
      setChildNode = _React$useState[1];

  var _React$useState2 = react.useState(null),
      arrowRef = _React$useState2[0],
      setArrowRef = _React$useState2[1];

  var ignoreNonTouchEvents = react.useRef(false);
  var closeTimer = react.useRef();
  var enterTimer = react.useRef();
  var leaveTimer = react.useRef();
  var touchTimer = react.useRef();

  var _useControlled = useControlled({
    controlled: openProp,
    default: false,
    name: 'Tooltip',
    state: 'open'
  }),
      _useControlled2 = _slicedToArray$1(_useControlled, 2),
      openState = _useControlled2[0],
      setOpenState = _useControlled2[1];

  var open = openState;

  var id = useId(idProp);
  react.useEffect(function () {
    return function () {
      clearTimeout(closeTimer.current);
      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
      clearTimeout(touchTimer.current);
    };
  }, []);

  var handleOpen = function handleOpen(event) {
    clearTimeout(hystersisTimer);
    hystersisOpen = true; // The mouseover event will trigger for every nested element in the tooltip.
    // We can skip rerendering when the tooltip is already open.
    // We are using the mouseover event instead of the mouseenter event to fix a hide/show issue.

    setOpenState(true);

    if (onOpen) {
      onOpen(event);
    }
  };

  var handleEnter = function handleEnter() {
    var forward = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return function (event) {
      var childrenProps = children.props;

      if (event.type === 'mouseover' && childrenProps.onMouseOver && forward) {
        childrenProps.onMouseOver(event);
      }

      if (ignoreNonTouchEvents.current && event.type !== 'touchstart') {
        return;
      } // Remove the title ahead of time.
      // We don't want to wait for the next render commit.
      // We would risk displaying two tooltips at the same time (native + this one).


      if (childNode) {
        childNode.removeAttribute('title');
      }

      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);

      if (enterDelay || hystersisOpen && enterNextDelay) {
        event.persist();
        enterTimer.current = setTimeout(function () {
          handleOpen(event);
        }, hystersisOpen ? enterNextDelay : enterDelay);
      } else {
        handleOpen(event);
      }
    };
  };

  var _useIsFocusVisible = useIsFocusVisible(),
      isFocusVisible = _useIsFocusVisible.isFocusVisible,
      onBlurVisible = _useIsFocusVisible.onBlurVisible,
      focusVisibleRef = _useIsFocusVisible.ref;

  var _React$useState3 = react.useState(false),
      childIsFocusVisible = _React$useState3[0],
      setChildIsFocusVisible = _React$useState3[1];

  var handleBlur = function handleBlur() {
    if (childIsFocusVisible) {
      setChildIsFocusVisible(false);
      onBlurVisible();
    }
  };

  var handleFocus = function handleFocus() {
    var forward = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return function (event) {
      // Workaround for https://github.com/facebook/react/issues/7769
      // The autoFocus of React might trigger the event before the componentDidMount.
      // We need to account for this eventuality.
      if (!childNode) {
        setChildNode(event.currentTarget);
      }

      if (isFocusVisible(event)) {
        setChildIsFocusVisible(true);
        handleEnter()(event);
      }

      var childrenProps = children.props;

      if (childrenProps.onFocus && forward) {
        childrenProps.onFocus(event);
      }
    };
  };

  var handleClose = function handleClose(event) {
    clearTimeout(hystersisTimer);
    hystersisTimer = setTimeout(function () {
      hystersisOpen = false;
    }, 800 + leaveDelay);
    setOpenState(false);

    if (onClose) {
      onClose(event);
    }

    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(function () {
      ignoreNonTouchEvents.current = false;
    }, theme.transitions.duration.shortest);
  };

  var handleLeave = function handleLeave() {
    var forward = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    return function (event) {
      var childrenProps = children.props;

      if (event.type === 'blur') {
        if (childrenProps.onBlur && forward) {
          childrenProps.onBlur(event);
        }

        handleBlur();
      }

      if (event.type === 'mouseleave' && childrenProps.onMouseLeave && event.currentTarget === childNode) {
        childrenProps.onMouseLeave(event);
      }

      clearTimeout(enterTimer.current);
      clearTimeout(leaveTimer.current);
      event.persist();
      leaveTimer.current = setTimeout(function () {
        handleClose(event);
      }, leaveDelay);
    };
  };

  var detectTouchStart = function detectTouchStart(event) {
    ignoreNonTouchEvents.current = true;
    var childrenProps = children.props;

    if (childrenProps.onTouchStart) {
      childrenProps.onTouchStart(event);
    }
  };

  var handleTouchStart = function handleTouchStart(event) {
    detectTouchStart(event);
    clearTimeout(leaveTimer.current);
    clearTimeout(closeTimer.current);
    clearTimeout(touchTimer.current);
    event.persist();
    touchTimer.current = setTimeout(function () {
      handleEnter()(event);
    }, enterTouchDelay);
  };

  var handleTouchEnd = function handleTouchEnd(event) {
    if (children.props.onTouchEnd) {
      children.props.onTouchEnd(event);
    }

    clearTimeout(touchTimer.current);
    clearTimeout(leaveTimer.current);
    event.persist();
    leaveTimer.current = setTimeout(function () {
      handleClose(event);
    }, leaveTouchDelay);
  };

  var handleUseRef = useForkRef(setChildNode, ref);
  var handleFocusRef = useForkRef(focusVisibleRef, handleUseRef); // can be removed once we drop support for non ref forwarding class components

  var handleOwnRef = react.useCallback(function (instance) {
    // #StrictMode ready
    setRef(handleFocusRef, reactDom.findDOMNode(instance));
  }, [handleFocusRef]);
  var handleRef = useForkRef(children.ref, handleOwnRef); // There is no point in displaying an empty tooltip.

  if (title === '') {
    open = false;
  } // For accessibility and SEO concerns, we render the title to the DOM node when
  // the tooltip is hidden. However, we have made a tradeoff when
  // `disableHoverListener` is set. This title logic is disabled.
  // It's allowing us to keep the implementation size minimal.
  // We are open to change the tradeoff.


  var shouldShowNativeTitle = !open && !disableHoverListener;

  var childrenProps = _extends$2({
    'aria-describedby': open ? id : null,
    title: shouldShowNativeTitle && typeof title === 'string' ? title : null
  }, other, children.props, {
    className: clsx(other.className, children.props.className),
    onTouchStart: detectTouchStart,
    ref: handleRef
  });

  var interactiveWrapperListeners = {};

  if (!disableTouchListener) {
    childrenProps.onTouchStart = handleTouchStart;
    childrenProps.onTouchEnd = handleTouchEnd;
  }

  if (!disableHoverListener) {
    childrenProps.onMouseOver = handleEnter();
    childrenProps.onMouseLeave = handleLeave();

    if (interactive) {
      interactiveWrapperListeners.onMouseOver = handleEnter(false);
      interactiveWrapperListeners.onMouseLeave = handleLeave(false);
    }
  }

  if (!disableFocusListener) {
    childrenProps.onFocus = handleFocus();
    childrenProps.onBlur = handleLeave();

    if (interactive) {
      interactiveWrapperListeners.onFocus = handleFocus(false);
      interactiveWrapperListeners.onBlur = handleLeave(false);
    }
  }

  var mergedPopperProps = react.useMemo(function () {
    return deepmerge({
      popperOptions: {
        modifiers: {
          arrow: {
            enabled: Boolean(arrowRef),
            element: arrowRef
          }
        }
      }
    }, PopperProps);
  }, [arrowRef, PopperProps]);
  return /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.cloneElement(children, childrenProps), /*#__PURE__*/react.createElement(PopperComponent, _extends$2({
    className: clsx(classes.popper, interactive && classes.popperInteractive, arrow && classes.popperArrow),
    placement: placement,
    anchorEl: childNode,
    open: childNode ? open : false,
    id: childrenProps['aria-describedby'],
    transition: true
  }, interactiveWrapperListeners, mergedPopperProps), function (_ref) {
    var placementInner = _ref.placement,
        TransitionPropsInner = _ref.TransitionProps;
    return /*#__PURE__*/react.createElement(TransitionComponent, _extends$2({
      timeout: theme.transitions.duration.shorter
    }, TransitionPropsInner, TransitionProps), /*#__PURE__*/react.createElement("div", {
      className: clsx(classes.tooltip, classes["tooltipPlacement".concat(capitalize(placementInner.split('-')[0]))], ignoreNonTouchEvents.current && classes.touch, arrow && classes.tooltipArrow)
    }, title, arrow ? /*#__PURE__*/react.createElement("span", {
      className: classes.arrow,
      ref: setArrowRef
    }) : null));
  }));
});
var Tooltip$1 = withStyles(styles$1, {
  name: 'MuiTooltip',
  flip: false
})(Tooltip);

function requirePropFactory(componentNameInError) {
  {
    return function () {
      return null;
    };
  }
}

function unsupportedProp(props, propName, componentName, location, propFullName) {
  {
    return null;
  }
}

var utils = /*#__PURE__*/Object.freeze({
  __proto__: null,
  capitalize: capitalize,
  createChainedFunction: createChainedFunction,
  createSvgIcon: createSvgIcon$1,
  debounce: debounce$1,
  deprecatedPropType: deprecatedPropType,
  isMuiElement: isMuiElement,
  ownerDocument: ownerDocument,
  ownerWindow: ownerWindow,
  requirePropFactory: requirePropFactory,
  setRef: setRef,
  unsupportedProp: unsupportedProp,
  useControlled: useControlled,
  useEventCallback: useEventCallback,
  useForkRef: useForkRef,
  unstable_useId: useId,
  useIsFocusVisible: useIsFocusVisible
});

var createSvgIcon = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return utils.createSvgIcon;
  }
});
});

var VisibilityOff = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(createSvgIcon);

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/React.createElement("path", {
  d: "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
}), 'VisibilityOff');

exports.default = _default;
});

var VisibilityOff$1 = /*@__PURE__*/getDefaultExportFromCjs(VisibilityOff);

var styles$2 = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      margin: 0
    },

    /* Styles applied to the root element if `variant="body2"`. */
    body2: theme.typography.body2,

    /* Styles applied to the root element if `variant="body1"`. */
    body1: theme.typography.body1,

    /* Styles applied to the root element if `variant="caption"`. */
    caption: theme.typography.caption,

    /* Styles applied to the root element if `variant="button"`. */
    button: theme.typography.button,

    /* Styles applied to the root element if `variant="h1"`. */
    h1: theme.typography.h1,

    /* Styles applied to the root element if `variant="h2"`. */
    h2: theme.typography.h2,

    /* Styles applied to the root element if `variant="h3"`. */
    h3: theme.typography.h3,

    /* Styles applied to the root element if `variant="h4"`. */
    h4: theme.typography.h4,

    /* Styles applied to the root element if `variant="h5"`. */
    h5: theme.typography.h5,

    /* Styles applied to the root element if `variant="h6"`. */
    h6: theme.typography.h6,

    /* Styles applied to the root element if `variant="subtitle1"`. */
    subtitle1: theme.typography.subtitle1,

    /* Styles applied to the root element if `variant="subtitle2"`. */
    subtitle2: theme.typography.subtitle2,

    /* Styles applied to the root element if `variant="overline"`. */
    overline: theme.typography.overline,

    /* Styles applied to the root element if `variant="srOnly"`. Only accessible to screen readers. */
    srOnly: {
      position: 'absolute',
      height: 1,
      width: 1,
      overflow: 'hidden'
    },

    /* Styles applied to the root element if `align="left"`. */
    alignLeft: {
      textAlign: 'left'
    },

    /* Styles applied to the root element if `align="center"`. */
    alignCenter: {
      textAlign: 'center'
    },

    /* Styles applied to the root element if `align="right"`. */
    alignRight: {
      textAlign: 'right'
    },

    /* Styles applied to the root element if `align="justify"`. */
    alignJustify: {
      textAlign: 'justify'
    },

    /* Styles applied to the root element if `nowrap={true}`. */
    noWrap: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },

    /* Styles applied to the root element if `gutterBottom={true}`. */
    gutterBottom: {
      marginBottom: '0.35em'
    },

    /* Styles applied to the root element if `paragraph={true}`. */
    paragraph: {
      marginBottom: 16
    },

    /* Styles applied to the root element if `color="inherit"`. */
    colorInherit: {
      color: 'inherit'
    },

    /* Styles applied to the root element if `color="primary"`. */
    colorPrimary: {
      color: theme.palette.primary.main
    },

    /* Styles applied to the root element if `color="secondary"`. */
    colorSecondary: {
      color: theme.palette.secondary.main
    },

    /* Styles applied to the root element if `color="textPrimary"`. */
    colorTextPrimary: {
      color: theme.palette.text.primary
    },

    /* Styles applied to the root element if `color="textSecondary"`. */
    colorTextSecondary: {
      color: theme.palette.text.secondary
    },

    /* Styles applied to the root element if `color="error"`. */
    colorError: {
      color: theme.palette.error.main
    },

    /* Styles applied to the root element if `display="inline"`. */
    displayInline: {
      display: 'inline'
    },

    /* Styles applied to the root element if `display="block"`. */
    displayBlock: {
      display: 'block'
    }
  };
};
var defaultVariantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p'
};
var Typography = /*#__PURE__*/react.forwardRef(function Typography(props, ref) {
  var _props$align = props.align,
      align = _props$align === void 0 ? 'inherit' : _props$align,
      classes = props.classes,
      className = props.className,
      _props$color = props.color,
      color = _props$color === void 0 ? 'initial' : _props$color,
      component = props.component,
      _props$display = props.display,
      display = _props$display === void 0 ? 'initial' : _props$display,
      _props$gutterBottom = props.gutterBottom,
      gutterBottom = _props$gutterBottom === void 0 ? false : _props$gutterBottom,
      _props$noWrap = props.noWrap,
      noWrap = _props$noWrap === void 0 ? false : _props$noWrap,
      _props$paragraph = props.paragraph,
      paragraph = _props$paragraph === void 0 ? false : _props$paragraph,
      _props$variant = props.variant,
      variant = _props$variant === void 0 ? 'body1' : _props$variant,
      _props$variantMapping = props.variantMapping,
      variantMapping = _props$variantMapping === void 0 ? defaultVariantMapping : _props$variantMapping,
      other = _objectWithoutProperties$1(props, ["align", "classes", "className", "color", "component", "display", "gutterBottom", "noWrap", "paragraph", "variant", "variantMapping"]);

  var Component = component || (paragraph ? 'p' : variantMapping[variant] || defaultVariantMapping[variant]) || 'span';
  return /*#__PURE__*/react.createElement(Component, _extends$2({
    className: clsx(classes.root, className, variant !== 'inherit' && classes[variant], color !== 'initial' && classes["color".concat(capitalize(color))], noWrap && classes.noWrap, gutterBottom && classes.gutterBottom, paragraph && classes.paragraph, align !== 'inherit' && classes["align".concat(capitalize(align))], display !== 'initial' && classes["display".concat(capitalize(display))]),
    ref: ref
  }, other));
});
var Typography$1 = withStyles(styles$2, {
  name: 'MuiTypography'
})(Typography);

var styles$3 = {
  /* Styles applied to the root element. */
  root: {
    flex: '1 1 auto',
    minWidth: 0,
    marginTop: 4,
    marginBottom: 4
  },

  /* Styles applied to the `Typography` components if primary and secondary are set. */
  multiline: {
    marginTop: 6,
    marginBottom: 6
  },

  /* Styles applied to the `Typography` components if dense. */
  dense: {},

  /* Styles applied to the root element if `inset={true}`. */
  inset: {
    paddingLeft: 56
  },

  /* Styles applied to the primary `Typography` component. */
  primary: {},

  /* Styles applied to the secondary `Typography` component. */
  secondary: {}
};
var ListItemText = /*#__PURE__*/react.forwardRef(function ListItemText(props, ref) {
  var children = props.children,
      classes = props.classes,
      className = props.className,
      _props$disableTypogra = props.disableTypography,
      disableTypography = _props$disableTypogra === void 0 ? false : _props$disableTypogra,
      _props$inset = props.inset,
      inset = _props$inset === void 0 ? false : _props$inset,
      primaryProp = props.primary,
      primaryTypographyProps = props.primaryTypographyProps,
      secondaryProp = props.secondary,
      secondaryTypographyProps = props.secondaryTypographyProps,
      other = _objectWithoutProperties$1(props, ["children", "classes", "className", "disableTypography", "inset", "primary", "primaryTypographyProps", "secondary", "secondaryTypographyProps"]);

  var _React$useContext = react.useContext(ListContext),
      dense = _React$useContext.dense;

  var primary = primaryProp != null ? primaryProp : children;

  if (primary != null && primary.type !== Typography$1 && !disableTypography) {
    primary = /*#__PURE__*/react.createElement(Typography$1, _extends$2({
      variant: dense ? 'body2' : 'body1',
      className: classes.primary,
      component: "span",
      display: "block"
    }, primaryTypographyProps), primary);
  }

  var secondary = secondaryProp;

  if (secondary != null && secondary.type !== Typography$1 && !disableTypography) {
    secondary = /*#__PURE__*/react.createElement(Typography$1, _extends$2({
      variant: "body2",
      className: classes.secondary,
      color: "textSecondary",
      display: "block"
    }, secondaryTypographyProps), secondary);
  }

  return /*#__PURE__*/react.createElement("div", _extends$2({
    className: clsx(classes.root, className, dense && classes.dense, inset && classes.inset, primary && secondary && classes.multiline),
    ref: ref
  }, other), primary, secondary);
});
var ListItemText$1 = withStyles(styles$3, {
  name: 'MuiListItemText'
})(ListItemText);

var styles$4 = {
  root: {
    padding: 9
  },
  checked: {},
  disabled: {},
  input: {
    cursor: 'inherit',
    position: 'absolute',
    opacity: 0,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    zIndex: 1
  }
};
/**
 * @ignore - internal component.
 */

var SwitchBase = /*#__PURE__*/react.forwardRef(function SwitchBase(props, ref) {
  var autoFocus = props.autoFocus,
      checkedProp = props.checked,
      checkedIcon = props.checkedIcon,
      classes = props.classes,
      className = props.className,
      defaultChecked = props.defaultChecked,
      disabledProp = props.disabled,
      icon = props.icon,
      id = props.id,
      inputProps = props.inputProps,
      inputRef = props.inputRef,
      name = props.name,
      onBlur = props.onBlur,
      onChange = props.onChange,
      onFocus = props.onFocus,
      readOnly = props.readOnly,
      required = props.required,
      tabIndex = props.tabIndex,
      type = props.type,
      value = props.value,
      other = _objectWithoutProperties$1(props, ["autoFocus", "checked", "checkedIcon", "classes", "className", "defaultChecked", "disabled", "icon", "id", "inputProps", "inputRef", "name", "onBlur", "onChange", "onFocus", "readOnly", "required", "tabIndex", "type", "value"]);

  var _useControlled = useControlled({
    controlled: checkedProp,
    default: Boolean(defaultChecked),
    name: 'SwitchBase',
    state: 'checked'
  }),
      _useControlled2 = _slicedToArray$1(_useControlled, 2),
      checked = _useControlled2[0],
      setCheckedState = _useControlled2[1];

  var muiFormControl = useFormControl();

  var handleFocus = function handleFocus(event) {
    if (onFocus) {
      onFocus(event);
    }

    if (muiFormControl && muiFormControl.onFocus) {
      muiFormControl.onFocus(event);
    }
  };

  var handleBlur = function handleBlur(event) {
    if (onBlur) {
      onBlur(event);
    }

    if (muiFormControl && muiFormControl.onBlur) {
      muiFormControl.onBlur(event);
    }
  };

  var handleInputChange = function handleInputChange(event) {
    var newChecked = event.target.checked;
    setCheckedState(newChecked);

    if (onChange) {
      // TODO v5: remove the second argument.
      onChange(event, newChecked);
    }
  };

  var disabled = disabledProp;

  if (muiFormControl) {
    if (typeof disabled === 'undefined') {
      disabled = muiFormControl.disabled;
    }
  }

  var hasLabelFor = type === 'checkbox' || type === 'radio';
  return /*#__PURE__*/react.createElement(IconButton$1, _extends$2({
    component: "span",
    className: clsx(classes.root, className, checked && classes.checked, disabled && classes.disabled),
    disabled: disabled,
    tabIndex: null,
    role: undefined,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ref: ref
  }, other), /*#__PURE__*/react.createElement("input", _extends$2({
    autoFocus: autoFocus,
    checked: checkedProp,
    defaultChecked: defaultChecked,
    className: classes.input,
    disabled: disabled,
    id: hasLabelFor && id,
    name: name,
    onChange: handleInputChange,
    readOnly: readOnly,
    ref: inputRef,
    required: required,
    tabIndex: tabIndex,
    type: type,
    value: value
  }, inputProps)), checked ? checkedIcon : icon);
}); // NB: If changed, please update Checkbox, Switch and Radio
var SwitchBase$1 = withStyles(styles$4, {
  name: 'PrivateSwitchBase'
})(SwitchBase);

/**
 * @ignore - internal component.
 */

var CheckBoxOutlineBlankIcon = createSvgIcon$1( /*#__PURE__*/react.createElement("path", {
  d: "M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
}));

/**
 * @ignore - internal component.
 */

var CheckBoxIcon = createSvgIcon$1( /*#__PURE__*/react.createElement("path", {
  d: "M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
}));

/**
 * @ignore - internal component.
 */

var IndeterminateCheckBoxIcon = createSvgIcon$1( /*#__PURE__*/react.createElement("path", {
  d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"
}));

var styles$5 = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      color: theme.palette.text.secondary
    },

    /* Pseudo-class applied to the root element if `checked={true}`. */
    checked: {},

    /* Pseudo-class applied to the root element if `disabled={true}`. */
    disabled: {},

    /* Pseudo-class applied to the root element if `indeterminate={true}`. */
    indeterminate: {},

    /* Styles applied to the root element if `color="primary"`. */
    colorPrimary: {
      '&$checked': {
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: 'transparent'
          }
        }
      },
      '&$disabled': {
        color: theme.palette.action.disabled
      }
    },

    /* Styles applied to the root element if `color="secondary"`. */
    colorSecondary: {
      '&$checked': {
        color: theme.palette.secondary.main,
        '&:hover': {
          backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
          // Reset on touch devices, it doesn't add specificity
          '@media (hover: none)': {
            backgroundColor: 'transparent'
          }
        }
      },
      '&$disabled': {
        color: theme.palette.action.disabled
      }
    }
  };
};
var defaultCheckedIcon = /*#__PURE__*/react.createElement(CheckBoxIcon, null);
var defaultIcon = /*#__PURE__*/react.createElement(CheckBoxOutlineBlankIcon, null);
var defaultIndeterminateIcon = /*#__PURE__*/react.createElement(IndeterminateCheckBoxIcon, null);
var Checkbox = /*#__PURE__*/react.forwardRef(function Checkbox(props, ref) {
  var _props$checkedIcon = props.checkedIcon,
      checkedIcon = _props$checkedIcon === void 0 ? defaultCheckedIcon : _props$checkedIcon,
      classes = props.classes,
      _props$color = props.color,
      color = _props$color === void 0 ? 'secondary' : _props$color,
      _props$icon = props.icon,
      iconProp = _props$icon === void 0 ? defaultIcon : _props$icon,
      _props$indeterminate = props.indeterminate,
      indeterminate = _props$indeterminate === void 0 ? false : _props$indeterminate,
      _props$indeterminateI = props.indeterminateIcon,
      indeterminateIconProp = _props$indeterminateI === void 0 ? defaultIndeterminateIcon : _props$indeterminateI,
      inputProps = props.inputProps,
      _props$size = props.size,
      size = _props$size === void 0 ? 'medium' : _props$size,
      other = _objectWithoutProperties$1(props, ["checkedIcon", "classes", "color", "icon", "indeterminate", "indeterminateIcon", "inputProps", "size"]);

  var icon = indeterminate ? indeterminateIconProp : iconProp;
  var indeterminateIcon = indeterminate ? indeterminateIconProp : checkedIcon;
  return /*#__PURE__*/react.createElement(SwitchBase$1, _extends$2({
    type: "checkbox",
    classes: {
      root: clsx(classes.root, classes["color".concat(capitalize(color))], indeterminate && classes.indeterminate),
      checked: classes.checked,
      disabled: classes.disabled
    },
    color: color,
    inputProps: _extends$2({
      'data-indeterminate': indeterminate
    }, inputProps),
    icon: /*#__PURE__*/react.cloneElement(icon, {
      fontSize: icon.props.fontSize === undefined && size === "small" ? size : icon.props.fontSize
    }),
    checkedIcon: /*#__PURE__*/react.cloneElement(indeterminateIcon, {
      fontSize: indeterminateIcon.props.fontSize === undefined && size === "small" ? size : indeterminateIcon.props.fontSize
    }),
    ref: ref
  }, other));
});
var Checkbox$1 = withStyles(styles$5, {
  name: 'MuiCheckbox'
})(Checkbox);

/**
 * @ignore - internal component.
 */

var CancelIcon = createSvgIcon$1( /*#__PURE__*/react.createElement("path", {
  d: "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
}));

var styles$6 = function styles(theme) {
  var backgroundColor = theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700];
  var deleteIconColor = alpha(theme.palette.text.primary, 0.26);
  return {
    /* Styles applied to the root element. */
    root: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(13),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 32,
      color: theme.palette.getContrastText(backgroundColor),
      backgroundColor: backgroundColor,
      borderRadius: 32 / 2,
      whiteSpace: 'nowrap',
      transition: theme.transitions.create(['background-color', 'box-shadow']),
      // label will inherit this from root, then `clickable` class overrides this for both
      cursor: 'default',
      // We disable the focus ring for mouse, touch and keyboard users.
      outline: 0,
      textDecoration: 'none',
      border: 'none',
      // Remove `button` border
      padding: 0,
      // Remove `button` padding
      verticalAlign: 'middle',
      boxSizing: 'border-box',
      '&$disabled': {
        opacity: 0.5,
        pointerEvents: 'none'
      },
      '& $avatar': {
        marginLeft: 5,
        marginRight: -6,
        width: 24,
        height: 24,
        color: theme.palette.type === 'light' ? theme.palette.grey[700] : theme.palette.grey[300],
        fontSize: theme.typography.pxToRem(12)
      },
      '& $avatarColorPrimary': {
        color: theme.palette.primary.contrastText,
        backgroundColor: theme.palette.primary.dark
      },
      '& $avatarColorSecondary': {
        color: theme.palette.secondary.contrastText,
        backgroundColor: theme.palette.secondary.dark
      },
      '& $avatarSmall': {
        marginLeft: 4,
        marginRight: -4,
        width: 18,
        height: 18,
        fontSize: theme.typography.pxToRem(10)
      }
    },

    /* Styles applied to the root element if `size="small"`. */
    sizeSmall: {
      height: 24
    },

    /* Styles applied to the root element if `color="primary"`. */
    colorPrimary: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    },

    /* Styles applied to the root element if `color="secondary"`. */
    colorSecondary: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText
    },

    /* Pseudo-class applied to the root element if `disabled={true}`. */
    disabled: {},

    /* Styles applied to the root element if `onClick` is defined or `clickable={true}`. */
    clickable: {
      userSelect: 'none',
      WebkitTapHighlightColor: 'transparent',
      cursor: 'pointer',
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.08)
      },
      '&:active': {
        boxShadow: theme.shadows[1]
      }
    },

    /* Styles applied to the root element if `onClick` and `color="primary"` is defined or `clickable={true}`. */
    clickableColorPrimary: {
      '&:hover, &:focus': {
        backgroundColor: emphasize(theme.palette.primary.main, 0.08)
      }
    },

    /* Styles applied to the root element if `onClick` and `color="secondary"` is defined or `clickable={true}`. */
    clickableColorSecondary: {
      '&:hover, &:focus': {
        backgroundColor: emphasize(theme.palette.secondary.main, 0.08)
      }
    },

    /* Styles applied to the root element if `onDelete` is defined. */
    deletable: {
      '&:focus': {
        backgroundColor: emphasize(backgroundColor, 0.08)
      }
    },

    /* Styles applied to the root element if `onDelete` and `color="primary"` is defined. */
    deletableColorPrimary: {
      '&:focus': {
        backgroundColor: emphasize(theme.palette.primary.main, 0.2)
      }
    },

    /* Styles applied to the root element if `onDelete` and `color="secondary"` is defined. */
    deletableColorSecondary: {
      '&:focus': {
        backgroundColor: emphasize(theme.palette.secondary.main, 0.2)
      }
    },

    /* Styles applied to the root element if `variant="outlined"`. */
    outlined: {
      backgroundColor: 'transparent',
      border: "1px solid ".concat(theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'),
      '$clickable&:hover, $clickable&:focus, $deletable&:focus': {
        backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity)
      },
      '& $avatar': {
        marginLeft: 4
      },
      '& $avatarSmall': {
        marginLeft: 2
      },
      '& $icon': {
        marginLeft: 4
      },
      '& $iconSmall': {
        marginLeft: 2
      },
      '& $deleteIcon': {
        marginRight: 5
      },
      '& $deleteIconSmall': {
        marginRight: 3
      }
    },

    /* Styles applied to the root element if `variant="outlined"` and `color="primary"`. */
    outlinedPrimary: {
      color: theme.palette.primary.main,
      border: "1px solid ".concat(theme.palette.primary.main),
      '$clickable&:hover, $clickable&:focus, $deletable&:focus': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
      }
    },

    /* Styles applied to the root element if `variant="outlined"` and `color="secondary"`. */
    outlinedSecondary: {
      color: theme.palette.secondary.main,
      border: "1px solid ".concat(theme.palette.secondary.main),
      '$clickable&:hover, $clickable&:focus, $deletable&:focus': {
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity)
      }
    },
    // TODO v5: remove

    /* Styles applied to the `avatar` element. */
    avatar: {},

    /* Styles applied to the `avatar` element if `size="small"`. */
    avatarSmall: {},

    /* Styles applied to the `avatar` element if `color="primary"`. */
    avatarColorPrimary: {},

    /* Styles applied to the `avatar` element if `color="secondary"`. */
    avatarColorSecondary: {},

    /* Styles applied to the `icon` element. */
    icon: {
      color: theme.palette.type === 'light' ? theme.palette.grey[700] : theme.palette.grey[300],
      marginLeft: 5,
      marginRight: -6
    },

    /* Styles applied to the `icon` element if `size="small"`. */
    iconSmall: {
      width: 18,
      height: 18,
      marginLeft: 4,
      marginRight: -4
    },

    /* Styles applied to the `icon` element if `color="primary"`. */
    iconColorPrimary: {
      color: 'inherit'
    },

    /* Styles applied to the `icon` element if `color="secondary"`. */
    iconColorSecondary: {
      color: 'inherit'
    },

    /* Styles applied to the label `span` element. */
    label: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      paddingLeft: 12,
      paddingRight: 12,
      whiteSpace: 'nowrap'
    },

    /* Styles applied to the label `span` element if `size="small"`. */
    labelSmall: {
      paddingLeft: 8,
      paddingRight: 8
    },

    /* Styles applied to the `deleteIcon` element. */
    deleteIcon: {
      WebkitTapHighlightColor: 'transparent',
      color: deleteIconColor,
      height: 22,
      width: 22,
      cursor: 'pointer',
      margin: '0 5px 0 -6px',
      '&:hover': {
        color: alpha(deleteIconColor, 0.4)
      }
    },

    /* Styles applied to the `deleteIcon` element if `size="small"`. */
    deleteIconSmall: {
      height: 16,
      width: 16,
      marginRight: 4,
      marginLeft: -4
    },

    /* Styles applied to the deleteIcon element if `color="primary"` and `variant="default"`. */
    deleteIconColorPrimary: {
      color: alpha(theme.palette.primary.contrastText, 0.7),
      '&:hover, &:active': {
        color: theme.palette.primary.contrastText
      }
    },

    /* Styles applied to the deleteIcon element if `color="secondary"` and `variant="default"`. */
    deleteIconColorSecondary: {
      color: alpha(theme.palette.secondary.contrastText, 0.7),
      '&:hover, &:active': {
        color: theme.palette.secondary.contrastText
      }
    },

    /* Styles applied to the deleteIcon element if `color="primary"` and `variant="outlined"`. */
    deleteIconOutlinedColorPrimary: {
      color: alpha(theme.palette.primary.main, 0.7),
      '&:hover, &:active': {
        color: theme.palette.primary.main
      }
    },

    /* Styles applied to the deleteIcon element if `color="secondary"` and `variant="outlined"`. */
    deleteIconOutlinedColorSecondary: {
      color: alpha(theme.palette.secondary.main, 0.7),
      '&:hover, &:active': {
        color: theme.palette.secondary.main
      }
    }
  };
};

function isDeleteKeyboardEvent(keyboardEvent) {
  return keyboardEvent.key === 'Backspace' || keyboardEvent.key === 'Delete';
}
/**
 * Chips represent complex entities in small blocks, such as a contact.
 */


var Chip = /*#__PURE__*/react.forwardRef(function Chip(props, ref) {
  var avatarProp = props.avatar,
      classes = props.classes,
      className = props.className,
      clickableProp = props.clickable,
      _props$color = props.color,
      color = _props$color === void 0 ? 'default' : _props$color,
      ComponentProp = props.component,
      deleteIconProp = props.deleteIcon,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      iconProp = props.icon,
      label = props.label,
      onClick = props.onClick,
      onDelete = props.onDelete,
      onKeyDown = props.onKeyDown,
      onKeyUp = props.onKeyUp,
      _props$size = props.size,
      size = _props$size === void 0 ? 'medium' : _props$size,
      _props$variant = props.variant,
      variant = _props$variant === void 0 ? 'default' : _props$variant,
      other = _objectWithoutProperties$1(props, ["avatar", "classes", "className", "clickable", "color", "component", "deleteIcon", "disabled", "icon", "label", "onClick", "onDelete", "onKeyDown", "onKeyUp", "size", "variant"]);

  var chipRef = react.useRef(null);
  var handleRef = useForkRef(chipRef, ref);

  var handleDeleteIconClick = function handleDeleteIconClick(event) {
    // Stop the event from bubbling up to the `Chip`
    event.stopPropagation();

    if (onDelete) {
      onDelete(event);
    }
  };

  var handleKeyDown = function handleKeyDown(event) {
    // Ignore events from children of `Chip`.
    if (event.currentTarget === event.target && isDeleteKeyboardEvent(event)) {
      // will be handled in keyUp, otherwise some browsers
      // might init navigation
      event.preventDefault();
    }

    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  var handleKeyUp = function handleKeyUp(event) {
    // Ignore events from children of `Chip`.
    if (event.currentTarget === event.target) {
      if (onDelete && isDeleteKeyboardEvent(event)) {
        onDelete(event);
      } else if (event.key === 'Escape' && chipRef.current) {
        chipRef.current.blur();
      }
    }

    if (onKeyUp) {
      onKeyUp(event);
    }
  };

  var clickable = clickableProp !== false && onClick ? true : clickableProp;
  var small = size === 'small';
  var Component = ComponentProp || (clickable ? ButtonBase : 'div');
  var moreProps = Component === ButtonBase ? {
    component: 'div'
  } : {};
  var deleteIcon = null;

  if (onDelete) {
    var customClasses = clsx(color !== 'default' && (variant === "default" ? classes["deleteIconColor".concat(capitalize(color))] : classes["deleteIconOutlinedColor".concat(capitalize(color))]), small && classes.deleteIconSmall);
    deleteIcon = deleteIconProp && /*#__PURE__*/react.isValidElement(deleteIconProp) ? /*#__PURE__*/react.cloneElement(deleteIconProp, {
      className: clsx(deleteIconProp.props.className, classes.deleteIcon, customClasses),
      onClick: handleDeleteIconClick
    }) : /*#__PURE__*/react.createElement(CancelIcon, {
      className: clsx(classes.deleteIcon, customClasses),
      onClick: handleDeleteIconClick
    });
  }

  var avatar = null;

  if (avatarProp && /*#__PURE__*/react.isValidElement(avatarProp)) {
    avatar = /*#__PURE__*/react.cloneElement(avatarProp, {
      className: clsx(classes.avatar, avatarProp.props.className, small && classes.avatarSmall, color !== 'default' && classes["avatarColor".concat(capitalize(color))])
    });
  }

  var icon = null;

  if (iconProp && /*#__PURE__*/react.isValidElement(iconProp)) {
    icon = /*#__PURE__*/react.cloneElement(iconProp, {
      className: clsx(classes.icon, iconProp.props.className, small && classes.iconSmall, color !== 'default' && classes["iconColor".concat(capitalize(color))])
    });
  }

  return /*#__PURE__*/react.createElement(Component, _extends$2({
    role: clickable || onDelete ? 'button' : undefined,
    className: clsx(classes.root, className, color !== 'default' && [classes["color".concat(capitalize(color))], clickable && classes["clickableColor".concat(capitalize(color))], onDelete && classes["deletableColor".concat(capitalize(color))]], variant !== "default" && [classes.outlined, {
      'primary': classes.outlinedPrimary,
      'secondary': classes.outlinedSecondary
    }[color]], disabled && classes.disabled, small && classes.sizeSmall, clickable && classes.clickable, onDelete && classes.deletable),
    "aria-disabled": disabled ? true : undefined,
    tabIndex: clickable || onDelete ? 0 : undefined,
    onClick: onClick,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    ref: handleRef
  }, moreProps, other), avatar || icon, /*#__PURE__*/react.createElement("span", {
    className: clsx(classes.label, small && classes.labelSmall)
  }, label), deleteIcon);
});
var Chip$1 = withStyles(styles$6, {
  name: 'MuiChip'
})(Chip);

var styles$7 = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: _extends$2({}, theme.typography.button, {
      boxSizing: 'border-box',
      minWidth: 64,
      padding: '6px 16px',
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.text.primary,
      transition: theme.transitions.create(['background-color', 'box-shadow', 'border'], {
        duration: theme.transitions.duration.short
      }),
      '&:hover': {
        textDecoration: 'none',
        backgroundColor: alpha(theme.palette.text.primary, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        },
        '&$disabled': {
          backgroundColor: 'transparent'
        }
      },
      '&$disabled': {
        color: theme.palette.action.disabled
      }
    }),

    /* Styles applied to the span element that wraps the children. */
    label: {
      width: '100%',
      // Ensure the correct width for iOS Safari
      display: 'inherit',
      alignItems: 'inherit',
      justifyContent: 'inherit'
    },

    /* Styles applied to the root element if `variant="text"`. */
    text: {
      padding: '6px 8px'
    },

    /* Styles applied to the root element if `variant="text"` and `color="primary"`. */
    textPrimary: {
      color: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    },

    /* Styles applied to the root element if `variant="text"` and `color="secondary"`. */
    textSecondary: {
      color: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    },

    /* Styles applied to the root element if `variant="outlined"`. */
    outlined: {
      padding: '5px 15px',
      border: "1px solid ".concat(theme.palette.type === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)'),
      '&$disabled': {
        border: "1px solid ".concat(theme.palette.action.disabledBackground)
      }
    },

    /* Styles applied to the root element if `variant="outlined"` and `color="primary"`. */
    outlinedPrimary: {
      color: theme.palette.primary.main,
      border: "1px solid ".concat(alpha(theme.palette.primary.main, 0.5)),
      '&:hover': {
        border: "1px solid ".concat(theme.palette.primary.main),
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      }
    },

    /* Styles applied to the root element if `variant="outlined"` and `color="secondary"`. */
    outlinedSecondary: {
      color: theme.palette.secondary.main,
      border: "1px solid ".concat(alpha(theme.palette.secondary.main, 0.5)),
      '&:hover': {
        border: "1px solid ".concat(theme.palette.secondary.main),
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: 'transparent'
        }
      },
      '&$disabled': {
        border: "1px solid ".concat(theme.palette.action.disabled)
      }
    },

    /* Styles applied to the root element if `variant="contained"`. */
    contained: {
      color: theme.palette.getContrastText(theme.palette.grey[300]),
      backgroundColor: theme.palette.grey[300],
      boxShadow: theme.shadows[2],
      '&:hover': {
        backgroundColor: theme.palette.grey.A100,
        boxShadow: theme.shadows[4],
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          boxShadow: theme.shadows[2],
          backgroundColor: theme.palette.grey[300]
        },
        '&$disabled': {
          backgroundColor: theme.palette.action.disabledBackground
        }
      },
      '&$focusVisible': {
        boxShadow: theme.shadows[6]
      },
      '&:active': {
        boxShadow: theme.shadows[8]
      },
      '&$disabled': {
        color: theme.palette.action.disabled,
        boxShadow: theme.shadows[0],
        backgroundColor: theme.palette.action.disabledBackground
      }
    },

    /* Styles applied to the root element if `variant="contained"` and `color="primary"`. */
    containedPrimary: {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: theme.palette.primary.main
        }
      }
    },

    /* Styles applied to the root element if `variant="contained"` and `color="secondary"`. */
    containedSecondary: {
      color: theme.palette.secondary.contrastText,
      backgroundColor: theme.palette.secondary.main,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: theme.palette.secondary.main
        }
      }
    },

    /* Styles applied to the root element if `disableElevation={true}`. */
    disableElevation: {
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none'
      },
      '&$focusVisible': {
        boxShadow: 'none'
      },
      '&:active': {
        boxShadow: 'none'
      },
      '&$disabled': {
        boxShadow: 'none'
      }
    },

    /* Pseudo-class applied to the ButtonBase root element if the button is keyboard focused. */
    focusVisible: {},

    /* Pseudo-class applied to the root element if `disabled={true}`. */
    disabled: {},

    /* Styles applied to the root element if `color="inherit"`. */
    colorInherit: {
      color: 'inherit',
      borderColor: 'currentColor'
    },

    /* Styles applied to the root element if `size="small"` and `variant="text"`. */
    textSizeSmall: {
      padding: '4px 5px',
      fontSize: theme.typography.pxToRem(13)
    },

    /* Styles applied to the root element if `size="large"` and `variant="text"`. */
    textSizeLarge: {
      padding: '8px 11px',
      fontSize: theme.typography.pxToRem(15)
    },

    /* Styles applied to the root element if `size="small"` and `variant="outlined"`. */
    outlinedSizeSmall: {
      padding: '3px 9px',
      fontSize: theme.typography.pxToRem(13)
    },

    /* Styles applied to the root element if `size="large"` and `variant="outlined"`. */
    outlinedSizeLarge: {
      padding: '7px 21px',
      fontSize: theme.typography.pxToRem(15)
    },

    /* Styles applied to the root element if `size="small"` and `variant="contained"`. */
    containedSizeSmall: {
      padding: '4px 10px',
      fontSize: theme.typography.pxToRem(13)
    },

    /* Styles applied to the root element if `size="large"` and `variant="contained"`. */
    containedSizeLarge: {
      padding: '8px 22px',
      fontSize: theme.typography.pxToRem(15)
    },

    /* Styles applied to the root element if `size="small"`. */
    sizeSmall: {},

    /* Styles applied to the root element if `size="large"`. */
    sizeLarge: {},

    /* Styles applied to the root element if `fullWidth={true}`. */
    fullWidth: {
      width: '100%'
    },

    /* Styles applied to the startIcon element if supplied. */
    startIcon: {
      display: 'inherit',
      marginRight: 8,
      marginLeft: -4,
      '&$iconSizeSmall': {
        marginLeft: -2
      }
    },

    /* Styles applied to the endIcon element if supplied. */
    endIcon: {
      display: 'inherit',
      marginRight: -4,
      marginLeft: 8,
      '&$iconSizeSmall': {
        marginRight: -2
      }
    },

    /* Styles applied to the icon element if supplied and `size="small"`. */
    iconSizeSmall: {
      '& > *:first-child': {
        fontSize: 18
      }
    },

    /* Styles applied to the icon element if supplied and `size="medium"`. */
    iconSizeMedium: {
      '& > *:first-child': {
        fontSize: 20
      }
    },

    /* Styles applied to the icon element if supplied and `size="large"`. */
    iconSizeLarge: {
      '& > *:first-child': {
        fontSize: 22
      }
    }
  };
};
var Button = /*#__PURE__*/react.forwardRef(function Button(props, ref) {
  var children = props.children,
      classes = props.classes,
      className = props.className,
      _props$color = props.color,
      color = _props$color === void 0 ? 'default' : _props$color,
      _props$component = props.component,
      component = _props$component === void 0 ? 'button' : _props$component,
      _props$disabled = props.disabled,
      disabled = _props$disabled === void 0 ? false : _props$disabled,
      _props$disableElevati = props.disableElevation,
      disableElevation = _props$disableElevati === void 0 ? false : _props$disableElevati,
      _props$disableFocusRi = props.disableFocusRipple,
      disableFocusRipple = _props$disableFocusRi === void 0 ? false : _props$disableFocusRi,
      endIconProp = props.endIcon,
      focusVisibleClassName = props.focusVisibleClassName,
      _props$fullWidth = props.fullWidth,
      fullWidth = _props$fullWidth === void 0 ? false : _props$fullWidth,
      _props$size = props.size,
      size = _props$size === void 0 ? 'medium' : _props$size,
      startIconProp = props.startIcon,
      _props$type = props.type,
      type = _props$type === void 0 ? 'button' : _props$type,
      _props$variant = props.variant,
      variant = _props$variant === void 0 ? 'text' : _props$variant,
      other = _objectWithoutProperties$1(props, ["children", "classes", "className", "color", "component", "disabled", "disableElevation", "disableFocusRipple", "endIcon", "focusVisibleClassName", "fullWidth", "size", "startIcon", "type", "variant"]);

  var startIcon = startIconProp && /*#__PURE__*/react.createElement("span", {
    className: clsx(classes.startIcon, classes["iconSize".concat(capitalize(size))])
  }, startIconProp);
  var endIcon = endIconProp && /*#__PURE__*/react.createElement("span", {
    className: clsx(classes.endIcon, classes["iconSize".concat(capitalize(size))])
  }, endIconProp);
  return /*#__PURE__*/react.createElement(ButtonBase, _extends$2({
    className: clsx(classes.root, classes[variant], className, color === 'inherit' ? classes.colorInherit : color !== 'default' && classes["".concat(variant).concat(capitalize(color))], size !== 'medium' && [classes["".concat(variant, "Size").concat(capitalize(size))], classes["size".concat(capitalize(size))]], disableElevation && classes.disableElevation, disabled && classes.disabled, fullWidth && classes.fullWidth),
    component: component,
    disabled: disabled,
    focusRipple: !disableFocusRipple,
    focusVisibleClassName: clsx(classes.focusVisible, focusVisibleClassName),
    ref: ref,
    type: type
  }, other), /*#__PURE__*/react.createElement("span", {
    className: classes.label
  }, startIcon, children, endIcon));
});
var Button$1 = withStyles(styles$7, {
  name: 'MuiButton'
})(Button);

var ChevronLeft = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(createSvgIcon);

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/React.createElement("path", {
  d: "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
}), 'ChevronLeft');

exports.default = _default;
});

var ChevronLeft$1 = /*@__PURE__*/getDefaultExportFromCjs(ChevronLeft);

var ChevronRight = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(createSvgIcon);

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/React.createElement("path", {
  d: "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"
}), 'ChevronRight');

exports.default = _default;
});

var ChevronRight$1 = /*@__PURE__*/getDefaultExportFromCjs(ChevronRight);

/**
 * @ignore - internal component.
 */

var ArrowDownwardIcon = createSvgIcon$1( /*#__PURE__*/react.createElement("path", {
  d: "M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"
}));

var styles$8 = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      cursor: 'pointer',
      display: 'inline-flex',
      justifyContent: 'flex-start',
      flexDirection: 'inherit',
      alignItems: 'center',
      '&:focus': {
        color: theme.palette.text.secondary
      },
      '&:hover': {
        color: theme.palette.text.secondary,
        '& $icon': {
          opacity: 0.5
        }
      },
      '&$active': {
        color: theme.palette.text.primary,
        // && instead of & is a workaround for https://github.com/cssinjs/jss/issues/1045
        '&& $icon': {
          opacity: 1,
          color: theme.palette.text.secondary
        }
      }
    },

    /* Pseudo-class applied to the root element if `active={true}`. */
    active: {},

    /* Styles applied to the icon component. */
    icon: {
      fontSize: 18,
      marginRight: 4,
      marginLeft: 4,
      opacity: 0,
      transition: theme.transitions.create(['opacity', 'transform'], {
        duration: theme.transitions.duration.shorter
      }),
      userSelect: 'none'
    },

    /* Styles applied to the icon component if `direction="desc"`. */
    iconDirectionDesc: {
      transform: 'rotate(0deg)'
    },

    /* Styles applied to the icon component if `direction="asc"`. */
    iconDirectionAsc: {
      transform: 'rotate(180deg)'
    }
  };
};
/**
 * A button based label for placing inside `TableCell` for column sorting.
 */

var TableSortLabel = /*#__PURE__*/react.forwardRef(function TableSortLabel(props, ref) {
  var _props$active = props.active,
      active = _props$active === void 0 ? false : _props$active,
      children = props.children,
      classes = props.classes,
      className = props.className,
      _props$direction = props.direction,
      direction = _props$direction === void 0 ? 'asc' : _props$direction,
      _props$hideSortIcon = props.hideSortIcon,
      hideSortIcon = _props$hideSortIcon === void 0 ? false : _props$hideSortIcon,
      _props$IconComponent = props.IconComponent,
      IconComponent = _props$IconComponent === void 0 ? ArrowDownwardIcon : _props$IconComponent,
      other = _objectWithoutProperties$1(props, ["active", "children", "classes", "className", "direction", "hideSortIcon", "IconComponent"]);

  return /*#__PURE__*/react.createElement(ButtonBase, _extends$2({
    className: clsx(classes.root, className, active && classes.active),
    component: "span",
    disableRipple: true,
    ref: ref
  }, other), children, hideSortIcon && !active ? null : /*#__PURE__*/react.createElement(IconComponent, {
    className: clsx(classes.icon, classes["iconDirection".concat(capitalize(direction))])
  }));
});
var TableSortLabel$1 = withStyles(styles$8, {
  name: 'MuiTableSortLabel'
})(TableSortLabel);

/**
 * @ignore - internal component.
 */

var TableContext = react.createContext();

/**
 * @ignore - internal component.
 */

var Tablelvl2Context = react.createContext();

var styles$9 = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: _extends$2({}, theme.typography.body2, {
      display: 'table-cell',
      verticalAlign: 'inherit',
      // Workaround for a rendering bug with spanned columns in Chrome 62.0.
      // Removes the alpha (sets it to 1), and lightens or darkens the theme color.
      borderBottom: "1px solid\n    ".concat(theme.palette.type === 'light' ? lighten(alpha(theme.palette.divider, 1), 0.88) : darken(alpha(theme.palette.divider, 1), 0.68)),
      textAlign: 'left',
      padding: 16
    }),

    /* Styles applied to the root element if `variant="head"` or `context.table.head`. */
    head: {
      color: theme.palette.text.primary,
      lineHeight: theme.typography.pxToRem(24),
      fontWeight: theme.typography.fontWeightMedium
    },

    /* Styles applied to the root element if `variant="body"` or `context.table.body`. */
    body: {
      color: theme.palette.text.primary
    },

    /* Styles applied to the root element if `variant="footer"` or `context.table.footer`. */
    footer: {
      color: theme.palette.text.secondary,
      lineHeight: theme.typography.pxToRem(21),
      fontSize: theme.typography.pxToRem(12)
    },

    /* Styles applied to the root element if `size="small"`. */
    sizeSmall: {
      padding: '6px 24px 6px 16px',
      '&:last-child': {
        paddingRight: 16
      },
      '&$paddingCheckbox': {
        width: 24,
        // prevent the checkbox column from growing
        padding: '0 12px 0 16px',
        '&:last-child': {
          paddingLeft: 12,
          paddingRight: 16
        },
        '& > *': {
          padding: 0
        }
      }
    },

    /* Styles applied to the root element if `padding="checkbox"`. */
    paddingCheckbox: {
      width: 48,
      // prevent the checkbox column from growing
      padding: '0 0 0 4px',
      '&:last-child': {
        paddingLeft: 0,
        paddingRight: 4
      }
    },

    /* Styles applied to the root element if `padding="none"`. */
    paddingNone: {
      padding: 0,
      '&:last-child': {
        padding: 0
      }
    },

    /* Styles applied to the root element if `align="left"`. */
    alignLeft: {
      textAlign: 'left'
    },

    /* Styles applied to the root element if `align="center"`. */
    alignCenter: {
      textAlign: 'center'
    },

    /* Styles applied to the root element if `align="right"`. */
    alignRight: {
      textAlign: 'right',
      flexDirection: 'row-reverse'
    },

    /* Styles applied to the root element if `align="justify"`. */
    alignJustify: {
      textAlign: 'justify'
    },

    /* Styles applied to the root element if `context.table.stickyHeader={true}`. */
    stickyHeader: {
      position: 'sticky',
      top: 0,
      left: 0,
      zIndex: 2,
      backgroundColor: theme.palette.background.default
    }
  };
};
/**
 * The component renders a `<th>` element when the parent context is a header
 * or otherwise a `<td>` element.
 */

var TableCell = /*#__PURE__*/react.forwardRef(function TableCell(props, ref) {
  var _props$align = props.align,
      align = _props$align === void 0 ? 'inherit' : _props$align,
      classes = props.classes,
      className = props.className,
      component = props.component,
      paddingProp = props.padding,
      scopeProp = props.scope,
      sizeProp = props.size,
      sortDirection = props.sortDirection,
      variantProp = props.variant,
      other = _objectWithoutProperties$1(props, ["align", "classes", "className", "component", "padding", "scope", "size", "sortDirection", "variant"]);

  var table = react.useContext(TableContext);
  var tablelvl2 = react.useContext(Tablelvl2Context);
  var isHeadCell = tablelvl2 && tablelvl2.variant === 'head';
  var role;
  var Component;

  if (component) {
    Component = component;
    role = isHeadCell ? 'columnheader' : 'cell';
  } else {
    Component = isHeadCell ? 'th' : 'td';
  }

  var scope = scopeProp;

  if (!scope && isHeadCell) {
    scope = 'col';
  }

  var padding = paddingProp || (table && table.padding ? table.padding : 'normal');
  var size = sizeProp || (table && table.size ? table.size : 'medium');
  var variant = variantProp || tablelvl2 && tablelvl2.variant;
  var ariaSort = null;

  if (sortDirection) {
    ariaSort = sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  return /*#__PURE__*/react.createElement(Component, _extends$2({
    ref: ref,
    className: clsx(classes.root, classes[variant], className, align !== 'inherit' && classes["align".concat(capitalize(align))], padding !== 'normal' && classes["padding".concat(capitalize(padding))], size !== 'medium' && classes["size".concat(capitalize(size))], variant === 'head' && table && table.stickyHeader && classes.stickyHeader),
    "aria-sort": ariaSort,
    role: role,
    scope: scope
  }, other));
});
var TableCell$1 = withStyles(styles$9, {
  name: 'MuiTableCell'
})(TableCell);

var ExpandMore = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(createSvgIcon);

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/React.createElement("path", {
  d: "M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"
}), 'ExpandMore');

exports.default = _default;
});

var ExpandMore$1 = /*@__PURE__*/getDefaultExportFromCjs(ExpandMore);

var ExpandLess = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(createSvgIcon);

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/React.createElement("path", {
  d: "M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"
}), 'ExpandLess');

exports.default = _default;
});

var ExpandLess$1 = /*@__PURE__*/getDefaultExportFromCjs(ExpandLess);

var styles$a = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      color: 'inherit',
      display: 'table-row',
      verticalAlign: 'middle',
      // We disable the focus ring for mouse, touch and keyboard users.
      outline: 0,
      '&$hover:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '&$selected, &$selected:hover': {
        backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.selectedOpacity)
      }
    },

    /* Pseudo-class applied to the root element if `selected={true}`. */
    selected: {},

    /* Pseudo-class applied to the root element if `hover={true}`. */
    hover: {},

    /* Styles applied to the root element if table variant="head". */
    head: {},

    /* Styles applied to the root element if table variant="footer". */
    footer: {}
  };
};
var defaultComponent = 'tr';
/**
 * Will automatically set dynamic row height
 * based on the material table element parent (head, body, etc).
 */

var TableRow = /*#__PURE__*/react.forwardRef(function TableRow(props, ref) {
  var classes = props.classes,
      className = props.className,
      _props$component = props.component,
      Component = _props$component === void 0 ? defaultComponent : _props$component,
      _props$hover = props.hover,
      hover = _props$hover === void 0 ? false : _props$hover,
      _props$selected = props.selected,
      selected = _props$selected === void 0 ? false : _props$selected,
      other = _objectWithoutProperties$1(props, ["classes", "className", "component", "hover", "selected"]);

  var tablelvl2 = react.useContext(Tablelvl2Context);
  return /*#__PURE__*/react.createElement(Component, _extends$2({
    ref: ref,
    className: clsx(classes.root, className, tablelvl2 && {
      'head': classes.head,
      'footer': classes.footer
    }[tablelvl2.variant], hover && classes.hover, selected && classes.selected),
    role: Component === defaultComponent ? null : 'row'
  }, other));
});
var TableRowMUI = withStyles(styles$a, {
  name: 'MuiTableRow'
})(TableRow);

var styles$b = {
  /* Styles applied to the root element. */
  root: {
    display: 'table-row-group'
  }
};
var tablelvl2 = {
  variant: 'body'
};
var defaultComponent$1 = 'tbody';
var TableBody = /*#__PURE__*/react.forwardRef(function TableBody(props, ref) {
  var classes = props.classes,
      className = props.className,
      _props$component = props.component,
      Component = _props$component === void 0 ? defaultComponent$1 : _props$component,
      other = _objectWithoutProperties$1(props, ["classes", "className", "component"]);

  return /*#__PURE__*/react.createElement(Tablelvl2Context.Provider, {
    value: tablelvl2
  }, /*#__PURE__*/react.createElement(Component, _extends$2({
    className: clsx(classes.root, className),
    ref: ref,
    role: Component === defaultComponent$1 ? null : 'rowgroup'
  }, other)));
});
var TableBody$1 = withStyles(styles$b, {
  name: 'MuiTableBody'
})(TableBody);

var styles$c = {
  /* Styles applied to the root element. */
  root: {
    display: 'table-header-group'
  }
};
var tablelvl2$1 = {
  variant: 'head'
};
var defaultComponent$2 = 'thead';
var TableHead = /*#__PURE__*/react.forwardRef(function TableHead(props, ref) {
  var classes = props.classes,
      className = props.className,
      _props$component = props.component,
      Component = _props$component === void 0 ? defaultComponent$2 : _props$component,
      other = _objectWithoutProperties$1(props, ["classes", "className", "component"]);

  return /*#__PURE__*/react.createElement(Tablelvl2Context.Provider, {
    value: tablelvl2$1
  }, /*#__PURE__*/react.createElement(Component, _extends$2({
    className: clsx(classes.root, className),
    ref: ref,
    role: Component === defaultComponent$2 ? null : 'rowgroup'
  }, other)));
});
var TableHead$1 = withStyles(styles$c, {
  name: 'MuiTableHead'
})(TableHead);

var styles$d = {
  /* Styles applied to the root element. */
  root: {
    display: 'table-footer-group'
  }
};
var tablelvl2$2 = {
  variant: 'footer'
};
var defaultComponent$3 = 'tfoot';
var TableFooter = /*#__PURE__*/react.forwardRef(function TableFooter(props, ref) {
  var classes = props.classes,
      className = props.className,
      _props$component = props.component,
      Component = _props$component === void 0 ? defaultComponent$3 : _props$component,
      other = _objectWithoutProperties$1(props, ["classes", "className", "component"]);

  return /*#__PURE__*/react.createElement(Tablelvl2Context.Provider, {
    value: tablelvl2$2
  }, /*#__PURE__*/react.createElement(Component, _extends$2({
    className: clsx(classes.root, className),
    ref: ref,
    role: Component === defaultComponent$3 ? null : 'rowgroup'
  }, other)));
});
var TableFooter$1 = withStyles(styles$d, {
  name: 'MuiTableFooter'
})(TableFooter);

var styles$e = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      display: 'table',
      width: '100%',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      '& caption': _extends$2({}, theme.typography.body2, {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
        textAlign: 'left',
        captionSide: 'bottom'
      })
    },

    /* Styles applied to the root element if `stickyHeader={true}`. */
    stickyHeader: {
      borderCollapse: 'separate'
    }
  };
};
var defaultComponent$4 = 'table';
var Table = /*#__PURE__*/react.forwardRef(function Table(props, ref) {
  var classes = props.classes,
      className = props.className,
      _props$component = props.component,
      Component = _props$component === void 0 ? defaultComponent$4 : _props$component,
      _props$padding = props.padding,
      padding = _props$padding === void 0 ? 'normal' : _props$padding,
      _props$size = props.size,
      size = _props$size === void 0 ? 'medium' : _props$size,
      _props$stickyHeader = props.stickyHeader,
      stickyHeader = _props$stickyHeader === void 0 ? false : _props$stickyHeader,
      other = _objectWithoutProperties$1(props, ["classes", "className", "component", "padding", "size", "stickyHeader"]);

  var table = react.useMemo(function () {
    return {
      padding: padding,
      size: size,
      stickyHeader: stickyHeader
    };
  }, [padding, size, stickyHeader]);
  return /*#__PURE__*/react.createElement(TableContext.Provider, {
    value: table
  }, /*#__PURE__*/react.createElement(Component, _extends$2({
    role: Component === defaultComponent$4 ? null : 'table',
    ref: ref,
    className: clsx(classes.root, className, stickyHeader && classes.stickyHeader)
  }, other)));
});
var TableMUI = withStyles(styles$e, {
  name: 'MuiTable'
})(Table);

var styles$f = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      minWidth: 56,
      color: theme.palette.action.active,
      flexShrink: 0,
      display: 'inline-flex'
    },

    /* Styles applied to the root element when the parent `ListItem` uses `alignItems="flex-start"`. */
    alignItemsFlexStart: {
      marginTop: 8
    }
  };
};
/**
 * A simple wrapper to apply `List` styles to an `Icon` or `SvgIcon`.
 */

var ListItemIcon = /*#__PURE__*/react.forwardRef(function ListItemIcon(props, ref) {
  var classes = props.classes,
      className = props.className,
      other = _objectWithoutProperties$1(props, ["classes", "className"]);

  var context = react.useContext(ListContext);
  return /*#__PURE__*/react.createElement("div", _extends$2({
    className: clsx(classes.root, className, context.alignItems === 'flex-start' && classes.alignItemsFlexStart),
    ref: ref
  }, other));
});
var ListItemIcon$1 = withStyles(styles$f, {
  name: 'MuiListItemIcon'
})(ListItemIcon);

var Search = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(createSvgIcon);

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/React.createElement("path", {
  d: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
}), 'Search');

exports.default = _default;
});

var SearchIcon = /*@__PURE__*/getDefaultExportFromCjs(Search);

var List = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(createSvgIcon);

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/React.createElement("path", {
  d: "M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"
}), 'List');

exports.default = _default;
});

var List$1 = /*@__PURE__*/getDefaultExportFromCjs(List);

var styles$g = function styles(theme) {
  return {
    /* Styles applied to the root element. */
    root: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },

    /* Styles applied to the root element if `disableGutters={false}`. */
    gutters: _defineProperty$1({
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }, theme.breakpoints.up('sm'), {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }),

    /* Styles applied to the root element if `variant="regular"`. */
    regular: theme.mixins.toolbar,

    /* Styles applied to the root element if `variant="dense"`. */
    dense: {
      minHeight: 48
    }
  };
};
var Toolbar = /*#__PURE__*/react.forwardRef(function Toolbar(props, ref) {
  var classes = props.classes,
      className = props.className,
      _props$component = props.component,
      Component = _props$component === void 0 ? 'div' : _props$component,
      _props$disableGutters = props.disableGutters,
      disableGutters = _props$disableGutters === void 0 ? false : _props$disableGutters,
      _props$variant = props.variant,
      variant = _props$variant === void 0 ? 'regular' : _props$variant,
      other = _objectWithoutProperties$1(props, ["classes", "className", "component", "disableGutters", "variant"]);

  return /*#__PURE__*/react.createElement(Component, _extends$2({
    className: clsx(classes.root, classes[variant], className, !disableGutters && classes.gutters),
    ref: ref
  }, other));
});
var Toolbar$1 = withStyles(styles$g, {
  name: 'MuiToolbar'
})(Toolbar);

var styles$h = {
  /* Styles applied to the root element. */
  root: {
    display: 'flex',
    height: '0.01em',
    // Fix IE 11 flexbox alignment. To remove at some point.
    maxHeight: '2em',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  },

  /* Styles applied to the root element if `variant="filled"`. */
  filled: {
    '&$positionStart:not($hiddenLabel)': {
      marginTop: 16
    }
  },

  /* Styles applied to the root element if `position="start"`. */
  positionStart: {
    marginRight: 8
  },

  /* Styles applied to the root element if `position="end"`. */
  positionEnd: {
    marginLeft: 8
  },

  /* Styles applied to the root element if `disablePointerEvents=true`. */
  disablePointerEvents: {
    pointerEvents: 'none'
  },

  /* Styles applied if the adornment is used inside <FormControl hiddenLabel />. */
  hiddenLabel: {},

  /* Styles applied if the adornment is used inside <FormControl margin="dense" />. */
  marginDense: {}
};
var InputAdornment = /*#__PURE__*/react.forwardRef(function InputAdornment(props, ref) {
  var children = props.children,
      classes = props.classes,
      className = props.className,
      _props$component = props.component,
      Component = _props$component === void 0 ? 'div' : _props$component,
      _props$disablePointer = props.disablePointerEvents,
      disablePointerEvents = _props$disablePointer === void 0 ? false : _props$disablePointer,
      _props$disableTypogra = props.disableTypography,
      disableTypography = _props$disableTypogra === void 0 ? false : _props$disableTypogra,
      position = props.position,
      variantProp = props.variant,
      other = _objectWithoutProperties$1(props, ["children", "classes", "className", "component", "disablePointerEvents", "disableTypography", "position", "variant"]);

  var muiFormControl = useFormControl$1() || {};
  var variant = variantProp;

  if (variantProp && muiFormControl.variant) ;

  if (muiFormControl && !variant) {
    variant = muiFormControl.variant;
  }

  return /*#__PURE__*/react.createElement(FormControlContext.Provider, {
    value: null
  }, /*#__PURE__*/react.createElement(Component, _extends$2({
    className: clsx(classes.root, className, position === 'end' ? classes.positionEnd : classes.positionStart, disablePointerEvents && classes.disablePointerEvents, muiFormControl.hiddenLabel && classes.hiddenLabel, variant === 'filled' && classes.filled, muiFormControl.margin === 'dense' && classes.marginDense),
    ref: ref
  }, other), typeof children === 'string' && !disableTypography ? /*#__PURE__*/react.createElement(Typography$1, {
    color: "textSecondary"
  }, children) : children));
});
var InputAdornment$1 = withStyles(styles$h, {
  name: 'MuiInputAdornment'
})(InputAdornment);

var Save = createCommonjsModule(function (module, exports) {





Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var React = interopRequireWildcard(react);

var _createSvgIcon = interopRequireDefault(createSvgIcon);

var _default = (0, _createSvgIcon.default)( /*#__PURE__*/React.createElement("path", {
  d: "M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"
}), 'Save');

exports.default = _default;
});

var Save$1 = /*@__PURE__*/getDefaultExportFromCjs(Save);

/**
 * Bundle of @devexpress/dx-react-grid-material-ui
 * Generated: 2021-06-24
 * Version: 2.7.6
 * License: https://js.devexpress.com/Licensing
 */

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _extends$1() {
  _extends$1 = Object.assign || function (target) {
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

  return _extends$1.apply(this, arguments);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
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

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var _excluded = ["children", "classes", "className"];
var styles$i = {
  root: {
    display: 'flex',
    flexDirection: 'column'
  }
};

var RootBase = function RootBase(_ref) {
  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(classes.root, className)
  }, restProps), children);
};
RootBase.defaultProps = {
  className: undefined
};
var Root = withStyles(styles$i)(RootBase);

var _excluded$1 = ["children"];
var Grid = function Grid(_ref) {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, _excluded$1);

  return /*#__PURE__*/react.createElement(Grid$1, _extends$1({
    rootComponent: Root
  }, props), children);
};
Grid.Root = Root;

var _excluded$2 = ["visible", "onHide", "children", "target"];
var Overlay = function Overlay(_ref) {
  var visible = _ref.visible,
      onHide = _ref.onHide,
      children = _ref.children,
      target = _ref.target,
      restProps = _objectWithoutProperties(_ref, _excluded$2);

  return /*#__PURE__*/react.createElement(Popover, _extends$1({
    open: visible,
    anchorEl: target,
    onClose: onHide,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    },
    transformOrigin: {
      vertical: 'top',
      horizontal: 'right'
    }
  }, restProps), children);
};
Overlay.defaultProps = {
  visible: false,
  target: null
};

var _excluded$3 = ["children"];
var Container = function Container(_ref) {
  var children = _ref.children,
      restProps = _objectWithoutProperties(_ref, _excluded$3);

  return /*#__PURE__*/react.createElement(List$2, _extends$1({
    dense: true
  }, restProps), children);
};

var _excluded$4 = ["onToggle", "getMessage", "buttonRef", "active"];
var ToggleButton = function ToggleButton(_ref) {
  var onToggle = _ref.onToggle,
      getMessage = _ref.getMessage,
      buttonRef = _ref.buttonRef,
      active = _ref.active,
      restProps = _objectWithoutProperties(_ref, _excluded$4);

  return /*#__PURE__*/react.createElement(Tooltip$1, {
    title: getMessage('showColumnChooser'),
    placement: "bottom",
    enterDelay: 300
  }, /*#__PURE__*/react.createElement(IconButton$1, _extends$1({
    onClick: onToggle,
    buttonRef: buttonRef
  }, restProps), /*#__PURE__*/react.createElement(VisibilityOff$1, null)));
};
ToggleButton.defaultProps = {
  active: false
};

var _excluded$5 = ["item", "disabled", "onToggle", "classes"];

var styles$1$1 = function styles(theme) {
  return {
    checkbox: {
      padding: 0
    },
    itemText: {
      paddingLeft: theme.spacing(1)
    }
  };
};

var ItemBase = function ItemBase(_ref) {
  var _ref$item = _ref.item,
      column = _ref$item.column,
      hidden = _ref$item.hidden,
      disabled = _ref.disabled,
      onToggle = _ref.onToggle,
      classes = _ref.classes,
      restProps = _objectWithoutProperties(_ref, _excluded$5);

  return /*#__PURE__*/react.createElement(ListItem, _extends$1({
    key: column.name,
    button: !disabled,
    component: "li",
    disabled: disabled,
    onClick: !disabled ? onToggle : null
  }, restProps), /*#__PURE__*/react.createElement(Checkbox$1, {
    checked: !hidden,
    tabIndex: -1,
    disableRipple: true,
    disabled: disabled,
    className: classes.checkbox
  }), /*#__PURE__*/react.createElement(ListItemText$1, {
    className: classes.itemText,
    primary: column.title || column.name
  }));
};
ItemBase.defaultProps = {
  onToggle: function onToggle() {},
  disabled: false
};
var Item = withStyles(styles$1$1, {
  name: 'Item'
})(ItemBase);

var withPatchedProps = function withPatchedProps(patchProps) {
  return function (Target) {
    var Patched = /*#__PURE__*/function (_React$PureComponent) {
      _inherits(Patched, _React$PureComponent);

      var _super = _createSuper(Patched);

      function Patched() {
        _classCallCheck(this, Patched);

        return _super.apply(this, arguments);
      }

      _createClass(Patched, [{
        key: "render",
        value: function render() {
          return /*#__PURE__*/react.createElement(Target, patchProps(this.props));
        }
      }]);

      return Patched;
    }(react.PureComponent);

    return Patched;
  };
};

var _excluded$6 = ["messages"];
var defaultMessages = {
  showColumnChooser: 'Show Column Chooser'
};
var ColumnChooserWithMessages = withPatchedProps(function (_ref) {
  var messages = _ref.messages,
      restProps = _objectWithoutProperties(_ref, _excluded$6);

  return _objectSpread2({
    messages: _objectSpread2(_objectSpread2({}, defaultMessages), messages)
  }, restProps);
})(ColumnChooser$1);
ColumnChooserWithMessages.propTypes = {
  messages: propTypes.shape({
    hiddenColumnNames: propTypes.string
  })
};
ColumnChooserWithMessages.defaultProps = {
  messages: {}
};
ColumnChooserWithMessages.components = ColumnChooser$1.components;
var ColumnChooser = withComponents({
  Container: Container,
  Item: Item,
  Overlay: Overlay,
  ToggleButton: ToggleButton
})(ColumnChooserWithMessages);

var _excluded$7 = ["clientOffset", "classes", "style", "className", "children"],
    _excluded2 = ["column", "classes", "className"];

var styles$2$1 = function styles(theme) {
  return {
    container: {
      position: 'fixed',
      zIndex: 1000,
      left: 0,
      top: 0,
      display: 'inline-block'
    },
    column: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      float: 'right',
      cursor: 'move'
    }
  };
};

var ContainerBase = function ContainerBase(_ref) {
  var clientOffset = _ref.clientOffset,
      classes = _ref.classes,
      style = _ref.style,
      className = _ref.className,
      children = _ref.children,
      restProps = _objectWithoutProperties(_ref, _excluded$7);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(classes.container, className),
    style: _objectSpread2({
      transform: "translate(calc(".concat(clientOffset.x, "px - 50%), calc(").concat(clientOffset.y, "px - 50%))"),
      msTransform: "translateX(".concat(clientOffset.x, "px) translateX(-50%) translateY(").concat(clientOffset.y, "px) translateY(-50%)")
    }, style)
  }, restProps), children);
};
ContainerBase.defaultProps = {
  style: null,
  className: undefined,
  children: undefined
};
var Container$1 = withStyles(styles$2$1, {
  name: 'DragDrop'
})(ContainerBase);
var ColumnBase = /*#__PURE__*/react.memo(function (_ref2) {
  var column = _ref2.column,
      classes = _ref2.classes,
      className = _ref2.className,
      restProps = _objectWithoutProperties(_ref2, _excluded2);

  return /*#__PURE__*/react.createElement(Chip$1, _extends$1({
    className: clsx(classes.column, className),
    label: column.title
  }, restProps));
});
ColumnBase.propTypes = {
  column: propTypes.object.isRequired,
  classes: propTypes.object.isRequired,
  className: propTypes.string
};
ColumnBase.defaultProps = {
  className: undefined
};
var Column = withStyles(styles$2$1, {
  name: 'DragDrop'
})(ColumnBase);

var DragDropProvider = withComponents({
  Container: Container$1,
  Column: Column
})(DragDropProvider$1);

var IS_LEGACY_EDGE_MEDIA_QUERY = '@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none)';

var styles$3$1 = function styles(theme) {
  return {
    pageSizeSelector: _objectSpread2(_objectSpread2({}, theme.typography.caption), {}, {
      paddingRight: theme.spacing(5),
      // NOTE: fixes vertical alignment in FF
      display: 'flex',
      alignItems: 'center'
    }),
    label: {
      paddingRight: theme.spacing(3)
    },
    pageSizeTitle: {
      width: 'auto',
      marginRight: theme.spacing(2)
    },
    inputRoot: {
      fontSize: theme.spacing(1.75),
      textAlign: 'right'
    },
    selectIcon: {
      top: 2
    },
    selectMenu: _defineProperty({}, "".concat(IS_LEGACY_EDGE_MEDIA_QUERY), {
      position: 'absolute !important'
    }),
    '@media (max-width: 768px)': {
      label: {
        display: 'none'
      },
      pageSizeSelector: {
        paddingRight: theme.spacing(2)
      }
    }
  };
};

var PageSizeSelectorBase = function PageSizeSelectorBase(_ref) {
  var pageSize = _ref.pageSize,
      onPageSizeChange = _ref.onPageSizeChange,
      pageSizes = _ref.pageSizes,
      getMessage = _ref.getMessage,
      classes = _ref.classes;
  var showAll = getMessage('showAll');
  return /*#__PURE__*/react.createElement("div", {
    className: classes.pageSizeSelector
  }, /*#__PURE__*/react.createElement("span", {
    className: classes.label
  }, getMessage('rowsPerPage')), /*#__PURE__*/react.createElement(__pika_web_default_export_for_treeshaking__, {
    value: pageSize,
    onChange: function onChange(event) {
      return onPageSizeChange(event.target.value);
    },
    classes: {
      icon: classes.selectIcon
    },
    MenuProps: {
      className: classes.selectMenu
    },
    input: /*#__PURE__*/react.createElement(__pika_web_default_export_for_treeshaking__$1, {
      disableUnderline: true,
      classes: {
        root: classes.inputRoot
      }
    })
  }, pageSizes.map(function (item) {
    return /*#__PURE__*/react.createElement(__pika_web_default_export_for_treeshaking__$2, {
      key: item,
      value: item
    }, item !== 0 ? item : showAll);
  })));
};
var PageSizeSelector = withStyles(styles$3$1, {
  name: 'PageSizeSelector'
})(PageSizeSelectorBase);

var styles$4$1 = function styles(theme) {
  return {
    pagination: {
      margin: 0
    },
    rowsLabel: _objectSpread2(_objectSpread2({}, theme.typography.caption), {}, {
      paddingRight: theme.spacing(5)
    }),
    button: {
      minWidth: theme.spacing(2)
    },
    activeButton: {
      fontWeight: 'bold',
      cursor: 'default'
    },
    arrowButton: {
      display: 'inline-block',
      transform: theme.direction === 'rtl' ? 'rotate(180deg)' : null,
      msTransform: theme.direction === 'rtl' ? 'rotate(180deg)' : null
    },
    prev: {
      marginRight: 0
    },
    next: {
      marginLeft: 0
    },
    '@media(max-width: 768px)': {
      button: {
        display: 'none'
      },
      prev: {
        marginRight: theme.spacing(1)
      },
      next: {
        marginLeft: theme.spacing(1)
      },
      rowsLabel: {
        paddingRight: theme.spacing(2)
      }
    }
  };
};

var PageButton = function PageButton(_ref) {
  var _classNames;

  var text = _ref.text,
      isActive = _ref.isActive,
      isDisabled = _ref.isDisabled,
      classes = _ref.classes,
      onClick = _ref.onClick;
  var buttonClasses = clsx((_classNames = {}, _defineProperty(_classNames, classes.button, true), _defineProperty(_classNames, classes.activeButton, isActive), _classNames));
  return /*#__PURE__*/react.createElement(Button$1, _extends$1({
    className: buttonClasses,
    disabled: isDisabled,
    onClick: onClick
  }, isActive ? {
    tabIndex: -1
  } : null), text);
};
PageButton.defaultProps = {
  onClick: function onClick() {},
  isDisabled: false,
  isActive: false
};
var ellipsisSymbol = "\u2026";

var renderPageButtons = function renderPageButtons(currentPage, totalPageCount, classes, onCurrentPageChange) {
  var pageButtons = [];
  var maxButtonCount = 3;
  var startPage = 1;
  var endPage = totalPageCount || 1; // NOTE: take into account last button and ellipsis (T1004797)

  if (maxButtonCount < totalPageCount - 2) {
    startPage = calculateStartPage(currentPage + 1, maxButtonCount, totalPageCount);
    endPage = startPage + maxButtonCount - 1;
  }

  if (startPage > 1) {
    pageButtons.push( /*#__PURE__*/react.createElement(PageButton, {
      key: 1,
      text: String(1),
      classes: classes,
      onClick: function onClick() {
        return onCurrentPageChange(0);
      }
    }));

    if (startPage > 2) {
      pageButtons.push( /*#__PURE__*/react.createElement(PageButton, {
        key: "ellipsisStart",
        text: ellipsisSymbol,
        classes: classes,
        isDisabled: true
      }));
    }
  }

  var _loop = function _loop(page) {
    pageButtons.push( /*#__PURE__*/react.createElement(PageButton, {
      key: page,
      text: String(page),
      isActive: page === currentPage + 1,
      classes: classes,
      onClick: function onClick() {
        return onCurrentPageChange(page - 1);
      },
      isDisabled: startPage === endPage
    }));
  };

  for (var page = startPage; page <= endPage; page += 1) {
    _loop(page);
  }

  if (endPage < totalPageCount) {
    if (endPage < totalPageCount - 1) {
      pageButtons.push( /*#__PURE__*/react.createElement(PageButton, {
        key: "ellipsisEnd",
        text: ellipsisSymbol,
        classes: classes,
        isDisabled: true
      }));
    }

    pageButtons.push( /*#__PURE__*/react.createElement(PageButton, {
      key: totalPageCount,
      text: String(totalPageCount),
      classes: classes,
      onClick: function onClick() {
        return onCurrentPageChange(totalPageCount - 1);
      }
    }));
  }

  return pageButtons;
};

var PaginationBase = function PaginationBase(_ref2) {
  var totalPages = _ref2.totalPages,
      totalCount = _ref2.totalCount,
      pageSize = _ref2.pageSize,
      currentPage = _ref2.currentPage,
      onCurrentPageChange = _ref2.onCurrentPageChange,
      getMessage = _ref2.getMessage,
      classes = _ref2.classes;
  var from = firstRowOnPage(currentPage, pageSize, totalCount);
  var to = lastRowOnPage(currentPage, pageSize, totalCount);
  return /*#__PURE__*/react.createElement("div", {
    className: classes.pagination
  }, /*#__PURE__*/react.createElement("span", {
    className: classes.rowsLabel
  }, getMessage('info', {
    from: from,
    to: to,
    count: totalCount
  })), /*#__PURE__*/react.createElement(IconButton$1, {
    className: clsx(classes.arrowButton, classes.prev),
    disabled: currentPage === 0,
    onClick: function onClick() {
      return currentPage > 0 && onCurrentPageChange(currentPage - 1);
    },
    "aria-label": "Previous"
  }, /*#__PURE__*/react.createElement(ChevronLeft$1, null)), renderPageButtons(currentPage, totalPages, classes, onCurrentPageChange), /*#__PURE__*/react.createElement(IconButton$1, {
    className: clsx(classes.arrowButton, classes.next),
    disabled: currentPage === totalPages - 1 || totalCount === 0,
    onClick: function onClick() {
      return currentPage < totalPages - 1 && onCurrentPageChange(currentPage + 1);
    },
    "aria-label": "Next"
  }, /*#__PURE__*/react.createElement(ChevronRight$1, null)));
};
var Pagination = withStyles(styles$4$1, {
  name: 'Pagination'
})(PaginationBase);

var _excluded$8 = ["currentPage", "pageSizes", "totalPages", "pageSize", "classes", "onCurrentPageChange", "onPageSizeChange", "totalCount", "getMessage", "className"];

var styles$5$1 = function styles(theme) {
  return {
    pager: {
      overflow: 'hidden',
      padding: theme.spacing(1.5),
      display: 'flex',
      flex: 'none',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }
  };
};

var PagerBase = function PagerBase(_ref) {
  var currentPage = _ref.currentPage,
      pageSizes = _ref.pageSizes,
      totalPages = _ref.totalPages,
      pageSize = _ref.pageSize,
      classes = _ref.classes,
      _onCurrentPageChange = _ref.onCurrentPageChange,
      onPageSizeChange = _ref.onPageSizeChange,
      totalCount = _ref.totalCount,
      getMessage = _ref.getMessage,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$8);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(classes.pager, className)
  }, restProps), !!pageSizes.length && /*#__PURE__*/react.createElement(PageSizeSelector, {
    pageSize: pageSize,
    onPageSizeChange: onPageSizeChange,
    pageSizes: pageSizes,
    getMessage: getMessage
  }), /*#__PURE__*/react.createElement(Pagination, {
    totalPages: totalPages,
    totalCount: totalCount,
    currentPage: currentPage,
    onCurrentPageChange: function onCurrentPageChange(page) {
      return _onCurrentPageChange(page);
    },
    pageSize: pageSize,
    getMessage: getMessage
  }));
};
PagerBase.defaultProps = {
  className: undefined
};
var Pager = withStyles(styles$5$1, {
  name: 'Pager'
})(PagerBase);

var _excluded$9 = ["messages"];
var defaultMessages$1 = {
  rowsPerPage: 'Rows per page:'
};
var PagingPanelWithMessages = withPatchedProps(function (_ref) {
  var messages = _ref.messages,
      restProps = _objectWithoutProperties(_ref, _excluded$9);

  return _objectSpread2({
    messages: _objectSpread2(_objectSpread2({}, defaultMessages$1), messages)
  }, restProps);
})(PagingPanel$1);
PagingPanelWithMessages.propTypes = {
  messages: propTypes.shape({
    showAll: propTypes.string,
    rowsPerPage: propTypes.string,
    info: propTypes.oneOfType([propTypes.string, propTypes.func])
  })
};
PagingPanelWithMessages.defaultProps = {
  messages: {}
};
PagingPanelWithMessages.components = PagingPanel$1.components;
var PagingPanel = withComponents({
  Container: Pager
})(PagingPanelWithMessages);

var _excluded$a = ["classes", "children", "className"];

var styles$6$1 = function styles(theme) {
  return {
    panel: {
      display: 'flex',
      flexWrap: 'wrap',
      width: '100%',
      marginTop: theme.spacing(1.5)
    }
  };
};

var GroupPanelContainerBase = function GroupPanelContainerBase(_ref) {
  var classes = _ref.classes,
      children = _ref.children,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$a);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(classes.panel, className)
  }, restProps), children);
};
GroupPanelContainerBase.defaultProps = {
  children: undefined,
  className: undefined
};
var GroupPanelContainer = withStyles(styles$6$1, {
  name: 'GroupPanelContainer'
})(GroupPanelContainerBase);

var _excluded$b = ["item", "onGroup", "showGroupingControls", "showSortingControls", "sortingDirection", "onSort", "sortingEnabled", "groupingEnabled", "classes", "className"];
var ENTER_KEY_CODE = 13;
var SPACE_KEY_CODE = 32;

var styles$7$1 = function styles(theme) {
  return {
    button: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1.5)
    },
    withoutIcon: {
      paddingRight: '13px',
      paddingLeft: '13px'
    },
    draftCell: {
      opacity: 0.3
    }
  };
};

var label = function label(showSortingControls, sortingEnabled, sortingDirection, column, hovered) {
  var title = column.title || column.name;
  return showSortingControls ? /*#__PURE__*/react.createElement(TableSortLabel$1, {
    active: !!sortingDirection,
    direction: sortingDirection === null ? undefined : sortingDirection,
    disabled: !sortingEnabled,
    hideSortIcon: !hovered,
    tabIndex: -1
  }, title) : title;
};

var GroupPanelItemBase = function GroupPanelItemBase(_ref) {
  var _classNames;

  var _ref$item = _ref.item,
      column = _ref$item.column,
      draft = _ref$item.draft,
      onGroup = _ref.onGroup,
      showGroupingControls = _ref.showGroupingControls,
      showSortingControls = _ref.showSortingControls,
      sortingDirection = _ref.sortingDirection,
      onSort = _ref.onSort,
      sortingEnabled = _ref.sortingEnabled,
      groupingEnabled = _ref.groupingEnabled,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$b);

  var _React$useState = react.useState(false),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      hovered = _React$useState2[0],
      setHovered = _React$useState2[1];

  var chipClassNames = clsx((_classNames = {}, _defineProperty(_classNames, classes.button, true), _defineProperty(_classNames, classes.withoutIcon, !showSortingControls || !hovered && sortingDirection === null), _defineProperty(_classNames, classes.draftCell, draft), _classNames), className);

  var onClick = function onClick(e) {
    var isActionKeyDown = e.keyCode === ENTER_KEY_CODE || e.keyCode === SPACE_KEY_CODE;
    var isMouseClick = e.keyCode === undefined;
    var cancelSortingRelatedKey = e.metaKey || e.ctrlKey;
    var direction = (isMouseClick || isActionKeyDown) && cancelSortingRelatedKey ? null : undefined;
    onSort({
      direction: direction,
      keepOther: cancelSortingRelatedKey
    });
  };

  return /*#__PURE__*/react.createElement(Chip$1, _extends$1({
    label: label(showSortingControls, sortingEnabled, sortingDirection, column, hovered),
    className: chipClassNames
  }, showGroupingControls ? {
    onDelete: groupingEnabled ? onGroup : null
  } : null, showSortingControls ? {
    onClick: sortingEnabled ? onClick : null,
    onMouseEnter: function onMouseEnter() {
      return setHovered(true);
    },
    onMouseLeave: function onMouseLeave() {
      return setHovered(false);
    }
  } : null, restProps));
};
GroupPanelItemBase.defaultProps = {
  showSortingControls: false,
  sortingEnabled: false,
  sortingDirection: undefined,
  onSort: undefined,
  onGroup: undefined,
  showGroupingControls: false,
  groupingEnabled: false,
  className: undefined
};
var GroupPanelItem = withStyles(styles$7$1, {
  name: 'GroupPanelItem'
})(GroupPanelItemBase);

var _excluded$c = ["getMessage", "classes", "className"];

var styles$8$1 = function styles(theme) {
  return {
    groupInfo: {
      color: theme.typography.caption.color,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize
    }
  };
};

var GroupPanelEmptyMessageBase = function GroupPanelEmptyMessageBase(_ref) {
  var getMessage = _ref.getMessage,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$c);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(classes.groupInfo, className)
  }, restProps), getMessage('groupByColumn'));
};
GroupPanelEmptyMessageBase.defaultProps = {
  className: undefined
};
var GroupPanelEmptyMessage = withStyles(styles$8$1, {
  name: 'GroupPanelEmptyMessage'
})(GroupPanelEmptyMessageBase);

var GroupingPanel = withComponents({
  Container: GroupPanelContainer,
  Item: GroupPanelItem,
  EmptyMessage: GroupPanelEmptyMessage
})(GroupingPanel$1);

var _excluded$d = ["style", "expanded", "classes", "onToggle", "tableColumn", "tableRow", "row", "className"];

var styles$9$1 = function styles(theme) {
  return {
    toggleCell: {
      textAlign: 'center',
      textOverflow: 'initial',
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: theme.spacing(1)
    },
    toggleCellButton: {
      verticalAlign: 'middle',
      display: 'inline-block',
      padding: theme.spacing(1)
    }
  };
};

var TableDetailToggleCellBase = function TableDetailToggleCellBase(_ref) {
  var style = _ref.style,
      expanded = _ref.expanded,
      classes = _ref.classes,
      onToggle = _ref.onToggle,
      tableColumn = _ref.tableColumn,
      tableRow = _ref.tableRow,
      row = _ref.row,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$d);

  var handleClick = function handleClick(e) {
    e.stopPropagation();
    onToggle();
  };

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx(classes.toggleCell, className),
    style: style
  }, restProps), /*#__PURE__*/react.createElement(IconButton$1, {
    className: classes.toggleCellButton,
    onClick: handleClick
  }, expanded ? /*#__PURE__*/react.createElement(ExpandLess$1, null) : /*#__PURE__*/react.createElement(ExpandMore$1, null)));
};
TableDetailToggleCellBase.defaultProps = {
  style: null,
  expanded: false,
  onToggle: function onToggle() {},
  className: undefined,
  tableColumn: undefined,
  tableRow: undefined,
  row: undefined
};
var TableDetailToggleCell = withStyles(styles$9$1, {
  name: 'TableDetailToggleCell'
})(TableDetailToggleCellBase);

var _excluded$e = ["colSpan", "style", "children", "classes", "className", "tableColumn", "tableRow", "row"];

var styles$a$1 = function styles(theme) {
  return {
    active: {
      backgroundColor: theme.palette.background.default
    }
  };
};

var TableDetailCellBase = function TableDetailCellBase(_ref) {
  var colSpan = _ref.colSpan,
      style = _ref.style,
      children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      tableColumn = _ref.tableColumn,
      tableRow = _ref.tableRow,
      row = _ref.row,
      restProps = _objectWithoutProperties(_ref, _excluded$e);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    style: style,
    colSpan: colSpan,
    className: clsx(classes.active, className)
  }, restProps), children);
};
TableDetailCellBase.defaultProps = {
  style: null,
  colSpan: 1,
  className: undefined,
  tableColumn: undefined,
  tableRow: undefined,
  row: undefined,
  children: undefined
};
var TableDetailCell = withStyles(styles$a$1, {
  name: 'TableDetailCell'
})(TableDetailCellBase);

var _excluded$f = ["children", "row", "tableRow"];
var TableRow$1 = function TableRow(_ref) {
  var children = _ref.children,
      row = _ref.row,
      tableRow = _ref.tableRow,
      restProps = _objectWithoutProperties(_ref, _excluded$f);

  return /*#__PURE__*/react.createElement(TableRowMUI, restProps, children);
};
TableRow$1.defaultProps = {
  children: undefined,
  row: undefined,
  tableRow: undefined
};

var TableRowDetailWithWidth = function TableRowDetailWithWidth(props) {
  return /*#__PURE__*/react.createElement(TableRowDetail$1, _extends$1({
    toggleColumnWidth: 48
  }, props));
};

TableRowDetailWithWidth.components = TableRowDetail$1.components;
var TableRowDetail = withComponents({
  Row: TableRow$1,
  Cell: TableDetailCell,
  ToggleCell: TableDetailToggleCell
})(TableRowDetailWithWidth);
TableRowDetail.COLUMN_TYPE = TableRowDetail$1.COLUMN_TYPE;
TableRowDetail.ROW_TYPE = TableRowDetail$1.ROW_TYPE;

var _excluded$g = ["contentComponent", "iconComponent", "containerComponent", "inlineSummaryComponent", "inlineSummaryItemComponent", "inlineSummaries", "getMessage", "style", "colSpan", "row", "column", "expanded", "onToggle", "classes", "children", "className", "tableRow", "tableColumn", "side", "position"];

var styles$b$1 = function styles(theme) {
  return {
    cell: {
      cursor: 'pointer',
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(0.5),
      paddingBottom: theme.spacing(0.5)
    },
    cellNoWrap: {
      whiteSpace: 'nowrap'
    }
  };
};

var CellBase = function CellBase(_ref) {
  var _classNames;

  var Content = _ref.contentComponent,
      Icon = _ref.iconComponent,
      Container = _ref.containerComponent,
      InlineSummary = _ref.inlineSummaryComponent,
      InlineSummaryItem = _ref.inlineSummaryItemComponent,
      inlineSummaries = _ref.inlineSummaries,
      getMessage = _ref.getMessage,
      style = _ref.style,
      colSpan = _ref.colSpan,
      row = _ref.row,
      column = _ref.column,
      expanded = _ref.expanded,
      onToggle = _ref.onToggle,
      classes = _ref.classes,
      children = _ref.children,
      className = _ref.className,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      side = _ref.side,
      position = _ref.position,
      restProps = _objectWithoutProperties(_ref, _excluded$g);

  var handleClick = function handleClick() {
    return onToggle();
  };

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    colSpan: colSpan,
    style: style,
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.cell, true), _defineProperty(_classNames, classes.cellNoWrap, !(tableColumn && tableColumn.wordWrapEnabled)), _classNames), className),
    onClick: handleClick
  }, restProps), /*#__PURE__*/react.createElement(Container, {
    side: side,
    position: position
  }, /*#__PURE__*/react.createElement(Icon, {
    expanded: expanded
  }), /*#__PURE__*/react.createElement(Content, {
    column: column,
    row: row
  }, children), inlineSummaries.length ? /*#__PURE__*/react.createElement(InlineSummary, {
    inlineSummaries: inlineSummaries,
    getMessage: getMessage,
    inlineSummaryItemComponent: InlineSummaryItem
  }) : null));
};
CellBase.defaultProps = {
  style: null,
  colSpan: 1,
  row: {},
  column: {},
  expanded: false,
  inlineSummaries: [],
  onToggle: function onToggle() {},
  children: undefined,
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  side: 'left',
  position: ''
};
var Cell = withStyles(styles$b$1, {
  name: 'TableGroupCell'
})(CellBase);

var _excluded$h = ["column", "row", "classes", "className", "children"];

var styles$c$1 = function styles() {
  return {
    columnTitle: {
      verticalAlign: 'middle'
    }
  };
};

var ContentBase = function ContentBase(_ref) {
  var column = _ref.column,
      row = _ref.row,
      classes = _ref.classes,
      className = _ref.className,
      children = _ref.children,
      restProps = _objectWithoutProperties(_ref, _excluded$h);

  return /*#__PURE__*/react.createElement("span", _extends$1({
    className: clsx(classes.columnTitle, className)
  }, restProps), /*#__PURE__*/react.createElement("strong", null, column.title || column.name, ":", ' '), children || String(row.value));
};
ContentBase.defaultProps = {
  row: {},
  column: {},
  children: undefined,
  className: undefined
};
var Content = withStyles(styles$c$1)(ContentBase);

var getBorder = function getBorder(theme) {
  return "1px solid ".concat(theme.palette.type === 'light' ? colorManipulator.lighten(colorManipulator.fade(theme.palette.divider, 1), 0.88) : colorManipulator.darken(colorManipulator.fade(theme.palette.divider, 1), 0.68));
};
var getStickyCellStyle = function getStickyCellStyle(theme) {
  return {
    backgroundColor: theme.palette.background.paper,
    position: 'sticky',
    zIndex: 300,
    backgroundClip: 'padding-box'
  };
};

var _excluded$i = ["children", "style", "classes", "className", "side", "position"];

var styles$d$1 = function styles(theme) {
  return {
    wrapper: _objectSpread2(_objectSpread2({}, getStickyCellStyle(theme)), {}, {
      float: 'left',
      maxWidth: '100%',
      overflowX: 'hidden',
      textOverflow: 'ellipsis'
    })
  };
};

var ContainerBase$1 = function ContainerBase(_ref) {
  var children = _ref.children,
      style = _ref.style,
      classes = _ref.classes,
      className = _ref.className,
      side = _ref.side,
      position = _ref.position,
      restProps = _objectWithoutProperties(_ref, _excluded$i);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(classes.wrapper, className),
    style: _objectSpread2(_objectSpread2({}, style), {}, _defineProperty({}, side, position))
  }, restProps), children);
};
ContainerBase$1.defaultProps = {
  children: undefined,
  className: undefined,
  style: null,
  side: 'left',
  position: ''
};
var Container$2 = withStyles(styles$d$1)(ContainerBase$1);

var _excluded$j = ["tableRow", "tableColumn", "row", "column", "style", "className", "classes", "position", "side"];

var styles$e$1 = function styles(theme) {
  return {
    indentCell: _objectSpread2(_objectSpread2({}, getStickyCellStyle(theme)), {}, {
      borderBottom: getBorder(theme)
    })
  };
};

var IndentCellBase = function IndentCellBase(_ref) {
  var tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      row = _ref.row,
      column = _ref.column,
      style = _ref.style,
      className = _ref.className,
      classes = _ref.classes,
      position = _ref.position,
      side = _ref.side,
      restProps = _objectWithoutProperties(_ref, _excluded$j);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx(classes.indentCell, className),
    style: _objectSpread2(_objectSpread2({}, style), {}, _defineProperty({}, side, position))
  }, restProps));
};
IndentCellBase.defaultProps = {
  tableRow: undefined,
  tableColumn: undefined,
  row: {},
  column: {},
  style: null,
  className: undefined,
  side: 'left',
  position: undefined
};
var IndentCell = withStyles(styles$e$1)(IndentCellBase);

var _excluded$k = ["expanded", "classes", "className"];

var styles$f$1 = function styles(theme) {
  return {
    groupButton: {
      verticalAlign: 'middle',
      display: 'inline-block',
      padding: theme.spacing(1),
      marginRight: theme.spacing(1)
    }
  };
};

var IconBase = /*#__PURE__*/react.memo(function (_ref) {
  var expanded = _ref.expanded,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$k);

  return /*#__PURE__*/react.createElement(IconButton$1, _extends$1({
    className: clsx(classes.groupButton, className)
  }, restProps), expanded ? /*#__PURE__*/react.createElement(ExpandMore$1, null) : /*#__PURE__*/react.createElement(ChevronRight$1, null));
});
IconBase.propTypes = {
  expanded: propTypes.bool.isRequired,
  classes: propTypes.object.isRequired,
  className: propTypes.string
};
IconBase.defaultProps = {
  className: undefined
};
var Icon = withStyles(styles$f$1)(IconBase);

var _excluded$l = ["children", "classes", "className"];

var styles$g$1 = function styles() {
  return {
    row: {
      cursor: 'pointer'
    }
  };
};

var RowBase = function RowBase(_ref) {
  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$l);

  return /*#__PURE__*/react.createElement(TableRow$1, _extends$1({}, restProps, {
    className: clsx(classes.row, className)
  }), children);
};
RowBase.defaultProps = {
  children: null,
  className: undefined
};
var Row = withStyles(styles$g$1)(RowBase);

var _excluded$m = ["inlineSummaries", "getMessage", "inlineSummaryItemComponent", "classes", "className"];

var styles$h$1 = function styles(theme) {
  return {
    inlineSummary: {
      marginLeft: theme.spacing(1),
      verticalAlign: 'middle'
    }
  };
};

var InlineSummaryBase = function InlineSummaryBase(_ref) {
  var inlineSummaries = _ref.inlineSummaries,
      getMessage = _ref.getMessage,
      InlineSummaryItem = _ref.inlineSummaryItemComponent,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$m);

  return /*#__PURE__*/react.createElement("span", _extends$1({
    className: clsx(classes.inlineSummary, className)
  }, restProps), '(', inlineSummaries.map(function (s) {
    return /*#__PURE__*/react.createElement(InlineSummaryItem, {
      key: s.type,
      summary: s,
      getMessage: getMessage
    });
  }).reduce(function (acc, summary) {
    return acc.concat(summary, ', ');
  }, []).slice(0, -1), ')');
};
InlineSummaryBase.defaultProps = {
  className: undefined,
  inlineSummaries: []
};
var InlineSummary = withStyles(styles$h$1)(InlineSummaryBase);

var _excluded$n = ["column", "value", "children", "classes", "tableRow", "tableColumn", "row", "className"];

var styles$i$1 = function styles(theme) {
  return {
    cell: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      '&:first-child': {
        paddingLeft: theme.spacing(3)
      },
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    footer: {
      borderBottom: getBorder(theme)
    },
    cellRightAlign: {
      textAlign: 'right'
    },
    cellCenterAlign: {
      textAlign: 'center'
    },
    cellNoWrap: {
      whiteSpace: 'nowrap'
    }
  };
};

var TableCellBase = function TableCellBase(_ref) {
  var _classNames;

  var column = _ref.column,
      value = _ref.value,
      children = _ref.children,
      classes = _ref.classes,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      row = _ref.row,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$n);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.cell, true), _defineProperty(_classNames, classes.cellRightAlign, tableColumn && tableColumn.align === 'right'), _defineProperty(_classNames, classes.cellCenterAlign, tableColumn && tableColumn.align === 'center'), _defineProperty(_classNames, classes.cellNoWrap, !(tableColumn && tableColumn.wordWrapEnabled)), _classNames), className),
    classes: {
      footer: classes.footer
    }
  }, restProps), children || value);
};
TableCellBase.defaultProps = {
  value: undefined,
  column: undefined,
  row: undefined,
  children: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  className: undefined
};
var TableCell$2 = withStyles(styles$i$1, {
  name: 'TableCell'
})(TableCellBase);

var _excluded$o = ["onToggle"];
var SummaryCell = function SummaryCell(_ref) {
  var onToggle = _ref.onToggle,
      restProps = _objectWithoutProperties(_ref, _excluded$o);

  return /*#__PURE__*/react.createElement(TableCell$2, _extends$1({}, restProps, {
    onClick: onToggle
  }));
};
SummaryCell.defaultProps = {
  onToggle: function onToggle() {}
};

var _excluded$p = ["children", "type", "value", "getMessage", "classes", "className"];

var styles$j = function styles(theme) {
  return {
    item: {
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.primary,
      fontSize: theme.typography.pxToRem(13)
    }
  };
};

var TableSummaryItemBase = function TableSummaryItemBase(_ref) {
  var children = _ref.children,
      type = _ref.type,
      value = _ref.value,
      getMessage = _ref.getMessage,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$p);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(_defineProperty({}, classes.item, true), className)
  }, restProps), /*#__PURE__*/react.createElement(react.Fragment, null, getMessage(type), ":\xA0\xA0", children));
};
TableSummaryItemBase.defaultProps = {
  value: null,
  children: undefined,
  className: undefined
};
var TableSummaryItem = withStyles(styles$j)(TableSummaryItemBase);

var TableGroupRowWithIndent = function TableGroupRowWithIndent(props) {
  return /*#__PURE__*/react.createElement(TableGroupRow$1, _extends$1({
    contentCellPadding: "8px",
    indentColumnWidth: 48
  }, props));
};

TableGroupRowWithIndent.components = TableGroupRow$1.components;
var StubCell = SummaryCell;
var TableGroupRow = withComponents({
  Row: Row,
  Cell: Cell,
  IndentCell: IndentCell,
  Container: Container$2,
  Content: Content,
  Icon: Icon,
  InlineSummary: InlineSummary,
  InlineSummaryItem: InlineSummaryItem,
  SummaryCell: SummaryCell,
  SummaryItem: TableSummaryItem,
  StubCell: StubCell
})(TableGroupRowWithIndent);
TableGroupRow.COLUMN_TYPE = TableGroupRow$1.COLUMN_TYPE;
TableGroupRow.ROW_TYPE = TableGroupRow$1.ROW_TYPE;

var _excluded$q = ["allSelected", "someSelected", "disabled", "onToggle", "classes", "className", "tableRow", "tableColumn", "rowSpan"];

var styles$k = function styles(theme) {
  return {
    cell: {
      overflow: 'visible',
      paddingRight: 0,
      paddingLeft: theme.spacing(1),
      textAlign: 'center'
    },
    checkbox: {
      padding: theme.spacing(1)
    },
    alignWithRowSpan: {
      verticalAlign: 'bottom',
      paddingBottom: theme.spacing(0.5)
    },
    pointer: {
      cursor: 'pointer'
    }
  };
};

var TableSelectAllCellBase = function TableSelectAllCellBase(_ref) {
  var _classNames;

  var allSelected = _ref.allSelected,
      someSelected = _ref.someSelected,
      disabled = _ref.disabled,
      onToggle = _ref.onToggle,
      classes = _ref.classes,
      className = _ref.className,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      rowSpan = _ref.rowSpan,
      restProps = _objectWithoutProperties(_ref, _excluded$q);

  var cellClasses = clsx((_classNames = {}, _defineProperty(_classNames, classes.cell, true), _defineProperty(_classNames, classes.pointer, !disabled), _defineProperty(_classNames, classes.alignWithRowSpan, rowSpan > 1), _classNames), className);
  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    padding: "checkbox",
    className: cellClasses,
    rowSpan: rowSpan
  }, restProps), /*#__PURE__*/react.createElement(Checkbox$1, {
    checked: allSelected,
    className: classes.checkbox,
    indeterminate: someSelected,
    disabled: disabled,
    onClick: function onClick(e) {
      if (disabled) return;
      e.stopPropagation();
      onToggle();
    }
  }));
};
TableSelectAllCellBase.defaultProps = {
  allSelected: false,
  someSelected: false,
  disabled: false,
  onToggle: function onToggle() {},
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  rowSpan: undefined
};
var TableSelectAllCell = withStyles(styles$k, {
  name: 'TableSelectAllCell'
})(TableSelectAllCellBase);

var _excluded$r = ["style", "selected", "onToggle", "classes", "className", "row", "tableRow", "tableColumn"];

var styles$l = function styles(theme) {
  return {
    cell: {
      overflow: 'visible',
      paddingRight: 0,
      paddingLeft: theme.spacing(1),
      textAlign: 'center'
    },
    checkbox: {
      marginTop: '-1px',
      marginBottom: '-1px',
      padding: theme.spacing(1)
    }
  };
};

var TableSelectCellBase = function TableSelectCellBase(_ref) {
  var style = _ref.style,
      selected = _ref.selected,
      onToggle = _ref.onToggle,
      classes = _ref.classes,
      className = _ref.className,
      row = _ref.row,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      restProps = _objectWithoutProperties(_ref, _excluded$r);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    padding: "checkbox",
    style: style,
    className: clsx(classes.cell, className)
  }, restProps), /*#__PURE__*/react.createElement(Checkbox$1, {
    className: classes.checkbox,
    checked: selected,
    onClick: function onClick(e) {
      e.stopPropagation();
      onToggle();
    }
  }));
};
TableSelectCellBase.defaultProps = {
  style: null,
  selected: false,
  onToggle: function onToggle() {},
  row: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  className: undefined
};
var TableSelectCell = withStyles(styles$l, {
  name: 'TableSelectCell'
})(TableSelectCellBase);

var getSelectionColor = (function (theme) {
  return theme.palette.type === 'light' ? colorManipulator.lighten(colorManipulator.fade(theme.palette.action.selected, 1), 0.96) : colorManipulator.darken(colorManipulator.fade(theme.palette.action.selected, 1), 0.68);
});

var _excluded$s = ["children", "classes", "className", "onToggle", "row", "selectByRowClick", "highlighted", "tableColumn", "tableRow"];

var styles$m = function styles(theme) {
  return {
    selected: {
      backgroundColor: getSelectionColor(theme)
    }
  };
};

var TableSelectRowBase = function TableSelectRowBase(_ref) {
  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      onToggle = _ref.onToggle,
      row = _ref.row,
      selectByRowClick = _ref.selectByRowClick,
      highlighted = _ref.highlighted,
      tableColumn = _ref.tableColumn,
      tableRow = _ref.tableRow,
      restProps = _objectWithoutProperties(_ref, _excluded$s);

  return /*#__PURE__*/react.createElement(TableRowMUI, _extends$1({
    className: clsx(_defineProperty({}, classes.selected, highlighted), className),
    onClick: function onClick(e) {
      if (!selectByRowClick) return;
      e.stopPropagation();
      onToggle();
    }
  }, restProps), children);
};
TableSelectRowBase.defaultProps = {
  children: undefined,
  className: undefined,
  onToggle: function onToggle() {},
  row: undefined,
  selectByRowClick: false,
  highlighted: false,
  tableColumn: undefined,
  tableRow: undefined
};
var TableSelectRow = withStyles(styles$m, {
  name: 'TableSelectRow'
})(TableSelectRowBase);

var TableSelectionWithWidth = function TableSelectionWithWidth(props) {
  return /*#__PURE__*/react.createElement(TableSelection$1, _extends$1({
    selectionColumnWidth: 58
  }, props));
};

TableSelectionWithWidth.components = TableSelection$1.components;
var TableSelection = withComponents({
  Row: TableSelectRow,
  Cell: TableSelectCell,
  HeaderCell: TableSelectAllCell
})(TableSelectionWithWidth);
TableSelection.COLUMN_TYPE = TableSelection$1.COLUMN_TYPE;

var _excluded$t = ["children", "classes", "className", "use", "tableRef"];

var styles$n = function styles(theme) {
  return {
    table: {
      tableLayout: 'fixed',
      borderCollapse: 'separate'
    },
    stickyTable: {
      position: 'sticky',
      zIndex: 500,
      overflow: 'visible',
      background: theme.palette.background.paper,
      fallbacks: {
        position: '-webkit-sticky'
      }
    },
    headTable: {
      top: 0
    },
    footTable: {
      borderTop: getBorder(theme),
      bottom: 0
    }
  };
};

var TableBase = function TableBase(_ref) {
  var _classNames;

  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      use = _ref.use,
      tableRef = _ref.tableRef,
      restProps = _objectWithoutProperties(_ref, _excluded$t);

  return /*#__PURE__*/react.createElement(TableMUI, _extends$1({
    ref: tableRef,
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.table, true), _defineProperty(_classNames, classes.stickyTable, !!use), _defineProperty(_classNames, classes.headTable, use === 'head'), _defineProperty(_classNames, classes.footTable, use === 'foot'), _classNames), className)
  }, restProps), children);
};
TableBase.defaultProps = {
  use: undefined,
  className: undefined
};
var Table$1 = withStyles(styles$n, {
  name: 'Table'
})(TableBase);

var MINIMAL_COLUMN_WIDTH = 120;
var TableLayout = function TableLayout(props) {
  return /*#__PURE__*/react.createElement(TableLayout$1, _extends$1({
    layoutComponent: StaticTableLayout,
    minColumnWidth: MINIMAL_COLUMN_WIDTH
  }, props));
};

var _excluded$u = ["classes", "className", "tableRow", "tableColumn"];

var styles$o = function styles(theme) {
  return {
    cell: {
      padding: 0
    },
    footer: {
      borderBottom: getBorder(theme)
    }
  };
};

var TableStubCellBase = function TableStubCellBase(_ref) {
  var classes = _ref.classes,
      className = _ref.className,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      restProps = _objectWithoutProperties(_ref, _excluded$u);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx(classes.cell, className),
    classes: {
      footer: classes.footer
    }
  }, restProps));
};
TableStubCellBase.defaultProps = {
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined
};
var TableStubCell = withStyles(styles$o, {
  name: 'TableStubCell'
})(TableStubCellBase);

var _excluded$v = ["style", "colSpan", "getMessage", "classes", "className", "tableRow", "tableColumn"];

var styles$p = function styles(theme) {
  return {
    cell: {
      padding: theme.spacing(6, 0),
      position: 'static !important'
    },
    textContainer: {
      display: 'inline-block',
      position: 'sticky',
      left: '50%'
    },
    text: {
      transform: 'translateX(-50%)',
      msTransform: 'translateX(-50%)',
      display: 'inline-block'
    }
  };
};

var TableNoDataCellBase = function TableNoDataCellBase(_ref) {
  var style = _ref.style,
      colSpan = _ref.colSpan,
      getMessage = _ref.getMessage,
      classes = _ref.classes,
      className = _ref.className,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      restProps = _objectWithoutProperties(_ref, _excluded$v);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    style: style,
    className: clsx(classes.cell, className),
    colSpan: colSpan
  }, restProps), /*#__PURE__*/react.createElement("div", {
    className: classes.textContainer
  }, /*#__PURE__*/react.createElement("big", {
    className: classes.text
  }, getMessage('noData'))));
};
TableNoDataCellBase.defaultProps = {
  style: null,
  colSpan: 1,
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined
};
var TableNoDataCell = withStyles(styles$p, {
  name: 'TableNoDataCell'
})(TableNoDataCellBase);

var _excluded$w = ["children", "classes", "className"];
var styles$q = {
  root: {
    flexGrow: 1,
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    // NOTE: fix sticky positioning in Safari
    width: '100%'
  }
};

var TableContainerBase = function TableContainerBase(_ref) {
  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$w);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(classes.root, className)
  }, restProps), /*#__PURE__*/react.createElement("div", null, children));
};
TableContainerBase.defaultProps = {
  className: undefined
};
var TableContainer = withStyles(styles$q, {
  name: 'TableContainer'
})(TableContainerBase);

var _excluded$x = ["children", "tableRow"];
var TableStubRow = function TableStubRow(_ref) {
  var children = _ref.children,
      tableRow = _ref.tableRow,
      restProps = _objectWithoutProperties(_ref, _excluded$x);

  return /*#__PURE__*/react.createElement(TableRowMUI, restProps, children);
};
TableStubRow.defaultProps = {
  children: undefined,
  tableRow: undefined
};

var Table$1$1 = withComponents({
  Table: Table$1,
  TableHead: TableHead$1,
  TableBody: TableBody$1,
  TableFooter: TableFooter$1,
  Container: TableContainer,
  Layout: TableLayout,
  Row: TableRow$1,
  Cell: TableCell$2,
  NoDataRow: TableRow$1,
  NoDataCell: TableNoDataCell,
  StubRow: TableStubRow,
  StubCell: TableStubCell,
  StubHeaderCell: TableStubCell
})(Table$2);
Table$1$1.components = Table$2.components;
Table$1$1.COLUMN_TYPE = Table$2.COLUMN_TYPE;
Table$1$1.ROW_TYPE = Table$2.ROW_TYPE;
Table$1$1.NODATA_ROW_TYPE = Table$2.NODATA_ROW_TYPE;

var _excluded$y = ["classes", "className", "tableRow", "tableColumn"];

var styles$r = function styles(theme) {
  return {
    cell: {
      padding: theme.spacing(1),
      backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAACqCAYAAABbAOqQAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA39pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpjYWQ2ODE5MS00ZDMxLWRjNGYtOTU0NC1jNjJkMTIxMjY2M2IiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjY1RUVFQzAzRDYzMTFFODlFNThCOUJBQjU4Q0EzRDgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjY1RUVFQkYzRDYzMTFFODlFNThCOUJBQjU4Q0EzRDgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVlMjM1Y2U0LTc5ZWUtNGI0NC05ZjlkLTk2NTZmZGFjNjhhNCIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjk1OTQ2MjBiLTUyMTQtYTM0Yy04Nzc5LTEwMmEyMTY4MTlhOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvLbJKYAAADrSURBVHja7N3BDYBACABBsQn7L48q0BoMD5SZxAZuc74gF1V1MMfpCARBEEEQRBAEEQRBdovnuxxDq3RD/LIQRBAEQRBBEEQQBBEEQQQBAAAAAAAAABhi8gZVbgxi6kQQBBEEQQRBEEEQRBAEQRBBAAAAAAAAAAAabX2Daux2lqkTQRBEEAQRBEEEQRBBEARBBAEAAAAAAAAAaLR1g2osUyeCIIggCCIIggiCIIIgCIIIAgAAAAAAAADQ6KsbVPnXIKZOBEEQQRBEEAQRBEEEQRAEEYRXoqqcghuCIIIgiCAIIgiCCMIUtwADALYCCr92l++TAAAAAElFTkSuQmCC)',
      backgroundRepeat: 'no-repeat repeat',
      backgroundOrigin: 'content-box'
    }
  };
};

var TableSkeletonCellBase = function TableSkeletonCellBase(_ref) {
  var classes = _ref.classes,
      className = _ref.className,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      restProps = _objectWithoutProperties(_ref, _excluded$y);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx(classes.cell, className)
  }, restProps));
};
TableSkeletonCellBase.defaultProps = {
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined
};
var TableSkeletonCell = withStyles(styles$r, {
  name: 'TableSkeletonCell'
})(TableSkeletonCellBase);

var MINIMAL_COLUMN_WIDTH$1 = 120;
var VirtualTableLayout = function VirtualTableLayout(props) {
  return /*#__PURE__*/react.createElement(TableLayout$1, _extends$1({
    layoutComponent: VirtualTableLayout$1,
    minColumnWidth: MINIMAL_COLUMN_WIDTH$1
  }, props));
};

var FixedHeader = function FixedHeader(props) {
  return /*#__PURE__*/react.createElement(Table$1, _extends$1({
    use: "head"
  }, props));
};

var FixedFooter = function FixedFooter(props) {
  return /*#__PURE__*/react.createElement(Table$1, _extends$1({
    use: "foot"
  }, props));
};

var VirtualTable = makeVirtualTable(Table$1$1, {
  VirtualLayout: VirtualTableLayout,
  FixedHeader: FixedHeader,
  FixedFooter: FixedFooter,
  SkeletonCell: TableSkeletonCell,
  defaultEstimatedRowHeight: 53,
  defaultHeight: 530
});
VirtualTable.COLUMN_TYPE = Table$1$1.COLUMN_TYPE;
VirtualTable.ROW_TYPE = Table$1$1.ROW_TYPE;
VirtualTable.NODATA_ROW_TYPE = Table$1$1.NODATA_ROW_TYPE;

var _excluded$z = ["filter", "getMessage", "onFilter", "classes", "children", "className", "tableRow", "tableColumn", "column", "filteringEnabled"];

var styles$s = function styles(_ref) {
  var spacing = _ref.spacing;
  return {
    cell: {
      padding: 0,
      '&:first-child': {
        paddingLeft: spacing(3)
      }
    },
    flexContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  };
};

var TableFilterCellBase = function TableFilterCellBase(_ref2) {
  var filter = _ref2.filter,
      getMessage = _ref2.getMessage,
      onFilter = _ref2.onFilter,
      classes = _ref2.classes,
      children = _ref2.children,
      className = _ref2.className,
      tableRow = _ref2.tableRow,
      tableColumn = _ref2.tableColumn,
      column = _ref2.column,
      filteringEnabled = _ref2.filteringEnabled,
      restProps = _objectWithoutProperties(_ref2, _excluded$z);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx(classes.cell, className)
  }, restProps), /*#__PURE__*/react.createElement("div", {
    className: classes.flexContainer
  }, children));
};
TableFilterCellBase.defaultProps = {
  filter: null,
  onFilter: function onFilter() {},
  children: undefined,
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  column: undefined,
  filteringEnabled: true
};
var TableFilterCell = withStyles(styles$s, {
  name: 'TableFilterCell'
})(TableFilterCellBase);

var _excluded$A = ["value", "disabled", "getMessage", "onChange", "classes"];

var styles$t = function styles(theme) {
  return {
    input: {
      width: '100%',
      fontSize: '14px'
    },
    root: {
      margin: theme.spacing(1)
    }
  };
};

var EditorBase = function EditorBase(_ref) {
  var value = _ref.value,
      disabled = _ref.disabled,
      getMessage = _ref.getMessage,
      _onChange = _ref.onChange,
      classes = _ref.classes,
      restProps = _objectWithoutProperties(_ref, _excluded$A);

  return /*#__PURE__*/react.createElement(__pika_web_default_export_for_treeshaking__$1, _extends$1({
    classes: {
      input: classes.input,
      root: classes.root
    },
    fullWidth: true,
    disabled: disabled,
    value: value,
    onChange: function onChange(event) {
      return _onChange(event.target.value);
    },
    placeholder: getMessage('filterPlaceholder')
  }, restProps));
};
EditorBase.defaultProps = {
  value: '',
  disabled: false,
  onChange: function onChange() {}
};
var Editor = withStyles(styles$t, {
  name: 'Editor'
})(EditorBase);

var styles$u = function styles(_ref) {
  var spacing = _ref.spacing;
  return {
    icon: {
      marginRight: spacing(1)
    },
    iconItem: {
      minWidth: spacing(2)
    },
    selectMenu: {
      position: 'absolute !important'
    }
  };
};

var FilterSelectorBase = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FilterSelectorBase, _React$PureComponent);

  var _super = _createSuper(FilterSelectorBase);

  function FilterSelectorBase(props) {
    var _this;

    _classCallCheck(this, FilterSelectorBase);

    _this = _super.call(this, props);
    _this.state = {
      opened: false
    };

    _this.setButtonRef = function (buttonRef) {
      _this.buttonRef = buttonRef;
    };

    _this.handleButtonClick = function () {
      _this.setState(function (prevState) {
        return {
          opened: !prevState.opened
        };
      });
    };

    _this.handleMenuClose = function () {
      _this.setState({
        opened: false
      });
    };

    _this.handleMenuItemClick = function (nextValue) {
      var onChange = _this.props.onChange;

      _this.setState({
        opened: false
      });

      onChange(nextValue);
    };

    return _this;
  }

  _createClass(FilterSelectorBase, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$props = this.props,
          value = _this$props.value,
          availableValues = _this$props.availableValues,
          disabled = _this$props.disabled,
          getMessage = _this$props.getMessage,
          Icon = _this$props.iconComponent,
          ToggleButton = _this$props.toggleButtonComponent,
          classes = _this$props.classes;
      var opened = this.state.opened;
      return availableValues.length ? /*#__PURE__*/react.createElement(react.Fragment, null, /*#__PURE__*/react.createElement(ToggleButton, {
        buttonRef: this.setButtonRef,
        onToggle: this.handleButtonClick,
        disabled: disabled || availableValues.length === 1
      }, /*#__PURE__*/react.createElement(Icon, {
        type: value
      })), /*#__PURE__*/react.createElement(Menu$1, {
        anchorEl: this.buttonRef,
        open: opened,
        onClose: this.handleMenuClose,
        MenuListProps: {
          dense: true
        },
        className: classes.selectMenu
      }, availableValues.map(function (valueItem) {
        return /*#__PURE__*/react.createElement(__pika_web_default_export_for_treeshaking__$2, {
          key: valueItem,
          selected: valueItem === value,
          onClick: function onClick() {
            return _this2.handleMenuItemClick(valueItem);
          }
        }, /*#__PURE__*/react.createElement(ListItemIcon$1, {
          className: classes.iconItem
        }, /*#__PURE__*/react.createElement(Icon, {
          type: valueItem,
          className: classes.icon,
          fontSize: "small"
        })), /*#__PURE__*/react.createElement(ListItemText$1, null, getMessage(valueItem)));
      }))) : null;
    }
  }]);

  return FilterSelectorBase;
}(react.PureComponent);
FilterSelectorBase.defaultProps = {
  value: undefined,
  availableValues: [],
  onChange: function onChange() {},
  disabled: false
};
var FilterSelector = withStyles(styles$u, {
  name: 'FilterSelector'
})(FilterSelectorBase);

var _excluded$B = ["buttonRef", "onToggle", "disabled", "children"];
var ToggleButton$1 = function ToggleButton(_ref) {
  var buttonRef = _ref.buttonRef,
      onToggle = _ref.onToggle,
      disabled = _ref.disabled,
      children = _ref.children,
      restProps = _objectWithoutProperties(_ref, _excluded$B);

  return /*#__PURE__*/react.createElement(IconButton$1, _extends$1({
    buttonRef: buttonRef,
    onClick: onToggle,
    disabled: disabled
  }, restProps), children);
};
ToggleButton$1.defaultProps = {
  children: undefined,
  disabled: false
};

var _excluded$C = ["type"];
var AVAILABLE_PATHS = {
  contains: 'M6.094 19.563l-2.031 0.281c-0.646 0.094-1.13 0.266-1.453 0.516-0.302 0.24-0.453 0.646-0.453 1.219 0 0.438 0.138 0.799 0.414 1.086s0.664 0.419 1.164 0.398c0.708 0 1.281-0.24 1.719-0.719 0.427-0.49 0.641-1.125 0.641-1.906v-0.875zM8.234 24.641h-2.172v-1.641c-0.677 1.24-1.661 1.859-2.953 1.859-0.927 0-1.682-0.276-2.266-0.828-0.552-0.552-0.828-1.292-0.828-2.219 0-1.927 1.068-3.052 3.203-3.375l2.875-0.438c0-1.469-0.656-2.203-1.969-2.203-1.177 0-2.224 0.427-3.141 1.281v-2.078c1.010-0.656 2.198-0.984 3.563-0.984 2.458 0 3.687 1.302 3.687 3.906v6.719zM14.734 16.797c0.521-0.583 1.167-0.875 1.938-0.875 0.74 0 1.323 0.281 1.75 0.844 0.448 0.583 0.672 1.38 0.672 2.391 0 1.188-0.24 2.13-0.719 2.828-0.49 0.677-1.13 1.016-1.922 1.016-0.719 0-1.302-0.271-1.75-0.813-0.427-0.51-0.641-1.141-0.641-1.891v-1.266c-0.021-0.906 0.203-1.651 0.672-2.234zM16.969 24.859c1.375 0 2.443-0.521 3.203-1.562 0.781-1.042 1.172-2.427 1.172-4.156 0-1.542-0.354-2.771-1.063-3.688-0.688-0.958-1.651-1.438-2.891-1.438-1.427 0-2.531 0.693-3.313 2.078v-6.781h-2.156v15.328h2.172v-1.5c0.677 1.146 1.635 1.719 2.875 1.719zM22.266 6.125c0.135 0 0.245 0.063 0.328 0.188 0.104 0.073 0.156 0.182 0.156 0.328v22.953c0 0.125-0.052 0.24-0.156 0.344-0.083 0.115-0.193 0.172-0.328 0.172h-12.281c-0.146 0-0.266-0.057-0.359-0.172-0.115-0.115-0.172-0.229-0.172-0.344v-22.953c0-0.135 0.057-0.245 0.172-0.328 0.094-0.125 0.214-0.188 0.359-0.188h12.281zM31.531 24.141c-0.76 0.479-1.693 0.719-2.797 0.719-1.427 0-2.589-0.479-3.484-1.438-0.865-0.958-1.286-2.198-1.266-3.719 0-1.688 0.448-3.052 1.344-4.094 0.917-1.042 2.208-1.573 3.875-1.594 0.854 0 1.63 0.177 2.328 0.531v2.156c-0.677-0.531-1.391-0.792-2.141-0.781-0.938 0-1.714 0.339-2.328 1.016-0.594 0.677-0.891 1.552-0.891 2.625 0 1.042 0.297 1.88 0.891 2.516 0.521 0.615 1.25 0.922 2.188 0.922 0.813 0 1.573-0.297 2.281-0.891v2.031z',
  notContains: 'M5.828 20.469v0.328c0 0.385-0.057 0.667-0.172 0.844-0.052 0.083-0.117 0.177-0.195 0.281s-0.174 0.224-0.289 0.359c-0.458 0.521-1.031 0.771-1.719 0.75-0.521 0-0.927-0.141-1.219-0.422-0.292-0.292-0.438-0.661-0.438-1.109 0-0.156 0.010-0.273 0.031-0.352s0.052-0.141 0.094-0.188 0.094-0.086 0.156-0.117 0.141-0.078 0.234-0.141c0.031-0.031 0.078-0.070 0.141-0.117s0.146-0.086 0.25-0.117h3.125zM14.016 18.328c0.010-0.406 0.070-0.729 0.18-0.969s0.289-0.49 0.539-0.75c0.479-0.604 1.13-0.906 1.953-0.906 0.75 0 1.344 0.292 1.781 0.875 0.198 0.25 0.349 0.495 0.453 0.734s0.172 0.578 0.203 1.016h-5.109zM19.078 20.469c-0.063 0.427-0.146 0.708-0.25 0.844-0.052 0.073-0.109 0.159-0.172 0.258l-0.219 0.352c-0.469 0.688-1.135 1.031-2 1.031-0.708 0-1.297-0.271-1.766-0.813l-0.305-0.359c-0.089-0.104-0.159-0.198-0.211-0.281-0.104-0.167-0.156-0.448-0.156-0.844v-0.188h5.078zM33.344 18.328l-6.875 0c0.031-0.198 0.070-0.372 0.117-0.523s0.107-0.284 0.18-0.398 0.154-0.224 0.242-0.328l0.305-0.344c0.604-0.688 1.391-1.031 2.359-1.031 0.771 0 1.51 0.266 2.219 0.797v-2.234c-0.75-0.333-1.552-0.5-2.406-0.5-1.667 0-2.974 0.531-3.922 1.594-0.396 0.427-0.708 0.859-0.938 1.297s-0.385 0.995-0.469 1.672h-2.719c-0.021-0.719-0.117-1.31-0.289-1.773s-0.424-0.914-0.758-1.352c-0.729-0.938-1.719-1.417-2.969-1.438-1.479 0-2.615 0.708-3.406 2.125v-6.953h-2.266v9.391h-3.75v-0.594c0-2.646-1.25-3.969-3.75-3.969-1.365 0-2.583 0.328-3.656 0.984v2.125c0.99-0.865 2.063-1.297 3.219-1.297 1.344 0 2.016 0.75 2.016 2.25l-2.953 0.125c-0.25 0.021-0.487 0.070-0.711 0.148l-0.633 0.227h-3.328v2.141h1.828l-0.281 0.594c-0.073 0.135-0.109 0.37-0.109 0.703 0 0.938 0.276 1.682 0.828 2.234 0.542 0.573 1.313 0.859 2.313 0.859 1.281 0 2.297-0.635 3.047-1.906v1.656h2.172v-4.141h3.75v4.141h2.297v-1.516c0.677 1.188 1.661 1.776 2.953 1.766 1.385 0 2.464-0.531 3.234-1.594 0.302-0.385 0.557-0.792 0.766-1.219 0.198-0.385 0.339-0.911 0.422-1.578h2.703c0.021 0.708 0.141 1.25 0.359 1.625 0.115 0.198 0.253 0.401 0.414 0.609s0.346 0.427 0.555 0.656c0.906 1 2.099 1.5 3.578 1.5 1.104 0 2.057-0.245 2.859-0.734v-2.109c-0.75 0.604-1.526 0.917-2.328 0.938-0.979 0-1.74-0.318-2.281-0.953l-0.328-0.328c-0.094-0.094-0.177-0.195-0.25-0.305s-0.13-0.234-0.172-0.375-0.073-0.315-0.094-0.523h6.906v-2.141zM33.297 5.688c0.146 0 0.266 0.047 0.359 0.141 0.104 0.104 0.156 0.229 0.156 0.375v23.484c0 0.135-0.052 0.255-0.156 0.359-0.094 0.115-0.214 0.172-0.359 0.172h-35.078c-0.135 0-0.26-0.057-0.375-0.172-0.094-0.115-0.135-0.234-0.125-0.359v-23.484c0-0.104 0.042-0.229 0.125-0.375 0.104-0.094 0.229-0.141 0.375-0.141h35.078z',
  startsWith: 'M6.109 20.688c0 0.813-0.219 1.474-0.656 1.984-0.448 0.531-1.010 0.786-1.688 0.766-0.51 0-0.896-0.141-1.156-0.422-0.302-0.292-0.443-0.667-0.422-1.125 0-0.615 0.151-1.042 0.453-1.281 0.177-0.135 0.378-0.245 0.602-0.328s0.497-0.146 0.82-0.188l2.047-0.313v0.906zM8.203 18.063c0-2.688-1.219-4.031-3.656-4.031-1.333 0-2.51 0.339-3.531 1.016v2.141c0.917-0.885 1.948-1.328 3.094-1.328 1.333 0 2 0.766 2 2.297l-2.891 0.453c-2.115 0.333-3.161 1.516-3.141 3.547 0 0.958 0.266 1.724 0.797 2.297 0.542 0.573 1.292 0.859 2.25 0.859 1.292 0 2.26-0.641 2.906-1.922v1.688h2.172v-7.016zM14.703 16.906c0.479-0.604 1.109-0.906 1.891-0.906 0.76 0 1.344 0.297 1.75 0.891 0.438 0.615 0.656 1.443 0.656 2.484 0 1.219-0.229 2.198-0.688 2.938-0.469 0.719-1.109 1.078-1.922 1.078-0.719 0-1.286-0.281-1.703-0.844-0.448-0.542-0.672-1.208-0.672-2v-1.313c-0.010-0.938 0.219-1.714 0.688-2.328zM16.906 25.313c1.365 0 2.422-0.542 3.172-1.625 0.771-1.115 1.156-2.563 1.156-4.344 0-1.604-0.339-2.885-1.016-3.844-0.698-0.979-1.661-1.469-2.891-1.469-1.438 0-2.531 0.719-3.281 2.156v-7.078h-2.188v15.969h2.172v-1.563c0.667 1.198 1.625 1.797 2.875 1.797zM31.375 24.563c-0.75 0.5-1.672 0.75-2.766 0.75-1.427 0-2.583-0.505-3.469-1.516-0.885-0.969-1.318-2.26-1.297-3.875 0-1.74 0.464-3.161 1.391-4.266 0.927-1.063 2.198-1.604 3.813-1.625 0.844 0 1.62 0.172 2.328 0.516v2.25c-0.688-0.563-1.406-0.828-2.156-0.797-0.927 0-1.688 0.349-2.281 1.047-0.583 0.698-0.875 1.609-0.875 2.734 0 1.094 0.281 1.969 0.844 2.625 0.542 0.656 1.286 0.984 2.234 0.984 0.781 0 1.526-0.323 2.234-0.969v2.141zM22.172 5.844c0.115 0 0.224 0.052 0.328 0.156 0.094 0.125 0.141 0.25 0.141 0.375v23.844c0 0.156-0.047 0.286-0.141 0.391-0.115 0.094-0.224 0.141-0.328 0.141h-23.469c-0.125 0-0.24-0.047-0.344-0.141-0.094-0.104-0.141-0.234-0.141-0.391v-23.844c0-0.125 0.047-0.25 0.141-0.375 0.104-0.104 0.219-0.156 0.344-0.156h23.469z',
  endsWith: 'M6.234 19.344l-2.047 0.313c-0.625 0.083-1.104 0.26-1.438 0.531-0.302 0.24-0.453 0.651-0.453 1.234 0 0.469 0.141 0.852 0.422 1.148s0.672 0.435 1.172 0.414c0.677 0 1.234-0.25 1.672-0.75 0.448-0.51 0.672-1.167 0.672-1.969v-0.922zM8.359 24.578h-2.141v-1.656c-0.667 1.26-1.656 1.891-2.969 1.891-0.938 0-1.698-0.276-2.281-0.828-0.542-0.573-0.813-1.328-0.813-2.266 0-2.021 1.063-3.188 3.188-3.5l2.891-0.484c0-1.51-0.661-2.266-1.984-2.266-1.167 0-2.214 0.443-3.141 1.328v-2.125c1.042-0.677 2.224-1.016 3.547-1.016 2.469 0 3.703 1.333 3.703 4v6.922zM14.906 16.516c0.49-0.615 1.13-0.922 1.922-0.922 0.76 0 1.339 0.297 1.734 0.891 0.438 0.615 0.656 1.438 0.656 2.469 0 1.208-0.229 2.182-0.688 2.922-0.469 0.698-1.115 1.047-1.938 1.047-0.708 0-1.276-0.276-1.703-0.828-0.458-0.552-0.688-1.214-0.688-1.984v-1.281c-0.010-0.948 0.224-1.719 0.703-2.313zM17.125 24.813c1.354 0 2.417-0.531 3.188-1.594 0.781-1.073 1.172-2.505 1.172-4.297 0-1.604-0.349-2.87-1.047-3.797-0.698-0.979-1.661-1.469-2.891-1.469-1.438 0-2.542 0.714-3.313 2.141v-7h-2.203v15.781h2.188v-1.531c0.677 1.177 1.646 1.766 2.906 1.766zM31.688 21.969c-0.698 0.635-1.453 0.953-2.266 0.953-0.958 0-1.703-0.323-2.234-0.969-0.563-0.667-0.849-1.536-0.859-2.609 0-1.115 0.297-2.016 0.891-2.703 0.594-0.698 1.359-1.047 2.297-1.047 0.76 0 1.484 0.266 2.172 0.797v-2.219c-0.708-0.344-1.49-0.516-2.344-0.516-1.625 0-2.906 0.536-3.844 1.609-0.938 1.083-1.406 2.495-1.406 4.234 0 1.594 0.438 2.875 1.313 3.844 0.885 0.979 2.052 1.469 3.5 1.469 1.083 0 2.010-0.245 2.781-0.734v-2.109zM33.188 5.563c0.104 0 0.219 0.047 0.344 0.141 0.094 0.146 0.141 0.276 0.141 0.391v23.578c0 0.146-0.047 0.281-0.141 0.406-0.125 0.094-0.24 0.141-0.344 0.141h-23.625c-0.125 0-0.24-0.047-0.344-0.141-0.094-0.135-0.135-0.271-0.125-0.406v-23.578c0-0.115 0.042-0.245 0.125-0.391 0.094-0.094 0.208-0.141 0.344-0.141h23.625z',
  equal: 'M29.438 11.797v2.75h-26.922v-2.75h26.922zM29.438 17.406v2.75h-26.922v-2.75h26.922z',
  notEqual: 'M16.906 11.797l3.016-6.547 2.094 1-2.547 5.547h9.969v2.75h-11.234l-1.328 2.859h12.563v2.75h-13.828l-2.875 6.281-2.094-0.984 2.438-5.297h-10.563v-2.75h11.828l1.297-2.859h-13.125v-2.75h14.391z',
  greaterThan: 'M24.125 16.047l-14.906 8.625-1.375-2.375 10.781-6.25-10.781-6.234 1.375-2.375z',
  greaterThanOrEqual: 'M23.031 14.328l-14.906 8.625-1.375-2.375 10.797-6.25-10.797-6.234 1.375-2.375zM23.828 15.641l1.375 2.391-14.938 8.609-1.375-2.375z',
  lessThan: 'M22.75 7.438l1.375 2.375-10.781 6.234 10.781 6.25-1.375 2.375-14.906-8.609z',
  lessThanOrEqual: 'M23.828 5.719l1.375 2.375-10.813 6.234 10.813 6.25-1.375 2.375-14.922-8.609zM23.047 24.266l-1.375 2.375-14.922-8.609 1.375-2.391z'
};
var Icon$1 = /*#__PURE__*/react.memo(function (_ref) {
  var type = _ref.type,
      restProps = _objectWithoutProperties(_ref, _excluded$C);

  var path = AVAILABLE_PATHS[type];
  return path ? /*#__PURE__*/react.createElement(SvgIcon, _extends$1({
    viewBox: "0 0 32 32",
    fontSize: "small"
  }, restProps), /*#__PURE__*/react.createElement("path", {
    d: path
  })) : /*#__PURE__*/react.createElement(SearchIcon, restProps);
});
Icon$1.defaultProps = {
  type: undefined
};

var TableFilterRow = withComponents({
  Row: TableRow$1,
  Cell: TableFilterCell,
  Editor: Editor,
  FilterSelector: FilterSelector,
  Icon: Icon$1,
  ToggleButton: ToggleButton$1
})(TableFilterRow$1);
TableFilterRow.ROW_TYPE = TableFilterRow$1.ROW_TYPE;

var styles$v = function styles(theme) {
  return {
    resizeHandle: {
      position: 'absolute',
      userSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none',
      width: theme.spacing(2),
      top: 0,
      right: -theme.spacing(1),
      height: '100%',
      cursor: 'col-resize',
      zIndex: 100
    },
    resizeHandleLine: {
      position: 'absolute',
      backgroundColor: theme.palette.primary.light,
      height: '50%',
      width: '1px',
      top: '25%',
      transition: 'all linear 100ms'
    },
    resizeHandleFirstLine: {
      left: "".concat(theme.spacing(1) - 1, "px")
    },
    resizeHandleSecondLine: {
      left: "".concat(theme.spacing(1) + 1, "px")
    },
    resizeHandleLineActive: {
      left: theme.spacing(1)
    },
    resizeHandleActive: {
      '& $resizeHandleLine': {
        opacity: '1',
        backgroundColor: theme.palette.primary.light,
        height: 'calc(100% - 4px)',
        top: '2px'
      }
    }
  };
};

var ResizingControlBase = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ResizingControlBase, _React$PureComponent);

  var _super = _createSuper(ResizingControlBase);

  function ResizingControlBase(props) {
    var _this;

    _classCallCheck(this, ResizingControlBase);

    _this = _super.call(this, props);
    _this.state = {
      resizing: false
    };

    _this.onResizeStart = function (_ref) {
      var x = _ref.x;
      _this.resizeStartingX = x;

      _this.setState({
        resizing: true
      });
    };

    _this.onResizeUpdate = function (_ref2) {
      var x = _ref2.x;
      var onWidthDraft = _this.props.onWidthDraft;
      onWidthDraft({
        shift: x - _this.resizeStartingX
      });
    };

    _this.onResizeEnd = function (_ref3) {
      var x = _ref3.x;
      var _this$props = _this.props,
          onWidthChange = _this$props.onWidthChange,
          onWidthDraftCancel = _this$props.onWidthDraftCancel;
      onWidthDraftCancel();
      onWidthChange({
        shift: x - _this.resizeStartingX
      });

      _this.setState({
        resizing: false
      });
    };

    return _this;
  }

  _createClass(ResizingControlBase, [{
    key: "render",
    value: function render() {
      var _classNames, _classNames2, _classNames3;

      var _this$props2 = this.props,
          classes = _this$props2.classes,
          resizeHandleOpacityClass = _this$props2.resizeHandleOpacityClass,
          resizeLastHandleClass = _this$props2.resizeLastHandleClass;
      var resizing = this.state.resizing;
      return /*#__PURE__*/react.createElement(Draggable, {
        onStart: this.onResizeStart,
        onUpdate: this.onResizeUpdate,
        onEnd: this.onResizeEnd
      }, /*#__PURE__*/react.createElement("div", {
        className: clsx((_classNames = {}, _defineProperty(_classNames, classes.resizeHandle, true), _defineProperty(_classNames, resizeLastHandleClass, true), _defineProperty(_classNames, classes.resizeHandleActive, resizing), _classNames))
      }, /*#__PURE__*/react.createElement("div", {
        className: clsx((_classNames2 = {}, _defineProperty(_classNames2, resizeHandleOpacityClass, true), _defineProperty(_classNames2, classes.resizeHandleLine, true), _defineProperty(_classNames2, classes.resizeHandleFirstLine, true), _defineProperty(_classNames2, classes.resizeHandleLineActive, resizing), _classNames2))
      }), /*#__PURE__*/react.createElement("div", {
        className: clsx((_classNames3 = {}, _defineProperty(_classNames3, resizeHandleOpacityClass, true), _defineProperty(_classNames3, classes.resizeHandleLine, true), _defineProperty(_classNames3, classes.resizeHandleSecondLine, true), _defineProperty(_classNames3, classes.resizeHandleLineActive, resizing), _classNames3))
      })));
    }
  }]);

  return ResizingControlBase;
}(react.PureComponent);
var ResizingControl = withStyles(styles$v, {
  name: 'ResizingControl'
})(ResizingControlBase);

var _excluded$D = ["style", "column", "tableColumn", "draggingEnabled", "resizingEnabled", "onWidthChange", "onWidthDraft", "onWidthDraftCancel", "getCellWidth", "classes", "tableRow", "className", "children"];

var styles$w = function styles(theme) {
  return {
    plainTitle: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: theme.spacing(3)
    },
    cell: {
      outline: 'none',
      position: 'relative',
      overflow: 'visible',
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      '&:first-child': {
        paddingLeft: theme.spacing(3)
      },
      '&:hover $resizeHandleLine': {
        opacity: 1
      },
      '&:nth-last-child(2) $resizeHandle': {
        width: theme.spacing(1),
        right: '1px'
      }
    },
    resizeHandle: {},
    resizeHandleLine: {
      opacity: 0
    },
    '@media (pointer: fine)': {
      resizeHandleLine: {
        opacity: 0
      },
      resizeHandleActive: {
        '& $resizeHandleLine': {
          opacity: 1
        }
      },
      resizeHandle: {
        '&:hover $resizeHandleLine': {
          opacity: 1
        }
      }
    },
    cellNoUserSelect: {
      userSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none'
    },
    cellDraggable: {
      cursor: 'pointer'
    },
    cellDimmed: {
      '&:after': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: theme.palette.background.paper,
        opacity: 0.7,
        pointerEvents: 'none',
        zIndex: 400
      }
    },
    cellRight: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      textAlign: 'right'
    },
    cellCenter: {
      textAlign: 'center'
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    cellNoWrap: {
      whiteSpace: 'nowrap'
    }
  };
};

var TableHeaderCellBase = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(TableHeaderCellBase, _React$PureComponent);

  var _super = _createSuper(TableHeaderCellBase);

  function TableHeaderCellBase(props) {
    var _this;

    _classCallCheck(this, TableHeaderCellBase);

    _this = _super.call(this, props);
    _this.state = {
      dragging: false
    };
    _this.dragRef = /*#__PURE__*/react.createRef();
    _this.cellRef = /*#__PURE__*/react.createRef();

    _this.getWidthGetter = function () {
      var getCellWidth = _this.props.getCellWidth;
      var node = _this.cellRef.current;
      return node && getCellWidth(function () {
        var _node$getBoundingClie = node.getBoundingClientRect(),
            width = _node$getBoundingClie.width;

        return width;
      });
    };

    _this.onDragStart = function () {
      _this.setState({
        dragging: true
      });
    };

    _this.onDragEnd = function () {
      if (_this.dragRef.current) {
        _this.setState({
          dragging: false
        });
      }
    };

    return _this;
  }

  _createClass(TableHeaderCellBase, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.getWidthGetter();
    }
  }, {
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          style = _this$props.style,
          column = _this$props.column,
          tableColumn = _this$props.tableColumn,
          draggingEnabled = _this$props.draggingEnabled,
          resizingEnabled = _this$props.resizingEnabled,
          onWidthChange = _this$props.onWidthChange,
          onWidthDraft = _this$props.onWidthDraft,
          onWidthDraftCancel = _this$props.onWidthDraftCancel,
          getCellWidth = _this$props.getCellWidth,
          classes = _this$props.classes,
          tableRow = _this$props.tableRow,
          className = _this$props.className,
          children = _this$props.children,
          restProps = _objectWithoutProperties(_this$props, _excluded$D);

      var dragging = this.state.dragging;
      var align = tableColumn && tableColumn.align || 'left';
      var tableCellClasses = clsx((_classNames = {}, _defineProperty(_classNames, classes.cell, true), _defineProperty(_classNames, classes.cellRight, align === 'right'), _defineProperty(_classNames, classes.cellCenter, align === 'center'), _defineProperty(_classNames, classes.cellNoUserSelect, draggingEnabled), _defineProperty(_classNames, classes.cellDraggable, draggingEnabled), _defineProperty(_classNames, classes.cellDimmed, dragging || tableColumn && tableColumn.draft), _defineProperty(_classNames, classes.cellNoWrap, !(tableColumn && tableColumn.wordWrapEnabled)), _classNames), className);
      var cellLayout = /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
        style: style,
        className: tableCellClasses,
        ref: this.cellRef
      }, restProps), /*#__PURE__*/react.createElement("div", {
        className: classes.container
      }, children), resizingEnabled && /*#__PURE__*/react.createElement(ResizingControl, {
        onWidthChange: onWidthChange,
        onWidthDraft: onWidthDraft,
        onWidthDraftCancel: onWidthDraftCancel,
        resizeLastHandleClass: classes.resizeHandle,
        resizeHandleOpacityClass: classes.resizeHandleLine
      }));
      return draggingEnabled ? /*#__PURE__*/react.createElement(DragSource, {
        ref: this.dragRef,
        payload: [{
          type: 'column',
          columnName: column.name
        }],
        onStart: this.onDragStart,
        onEnd: this.onDragEnd
      }, cellLayout) : cellLayout;
    }
  }]);

  return TableHeaderCellBase;
}(react.PureComponent);
TableHeaderCellBase.defaultProps = {
  column: undefined,
  tableColumn: undefined,
  tableRow: undefined,
  style: null,
  draggingEnabled: false,
  resizingEnabled: false,
  onWidthChange: undefined,
  onWidthDraft: undefined,
  onWidthDraftCancel: undefined,
  className: undefined,
  children: undefined,
  getCellWidth: function getCellWidth() {}
};
var TableHeaderCell = withStyles(styles$w, {
  name: 'TableHeaderCell'
})(TableHeaderCellBase);

var _excluded$E = ["column", "align", "direction", "children", "onSort", "classes", "getMessage", "disabled", "className"];
var ENTER_KEY_CODE$1 = 13;
var SPACE_KEY_CODE$1 = 32;

var styles$x = function styles() {
  return {
    root: {
      width: '100%',
      userSelect: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none'
    },
    tooltipRoot: {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    sortLabelRoot: {
      maxWidth: '100%'
    },
    sortLabelRight: {
      flexDirection: 'row-reverse'
    },
    sortLabelActive: {
      color: 'inherit'
    }
  };
};

var _onClick = function onClick(e, onSort) {
  var isActionKeyDown = e.keyCode === ENTER_KEY_CODE$1 || e.keyCode === SPACE_KEY_CODE$1;
  var isMouseClick = e.keyCode === undefined;
  var cancelSortingRelatedKey = e.metaKey || e.ctrlKey;
  var direction = (isMouseClick || isActionKeyDown) && cancelSortingRelatedKey ? null : undefined;
  var keepOther = e.shiftKey || cancelSortingRelatedKey;
  e.preventDefault();
  onSort({
    direction: direction,
    keepOther: keepOther
  });
};

var SortLabelBase = function SortLabelBase(_ref) {
  var _classNames;

  var column = _ref.column,
      align = _ref.align,
      direction = _ref.direction,
      children = _ref.children,
      onSort = _ref.onSort,
      classes = _ref.classes,
      getMessage = _ref.getMessage,
      disabled = _ref.disabled,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$E);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(classes.root, className)
  }, restProps), /*#__PURE__*/react.createElement(Tooltip$1, {
    title: getMessage('sortingHint'),
    placement: align === 'right' ? 'bottom-end' : 'bottom-start',
    enterDelay: 300,
    classes: {
      tooltip: classes.tooltipRoot
    }
  }, /*#__PURE__*/react.createElement(TableSortLabel$1, {
    active: !!direction,
    direction: direction === null ? undefined : direction,
    onClick: function onClick(e) {
      return _onClick(e, onSort);
    },
    disabled: disabled,
    classes: {
      root: clsx((_classNames = {}, _defineProperty(_classNames, classes.sortLabelRoot, true), _defineProperty(_classNames, classes.sortLabelRight, align === 'right'), _classNames)),
      active: classes.sortLabelActive
    }
  }, children)));
};
SortLabelBase.defaultProps = {
  column: undefined,
  direction: undefined,
  disabled: false,
  align: 'left',
  className: null,
  children: undefined
};
var SortLabel = withStyles(styles$x, {
  name: 'SortLabel'
})(SortLabelBase);

var _excluded$F = ["disabled", "onGroup", "classes", "className"];

var styles$y = function styles(theme) {
  return {
    root: {
      paddingLeft: 0,
      height: theme.spacing(3),
      cursor: 'pointer'
    },
    disabled: {
      cursor: 'default',
      opacity: 0.3
    }
  };
};

var GroupButtonBase = function GroupButtonBase(_ref) {
  var _classNames;

  var disabled = _ref.disabled,
      onGroup = _ref.onGroup,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$F);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    onClick: function onClick(e) {
      if (disabled) return;
      e.stopPropagation();
      onGroup(e);
    },
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.root, true), _defineProperty(_classNames, classes.disabled, disabled), _classNames), className)
  }, restProps), /*#__PURE__*/react.createElement(List$1, null));
};
GroupButtonBase.defaultProps = {
  disabled: false,
  className: undefined
};
var GroupButton = withStyles(styles$y, {
  name: 'GroupButton'
})(GroupButtonBase);

var _excluded$G = ["children", "classes", "className"];
var styles$z = {
  title: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};

var TitelBase = function TitelBase(_ref) {
  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$G);

  return /*#__PURE__*/react.createElement("span", _extends$1({
    className: clsx(classes.title, className)
  }, restProps), children);
};
TitelBase.defaultProps = {
  className: null,
  children: undefined
};
var Title = withStyles(styles$z, {
  name: 'Title'
})(TitelBase);

var _excluded$H = ["column", "align", "children", "classes", "className"];
var styles$A = {
  content: {
    width: '100%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  alignCenter: {
    justifyContent: 'center'
  },
  alignRight: {
    justifyContent: 'flex-end'
  }
};

var ContentBase$1 = function ContentBase(_ref) {
  var _classNames;

  var column = _ref.column,
      align = _ref.align,
      children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$H);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.content, true), _defineProperty(_classNames, classes.alignCenter, align === 'center'), _defineProperty(_classNames, classes.alignRight, align === 'right'), _classNames), className)
  }, restProps), children);
};
ContentBase$1.defaultProps = {
  column: undefined,
  align: 'left',
  className: null,
  children: undefined
};
var Content$1 = withStyles(styles$A, {
  name: 'Content'
})(ContentBase$1);

var _excluded$I = ["messages"];
var defaultMessages$2 = {
  sortingHint: 'Sort'
};
var TableHeaderRowWithMessages = withPatchedProps(function (_ref) {
  var messages = _ref.messages,
      restProps = _objectWithoutProperties(_ref, _excluded$I);

  return _objectSpread2({
    messages: _objectSpread2(_objectSpread2({}, defaultMessages$2), messages)
  }, restProps);
})(TableHeaderRow$1);
TableHeaderRowWithMessages.propTypes = {
  messages: propTypes.shape({
    sortingHint: propTypes.string
  })
};
TableHeaderRowWithMessages.defaultProps = {
  messages: {}
};
TableHeaderRowWithMessages.components = TableHeaderRow$1.components;
var TableHeaderRow = withComponents({
  Cell: TableHeaderCell,
  Row: TableRow$1,
  Content: Content$1,
  SortLabel: SortLabel,
  Title: Title,
  GroupButton: GroupButton
})(TableHeaderRowWithMessages);
TableHeaderRow.ROW_TYPE = TableHeaderRow$1.ROW_TYPE;

var _excluded$J = ["column", "value", "children", "classes", "tableRow", "tableColumn", "row", "className", "beforeBorder"];

var styles$B = function styles(theme) {
  return {
    cell: {
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      '&:first-child': {
        paddingLeft: theme.spacing(3)
      },
      '&:last-child': {
        paddingRight: theme.spacing(3),
        borderRight: 0
      },
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      borderBottom: getBorder(theme),
      borderRight: getBorder(theme)
    },
    beforeBorder: {
      borderLeft: getBorder(theme)
    }
  };
};

var CellBase$1 = function CellBase(_ref) {
  var _classNames;

  var column = _ref.column,
      value = _ref.value,
      children = _ref.children,
      classes = _ref.classes,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      row = _ref.row,
      className = _ref.className,
      beforeBorder = _ref.beforeBorder,
      restProps = _objectWithoutProperties(_ref, _excluded$J);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.cell, true), _defineProperty(_classNames, classes.beforeBorder, beforeBorder), _classNames), className)
  }, restProps), children);
};
CellBase$1.defaultProps = {
  value: undefined,
  column: undefined,
  row: undefined,
  children: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  className: undefined,
  beforeBorder: false
};
var Cell$1 = withStyles(styles$B, {
  name: 'Cell'
})(CellBase$1);

var _excluded$K = ["component", "className", "classes", "beforeBorder"];

var styles$C = function styles(theme) {
  return {
    headerCellBorder: {
      borderRight: getBorder(theme),
      borderTop: 'none',
      '&:last-child': {
        borderRight: 0
      },
      verticalAlign: 'bottom',
      paddingBottom: theme.spacing(2)
    },
    beforeBorder: {
      borderLeft: getBorder(theme)
    }
  };
};

var BandedHeaderCellBase = function BandedHeaderCellBase(_ref) {
  var _classNames;

  var HeaderCellComponent = _ref.component,
      className = _ref.className,
      classes = _ref.classes,
      beforeBorder = _ref.beforeBorder,
      restProps = _objectWithoutProperties(_ref, _excluded$K);

  return /*#__PURE__*/react.createElement(HeaderCellComponent, _extends$1({
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.headerCellBorder, true), _defineProperty(_classNames, classes.beforeBorder, beforeBorder), _classNames), className)
  }, restProps));
};
BandedHeaderCellBase.defaultProps = {
  className: undefined,
  beforeBorder: false
};
var BandedHeaderCell = withStyles(styles$C, {
  name: 'BandedHeaderCell'
})(BandedHeaderCellBase);

var styles$D = {
  emptyCell: {
    display: 'none'
  }
};

var InvisibleCellBase = function InvisibleCellBase(_ref) {
  var classes = _ref.classes;
  return /*#__PURE__*/react.createElement(TableCell$1, {
    className: classes.emptyCell
  });
};
var InvisibleCell = withStyles(styles$D, {
  name: 'InvisibleCell'
})(InvisibleCellBase);

var _excluded$L = ["children", "classes", "className", "row", "tableRow", "tableColumn"];
var styles$E = {
  row: {
    height: 'auto'
  }
};
var RowBase$1 = function RowBase(_ref) {
  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      row = _ref.row,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      restProps = _objectWithoutProperties(_ref, _excluded$L);

  return /*#__PURE__*/react.createElement(TableRowMUI, _extends$1({
    className: clsx(classes.row, className)
  }, restProps), children);
};
RowBase$1.defaultProps = {
  children: undefined,
  row: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  className: undefined
};
var Row$1 = withStyles(styles$E, {
  name: 'Row'
})(RowBase$1);

var TableBandHeader = withComponents({
  Cell: Cell$1,
  Row: Row$1,
  BandedHeaderCell: BandedHeaderCell,
  InvisibleCell: InvisibleCell
})(TableBandHeader$1);
TableBandHeader.ROW_TYPE = TableBandHeader$1.ROW_TYPE;

var _excluded$M = ["column", "value", "onValueChange", "style", "classes", "children", "row", "tableRow", "tableColumn", "editingEnabled", "className", "autoFocus", "onBlur", "onFocus", "onKeyDown"];

var styles$F = function styles(theme) {
  return {
    cell: {
      padding: theme.spacing(1),
      // NOTE: without the TableEditColumn first EditCell changes size
      // (because first TableCell and EditCell have different paddings)
      '&:first-child': {
        paddingLeft: theme.spacing(3)
      }
    },
    inputRoot: {
      width: '100%'
    },
    disabledInput: {
      color: theme.palette.action.disabled,
      '&:before': {
        borderBottom: '1px dotted',
        borderBottomColor: theme.palette.action.disabled
      },
      '&&:hover:before': {
        borderBottom: '1px dotted',
        borderBottomColor: theme.palette.action.disabled
      },
      '&:after': {
        borderBottom: '0px'
      }
    },
    inputRight: {
      textAlign: 'right'
    },
    inputCenter: {
      textAlign: 'center'
    }
  };
};

var EditCellBase = function EditCellBase(_ref) {
  var _classNames, _classNames2;

  var column = _ref.column,
      value = _ref.value,
      onValueChange = _ref.onValueChange,
      style = _ref.style,
      classes = _ref.classes,
      children = _ref.children,
      row = _ref.row,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      editingEnabled = _ref.editingEnabled,
      className = _ref.className,
      autoFocus = _ref.autoFocus,
      onBlur = _ref.onBlur,
      onFocus = _ref.onFocus,
      onKeyDown = _ref.onKeyDown,
      restProps = _objectWithoutProperties(_ref, _excluded$M);

  var inputClasses = clsx((_classNames = {}, _defineProperty(_classNames, classes.inputRight, tableColumn && tableColumn.align === 'right'), _defineProperty(_classNames, classes.inputCenter, tableColumn && tableColumn.align === 'center'), _classNames));
  var patchedChildren = children ? /*#__PURE__*/react.cloneElement(children, {
    autoFocus: autoFocus,
    onBlur: onBlur,
    onFocus: onFocus,
    onKeyDown: onKeyDown
  }) : children;
  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx(classes.cell, className),
    style: style
  }, restProps), patchedChildren || /*#__PURE__*/react.createElement(__pika_web_default_export_for_treeshaking__$1, {
    className: clsx((_classNames2 = {}, _defineProperty(_classNames2, classes.inputRoot, true), _defineProperty(_classNames2, classes.disabledInput, !editingEnabled), _classNames2)),
    classes: {
      input: inputClasses
    },
    value: value,
    readOnly: !editingEnabled,
    onChange: function onChange(e) {
      return onValueChange(e.target.value);
    } // eslint-disable-next-line jsx-a11y/no-autofocus
    ,
    autoFocus: autoFocus,
    onBlur: onBlur,
    onFocus: onFocus,
    onKeyDown: onKeyDown
  }));
};
EditCellBase.defaultProps = {
  column: undefined,
  row: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  value: '',
  style: null,
  children: undefined,
  className: undefined,
  editingEnabled: true,
  autoFocus: false,
  onValueChange: function onValueChange() {},
  onBlur: function onBlur() {},
  onFocus: function onFocus() {},
  onKeyDown: function onKeyDown() {}
};
var EditCell = withStyles(styles$F, {
  name: 'EditCell'
})(EditCellBase);

var TableEditRow = withComponents({
  Row: TableRow$1,
  Cell: EditCell
})(TableEditRow$1);
TableEditRow.ADDED_ROW_TYPE = TableEditRow$1.ADDED_ROW_TYPE;
TableEditRow.EDIT_ROW_TYPE = TableEditRow$1.EDIT_ROW_TYPE;

var _excluded$N = ["onExecute", "text", "classes", "className"],
    _excluded2$1 = ["children", "classes", "className", "tableRow", "tableColumn", "rowSpan"],
    _excluded3 = ["tableRow", "tableColumn", "row", "children", "classes", "className"];

var styles$G = function styles(theme) {
  return {
    button: {
      padding: theme.spacing(1),
      minWidth: 40
    },
    headingCell: {
      whiteSpace: 'nowrap',
      textAlign: 'center',
      padding: theme.spacing(0, 2, 0, 3)
    },
    cell: {
      whiteSpace: 'nowrap',
      textAlign: 'center',
      padding: theme.spacing(0, 2, 0, 3)
    },
    alignWithRowSpan: {
      verticalAlign: 'bottom',
      paddingBottom: theme.spacing(1.25)
    }
  };
};

var withEditColumnStyles = withStyles(styles$G, {
  name: 'EditColumn'
});

var CommandButtonBase = function CommandButtonBase(_ref) {
  var onExecute = _ref.onExecute,
      text = _ref.text,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$N);

  return /*#__PURE__*/react.createElement(Button$1, _extends$1({
    color: "primary",
    className: clsx(classes.button, className),
    onClick: function onClick(e) {
      e.stopPropagation();
      onExecute();
    }
  }, restProps), text);
};
CommandButtonBase.defaultProps = {
  className: undefined
};
var CommandButton = withEditColumnStyles(CommandButtonBase);

var EditCommandHeadingCellBase = function EditCommandHeadingCellBase(_ref2) {
  var _classNames;

  var children = _ref2.children,
      classes = _ref2.classes,
      className = _ref2.className,
      tableRow = _ref2.tableRow,
      tableColumn = _ref2.tableColumn,
      rowSpan = _ref2.rowSpan,
      restProps = _objectWithoutProperties(_ref2, _excluded2$1);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.headingCell, true), _defineProperty(_classNames, classes.alignWithRowSpan, rowSpan > 1), _classNames), className),
    rowSpan: rowSpan
  }, restProps), children);
};
EditCommandHeadingCellBase.defaultProps = {
  children: undefined,
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  rowSpan: undefined
};
var EditCommandHeadingCell = withEditColumnStyles(EditCommandHeadingCellBase);

var EditCommandCellBase = function EditCommandCellBase(_ref3) {
  var tableRow = _ref3.tableRow,
      tableColumn = _ref3.tableColumn,
      row = _ref3.row,
      children = _ref3.children,
      classes = _ref3.classes,
      className = _ref3.className,
      restProps = _objectWithoutProperties(_ref3, _excluded3);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx(classes.cell, className)
  }, restProps), children);
};
EditCommandCellBase.defaultProps = {
  children: undefined,
  className: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  row: undefined
};
var EditCommandCell = withEditColumnStyles(EditCommandCellBase);

var TableEditColumnWithWidth = withPatchedProps(function (props) {
  return _objectSpread2({
    width: 150
  }, props);
})(TableEditColumn$1);
TableEditColumnWithWidth.components = TableEditColumn$1.components;
var TableEditColumn = withComponents({
  Cell: EditCommandCell,
  HeaderCell: EditCommandHeadingCell,
  Command: CommandButton
})(TableEditColumnWithWidth);
TableEditColumn.COLUMN_TYPE = TableEditColumn$1.COLUMN_TYPE;

var _excluded$O = ["getMessage", "classes"];

var styles$H = function styles(theme) {
  return {
    emptyMessage: {
      margin: '0 auto',
      padding: theme.spacing(5, 0),
      fontFamily: theme.typography.fontFamily,
      color: theme.typography.subtitle1.color,
      fontSize: theme.typography.subtitle1.fontSize
    }
  };
};

var EmptyMessageBase = function EmptyMessageBase(_ref) {
  var getMessage = _ref.getMessage,
      classes = _ref.classes,
      restProps = _objectWithoutProperties(_ref, _excluded$O);

  return /*#__PURE__*/react.createElement(Toolbar$1, restProps, /*#__PURE__*/react.createElement("big", {
    className: classes.emptyMessage
  }, getMessage('noColumns')));
};
var EmptyMessage = withStyles(styles$H, {
  name: 'EmptyMessage'
})(EmptyMessageBase);

var TableColumnVisibility = withComponents({
  EmptyMessage: EmptyMessage
})(TableColumnVisibility$1);

var TableReorderingCell = function TableReorderingCell(_ref) {
  var style = _ref.style,
      getCellDimensions = _ref.getCellDimensions;

  var refHandler = function refHandler(node) {
    return node && getCellDimensions(function () {
      return getCellGeometries(node);
    });
  };

  return /*#__PURE__*/react.createElement("td", {
    ref: refHandler,
    style: _objectSpread2(_objectSpread2({}, style), {}, {
      padding: 0
    })
  });
};
TableReorderingCell.defaultProps = {
  style: null
};

var _excluded$P = ["className", "classes"];

var styles$I = function styles() {
  return {
    row: {
      visibility: 'hidden'
    }
  };
};

var TableInvisibleRowBase = function TableInvisibleRowBase(_ref) {
  var className = _ref.className,
      classes = _ref.classes,
      restParams = _objectWithoutProperties(_ref, _excluded$P);

  return /*#__PURE__*/react.createElement(TableRow$1, _extends$1({
    className: clsx(classes.row, className)
  }, restParams));
};
TableInvisibleRowBase.defaultProps = {
  className: undefined
};
var TableInvisibleRow = withStyles(styles$I, {
  name: 'TableInvisibleRow'
})(TableInvisibleRowBase);

var TableColumnReordering = withComponents({
  Row: TableInvisibleRow,
  Cell: TableReorderingCell
})(TableColumnReordering$1);

var _excluded$R = ["children", "classes", "className", "style"];

var styles$J = function styles(theme) {
  return {
    toolbar: {
      borderBottom: getBorder(theme),
      flex: 'none'
    }
  };
};

var ToolbarBase = function ToolbarBase(_ref) {
  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      style = _ref.style,
      restProps = _objectWithoutProperties(_ref, _excluded$R);

  return /*#__PURE__*/react.createElement(Toolbar$1, _extends$1({
    style: style,
    className: clsx(classes.toolbar, className)
  }, restProps), children);
};
ToolbarBase.defaultProps = {
  className: undefined,
  style: null
};
var Toolbar$2 = withStyles(styles$J, {
  name: 'Toolbar'
})(ToolbarBase);

var FlexibleSpace = function FlexibleSpace() {
  return /*#__PURE__*/react.createElement("div", {
    style: {
      flex: '0 0 0',
      marginLeft: 'auto'
    }
  });
};

var Toolbar$1$1 = withComponents({
  Root: Toolbar$2,
  FlexibleSpace: FlexibleSpace
})(Toolbar$3);

var _excluded$S = ["visible", "expanded", "classes", "onToggle", "className"];

var styles$K = function styles(theme) {
  return {
    button: {
      marginTop: '-1px',
      marginBottom: '-1px',
      marginLeft: -theme.spacing(1),
      marginRight: theme.spacing(2),
      padding: theme.spacing(1)
    },
    hidden: {
      cursor: 'default',
      opacity: 0
    }
  };
};

var TableTreeExpandButtonBase = function TableTreeExpandButtonBase(_ref) {
  var _classNames;

  var visible = _ref.visible,
      expanded = _ref.expanded,
      classes = _ref.classes,
      onToggle = _ref.onToggle,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$S);

  return /*#__PURE__*/react.createElement(IconButton$1, _extends$1({
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.button, true), _defineProperty(_classNames, classes.hidden, !visible), _classNames), className),
    onClick: function onClick(e) {
      if (!visible) return;
      e.stopPropagation();
      onToggle();
    },
    tabIndex: visible ? 0 : -1
  }, restProps), expanded ? /*#__PURE__*/react.createElement(ExpandMore$1, null) : /*#__PURE__*/react.createElement(ChevronRight$1, null));
};
TableTreeExpandButtonBase.defaultProps = {
  visible: false,
  expanded: false,
  onToggle: function onToggle() {},
  className: undefined
};
var TableTreeExpandButton = withStyles(styles$K)(TableTreeExpandButtonBase);

var _excluded$T = ["disabled", "checked", "indeterminate", "onChange", "classes", "className"];

var styles$L = function styles(theme) {
  return {
    checkbox: {
      marginTop: '-1px',
      marginBottom: '-1px',
      marginRight: theme.spacing(2),
      marginLeft: -theme.spacing(2),
      padding: theme.spacing(1)
    }
  };
};

var TableTreeCheckboxBase = function TableTreeCheckboxBase(_ref) {
  var disabled = _ref.disabled,
      checked = _ref.checked,
      indeterminate = _ref.indeterminate,
      onChange = _ref.onChange,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$T);

  return /*#__PURE__*/react.createElement(Checkbox$1, _extends$1({
    className: clsx(classes.checkbox, className),
    checked: checked,
    indeterminate: indeterminate,
    disabled: disabled,
    onClick: function onClick(e) {
      if (disabled) return;
      e.stopPropagation();
      onChange();
    }
  }, restProps));
};
TableTreeCheckboxBase.defaultProps = {
  disabled: false,
  checked: false,
  indeterminate: false,
  onChange: function onChange() {},
  className: undefined
};
var TableTreeCheckbox = withStyles(styles$L)(TableTreeCheckboxBase);

var styles$M = function styles(theme) {
  return {
    indent: {
      marginLeft: theme.spacing(3)
    }
  };
};

var TableTreeIndentBase = /*#__PURE__*/react.memo(function (_ref) {
  var level = _ref.level,
      classes = _ref.classes;
  return Array.from({
    length: level
  }).map(function (value, currentLevel) {
    return /*#__PURE__*/react.createElement("span", {
      // eslint-disable-next-line react/no-array-index-key
      key: currentLevel,
      className: classes.indent
    });
  });
});
TableTreeIndentBase.propTypes = {
  level: propTypes.number,
  classes: propTypes.object.isRequired
};
TableTreeIndentBase.defaultProps = {
  level: 0
};
var TableTreeIndent = withStyles(styles$M)(TableTreeIndentBase);

var _excluded$U = ["children", "classes", "className"];

var styles$N = function styles() {
  return {
    content: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  };
};

var TableTreeContentBase = function TableTreeContentBase(_ref) {
  var children = _ref.children,
      classes = _ref.classes,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$U);

  return /*#__PURE__*/react.createElement("div", _extends$1({
    className: clsx(_defineProperty({}, classes.content, true), className)
  }, restProps), children);
};
TableTreeContentBase.defaultProps = {
  children: undefined,
  className: undefined
};
var TableTreeContent = withStyles(styles$N)(TableTreeContentBase);

var _excluded$V = ["column", "value", "children", "classes", "tableRow", "tableColumn", "row", "className"];

var styles$O = function styles(theme) {
  return {
    cell: {
      padding: theme.spacing(0.5, 1),
      '&:first-child': {
        paddingLeft: theme.spacing(3)
      }
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center'
    },
    cellNoWrap: {
      whiteSpace: 'nowrap'
    },
    cellRightAlign: {
      textAlign: 'right'
    },
    cellCenterAlign: {
      textAlign: 'center'
    }
  };
};

var TableTreeCellBase = function TableTreeCellBase(_ref) {
  var _classNames;

  var column = _ref.column,
      value = _ref.value,
      children = _ref.children,
      classes = _ref.classes,
      tableRow = _ref.tableRow,
      tableColumn = _ref.tableColumn,
      row = _ref.row,
      className = _ref.className,
      restProps = _objectWithoutProperties(_ref, _excluded$V);

  return /*#__PURE__*/react.createElement(TableCell$1, _extends$1({
    className: clsx((_classNames = {}, _defineProperty(_classNames, classes.cell, true), _defineProperty(_classNames, classes.cellNoWrap, !(tableColumn && tableColumn.wordWrapEnabled)), _defineProperty(_classNames, classes.cellRightAlign, tableColumn && tableColumn.align === 'right'), _defineProperty(_classNames, classes.cellCenterAlign, tableColumn && tableColumn.align === 'center'), _classNames), className)
  }, restProps), /*#__PURE__*/react.createElement("div", {
    className: classes.container
  }, children));
};
TableTreeCellBase.defaultProps = {
  value: undefined,
  column: undefined,
  row: undefined,
  children: undefined,
  tableRow: undefined,
  tableColumn: undefined,
  className: undefined
};
var TableTreeCell = withStyles(styles$O)(TableTreeCellBase);

var TableTreeColumn = withComponents({
  Cell: TableTreeCell,
  Content: TableTreeContent,
  Indent: TableTreeIndent,
  ExpandButton: TableTreeExpandButton,
  Checkbox: TableTreeCheckbox
})(TableTreeColumn$1);

var _excluded$W = ["onValueChange", "value", "getMessage"];

var styles$P = function styles(theme) {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      color: theme.palette.action.active
    }
  };
};

var SearchPanelInputBase = function SearchPanelInputBase(_ref) {
  var onValueChange = _ref.onValueChange,
      value = _ref.value,
      getMessage = _ref.getMessage,
      restProps = _objectWithoutProperties(_ref, _excluded$W);

  return /*#__PURE__*/react.createElement(__pika_web_default_export_for_treeshaking__$1, _extends$1({
    onChange: function onChange(e) {
      return onValueChange(e.target.value);
    },
    value: value,
    type: "text",
    placeholder: getMessage('searchPlaceholder')
  }, restProps, {
    startAdornment: /*#__PURE__*/react.createElement(InputAdornment$1, {
      position: "start"
    }, /*#__PURE__*/react.createElement(SearchIcon, null))
  }));
};
SearchPanelInputBase.defaultProps = {
  value: ''
};
var SearchPanelInput = withStyles(styles$P)(SearchPanelInputBase);

var SearchPanel = withComponents({
  Input: SearchPanelInput
})(SearchPanel$1);

var _excluded$X = ["className", "classes", "component", "position", "selected", "showLeftDivider", "showRightDivider", "side", "style"];

var styles$Q = function styles(theme) {
  return {
    dividerRight: {
      borderRight: getBorder(theme)
    },
    dividerLeft: {
      borderLeft: getBorder(theme)
    },
    fixedCell: getStickyCellStyle(theme),
    selected: {
      backgroundColor: 'inherit'
    }
  };
};

var FixedCellBase = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(FixedCellBase, _React$PureComponent);

  var _super = _createSuper(FixedCellBase);

  function FixedCellBase() {
    _classCallCheck(this, FixedCellBase);

    return _super.apply(this, arguments);
  }

  _createClass(FixedCellBase, [{
    key: "render",
    value: function render() {
      var _classNames;

      var _this$props = this.props,
          className = _this$props.className,
          classes = _this$props.classes,
          CellPlaceholder = _this$props.component,
          position = _this$props.position,
          selected = _this$props.selected,
          showLeftDivider = _this$props.showLeftDivider,
          showRightDivider = _this$props.showRightDivider,
          side = _this$props.side,
          style = _this$props.style,
          restProps = _objectWithoutProperties(_this$props, _excluded$X);

      return /*#__PURE__*/react.createElement(CellPlaceholder, _extends$1({
        className: clsx((_classNames = {}, _defineProperty(_classNames, classes.dividerLeft, showLeftDivider), _defineProperty(_classNames, classes.dividerRight, showRightDivider), _defineProperty(_classNames, classes.fixedCell, true), _defineProperty(_classNames, classes.selected, selected), _classNames), className),
        style: _objectSpread2(_objectSpread2({}, style), {}, _defineProperty({}, side, position))
      }, restProps));
    }
  }]);

  return FixedCellBase;
}(react.PureComponent);
FixedCellBase.defaultProps = {
  className: undefined,
  position: undefined,
  selected: false,
  showLeftDivider: false,
  showRightDivider: false,
  style: null
};
var FixedCell = withStyles(styles$Q, {
  name: 'TableFixedCell'
})(FixedCellBase);

var _excluded$Y = ["className", "classes"],
    _excluded2$2 = ["listen", "onSizeChange"];

var styles$R = function styles() {
  return {
    cell: {
      border: 0
    }
  };
};

var TableBorderlessStubCellBase = function TableBorderlessStubCellBase(_ref) {
  var className = _ref.className,
      classes = _ref.classes,
      restProps = _objectWithoutProperties(_ref, _excluded$Y);

  return /*#__PURE__*/react.createElement(TableStubCell, _extends$1({
    className: clsx(classes.cell, className)
  }, restProps));
};
TableBorderlessStubCellBase.defaultProps = {
  className: undefined
};
var TableBorderlessStubCell = withStyles(styles$R, {
  name: 'TableBorderlessStubCell'
})(TableBorderlessStubCellBase);
var TableListenerCell = function TableListenerCell(_ref2) {
  var listen = _ref2.listen,
      onSizeChange = _ref2.onSizeChange,
      restProps = _objectWithoutProperties(_ref2, _excluded2$2);

  return listen ? /*#__PURE__*/react.createElement(Sizer, _extends$1({
    containerComponent: TableBorderlessStubCell,
    onSizeChange: onSizeChange
  }, restProps)) : /*#__PURE__*/react.createElement(TableBorderlessStubCell, restProps);
};

var TableFixedColumns = withComponents({
  Cell: FixedCell,
  ListenerRow: TableInvisibleRow,
  ListenerCell: TableListenerCell
})(TableFixedColumns$1);

var TableSummaryRow = withComponents({
  TotalRow: TableRow$1,
  GroupRow: TableRow$1,
  TreeRow: TableRow$1,
  TotalCell: TableCell$2,
  GroupCell: TableCell$2,
  TreeCell: TableCell$2,
  TableTreeCell: TableTreeCell,
  TableTreeContent: TableTreeContent,
  TableTreeIndent: TableTreeIndent,
  Item: TableSummaryItem
})(TableSummaryRow$1);
TableSummaryRow.TREE_ROW_TYPE = TableSummaryRow$1.TREE_ROW_TYPE;
TableSummaryRow.GROUP_ROW_TYPE = TableSummaryRow$1.GROUP_ROW_TYPE;
TableSummaryRow.TOTAL_ROW_TYPE = TableSummaryRow$1.TOTAL_ROW_TYPE;

var TableInlineCellEditing = withComponents({
  Cell: EditCell
})(TableInlineCellEditing$1);

var _excluded$Z = ["onToggle", "getMessage", "buttonRef"];
var ToggleButton$2 = function ToggleButton(_ref) {
  var onToggle = _ref.onToggle,
      getMessage = _ref.getMessage,
      buttonRef = _ref.buttonRef,
      restProps = _objectWithoutProperties(_ref, _excluded$Z);

  return /*#__PURE__*/react.createElement(Tooltip$1, {
    title: getMessage('showExportMenu'),
    placement: "bottom",
    enterDelay: 300
  }, /*#__PURE__*/react.createElement(IconButton$1, _extends$1({
    onClick: onToggle,
    ref: buttonRef
  }, restProps), /*#__PURE__*/react.createElement(Save$1, null)));
};

var _excluded$_ = ["visible", "target", "onHide", "children"];
var Menu = function Menu(_ref) {
  var visible = _ref.visible,
      target = _ref.target,
      onHide = _ref.onHide,
      children = _ref.children,
      restProps = _objectWithoutProperties(_ref, _excluded$_);

  return /*#__PURE__*/react.createElement(Menu$1, _extends$1({
    keepMounted: true,
    open: visible,
    anchorEl: target,
    onClose: onHide
  }, restProps), children);
};
Menu.defaultProps = {
  visible: false,
  target: null
};

var _excluded$$ = ["text", "onClick"];
var MenuItem = /*#__PURE__*/react.forwardRef(function (_ref, ref) {
  var text = _ref.text,
      onClick = _ref.onClick,
      restProps = _objectWithoutProperties(_ref, _excluded$$);

  return /*#__PURE__*/react.createElement(__pika_web_default_export_for_treeshaking__$2, _extends$1({
    onClick: onClick,
    ref: ref
  }, restProps), text);
});
MenuItem.propTypes = {
  text: propTypes.string.isRequired,
  onClick: propTypes.func
};
MenuItem.defaultProps = {
  onClick: function onClick() {}
};

var ExportPanel = withComponents({
  ToggleButton: ToggleButton$2,
  Menu: Menu,
  MenuItem: MenuItem
})(ExportPanel$1);

export { Grid, PagingPanel, Table$1$1 as Table, TableEditColumn, TableEditRow, TableFilterRow, TableHeaderRow, Toolbar$1$1 as Toolbar };
