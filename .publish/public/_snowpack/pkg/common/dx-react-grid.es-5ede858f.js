import { r as react } from './index-0ff745df.js';
import { r as reactDom } from './index-1a921524.js';
import { p as propTypes } from './index-89cdc518.js';

/**
 * Bundle of @devexpress/dx-core
 * Generated: 2021-06-24
 * Version: 2.7.6
 * License: https://js.devexpress.com/Licensing
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}
var compare = function (a, b) {
    var aPosition = a.position();
    var bPosition = b.position();
    for (var i = 0; i < Math.min(aPosition.length, bPosition.length); i += 1) {
        if (aPosition[i] < bPosition[i])
            return -1;
        if (aPosition[i] > bPosition[i])
            return 1;
    }
    return aPosition.length - bPosition.length;
};
/** @internal */
var insertPlugin = function (array, newItem) {
    var result = array.slice();
    var nextItemIndex = array.findIndex(function (item) { return compare(newItem, item) <= 0; });
    var targetIndex = nextItemIndex < 0 ? array.length : nextItemIndex;
    var alreadyExists = (targetIndex >= 0 && targetIndex < array.length)
        && compare(newItem, array[targetIndex]) === 0;
    result.splice(targetIndex, alreadyExists ? 1 : 0, newItem);
    return result;
};
/** @internal */
var removePlugin = function (array, item) {
    var itemIndex = array.indexOf(item);
    return itemIndex >= 0 ? __spread(array.slice(0, itemIndex), array.slice(itemIndex + 1)) : array;
};
/** @internal */
var slice = function (arr) { return Array.prototype.slice.call(arr); }; // slice can be renamed to copy as well

var getDependencyError = function (pluginName, dependencyName) { return new Error("The '" + pluginName + "' plugin requires '" + dependencyName + "' to be defined before it."); };
/** @internal */
var PluginHost = /*#__PURE__*/ (function () {
    function PluginHost() {
        this.gettersCache = {};
        this.knownKeysCache = {};
        this.validationRequired = true;
        this.plugins = [];
        this.subscriptions = new Set();
    }
    PluginHost.prototype.ensureDependencies = function () {
        var defined = new Set();
        var knownOptionals = new Map();
        this.plugins
            .filter(function (plugin) { return plugin.container; })
            .forEach(function (plugin) {
            var pluginName = plugin.name || '';
            if (knownOptionals.has(pluginName)) {
                throw (getDependencyError(knownOptionals.get(pluginName), pluginName));
            }
            (plugin.dependencies || [])
                .forEach(function (dependency) {
                if (defined.has(dependency.name))
                    return;
                if (dependency.optional) {
                    if (!knownOptionals.has(dependency.name)) {
                        knownOptionals.set(dependency.name, pluginName);
                    }
                    return;
                }
                throw (getDependencyError(pluginName, dependency.name));
            });
            defined.add(pluginName);
        });
    };
    PluginHost.prototype.registerPlugin = function (plugin) {
        this.plugins = insertPlugin(this.plugins, plugin);
        this.cleanPluginsCache();
    };
    PluginHost.prototype.unregisterPlugin = function (plugin) {
        this.plugins = removePlugin(this.plugins, plugin);
        this.cleanPluginsCache();
    };
    PluginHost.prototype.knownKeys = function (postfix) {
        if (!this.knownKeysCache[postfix]) {
            this.knownKeysCache[postfix] = Array.from(this.plugins
                .map(function (plugin) { return Object.keys(plugin); })
                .map(function (keys) { return keys.filter(function (key) { return key.endsWith(postfix); })[0]; })
                .filter(function (key) { return !!key; })
                .reduce(function (acc, key) { return acc.add(key); }, new Set()))
                .map(function (key) { return key.replace(postfix, ''); });
        }
        return this.knownKeysCache[postfix];
    };
    PluginHost.prototype.collect = function (key, upTo) {
        if (this.validationRequired) {
            this.ensureDependencies();
            this.validationRequired = false;
        }
        var res = this.gettersCache[key];
        if (!res) {
            // Add cache for original plugin indexes
            var indexCache = this.plugins
                .map(function (plugin, index) { return ({ key: plugin[key], index: index }); })
                .filter(function (plugin) { return !!plugin.key; });
            this.gettersCache[key + "_i"] = indexCache;
            res = indexCache.map(function (item) { return item.key; });
            this.gettersCache[key] = res;
        }
        if (!upTo)
            return res;
        var upToIndex = this.plugins.indexOf(upTo);
        // Try to get a result from upToIndex cache first.
        var upToIndexKey = key + upToIndex;
        var upToRes = this.gettersCache[upToIndexKey];
        if (!upToRes) {
            var indexCache_1 = this.gettersCache[key + "_i"];
            upToRes = this.gettersCache[key]
                .filter(function (getter, index) { return indexCache_1[index].index < upToIndex; });
            this.gettersCache[upToIndexKey] = upToRes;
        }
        return upToRes;
    };
    PluginHost.prototype.get = function (key, upTo) {
        var plugins = this.collect(key, upTo);
        if (!plugins.length)
            return undefined;
        var result;
        // slice creates shallow copy, when do it many times, it costs about 5%
        plugins.forEach(function (plugin) {
            result = plugin(result);
        });
        return result;
    };
    PluginHost.prototype.registerSubscription = function (subscription) {
        this.subscriptions.add(subscription);
    };
    PluginHost.prototype.unregisterSubscription = function (subscription) {
        this.subscriptions.delete(subscription);
    };
    PluginHost.prototype.broadcast = function (event, message) {
        this.subscriptions.forEach(function (subscription) { return subscription[event] && subscription[event](message); });
    };
    PluginHost.prototype.cleanPluginsCache = function () {
        this.validationRequired = true;
        this.gettersCache = {};
        this.knownKeysCache = {};
    };
    return PluginHost;
}());

/** @internal */
var EventEmitter = /*#__PURE__*/ (function () {
    function EventEmitter() {
        this.handlers = [];
    }
    EventEmitter.prototype.emit = function (e) {
        this.handlers.forEach(function (handler) { return handler(e); });
    };
    EventEmitter.prototype.subscribe = function (handler) {
        this.handlers.push(handler);
    };
    EventEmitter.prototype.unsubscribe = function (handler) {
        this.handlers.splice(this.handlers.indexOf(handler), 1);
    };
    return EventEmitter;
}());

/** @internal */
var shallowEqual = function (objA, objB) {
    if (objA === objB) {
        return true;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length) {
        return false;
    }
    // Test for A's keys different from B.
    var hasOwn = Object.prototype.hasOwnProperty;
    // tslint:disable-next-line: prefer-for-of
    for (var i = 0; i < keysA.length; i += 1) {
        if (!hasOwn.call(objB, keysA[i])
            || objA[keysA[i]] !== objB[keysA[i]]) {
            return false;
        }
        var valA = objA[keysA[i]];
        var valB = objB[keysA[i]];
        if (valA !== valB) {
            return false;
        }
    }
    return true;
};
/** @internal */
var argumentsShallowEqual = function (prev, next) {
    if (prev === null || next === null || prev.length !== next.length) {
        return false;
    }
    for (var i = 0; i < prev.length; i += 1) {
        if (prev[i] !== next[i]) {
            return false;
        }
    }
    return true;
};

/** @internal */
var memoize = function (func) {
    var lastArgs = null;
    var lastResult = null;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (lastArgs === null || !argumentsShallowEqual(lastArgs, args)) {
            lastResult = func.apply(void 0, __spread(args));
        }
        lastArgs = args;
        return lastResult;
    };
};
/** @internal */
var easeOutCubic = function (t) { return ((t - 1) * (t - 1) * (t - 1)) + 1; };

var processPattern = function (pattern, params) { return Object.keys(params).reduce(function (msg, key) { return msg.replace("{" + key + "}", params[key]); }, pattern); };
/** @internal */
var getMessagesFormatter = function (messages) { return function (key, params) {
    var message = messages[key];
    if (typeof message === 'function') {
        return message(params);
    }
    if (params) {
        return processPattern(message, params);
    }
    return message !== null && message !== void 0 ? message : '';
}; };

/**
 * Bundle of @devexpress/dx-react-core
 * Generated: 2021-06-24
 * Version: 2.7.6
 * License: https://js.devexpress.com/Licensing
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __read$1(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread$1() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read$1(arguments[i]));
    return ar;
}

/** @internal */
var PluginHostContext = react.createContext(null);
/** @internal */
var PositionContext = react.createContext(function () { return []; });
/** @internal */
var TemplateHostContext = react.createContext(null);

/** @internal */
var PluginIndexer = /*#__PURE__*/ (function (_super) {
    __extends(PluginIndexer, _super);
    function PluginIndexer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.indexes = {};
        _this.memoize = function (index, positionContext) {
            if (_this.indexes[index])
                return _this.indexes[index];
            var fn = function () {
                var calculatedPosition = positionContext();
                return __spread$1(calculatedPosition, [index]);
            };
            _this.indexes[index] = fn;
            return fn;
        };
        return _this;
    }
    PluginIndexer.prototype.render = function () {
        var _this = this;
        var children = this.props.children;
        return (react.createElement(PositionContext.Consumer, null, function (positionContext) { return (react.Children.map(children, function (child, index) {
            if (!child || !child.type)
                return child;
            var childPosition = _this.memoize(index, positionContext);
            return (react.createElement(PositionContext.Provider, { key: String(index), value: childPosition }, child));
        })); }));
    };
    return PluginIndexer;
}(react.PureComponent));

/** @internal */
var PLUGIN_HOST_CONTEXT = 'dxcore_pluginHost_context';
/** @internal */
var POSITION_CONTEXT = 'dxcore_position_context';
/** @internal */
var TEMPLATE_HOST_CONTEXT = 'dxcore_templateHost_context';
/** @internal */
var RERENDER_TEMPLATE_EVENT = Symbol('rerenderTemplate');
/** @internal */
var RERENDER_TEMPLATE_SCOPE_EVENT = Symbol('rerenderTemplateScope');
/** @internal */
var UPDATE_CONNECTION_EVENT = Symbol('updateConnection');

/** @internal */
var withContext = function (Context, name) { return function (Component) { return function (props) { return (react.createElement(Context.Consumer, null, function (context) {
    var _a;
    return (react.createElement(Component, __assign({}, props, (_a = {}, _a[name] = context, _a))));
})); }; }; };
/** @internal */
var withHostAndPosition = function (Component) { return withContext(PluginHostContext, PLUGIN_HOST_CONTEXT)(withContext(PositionContext, POSITION_CONTEXT)(Component)); };

/** @internal */
var PluginBase = /*#__PURE__*/ (function (_super) {
    __extends(PluginBase, _super);
    function PluginBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PluginBase.prototype.componentDidMount = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b], _c = POSITION_CONTEXT, position = _a[_c];
        var _d = this.props, name = _d.name, dependencies = _d.dependencies;
        this.plugin = {
            position: position,
            name: name,
            dependencies: dependencies,
            container: true,
        };
        pluginHost.registerPlugin(this.plugin);
        pluginHost.ensureDependencies();
    };
    PluginBase.prototype.componentDidUpdate = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        pluginHost.ensureDependencies();
    };
    PluginBase.prototype.componentWillUnmount = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        pluginHost.unregisterPlugin(this.plugin);
    };
    PluginBase.prototype.render = function () {
        var children = this.props.children;
        return (react.createElement(PluginIndexer, null, children));
    };
    return PluginBase;
}(react.PureComponent));
var Plugin = withHostAndPosition(PluginBase);

var getRenderingData = function (props) {
    var name = props.name, params = props.params;
    if (name) {
        var _a = props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        return {
            params: params,
            templates: pluginHost.collect(name + "Template")
                .filter(function (template) { return template.predicate(params); })
                .reverse(),
        };
    }
    var _c = props, _d = TEMPLATE_HOST_CONTEXT, templateHost = _c[_d];
    return {
        params: params || templateHost.params(),
        templates: templateHost.templates(),
    };
};
var TemplatePlaceholderBase = /*#__PURE__*/ (function (_super) {
    __extends(TemplatePlaceholderBase, _super);
    function TemplatePlaceholderBase() {
        var _a;
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.subscription = (_a = {},
            _a[RERENDER_TEMPLATE_EVENT] = function (id) {
                if (_this.template && _this.template.id === id) {
                    _this.forceUpdate();
                }
            },
            _a[RERENDER_TEMPLATE_SCOPE_EVENT] = function (name) {
                var propsName = _this.props.name;
                if (propsName === name) {
                    _this.forceUpdate();
                }
            },
            _a);
        _this.template = null;
        _this.params = {};
        return _this;
    }
    TemplatePlaceholderBase.prototype.componentDidMount = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        pluginHost.registerSubscription(this.subscription);
    };
    TemplatePlaceholderBase.prototype.shouldComponentUpdate = function (nextProps) {
        var _a = getRenderingData(nextProps), params = _a.params, templates = _a.templates;
        var children = this.props.children;
        var _b = __read$1(templates, 1), template = _b[0];
        return children !== nextProps.children || this.template !== template
            || !shallowEqual(this.params, params);
    };
    TemplatePlaceholderBase.prototype.componentWillUnmount = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        pluginHost.unregisterSubscription(this.subscription);
    };
    TemplatePlaceholderBase.prototype.render = function () {
        var _a;
        var _this = this;
        var _b = getRenderingData(this.props), params = _b.params, templates = _b.templates;
        this.params = params;
        _a = __read$1(templates, 1), this.template = _a[0];
        var restTemplates = templates.slice(1);
        var content = null;
        if (this.template) {
            var templateContent = this.template.children;
            content = templateContent() || null;
            if (content && typeof content === 'function') {
                content = content(params);
            }
        }
        var templatePlaceholder = this.props.children;
        return (react.createElement(TemplateHostContext.Provider, { value: {
                templates: function () { return restTemplates; },
                params: function () { return _this.params; },
            } }, templatePlaceholder ? templatePlaceholder(content) : content));
    };
    return TemplatePlaceholderBase;
}(react.Component));
/** A React component to which a related Template is rendered. */
var TemplatePlaceholder = withContext(PluginHostContext, PLUGIN_HOST_CONTEXT)(withContext(TemplateHostContext, TEMPLATE_HOST_CONTEXT)(TemplatePlaceholderBase));

/** @internal */
var PluginHostBase = /*#__PURE__*/ (function (_super) {
    __extends(PluginHostBase, _super);
    function PluginHostBase(props) {
        var _this = _super.call(this, props) || this;
        _this.host = new PluginHost();
        return _this;
    }
    PluginHostBase.prototype.render = function () {
        var children = this.props.children;
        return (react.createElement(PluginHostContext.Provider, { value: this.host },
            react.createElement(PluginIndexer, null, children),
            react.createElement(TemplatePlaceholder, { name: "root" })));
    };
    return PluginHostBase;
}(react.PureComponent));
var PluginHost$1 = PluginHostBase;

/** @internal */
var getAvailableGetters = function (pluginHost, getGetterValue) {
    if (getGetterValue === void 0) { getGetterValue = function (getterName) { return pluginHost.get(getterName + "Getter"); }; }
    var trackedDependencies = {};
    var getters;
    if (typeof Proxy !== 'undefined') {
        getters = new Proxy({}, {
            get: function (target, prop) {
                if (typeof prop !== 'string')
                    return undefined;
                var result = getGetterValue(prop);
                trackedDependencies[prop] = result;
                return result;
            },
            getOwnPropertyDescriptor: function (target, prop) {
                return {
                    configurable: true,
                    enumerable: true,
                    value: this.get(target, prop, undefined),
                };
            },
            ownKeys: function () {
                return pluginHost.knownKeys('Getter');
            },
        });
    }
    else {
        getters = pluginHost.knownKeys('Getter')
            .reduce(function (acc, getterName) {
            Object.defineProperty(acc, getterName, {
                get: function () {
                    var result = getGetterValue(getterName);
                    trackedDependencies[getterName] = result;
                    return result;
                },
            });
            return acc;
        }, {});
    }
    return { getters: getters, trackedDependencies: trackedDependencies };
};
/** @internal */
var isTrackedDependenciesChanged = function (pluginHost, prevTrackedDependencies, getGetterValue) {
    if (getGetterValue === void 0) { getGetterValue = function (getterName) { return pluginHost.get(getterName + "Getter"); }; }
    var trackedDependencies = Object.keys(prevTrackedDependencies)
        // tslint:disable-next-line: prefer-object-spread
        .reduce(function (acc, getterName) {
        var _a;
        return Object.assign(acc, (_a = {},
            _a[getterName] = getGetterValue(getterName),
            _a));
    }, {});
    return !shallowEqual(prevTrackedDependencies, trackedDependencies);
};
/** @internal */
var getAvailableActions = function (pluginHost, getAction) {
    if (getAction === void 0) { getAction = function (actionName) { return pluginHost.collect(actionName + "Action").slice().reverse()[0]; }; }
    var actions;
    if (typeof Proxy !== 'undefined') {
        actions = new Proxy({}, {
            get: function (target, prop) {
                if (typeof prop !== 'string')
                    return undefined;
                return getAction(prop);
            },
            getOwnPropertyDescriptor: function (target, prop) {
                return {
                    configurable: true,
                    enumerable: true,
                    value: this.get(target, prop, undefined),
                };
            },
            ownKeys: function () {
                return pluginHost.knownKeys('Action');
            },
        });
    }
    else {
        actions = pluginHost.knownKeys('Action')
            .reduce(function (acc, actionName) {
            Object.defineProperty(acc, actionName, {
                get: function () { return getAction(actionName); },
            });
            return acc;
        }, {});
    }
    return actions;
};

var ActionBase = /*#__PURE__*/ (function (_super) {
    __extends(ActionBase, _super);
    function ActionBase(props) {
        var _a;
        var _this = _super.call(this, props) || this;
        var _b = props, _c = PLUGIN_HOST_CONTEXT, pluginHost = _b[_c], _d = POSITION_CONTEXT, positionContext = _b[_d];
        var name = props.name;
        _this.plugin = (_a = {
                position: function () { return positionContext(); }
            },
            _a[name + "Action"] = function (params) {
                var action = _this.props.action;
                var getters = getAvailableGetters(pluginHost, function (getterName) { return pluginHost.get(getterName + "Getter", _this.plugin); }).getters;
                var nextParams = params;
                var actions = getAvailableActions(pluginHost, function (actionName) { return (actionName === name
                    ? function (newParams) { nextParams = newParams; }
                    : pluginHost.collect(actionName + "Action", _this.plugin).slice().reverse()[0]); });
                action(params, getters, actions);
                var nextAction = pluginHost.collect(name + "Action", _this.plugin).slice().reverse()[0];
                if (nextAction) {
                    nextAction(nextParams);
                }
            },
            _a);
        pluginHost.registerPlugin(_this.plugin);
        return _this;
    }
    ActionBase.prototype.componentWillUnmount = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        pluginHost.unregisterPlugin(this.plugin);
    };
    ActionBase.prototype.render = function () {
        return null;
    };
    return ActionBase;
}(react.PureComponent));
var Action = withHostAndPosition(ActionBase);

var GetterBase = /*#__PURE__*/ (function (_super) {
    __extends(GetterBase, _super);
    function GetterBase(props) {
        var _a;
        var _this = _super.call(this, props) || this;
        var _b = props, _c = PLUGIN_HOST_CONTEXT, pluginHost = _b[_c], _d = POSITION_CONTEXT, positionContext = _b[_d];
        var name = props.name;
        var lastComputed;
        var lastTrackedDependencies = {};
        var lastResult;
        _this.plugin = (_a = {
                position: function () { return positionContext(); }
            },
            _a[name + "Getter"] = function (original) {
                var _a = _this.props, value = _a.value, computed = _a.computed;
                if (computed === undefined)
                    return value;
                var getGetterValue = function (getterName) { return ((getterName === name)
                    ? original
                    : pluginHost.get(getterName + "Getter", _this.plugin)); };
                if (computed === lastComputed
                    && !isTrackedDependenciesChanged(pluginHost, lastTrackedDependencies, getGetterValue)) {
                    return lastResult;
                }
                var _b = getAvailableGetters(pluginHost, getGetterValue), getters = _b.getters, trackedDependencies = _b.trackedDependencies;
                var actions = getAvailableActions(pluginHost);
                lastComputed = computed;
                lastTrackedDependencies = trackedDependencies;
                lastResult = computed(getters, actions);
                return lastResult;
            },
            _a);
        pluginHost.registerPlugin(_this.plugin);
        return _this;
    }
    GetterBase.prototype.componentDidUpdate = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        pluginHost.broadcast(UPDATE_CONNECTION_EVENT);
    };
    GetterBase.prototype.componentWillUnmount = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        pluginHost.unregisterPlugin(this.plugin);
    };
    GetterBase.prototype.render = function () {
        return null;
    };
    return GetterBase;
}(react.PureComponent));
var Getter = withHostAndPosition(GetterBase);

var globalTemplateId = 0;
/** @internal */
var TemplateBase = /*#__PURE__*/ (function (_super) {
    __extends(TemplateBase, _super);
    function TemplateBase(props) {
        var _a;
        var _this = _super.call(this, props) || this;
        _this.children = function () { return void 0; };
        globalTemplateId += 1;
        _this.id = globalTemplateId;
        var _b = props, _c = PLUGIN_HOST_CONTEXT, pluginHost = _b[_c], _d = POSITION_CONTEXT, positionContext = _b[_d];
        var name = props.name, predicate = props.predicate;
        _this.plugin = (_a = {
                position: function () { return positionContext(); }
            },
            _a[name + "Template"] = {
                id: _this.id,
                predicate: function (params) { return (predicate ? predicate(params) : true); },
                children: function () {
                    var children = _this.props.children;
                    return children;
                },
            },
            _a);
        pluginHost.registerPlugin(_this.plugin);
        pluginHost.broadcast(RERENDER_TEMPLATE_SCOPE_EVENT, name);
        return _this;
    }
    TemplateBase.prototype.componentDidUpdate = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        pluginHost.broadcast(RERENDER_TEMPLATE_EVENT, this.id);
    };
    TemplateBase.prototype.componentWillUnmount = function () {
        var _a = this.props, _b = PLUGIN_HOST_CONTEXT, pluginHost = _a[_b];
        var name = this.props.name;
        pluginHost.unregisterPlugin(this.plugin);
        pluginHost.broadcast(RERENDER_TEMPLATE_SCOPE_EVENT, name);
    };
    TemplateBase.prototype.render = function () {
        return null;
    };
    return TemplateBase;
}(react.PureComponent));
/*** A React component that defines a markup that is rendered
 * as the corresponding TemplatePlaceholder.
 */
var Template = withHostAndPosition(TemplateBase);

/** @internal */
var TemplateConnectorBase = /*#__PURE__*/ (function (_super) {
    __extends(TemplateConnectorBase, _super);
    function TemplateConnectorBase(props, context) {
        var _a;
        var _this = _super.call(this, props, context) || this;
        _this.trackedDependencies = {};
        _this.subscription = (_a = {},
            _a[UPDATE_CONNECTION_EVENT] = function () { return _this.updateConnection(); },
            _a);
        return _this;
    }
    TemplateConnectorBase.prototype.componentDidMount = function () {
        var pluginHost = this.context;
        pluginHost.registerSubscription(this.subscription);
    };
    TemplateConnectorBase.prototype.componentWillUnmount = function () {
        var pluginHost = this.context;
        pluginHost.unregisterSubscription(this.subscription);
    };
    TemplateConnectorBase.prototype.updateConnection = function () {
        var pluginHost = this.context;
        if (isTrackedDependenciesChanged(pluginHost, this.trackedDependencies)) {
            this.forceUpdate();
        }
    };
    TemplateConnectorBase.prototype.render = function () {
        var pluginHost = this.context;
        var children = this.props.children;
        var _a = getAvailableGetters(pluginHost), getters = _a.getters, trackedDependencies = _a.trackedDependencies;
        this.trackedDependencies = trackedDependencies;
        var actions = getAvailableActions(pluginHost);
        return children(getters, actions);
    };
    return TemplateConnectorBase;
}(react.Component));
TemplateConnectorBase.contextType = PluginHostContext;
/** A React component that provides access to Getters and Actions within a Template. */
var TemplateConnector = TemplateConnectorBase;

var TIMEOUT = 180;
/** @internal */
var TouchStrategy = /*#__PURE__*/ (function () {
    function TouchStrategy(delegate) {
        this.delegate = delegate;
        this.touchStartTimeout = null;
        this.dragging = false;
    }
    TouchStrategy.prototype.isDragging = function () {
        return this.dragging;
    };
    TouchStrategy.prototype.isWaiting = function () {
        return !!this.touchStartTimeout;
    };
    TouchStrategy.prototype.cancelWaiting = function () {
        clearTimeout(this.touchStartTimeout);
        this.touchStartTimeout = undefined;
    };
    TouchStrategy.prototype.start = function (e) {
        var _this = this;
        var _a = e.touches[0], x = _a.clientX, y = _a.clientY;
        this.touchStartTimeout = setTimeout(function () {
            _this.delegate.onStart({ x: x, y: y });
            _this.dragging = true;
        }, TIMEOUT);
    };
    TouchStrategy.prototype.move = function (e) {
        this.cancelWaiting();
        if (this.dragging) {
            var _a = e.touches[0], clientX = _a.clientX, clientY = _a.clientY;
            e.preventDefault();
            this.delegate.onMove({ x: clientX, y: clientY });
        }
    };
    TouchStrategy.prototype.end = function (e) {
        this.cancelWaiting();
        if (this.dragging) {
            var _a = e.changedTouches[0], clientX = _a.clientX, clientY = _a.clientY;
            this.delegate.onEnd({ x: clientX, y: clientY });
        }
        this.mouseInitialOffset = null;
        this.dragging = false;
    };
    return TouchStrategy;
}());

/* globals document:true */
var gestureCover;
/** @internal */
var toggleGestureCover = function (toggle, cursor) {
    var style = {
        pointerEvents: toggle ? 'all' : 'none',
    };
    if (toggle && cursor) {
        style = __assign(__assign({}, style), { cursor: cursor });
    }
    if (!gestureCover) {
        style = __assign(__assign({}, style), { position: 'fixed', top: 0, right: 0, left: 0, bottom: 0, opacity: 0, zIndex: 2147483647 });
        gestureCover = document.createElement('div');
        document.body.appendChild(gestureCover);
    }
    Object.keys(style).forEach(function (key) { gestureCover.style[key] = style[key]; });
};

/* globals document:true window:true */
/** @internal */
var clear = function () {
    var selection = window.getSelection && window.getSelection();
    if (selection) {
        if (selection.empty) {
            selection.empty();
        }
        else if (selection.removeAllRanges) {
            selection.removeAllRanges();
        }
    }
};

/* globals window:true document:true */
var BOUNDARY = 10;
var clamp = function (value, min, max) { return Math.max(Math.min(value, max), min); };
var isBoundExceeded = function (_a, _b) {
    var initialX = _a.x, initialY = _a.y;
    var x = _b.x, y = _b.y;
    return clamp(x, initialX - BOUNDARY, initialX + BOUNDARY) !== x
        || clamp(y, initialY - BOUNDARY, initialY + BOUNDARY) !== y;
};
/** @internal */
var MouseStrategy = /*#__PURE__*/ (function () {
    function MouseStrategy(delegate) {
        this.delegate = delegate;
        this.mouseInitialOffset = null;
        this.dragging = false;
    }
    MouseStrategy.prototype.isDragging = function () {
        return this.dragging;
    };
    MouseStrategy.prototype.start = function (e) {
        var x = e.clientX, y = e.clientY;
        this.e = e;
        this.mouseInitialOffset = { x: x, y: y };
    };
    MouseStrategy.prototype.move = function (e) {
        var x = e.clientX, y = e.clientY;
        var dragStarted = false;
        if (!this.dragging && this.mouseInitialOffset) {
            if (isBoundExceeded(this.mouseInitialOffset, { x: x, y: y })) {
                this.delegate.onStart(this.mouseInitialOffset);
                clear();
                dragStarted = true;
                this.dragging = true;
            }
        }
        if (this.dragging) {
            e.preventDefault();
            this.delegate.onMove({ x: x, y: y });
        }
        if (dragStarted) {
            var element = document.elementFromPoint(x, y);
            var cursor = element ? window.getComputedStyle(element).cursor : null;
            toggleGestureCover(true, cursor);
        }
    };
    MouseStrategy.prototype.end = function (e) {
        if (this.dragging) {
            var x = e.clientX, y = e.clientY;
            toggleGestureCover(false);
            this.delegate.onEnd({ x: x, y: y });
        }
        this.mouseInitialOffset = null;
        this.dragging = false;
    };
    return MouseStrategy;
}());

/* globals window:true */
var eventEmitter;
/** @internal */
var getSharedEventEmitter = function () {
    if (!eventEmitter) {
        eventEmitter = new EventEmitter();
        ['mousemove', 'mouseup', 'touchmove', 'touchend', 'touchcancel']
            .forEach(function (name) { return window.addEventListener(name, function (e) { return eventEmitter.emit([name, e]); }, { passive: false }); });
    }
    return eventEmitter;
};

var draggingHandled = Symbol('draggingHandled');
/** @internal */
var Draggable = /*#__PURE__*/ (function (_super) {
    __extends(Draggable, _super);
    function Draggable(props, context) {
        var _this = _super.call(this, props, context) || this;
        var delegate = {
            onStart: function (_a) {
                var x = _a.x, y = _a.y;
                var onStart = _this.props.onStart;
                if (!onStart)
                    return;
                reactDom.unstable_batchedUpdates(function () {
                    onStart({ x: x, y: y });
                });
            },
            onMove: function (_a) {
                var x = _a.x, y = _a.y;
                var onUpdate = _this.props.onUpdate;
                if (!onUpdate)
                    return;
                reactDom.unstable_batchedUpdates(function () {
                    onUpdate({ x: x, y: y });
                });
            },
            onEnd: function (_a) {
                var x = _a.x, y = _a.y;
                var onEnd = _this.props.onEnd;
                if (!onEnd)
                    return;
                reactDom.unstable_batchedUpdates(function () {
                    onEnd({ x: x, y: y });
                });
            },
        };
        _this.mouseStrategy = new MouseStrategy(delegate);
        _this.touchStrategy = new TouchStrategy(delegate);
        _this.mouseDownListener = _this.mouseDownListener.bind(_this);
        _this.touchStartListener = _this.touchStartListener.bind(_this);
        _this.globalListener = _this.globalListener.bind(_this);
        return _this;
    }
    Draggable.prototype.componentDidMount = function () {
        getSharedEventEmitter().subscribe(this.globalListener);
        this.setupNodeSubscription();
    };
    Draggable.prototype.shouldComponentUpdate = function (nextProps) {
        var children = this.props.children;
        return nextProps.children !== children;
    };
    Draggable.prototype.componentDidUpdate = function () {
        this.setupNodeSubscription();
    };
    Draggable.prototype.componentWillUnmount = function () {
        getSharedEventEmitter().unsubscribe(this.globalListener);
    };
    Draggable.prototype.setupNodeSubscription = function () {
        var node = reactDom.findDOMNode(this);
        if (!node)
            return;
        node.removeEventListener('mousedown', this.mouseDownListener);
        node.removeEventListener('touchstart', this.touchStartListener);
        node.addEventListener('mousedown', this.mouseDownListener);
        node.addEventListener('touchstart', this.touchStartListener, { passive: true });
    };
    Draggable.prototype.mouseDownListener = function (e) {
        if (this.touchStrategy.isWaiting() || e[draggingHandled])
            return;
        e.preventDefault();
        this.mouseStrategy.start(e);
        e[draggingHandled] = true;
    };
    Draggable.prototype.touchStartListener = function (e) {
        if (e[draggingHandled])
            return;
        this.touchStrategy.start(e);
        e[draggingHandled] = true;
    };
    Draggable.prototype.globalListener = function (_a) {
        var _b = __read$1(_a, 2), name = _b[0], e = _b[1];
        switch (name) {
            case 'mousemove':
                this.mouseStrategy.move(e);
                break;
            case 'mouseup':
                this.mouseStrategy.end(e);
                break;
            case 'touchmove': {
                this.touchStrategy.move(e);
                break;
            }
            case 'touchend':
            case 'touchcancel': {
                this.touchStrategy.end(e);
                break;
            }
        }
        if (this.mouseStrategy.isDragging() || this.touchStrategy.isDragging()) {
            clear();
        }
    };
    Draggable.prototype.render = function () {
        var children = this.props.children;
        return children;
    };
    return Draggable;
}(react.Component));

/** @internal */
var DragDropContext = react.createContext(null);

/** @internal */
var DragDropProviderCore = /*#__PURE__*/ (function () {
    function DragDropProviderCore() {
        this.payload = null;
        this.dragEmitter = new EventEmitter();
    }
    DragDropProviderCore.prototype.start = function (payload, clientOffset) {
        this.payload = payload;
        this.dragEmitter.emit({ clientOffset: clientOffset, payload: this.payload });
    };
    DragDropProviderCore.prototype.update = function (clientOffset) {
        this.dragEmitter.emit({ clientOffset: clientOffset, payload: this.payload });
    };
    DragDropProviderCore.prototype.end = function (clientOffset) {
        this.dragEmitter.emit({ clientOffset: clientOffset, payload: this.payload, end: true });
        this.payload = null;
    };
    return DragDropProviderCore;
}());
var defaultProps = {
    onChange: function (_a) {
        var payload = _a.payload, clientOffset = _a.clientOffset;
    },
};
/** @internal */
// tslint:disable-next-line: max-classes-per-file
var DragDropProvider = /*#__PURE__*/ (function (_super) {
    __extends(DragDropProvider, _super);
    function DragDropProvider(props) {
        var _this = _super.call(this, props) || this;
        var onChange = _this.props.onChange;
        _this.dragDropProvider = new DragDropProviderCore();
        _this.dragDropProvider.dragEmitter.subscribe(function (_a) {
            var payload = _a.payload, clientOffset = _a.clientOffset, end = _a.end;
            onChange({
                payload: end ? null : payload,
                clientOffset: end ? null : clientOffset,
            });
        });
        return _this;
    }
    DragDropProvider.prototype.shouldComponentUpdate = function (nextProps) {
        var children = this.props.children;
        return nextProps.children !== children;
    };
    DragDropProvider.prototype.render = function () {
        var children = this.props.children;
        return (react.createElement(DragDropContext.Provider, { value: this.dragDropProvider }, children));
    };
    DragDropProvider.defaultProps = defaultProps;
    return DragDropProvider;
}(react.Component));

var defaultProps$1 = {
    onStart: function (_a) {
        var clientOffset = _a.clientOffset;
    },
    onUpdate: function (_a) {
        var clientOffset = _a.clientOffset;
    },
    onEnd: function (_a) {
        var clientOffset = _a.clientOffset;
    },
};
/** @internal */
var DragSource = /*#__PURE__*/ (function (_super) {
    __extends(DragSource, _super);
    function DragSource() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragSource.prototype.shouldComponentUpdate = function (nextProps) {
        var children = this.props.children;
        return nextProps.children !== children;
    };
    DragSource.prototype.render = function () {
        var dragDropProvider = this.context;
        var _a = this.props, onStart = _a.onStart, onUpdate = _a.onUpdate, onEnd = _a.onEnd, payload = _a.payload, children = _a.children;
        return (react.createElement(Draggable, { onStart: function (_a) {
                var x = _a.x, y = _a.y;
                dragDropProvider.start(payload, { x: x, y: y });
                onStart({ clientOffset: { x: x, y: y } });
            }, onUpdate: function (_a) {
                var x = _a.x, y = _a.y;
                dragDropProvider.update({ x: x, y: y });
                onUpdate({ clientOffset: { x: x, y: y } });
            }, onEnd: function (_a) {
                var x = _a.x, y = _a.y;
                dragDropProvider.end({ x: x, y: y });
                onEnd({ clientOffset: { x: x, y: y } });
            } }, children));
    };
    DragSource.defaultProps = defaultProps$1;
    return DragSource;
}(react.Component));
DragSource.contextType = DragDropContext;

var clamp$1 = function (value, min, max) { return Math.max(Math.min(value, max), min); };
var defaultProps$2 = {
    onEnter: function (args) { },
    onOver: function (args) { },
    onLeave: function (args) { },
    onDrop: function (args) { },
};
/** @internal */
var DropTarget = /*#__PURE__*/ (function (_super) {
    __extends(DropTarget, _super);
    function DropTarget(props) {
        var _this = _super.call(this, props) || this;
        _this.isOver = false;
        _this.handleDrag = _this.handleDrag.bind(_this);
        return _this;
    }
    DropTarget.prototype.componentDidMount = function () {
        var dragEmitter = this.context.dragEmitter;
        dragEmitter.subscribe(this.handleDrag);
    };
    DropTarget.prototype.shouldComponentUpdate = function (nextProps) {
        var children = this.props.children;
        return nextProps.children !== children;
    };
    DropTarget.prototype.componentWillUnmount = function () {
        var dragEmitter = this.context.dragEmitter;
        dragEmitter.unsubscribe(this.handleDrag);
    };
    DropTarget.prototype.handleDrag = function (_a) {
        var payload = _a.payload, clientOffset = _a.clientOffset, end = _a.end;
        var _b = reactDom.findDOMNode(this).getBoundingClientRect(), left = _b.left, top = _b.top, right = _b.right, bottom = _b.bottom;
        var _c = this.props, onDrop = _c.onDrop, onEnter = _c.onEnter, onLeave = _c.onLeave, onOver = _c.onOver;
        var isOver = clientOffset
            && clamp$1(clientOffset.x, left, right) === clientOffset.x
            && clamp$1(clientOffset.y, top, bottom) === clientOffset.y;
        if (!this.isOver && isOver)
            onEnter({ payload: payload, clientOffset: clientOffset });
        if (this.isOver && isOver)
            onOver({ payload: payload, clientOffset: clientOffset });
        if (this.isOver && !isOver)
            onLeave({ payload: payload, clientOffset: clientOffset });
        if (isOver && end)
            onDrop({ payload: payload, clientOffset: clientOffset });
        this.isOver = isOver && !end;
    };
    DropTarget.prototype.render = function () {
        var children = this.props.children;
        return react.Children.only(children);
    };
    DropTarget.defaultProps = defaultProps$2;
    return DropTarget;
}(react.Component));
DropTarget.contextType = DragDropContext;

/** @internal */
var RefHolder = /*#__PURE__*/ (function (_super) {
    __extends(RefHolder, _super);
    function RefHolder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RefHolder.prototype.render = function () {
        var children = this.props.children;
        return children;
    };
    return RefHolder;
}(react.PureComponent));

/* globals document:true */
var styles = {
    root: {
        position: 'relative',
    },
    triggersRoot: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        zIndex: -1,
        visibility: 'hidden',
        opacity: 0,
    },
    expandTrigger: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        overflow: 'auto',
    },
    contractTrigger: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        overflow: 'auto',
        minHeight: '1px',
        minWidth: '1px',
    },
    contractNotifier: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '200%',
        height: '200%',
        minHeight: '2px',
        minWidth: '2px',
    },
};
/** @internal */
var Sizer = /*#__PURE__*/ (function (_super) {
    __extends(Sizer, _super);
    function Sizer(props) {
        var _this = _super.call(this, props) || this;
        _this.getSize = function () { return ({ height: _this.rootNode.clientHeight, width: _this.rootNode.clientWidth }); };
        _this.setupListeners = _this.setupListeners.bind(_this);
        _this.rootRef = react.createRef();
        return _this;
    }
    Sizer.prototype.componentDidMount = function () {
        this.createListeners();
        this.setupListeners();
    };
    Sizer.prototype.componentDidUpdate = function () {
        // We can scroll the VirtualTable manually only by changing
        // containter's (rootNode) scrollTop property.
        // Viewport changes its own properties automatically.
        var scrollTop = this.props.scrollTop;
        if (scrollTop > -1) {
            this.rootNode.scrollTop = scrollTop;
        }
    };
    // There is no need to remove listeners as divs are removed from DOM when component is unmount.
    // But there is a little chance that component unmounting and 'scroll' event happen roughly
    // at the same time so that `setupListeners` is called after component is unmount.
    Sizer.prototype.componentWillUnmount = function () {
        this.expandTrigger.removeEventListener('scroll', this.setupListeners);
        this.contractTrigger.removeEventListener('scroll', this.setupListeners);
    };
    Sizer.prototype.setupListeners = function () {
        var size = this.getSize();
        var width = size.width, height = size.height;
        this.contractTrigger.scrollTop = height;
        this.contractTrigger.scrollLeft = width;
        var scrollOffset = 2;
        this.expandNotifier.style.width = width + scrollOffset + "px";
        this.expandNotifier.style.height = height + scrollOffset + "px";
        this.expandTrigger.scrollTop = scrollOffset;
        this.expandTrigger.scrollLeft = scrollOffset;
        var onSizeChange = this.props.onSizeChange;
        onSizeChange(size);
    };
    Sizer.prototype.createListeners = function () {
        this.rootNode = reactDom.findDOMNode(this.rootRef.current);
        this.triggersRoot = document.createElement('div');
        Object.assign(this.triggersRoot.style, styles.triggersRoot);
        this.rootNode.appendChild(this.triggersRoot);
        this.expandTrigger = document.createElement('div');
        Object.assign(this.expandTrigger.style, styles.expandTrigger);
        this.expandTrigger.addEventListener('scroll', this.setupListeners);
        this.triggersRoot.appendChild(this.expandTrigger);
        this.expandNotifier = document.createElement('div');
        this.expandTrigger.appendChild(this.expandNotifier);
        this.contractTrigger = document.createElement('div');
        Object.assign(this.contractTrigger.style, styles.contractTrigger);
        this.contractTrigger.addEventListener('scroll', this.setupListeners);
        this.triggersRoot.appendChild(this.contractTrigger);
        this.contractNotifier = document.createElement('div');
        Object.assign(this.contractNotifier.style, styles.contractNotifier);
        this.contractTrigger.appendChild(this.contractNotifier);
    };
    Sizer.prototype.render = function () {
        var _a = this.props, onSizeChange = _a.onSizeChange, Container = _a.containerComponent, style = _a.style, scrollTop = _a.scrollTop, restProps = __rest(_a, ["onSizeChange", "containerComponent", "style", "scrollTop"]);
        return (react.createElement(RefHolder, { ref: this.rootRef },
            react.createElement(Container // NOTE: should have `position: relative`
            , __assign({ style: style ? __assign(__assign({}, styles.root), style) : styles.root }, restProps))));
    };
    Sizer.defaultProps = {
        containerComponent: 'div',
    };
    return Sizer;
}(react.PureComponent));

/*** A function that creates a new component that allows you to pass additional properties
 * to the wrapped component.
 */
var connectProps = function (WrappedComponent, getAdditionalProps) {
    var storedAdditionalProps = getAdditionalProps();
    var components = new Set();
    var RenderComponent = /*#__PURE__*/ (function (_super) {
        __extends(RenderComponent, _super);
        function RenderComponent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RenderComponent.prototype.componentDidMount = function () {
            components.add(this);
        };
        RenderComponent.prototype.componentWillUnmount = function () {
            components.delete(this);
        };
        RenderComponent.prototype.render = function () {
            return react.createElement(WrappedComponent, __assign({}, this.props, storedAdditionalProps));
        };
        return RenderComponent;
    }(react.PureComponent));
    RenderComponent.update = function () {
        storedAdditionalProps = getAdditionalProps();
        Array.from(components.values()).forEach(function (component) { return component.forceUpdate(); });
    };
    return RenderComponent;
};

/** @internal */
var createStateHelper = function (component, controlledStateProperties) {
    if (controlledStateProperties === void 0) { controlledStateProperties = {}; }
    var notifyStateChange = function (nextState, state) {
        Object.keys(controlledStateProperties).forEach(function (propertyName) {
            var changeEvent = controlledStateProperties[propertyName]();
            if (changeEvent && nextState[propertyName] !== state[propertyName]) {
                changeEvent(nextState[propertyName]);
            }
        });
    };
    var lastStateUpdater;
    var initialState = null;
    var lastInitialState = null;
    var newState = null;
    var shouldNotify = false;
    var applyReducer = function (reduce, payload, callback) {
        var stateUpdater = function (prevState) {
            if (initialState === null) {
                initialState = prevState;
            }
            var stateChange = reduce(__assign({}, prevState), payload);
            var state = __assign(__assign({}, prevState), stateChange);
            if (typeof callback === 'function') {
                callback(state, prevState);
            }
            if (stateUpdater === lastStateUpdater) {
                if (lastInitialState !== initialState) {
                    newState = state;
                    if (!shouldNotify) {
                        lastInitialState = initialState;
                        shouldNotify = true;
                    }
                }
                initialState = null;
            }
            return stateChange;
        };
        lastStateUpdater = stateUpdater;
        component.setState(stateUpdater, function () {
            if (shouldNotify) {
                notifyStateChange(newState, lastInitialState);
                shouldNotify = false;
            }
        });
    };
    var applyFieldReducer = function (field, reduce, payload) {
        applyReducer(function (state) {
            var _a;
            return (_a = {},
                _a[field] = reduce(state[field], payload),
                _a);
        });
    };
    return {
        applyReducer: applyReducer,
        applyFieldReducer: applyFieldReducer,
    };
};

var makeBoundComponent = function (Target, components, exposed) {
    var Component = /*#__PURE__*/ (function (_super) {
        __extends(Component, _super);
        function Component() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Component.prototype.render = function () {
            return react.createElement(Target, __assign({}, components, this.props));
        };
        return Component;
    }(react.PureComponent));
    Component.components = Target.components;
    Object.assign(Component, exposed);
    return Component;
};
// type ITargetComponentStatic = new() => ITargetComponent;
/** @internal */
var withComponents = function (components) { return function (Target) {
    var props = {};
    var exposed = {};
    var targetComponents = Target.components;
    Object.entries(targetComponents).forEach(function (_a) {
        var _b = __read$1(_a, 2), fieldName = _b[0], componentName = _b[1];
        var component = components[componentName];
        if (component && component !== Target[componentName]) {
            props[fieldName] = component;
        }
        exposed[componentName] = component || Target[componentName];
    });
    return Object.keys(props).length > 0
        ? makeBoundComponent(Target, props, exposed) : Target;
}; };

/* globals Element */
/** @internal */
var RefType = propTypes.shape({
    current: propTypes.instanceOf((typeof Element !== 'undefined') ? Element : Object),
});

/**
 * Bundle of @devexpress/dx-grid-core
 * Generated: 2021-06-24
 * Version: 2.7.6
 * License: https://js.devexpress.com/Licensing
 */

var GRID_GROUP_TYPE = Symbol('group');
var GRID_GROUP_CHECK = Symbol(GRID_GROUP_TYPE.toString() + "_check");
var GRID_GROUP_LEVEL_KEY = Symbol(GRID_GROUP_TYPE.toString() + "_levelKey");
var GRID_GROUP_COLLAPSED_ROWS = Symbol(GRID_GROUP_TYPE.toString() + "_collapsedRows");

var warnIfRowIdUndefined = function (getRowId) { return function (row) {
    var result = getRowId(row);
    if (!row[GRID_GROUP_CHECK] && result === undefined) {
        // tslint:disable-next-line: no-console
        console.warn('The row id is undefined. Check the getRowId function. The row is', row);
    }
    return result;
}; };
var rowIdGetter = function (getRowId, rows) {
    if (!getRowId) {
        var map_1 = new Map(rows.map(function (row, rowIndex) { return [row, rowIndex]; }));
        return function (row) { return map_1.get(row); };
    }
    return warnIfRowIdUndefined(getRowId);
};
var defaultGetCellValue = function (row, columnName) { return row[columnName]; };
var cellValueGetter = function (getCellValue, columns) {
    if (getCellValue === void 0) { getCellValue = defaultGetCellValue; }
    var useFastAccessor = true;
    var map = columns.reduce(function (acc, column) {
        if (column.getCellValue) {
            useFastAccessor = false;
            acc[column.name] = column.getCellValue;
        }
        return acc;
    }, {});
    if (useFastAccessor) {
        return getCellValue;
    }
    return function (row, columnName) { return (map[columnName]
        ? map[columnName](row, columnName)
        : getCellValue(row, columnName)); };
};

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign$1 = function() {
    __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};

function __read$2(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread$2() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read$2(arguments[i]));
    return ar;
}
var getColumnSortingDirection = function (sorting, columnName) {
    var columnSorting = sorting.filter(function (s) { return s.columnName === columnName; })[0];
    return columnSorting ? columnSorting.direction : null;
};

/* eslint-disable no-plusplus, no-param-reassign, no-use-before-define, no-constant-condition */
/* tslint:disable no-increment-decrement */
var merge = function (array, auxiliary, lo, mid, hi, compare) {
    var i = lo;
    var j = mid + 1;
    var k = lo;
    while (true) {
        var cmp = compare(array[i], array[j]);
        if (cmp <= 0) {
            auxiliary[k++] = array[i++];
            if (i > mid) {
                do {
                    auxiliary[k++] = array[j++];
                } while (j <= hi);
                break;
            }
        }
        else {
            auxiliary[k++] = array[j++];
            if (j > hi) {
                do {
                    auxiliary[k++] = array[i++];
                } while (i <= mid);
                break;
            }
        }
    }
};
var sortArrayToAuxiliary = function (array, auxiliary, lo, hi, compare) {
    if (hi < lo)
        return;
    if (hi === lo) {
        auxiliary[lo] = array[lo];
        return;
    }
    var mid = Math.floor(lo + ((hi - lo) / 2));
    sortAuxiliaryToArray(array, auxiliary, lo, mid, compare);
    sortAuxiliaryToArray(array, auxiliary, mid + 1, hi, compare);
    merge(array, auxiliary, lo, mid, hi, compare);
};
var sortAuxiliaryToArray = function (array, auxiliary, lo, hi, compare) {
    if (hi <= lo)
        return;
    var mid = Math.floor(lo + ((hi - lo) / 2));
    sortArrayToAuxiliary(array, auxiliary, lo, mid, compare);
    sortArrayToAuxiliary(array, auxiliary, mid + 1, hi, compare);
    merge(auxiliary, array, lo, mid, hi, compare);
};
var mergeSort = (function (array, compare) {
    if (compare === void 0) { compare = function (a, b) {
        if (a < b)
            return -1;
        if (a > b)
            return 1;
        return 0;
    }; }
    var result = slice(array);
    var auxiliary = slice(array);
    sortAuxiliaryToArray(result, auxiliary, 0, result.length - 1, compare);
    return result;
});

var NODE_CHECK = Symbol('node');
var rowsToTree = function (rows, getRowLevelKey) {
    if (!rows.length)
        return rows;
    var levels = [{ children: [] }];
    rows.forEach(function (row) {
        var _a;
        var levelKey = getRowLevelKey(row);
        if (levelKey) {
            var levelIndex = levels.slice(1)
                .findIndex(function (level) { return getRowLevelKey(level.root) === levelKey; }) + 1;
            if (levelIndex > 0) {
                levels.splice(levelIndex, levels.length - levelIndex);
            }
            var node = (_a = {}, _a[NODE_CHECK] = true, _a.root = row, _a.children = [], _a);
            levels[levels.length - 1].children.push(node);
            levels.push(node);
        }
        else {
            levels[levels.length - 1].children.push(row);
        }
    });
    return levels[0].children;
};
var treeToRows = function (tree, rows) {
    if (rows === void 0) { rows = []; }
    if (!tree.length)
        return tree;
    return tree.reduce(function (acc, node) {
        if (node[NODE_CHECK]) {
            acc.push(node.root);
            treeToRows(node.children, rows);
        }
        else {
            acc.push(node);
        }
        return acc;
    }, rows);
};

var changeColumnFilter = function (filters, _a) {
    var columnName = _a.columnName, config = _a.config;
    var filterIndex = filters.findIndex(function (f) { return f.columnName === columnName; });
    var nextState = slice(filters);
    if (config) {
        var filter = __assign$1({ columnName: columnName }, config);
        if (filterIndex > -1) {
            nextState.splice(filterIndex, 1, filter);
        }
        else {
            nextState.push(filter);
        }
    }
    else if (filterIndex > -1) {
        nextState.splice(filterIndex, 1);
    }
    return nextState;
};

var getColumnFilterConfig = function (filters, columnName) { return (filters.length && filters.filter(function (s) { return s.columnName === columnName; })[0] || null); };

var filterExpression = function (filters, expression) {
    // tslint:disable-next-line: no-object-literal-type-assertion
    var selfFilterExpr = { filters: filters, operator: 'and' };
    if (!expression) {
        return selfFilterExpr;
    }
    return {
        operator: 'and',
        filters: [expression, selfFilterExpr],
    };
};

var operators = {
    or: function (predicates) { return function (row) { return (predicates.reduce(function (acc, predicate) { return acc || predicate(row); }, false)); }; },
    and: function (predicates) { return function (row) { return (predicates.reduce(function (acc, predicate) { return acc && predicate(row); }, true)); }; },
};
var toLowerCase = function (value) { return String(value).toLowerCase(); };
var operationPredicates = {
    contains: function (value, filter) { return toLowerCase(value)
        .indexOf(toLowerCase(filter.value)) > -1; },
    notContains: function (value, filter) { return toLowerCase(value)
        .indexOf(toLowerCase(filter.value)) === -1; },
    startsWith: function (value, filter) { return toLowerCase(value)
        .startsWith(toLowerCase(filter.value)); },
    endsWith: function (value, filter) { return toLowerCase(value)
        .endsWith(toLowerCase(filter.value)); },
    equal: function (value, filter) { return String(value) === String(filter.value); },
    notEqual: function (value, filter) { return String(value) !== String(filter.value); },
    greaterThan: function (value, filter) { return value > filter.value; },
    greaterThanOrEqual: function (value, filter) { return value >= filter.value; },
    lessThan: function (value, filter) { return value < filter.value; },
    lessThanOrEqual: function (value, filter) { return value <= filter.value; },
};
var defaultFilterPredicate = function (value, filter) {
    var operation = filter.operation || 'contains';
    return operationPredicates[operation](value, filter);
};
var filterTree = function (tree, predicate) { return tree.reduce(function (acc, node) {
    if (node[NODE_CHECK]) {
        var filteredChildren = filterTree(node.children, predicate);
        if (filteredChildren.length > 0) {
            acc.push(__assign$1(__assign$1({}, node), { children: filteredChildren }));
            return acc;
        }
        if (predicate(node.root, true)) {
            acc.push(node.root);
            return acc;
        }
        return acc;
    }
    if (predicate(node)) {
        acc.push(node);
        return acc;
    }
    return acc;
}, []); };
var filterHierarchicalRows = function (rows, predicate, getRowLevelKey, getCollapsedRows) {
    var tree = rowsToTree(rows, getRowLevelKey);
    var collapsedRowsMeta = [];
    var filteredTree = filterTree(tree, function (row, isNode) {
        if (isNode) {
            var collapsedRows = getCollapsedRows && getCollapsedRows(row);
            if (collapsedRows && collapsedRows.length) {
                var filteredCollapsedRows = collapsedRows.filter(predicate);
                collapsedRowsMeta.push([row, filteredCollapsedRows]);
                return !!filteredCollapsedRows.length || predicate(row);
            }
            if (predicate(row)) {
                collapsedRowsMeta.push([row, []]);
                return true;
            }
            return false;
        }
        return predicate(row);
    });
    return { rows: treeToRows(filteredTree), collapsedRowsMeta: new Map(collapsedRowsMeta) };
};
var buildPredicate = function (initialFilterExpression, getCellValue, getColumnPredicate) {
    var getSimplePredicate = function (filter) {
        var columnName = filter.columnName;
        var customPredicate = getColumnPredicate && getColumnPredicate(columnName);
        var predicate = customPredicate || defaultFilterPredicate;
        return function (row) { return predicate(getCellValue(row, columnName), filter, row); };
    };
    var getOperatorPredicate = function (filterExpression) {
        var build = operators[toLowerCase(filterExpression.operator)];
        return build && build(filterExpression.filters.map(getPredicate));
    };
    var getPredicate = function (filterExpression) { return (getOperatorPredicate(filterExpression)
        || getSimplePredicate(filterExpression)); };
    return getPredicate(initialFilterExpression);
};
var filteredRows = function (rows, filterExpression, getCellValue, getColumnPredicate, getRowLevelKey, getCollapsedRows) {
    if (!(filterExpression && Object.keys(filterExpression).length && rows.length)) {
        // tslint:disable-next-line:no-object-literal-type-assertion
        return { rows: rows };
    }
    var predicate = buildPredicate(filterExpression, getCellValue, getColumnPredicate);
    return getRowLevelKey
        ? filterHierarchicalRows(rows, predicate, getRowLevelKey, getCollapsedRows)
        : { rows: rows.filter(predicate) };
};
var filteredCollapsedRowsGetter = function (_a) {
    var collapsedRowsMeta = _a.collapsedRowsMeta;
    return function (row) { return collapsedRowsMeta && collapsedRowsMeta.get(row); };
};
var unwrappedFilteredRows = function (_a) {
    var rows = _a.rows;
    return rows;
};

var groupingPanelItems = function (columns, grouping, draftGrouping) {
    var items = draftGrouping.map(function (_a) {
        var columnName = _a.columnName;
        return ({
            column: columns.find(function (c) { return c.name === columnName; }),
            draft: !grouping.some(function (columnGrouping) { return columnGrouping.columnName === columnName; }),
        });
    });
    grouping.forEach(function (_a, index) {
        var columnName = _a.columnName;
        if (draftGrouping.some(function (columnGrouping) { return columnGrouping.columnName === columnName; }))
            return;
        items.splice(index, 0, {
            column: columns.find(function (c) { return c.name === columnName; }),
            draft: true,
        });
    });
    return items;
};

var setCurrentPage = function (prevPage, page) { return page; };
var setPageSize = function (prevPageSize, size) { return size; };

var clamp$2 = function (value, max) { return (Math.max(Math.min(value, max), 0)); };

// tslint:disable-next-line:max-line-length
var PAGE_HEADERS_OVERFLOW_ERROR = 'Max row level exceeds the page size. Consider increasing the page size.';
var paginatedRows = function (rows, pageSize, page) { return (pageSize
    ? rows.slice(pageSize * page, pageSize * (page + 1))
    : rows); };
var rowsWithPageHeaders = function (rows, pageSize, getRowLevelKey) {
    if (!pageSize || !getRowLevelKey)
        return rows;
    var result = rows.slice();
    var headerRows = [];
    var currentIndex = 0;
    var _loop_1 = function () {
        var row = result[currentIndex];
        var levelKey = getRowLevelKey(row);
        if (levelKey) {
            var headerIndex = headerRows.findIndex(function (headerRow) { return getRowLevelKey(headerRow) === levelKey; });
            // tslint:disable-next-line:prefer-conditional-expression
            if (headerIndex === -1) {
                headerRows = __spread$2(headerRows, [row]);
            }
            else {
                headerRows = __spread$2(headerRows.slice(0, headerIndex), [row]);
            }
            if (headerRows.length >= pageSize) {
                throw new Error(PAGE_HEADERS_OVERFLOW_ERROR);
            }
        }
        var indexInPage = currentIndex % pageSize;
        if (indexInPage < headerRows.length && row !== headerRows[indexInPage]) {
            result = __spread$2(result.slice(0, currentIndex), [
                headerRows[indexInPage]
            ], result.slice(currentIndex));
        }
        currentIndex += 1;
    };
    while (result.length > currentIndex) {
        _loop_1();
    }
    return result;
};
var rowCount = function (rows) { return rows.length; };
var pageCount = function (count, pageSize) { return (pageSize ? Math.ceil(count / pageSize) : 1); };
var currentPage = function (page, totalCount, pageSize, setCurrentPage) {
    var totalPages = pageCount(totalCount, pageSize);
    var adjustedCurrentPage = clamp$2(page, totalPages - 1);
    if (page !== adjustedCurrentPage) {
        setTimeout(function () { return setCurrentPage(adjustedCurrentPage); });
    }
    return adjustedCurrentPage;
};

var firstRowOnPage = function (currentPage, pageSize, totalCount) {
    if (totalCount === 0) {
        return 0;
    }
    return pageSize ? (currentPage * pageSize) + 1 : 1;
};
var lastRowOnPage = function (currentPage, pageSize, totalRowCount) {
    var result = totalRowCount;
    if (pageSize) {
        var index = (currentPage + 1) * pageSize;
        result = index > totalRowCount ? totalRowCount : index;
    }
    return result;
};
var calculateStartPage = function (currentPage, maxButtonCount, totalPageCount) { return (Math.max(Math.min(currentPage - Math.floor(maxButtonCount / 2), (totalPageCount - maxButtonCount) + 1), 1)); };

var startEditRows = function (prevEditingRowIds, _a) {
    var rowIds = _a.rowIds;
    return __spread$2(prevEditingRowIds, rowIds);
};
var stopEditRows = function (prevEditingRowIds, _a) {
    var rowIds = _a.rowIds;
    var rowIdSet = new Set(rowIds);
    return prevEditingRowIds.filter(function (id) { return !rowIdSet.has(id); });
};
var startEditCells = function (prevEditingCells, _a) {
    var editingCells = _a.editingCells;
    return __spread$2(prevEditingCells, editingCells);
};
var stopEditCells = function (prevEditingCells, _a) {
    var editingCells = _a.editingCells;
    return prevEditingCells.filter(function (_a) {
        var rowId = _a.rowId, columnName = _a.columnName;
        return (!editingCells.some(function (_a) {
            var currentRowId = _a.rowId, currentColumnName = _a.columnName;
            return (currentRowId === rowId && currentColumnName === columnName);
        }));
    });
};
var addRow = function (addedRows, _a) {
    var _b = _a === void 0 ? { row: {} } : _a, row = _b.row;
    return __spread$2(addedRows, [row]);
};
var changeAddedRow = function (addedRows, _a) {
    var rowId = _a.rowId, change = _a.change;
    var result = addedRows.slice();
    result[rowId] = __assign$1(__assign$1({}, result[rowId]), change);
    return result;
};
var cancelAddedRows = function (addedRows, _a) {
    var rowIds = _a.rowIds;
    var result = [];
    var indexSet = new Set(rowIds);
    addedRows.forEach(function (row, index) {
        if (!indexSet.has(index)) {
            result.push(row);
        }
    });
    return result;
};
var changeRow = function (prevRowChanges, _a) {
    var _b;
    var rowId = _a.rowId, change = _a.change;
    var prevChange = prevRowChanges[rowId] || {};
    return __assign$1(__assign$1({}, prevRowChanges), (_b = {}, _b[rowId] = __assign$1(__assign$1({}, prevChange), change), _b));
};
var cancelChanges = function (prevRowChanges, _a) {
    var rowIds = _a.rowIds;
    var result = __assign$1({}, prevRowChanges);
    rowIds.forEach(function (rowId) {
        delete result[rowId];
    });
    return result;
};
var deleteRows = function (deletedRowIds, _a) {
    var rowIds = _a.rowIds;
    return __spread$2(deletedRowIds, rowIds);
};
var cancelDeletedRows = function (deletedRowIds, _a) {
    var rowIds = _a.rowIds;
    var rowIdSet = new Set(rowIds);
    return deletedRowIds.filter(function (rowId) { return !rowIdSet.has(rowId); });
};

var changedRowsByIds = function (changes, rowIds) {
    var result = {};
    rowIds.forEach(function (rowId) {
        result[rowId] = changes[rowId];
    });
    return result;
};
var addedRowsByIds = function (addedRows, rowIds) {
    var rowIdSet = new Set(rowIds);
    var result = [];
    addedRows.forEach(function (row, index) {
        if (rowIdSet.has(index)) {
            result.push(row);
        }
    });
    return result;
};
var defaultCreateRowChange = function (row, value, columnName) {
    var _a;
    return (_a = {}, _a[columnName] = value, _a);
};
var createRowChangeGetter = function (createRowChange, columnExtensions) {
    if (createRowChange === void 0) { createRowChange = defaultCreateRowChange; }
    if (columnExtensions === void 0) { columnExtensions = []; }
    var map = columnExtensions.reduce(function (acc, columnExtension) {
        if (columnExtension.createRowChange) {
            acc[columnExtension.columnName] = columnExtension.createRowChange;
        }
        return acc;
    }, {});
    return function (row, value, columnName) {
        if (map[columnName]) {
            return map[columnName](row, value, columnName);
        }
        return createRowChange(row, value, columnName);
    };
};

var getRowChange = function (rowChanges, rowId) { return rowChanges[rowId] || {}; };

var TABLE_REORDERING_TYPE = Symbol('reordering');

var changeColumnOrder = function (order, _a) {
    var sourceColumnName = _a.sourceColumnName, targetColumnName = _a.targetColumnName;
    var sourceColumnIndex = order.indexOf(sourceColumnName);
    var targetColumnIndex = order.indexOf(targetColumnName);
    var newOrder = slice(order);
    newOrder.splice(sourceColumnIndex, 1);
    newOrder.splice(targetColumnIndex, 0, sourceColumnName);
    return newOrder;
};

var TABLE_DATA_TYPE = Symbol('data');
var TABLE_NODATA_TYPE = Symbol('nodata');
var TABLE_FLEX_TYPE = Symbol('flex');

var orderedColumns = function (tableColumns, order) {
    if (tableColumns === void 0) { tableColumns = []; }
    return mergeSort(tableColumns, function (a, b) {
        if (a.type !== TABLE_DATA_TYPE || b.type !== TABLE_DATA_TYPE)
            return 0;
        var aPos = order.indexOf(a.column.name);
        var bPos = order.indexOf(b.column.name);
        return aPos - bPos;
    });
};
var tableHeaderRowsWithReordering = function (tableHeaderRows) { return __spread$2(tableHeaderRows, [
    {
        key: TABLE_REORDERING_TYPE.toString(),
        type: TABLE_REORDERING_TYPE,
        height: 0,
    },
]); };
var draftOrder = function (order, sourceColumnIndex, targetColumnIndex) {
    if (sourceColumnIndex === -1
        || targetColumnIndex === -1
        || sourceColumnIndex === targetColumnIndex) {
        return order;
    }
    var result = slice(order);
    var sourceColumn = order[sourceColumnIndex];
    result.splice(sourceColumnIndex, 1);
    result.splice(targetColumnIndex, 0, sourceColumn);
    return result;
};
var isValidValue = function (value, validUnits) {
    var numb = parseInt(value, 10);
    var unit = numb ? value.substr(numb.toString().length) : value;
    var sizeIsAuto = isNaN(numb) && unit === 'auto';
    var sizeIsValid = numb >= 0 && validUnits.some(function (validUnit) { return validUnit === unit; });
    return sizeIsAuto || sizeIsValid;
};
var convertWidth = function (value) {
    if (typeof value === 'string') {
        var numb = parseInt(value, 10);
        if (value.substr(numb.toString().length).length > 0) {
            return value;
        }
        return numb;
    }
    return value;
};

var TABLE_EDIT_COMMAND_TYPE = Symbol('editCommand');

var TABLE_ADDED_TYPE = Symbol('added');
var TABLE_EDIT_TYPE = Symbol('edit');

var TABLE_HEADING_TYPE = Symbol('heading');

var isHeadingEditCommandsTableCell = function (tableRow, tableColumn) { return tableRow.type === TABLE_HEADING_TYPE && tableColumn.type === TABLE_EDIT_COMMAND_TYPE; };
var isEditCommandsTableCell = function (tableRow, tableColumn) { return (tableRow.type === TABLE_DATA_TYPE || tableRow.type === TABLE_ADDED_TYPE
    || tableRow.type === TABLE_EDIT_TYPE) && tableColumn.type === TABLE_EDIT_COMMAND_TYPE; };

var tableColumnsWithEditing = function (tableColumns, width) { return __spread$2([
    { width: convertWidth(width),
        key: TABLE_EDIT_COMMAND_TYPE.toString(), type: TABLE_EDIT_COMMAND_TYPE }
], tableColumns); };

var isEditTableCell = function (tableRow, tableColumn) { return (tableRow.type === TABLE_ADDED_TYPE || tableRow.type === TABLE_EDIT_TYPE)
    && tableColumn.type === TABLE_DATA_TYPE; };
var isAddedTableRow = function (tableRow) { return tableRow.type === TABLE_ADDED_TYPE; };
var isEditTableRow = function (tableRow) { return tableRow.type === TABLE_EDIT_TYPE; };

var tableRowsWithEditing = function (tableRows, editingRowIds, addedRows, rowHeight) {
    var rowIds = new Set(editingRowIds);
    var editedTableRows = tableRows
        .map(function (tableRow) { return (tableRow.type === TABLE_DATA_TYPE && rowIds.has(tableRow.rowId)
        ? __assign$1(__assign$1({}, tableRow), { type: TABLE_EDIT_TYPE, height: rowHeight }) : tableRow); });
    var addedTableRows = addedRows
        .map(function (row, rowIndex) { return ({
        row: row,
        key: TABLE_ADDED_TYPE.toString() + "_" + rowIndex,
        type: TABLE_ADDED_TYPE,
        rowId: rowIndex,
        height: rowHeight,
    }); });
    return __spread$2(slice(addedTableRows).reverse(), editedTableRows);
};

var rowsWithEditingCells = function (tableBodyRows, editingCells) { return tableBodyRows.map(function (row) {
    var rowId = row.rowId, type = row.type;
    if (rowId !== undefined &&
        type === TABLE_DATA_TYPE &&
        editingCells.some(function (elem) { return elem.rowId === rowId; })) {
        return __assign$1(__assign$1({}, row), { hasEditCell: true });
    }
    return row;
}); };
var columnsWithEditingCells = function (tableColumns, editingCells) { return tableColumns.map(function (tableColumn) {
    var columnName = tableColumn.column ? tableColumn.column.name : undefined;
    if (columnName !== undefined && editingCells.some(function (elem) { return elem.columnName === columnName; })) {
        return __assign$1(__assign$1({}, tableColumn), { hasEditCell: true });
    }
    return tableColumn;
}); };

var TABLE_FILTER_TYPE = Symbol('filter');
var DEFAULT_FILTER_OPERATIONS = [
    'contains',
    'notContains',
    'startsWith',
    'endsWith',
    'equal',
    'notEqual',
];

var isFilterTableCell = function (tableRow, tableColumn) { return tableRow.type === TABLE_FILTER_TYPE && tableColumn.type === TABLE_DATA_TYPE; };
var isFilterTableRow = function (tableRow) { return tableRow.type === TABLE_FILTER_TYPE; };
var getColumnFilterOperations = function (getAvailableFilterOperations, columnName) { return (getAvailableFilterOperations && getAvailableFilterOperations(columnName))
    || DEFAULT_FILTER_OPERATIONS; };
var isFilterValueEmpty = function (value) { return value === undefined || !String(value).length; };
var getSelectedFilterOperation = function (filterOperations, columnName, columnFilter, columnFilterOperations) {
    if (columnFilter && columnFilter.operation) {
        return columnFilter.operation;
    }
    if (filterOperations[columnName]) {
        return filterOperations[columnName];
    }
    return columnFilterOperations[0];
};

var tableHeaderRowsWithFilter = function (headerRows, rowHeight) { return __spread$2(headerRows, [
    { key: TABLE_FILTER_TYPE.toString(), type: TABLE_FILTER_TYPE, height: rowHeight }
]); };

var TABLE_GROUP_TYPE = Symbol('group');

var TABLE_STUB_TYPE = Symbol('stub');
var getVisibleBoundaryWithFixed = function (visibleBoundary, items) { return items.reduce(function (acc, item, index) {
    if (item.fixed && (index < visibleBoundary[0] || index > visibleBoundary[1])) {
        acc.push([index, index]);
    }
    return acc;
}, [visibleBoundary]); };
var getVisibleBoundary = function (items, viewportStart, viewportSize, getItemSize, offset, itemSize) {
    if (offset === void 0) { offset = 0; }
    if (itemSize === void 0) { itemSize = 0; }
    var start = null;
    var end = null;
    var index = 0;
    var beforePosition = offset * itemSize;
    var viewportEnd = viewportStart + viewportSize;
    while (end === null && index < items.length) {
        var item = items[index];
        var afterPosition = beforePosition + getItemSize(item);
        var isVisible = (beforePosition >= viewportStart && beforePosition < viewportEnd)
            || (afterPosition > viewportStart && afterPosition <= viewportEnd)
            || (beforePosition < viewportStart && afterPosition > viewportEnd);
        if (isVisible && start === null) {
            start = index;
        }
        if (!isVisible && start !== null) {
            end = index - 1;
            break;
        }
        index += 1;
        beforePosition = afterPosition;
    }
    if (start !== null && end === null) {
        end = index - 1;
    }
    start = start === null ? 0 : start;
    end = end === null ? 0 : end;
    return [start + offset, end + offset];
};
var getRenderBoundary = function (itemsCount, visibleBoundary, overscan) {
    var _a = __read$2(visibleBoundary, 2), start = _a[0], end = _a[1];
    start = Math.max(0, start - overscan);
    end = Math.min(itemsCount - 1, end + overscan);
    return [start, end];
};
var getColumnBoundaries = function (columns, left, width, getColumnWidth) { return (getVisibleBoundaryWithFixed(getColumnsRenderBoundary(columns.length, getVisibleBoundary(columns, left, width, getColumnWidth, 0)), columns)); };
var getRowsVisibleBoundary = function (rows, top, height, getRowHeight, offset, rowHeight, isDataRemote) {
    var beforePosition = offset * rowHeight;
    var noVisibleRowsLoaded = rowHeight > 0 &&
        beforePosition + rows.length * rowHeight < top ||
        top < beforePosition;
    var boundaries;
    if (isDataRemote && noVisibleRowsLoaded) {
        var topIndex = Math.round(top / rowHeight);
        boundaries = [topIndex, topIndex];
    }
    else {
        boundaries = getVisibleBoundary(rows, top, height, getRowHeight, offset, rowHeight);
    }
    return boundaries;
};
var getColumnsRenderBoundary = function (columnCount, visibleBoundary) { return getRenderBoundary(columnCount, visibleBoundary, 1); };
var getRowsRenderBoundary = function (rowsCount, visibleBoundary) { return getRenderBoundary(rowsCount, visibleBoundary, 3); };
var getSpanBoundary = function (items, visibleBoundaries, getItemSpan) { return visibleBoundaries
    .map(function (visibleBoundary) {
    var endIndex = Math.min(visibleBoundary[1], items.length - 1);
    var end = endIndex;
    var start = visibleBoundary[0] <= end ? visibleBoundary[0] : 0;
    for (var index = 0; index <= endIndex; index += 1) {
        var span = getItemSpan(items[index]);
        if (index < visibleBoundary[0] && index + span > visibleBoundary[0]) {
            start = index;
        }
        if (index + (span - 1) > visibleBoundary[1]) {
            end = index + (span - 1);
        }
    }
    return [start, end];
}); };
var collapseBoundaries = function (itemsCount, visibleBoundaries, spanBoundaries) {
    var breakpoints = new Set([0, itemsCount]);
    spanBoundaries.forEach(function (rowBoundaries) { return rowBoundaries
        .forEach(function (boundary) {
        breakpoints.add(boundary[0]);
        // next interval starts after span end point
        breakpoints.add(Math.min(boundary[1] + 1, itemsCount));
    }); });
    visibleBoundaries
        .filter(function (boundary) { return boundary.every(function (bound) { return 0 <= bound && bound < itemsCount; }); })
        .forEach(function (boundary) {
        for (var point = boundary[0]; point <= boundary[1]; point += 1) {
            breakpoints.add(point);
        }
        if (boundary[1] + 1 < itemsCount) {
            // close last visible point
            breakpoints.add(boundary[1] + 1);
        }
    });
    var bp = __spread$2(breakpoints).sort(function (a, b) { return a - b; });
    var bounds = [];
    for (var i = 0; i < bp.length - 1; i += 1) {
        bounds.push([
            bp[i],
            bp[i + 1] - 1,
        ]);
    }
    return bounds;
};
var getColumnsSize = function (columns, startIndex, endIndex, getColumnSize) {
    var size = 0;
    for (var i = startIndex; i <= endIndex; i += 1) {
        size += getColumnSize(columns[i], 0) || 0;
    }
    return size;
};
var getCollapsedColumns = function (columns, visibleBoundaries, boundaries, getColumnWidth) {
    var collapsedColumns = [];
    boundaries.forEach(function (boundary) {
        var isVisible = visibleBoundaries.reduce(function (acc, visibleBoundary) { return (acc || (visibleBoundary[0] <= boundary[0] && boundary[1] <= visibleBoundary[1])); }, false);
        if (isVisible) {
            var column = columns[boundary[0]];
            collapsedColumns.push(__assign$1(__assign$1({}, column), { width: getColumnWidth(column) }));
        }
        else {
            collapsedColumns.push({
                key: TABLE_STUB_TYPE.toString() + "_" + boundary[0] + "_" + boundary[1],
                type: TABLE_STUB_TYPE,
                width: getColumnsSize(columns, boundary[0], boundary[1], getColumnWidth),
            });
        }
    });
    return collapsedColumns;
};
var getCollapsedRows = function (rows, visibleBoundary, boundaries, getRowHeight, getCells, offset) {
    var collapsedRows = [];
    boundaries.forEach(function (boundary) {
        var isVisible = visibleBoundary[0] <= boundary[0] && boundary[1] <= visibleBoundary[1];
        if (isVisible) {
            var row = rows[boundary[0] - offset];
            collapsedRows.push({
                row: row,
                cells: getCells(row),
            });
        }
        else {
            var row = {};
            collapsedRows.push({
                row: {
                    key: TABLE_STUB_TYPE.toString() + "_" + boundary[0] + "_" + boundary[1],
                    type: TABLE_STUB_TYPE,
                    height: getColumnsSize(rows, boundary[0], boundary[1], getRowHeight),
                },
                cells: getCells(row),
            });
        }
    });
    return collapsedRows;
};
var getCollapsedCells = function (columns, spanBoundaries, boundaries, getColSpan) {
    var collapsedCells = [];
    var index = 0;
    var _loop_1 = function () {
        var boundary = boundaries[index];
        var isSpan = spanBoundaries.reduce(function (acc, spanBoundary) { return (acc || (spanBoundary[0] <= boundary[0] && boundary[1] <= spanBoundary[1])); }, false);
        if (isSpan) {
            var column = columns[boundary[0]];
            var realColSpan = getColSpan(column);
            var realColSpanEnd_1 = (realColSpan + boundary[0]) - 1;
            var colSpanEnd = boundaries.findIndex(function (colSpanBoundary) { return colSpanBoundary[0]
                <= realColSpanEnd_1 && realColSpanEnd_1
                <= colSpanBoundary[1]; });
            collapsedCells.push({
                column: column,
                colSpan: (colSpanEnd - index) + 1,
            });
            index += 1;
        }
        else {
            collapsedCells.push({
                column: {
                    key: TABLE_STUB_TYPE.toString() + "_" + boundary[0] + "_" + boundary[1],
                    type: TABLE_STUB_TYPE,
                },
                colSpan: 1,
            });
            index += 1;
        }
    };
    while (index < boundaries.length) {
        _loop_1();
    }
    return collapsedCells;
};
var getCollapsedGrid = function (_a) {
    var rows = _a.rows, columns = _a.columns, rowsVisibleBoundary = _a.rowsVisibleBoundary, columnsVisibleBoundary = _a.columnsVisibleBoundary, _b = _a.getColumnWidth, getColumnWidth = _b === void 0 ? function (column) { return column.width; } : _b, _c = _a.getRowHeight, getRowHeight = _c === void 0 ? function (row) { return row.height; } : _c, _d = _a.getColSpan, getColSpan = _d === void 0 ? function () { return 1; } : _d, totalRowCount = _a.totalRowCount, offset = _a.offset;
    if (!columns.length) {
        return {
            columns: [],
            rows: [],
        };
    }
    var boundaries = rowsVisibleBoundary || [0, rows.length - 1 || 1];
    var rowSpanBoundaries = rows
        .slice(boundaries[0], boundaries[1])
        .map(function (row) { return getSpanBoundary(columns, columnsVisibleBoundary, function (column) { return getColSpan(row, column); }); });
    var columnBoundaries = collapseBoundaries(columns.length, columnsVisibleBoundary, rowSpanBoundaries);
    var rowBoundaries = collapseBoundaries(totalRowCount, [boundaries], []);
    return {
        columns: getCollapsedColumns(columns, columnsVisibleBoundary, columnBoundaries, getColumnWidth),
        rows: getCollapsedRows(rows, boundaries, rowBoundaries, getRowHeight, function (row) { return getCollapsedCells(columns, getSpanBoundary(columns, columnsVisibleBoundary, function (column) { return getColSpan(row, column); }), columnBoundaries, function (column) { return getColSpan(row, column); }); }, offset),
    };
};
var getColumnWidthGetter = function (tableColumns, tableWidth, minColumnWidth) {
    var colsHavingWidth = tableColumns.filter(function (col) { return typeof col.width === 'number'; });
    var columnsWidth = colsHavingWidth.reduce(function (acc, col) { return (acc + col.width); }, 0);
    var autoWidth = (tableWidth - columnsWidth) / (tableColumns.length - colsHavingWidth.length);
    var autoColWidth = Math.max(autoWidth, minColumnWidth);
    return function (column) { return (column.type === TABLE_FLEX_TYPE
        ? null
        : typeof column.width === 'number' ? column.width : autoColWidth); };
};
var getCollapsedGrids = function (_a) {
    var _b = _a.headerRows, headerRows = _b === void 0 ? [] : _b, _c = _a.bodyRows, bodyRows = _c === void 0 ? [] : _c, _d = _a.footerRows, footerRows = _d === void 0 ? [] : _d, columns = _a.columns, loadedRowsStart = _a.loadedRowsStart, totalRowCount = _a.totalRowCount, getCellColSpan = _a.getCellColSpan, viewport = _a.viewport, getRowHeight = _a.getRowHeight, getColumnWidth = _a.getColumnWidth;
    var getColSpan = function (tableRow, tableColumn) { return getCellColSpan({ tableRow: tableRow, tableColumn: tableColumn, tableColumns: columns }); };
    var getCollapsedGridBlock = function (rows, rowsVisibleBoundary, rowCount, offset) {
        if (rowCount === void 0) { rowCount = rows.length; }
        if (offset === void 0) { offset = 0; }
        return getCollapsedGrid({
            rows: rows,
            columns: columns,
            rowsVisibleBoundary: rowsVisibleBoundary,
            columnsVisibleBoundary: viewport.columns,
            getColumnWidth: getColumnWidth,
            getRowHeight: getRowHeight,
            getColSpan: getColSpan,
            totalRowCount: rowCount,
            offset: offset,
        });
    };
    var headerGrid = getCollapsedGridBlock(headerRows, getRenderRowBounds(viewport.headerRows, headerRows.length));
    var bodyGrid = getCollapsedGridBlock(bodyRows, adjustedRenderRowBounds(viewport.rows, bodyRows.length, loadedRowsStart), totalRowCount || 1, loadedRowsStart);
    var footerGrid = getCollapsedGridBlock(footerRows, getRenderRowBounds(viewport.footerRows, footerRows.length));
    return {
        headerGrid: headerGrid,
        bodyGrid: bodyGrid,
        footerGrid: footerGrid,
    };
};
var getRenderRowBounds = function (visibleBounds, rowCount) { return getRowsRenderBoundary(rowCount, visibleBounds); };
var adjustedRenderRowBounds = function (visibleBounds, rowCount, loadedRowsStart) {
    var renderRowBoundaries = getRenderRowBounds(visibleBounds, loadedRowsStart + rowCount);
    var adjustedInterval = intervalUtil.intersect({ start: renderRowBoundaries[0], end: renderRowBoundaries[1] }, { start: loadedRowsStart, end: loadedRowsStart + rowCount });
    return [adjustedInterval.start, adjustedInterval.end];
};

var getGroupIndexByColumn = function (grouping, tableColumn) { return grouping.findIndex(function (columnGrouping) { return !!tableColumn.column && columnGrouping.columnName === tableColumn.column.name; }); };
var isIndentCell = function (tableRow, tableColumn, grouping) {
    if (tableColumn.column && tableRow.row.groupedBy === tableColumn.column.name)
        return false;
    var rowGroupIndex = grouping.findIndex(function (columnGrouping) { return columnGrouping.columnName === tableRow.row.groupedBy; });
    var columnGroupIndex = getGroupIndexByColumn(grouping, tableColumn);
    return columnGroupIndex < rowGroupIndex;
};
var isGroupTableCell = function (tableRow, tableColumn) { return !!(tableRow.type === TABLE_GROUP_TYPE && tableColumn.type === TABLE_GROUP_TYPE
    && tableColumn.column
    && tableColumn.column.name === tableRow.row.groupedBy); };
var isGroupIndentTableCell = function (tableRow, tableColumn, grouping) { return (tableRow.type === TABLE_GROUP_TYPE && tableColumn.type === TABLE_GROUP_TYPE &&
    isIndentCell(tableRow, tableColumn, grouping)); };
var isGroupIndentStubTableCell = function (tableRow, tableColumn, grouping) { return ((tableRow.type === TABLE_GROUP_TYPE && tableColumn.type === TABLE_STUB_TYPE &&
    isIndentCell(tableRow, tableColumn, grouping))); };
var isGroupTableRow = function (tableRow) { return tableRow.type === TABLE_GROUP_TYPE; };
var isGroupRowOrdinaryCell = function (tableRow, tableColumn) { return (isGroupTableRow(tableRow) && !isGroupTableCell(tableRow, tableColumn)); };
var columnHasGroupRowSummary = function (tableColumn, groupSummaryItems) { return (!!(groupSummaryItems && groupSummaryItems
    .some(function (item) { return ((!item.showInGroupFooter && item.alignByColumn)
    && item.columnName === (tableColumn.column && tableColumn.column.name)); }))); };
var isRowSummaryCell = function (tableRow, tableColumn, grouping, groupSummaryItems) { return (columnHasGroupRowSummary(tableColumn, groupSummaryItems)
    && !isGroupIndentTableCell(tableRow, tableColumn, grouping)); };
var isPreviousCellContainSummary = function (tableRow, tableColumn, tableColumns, grouping, groupSummaryItems) {
    var columnIndex = tableColumns.indexOf(tableColumn);
    return columnIndex > 0 && isRowSummaryCell(tableRow, tableColumns[columnIndex - 1], grouping, groupSummaryItems);
};
var calculateGroupCellIndent = function (tableColumn, grouping, indentWidth) { return (indentWidth * getGroupIndexByColumn(grouping, tableColumn)); };
var sortAndSpliceColumns = function (tableColumns, firstVisibleColumnIndex) {
    var groupColumns = tableColumns.filter(function (col) { return col.type === TABLE_GROUP_TYPE; });
    var dataColumns = tableColumns.filter(function (col) { return col.type === TABLE_DATA_TYPE; });
    var flexColumns = tableColumns.filter(function (col) { return col.type === TABLE_FLEX_TYPE; });
    var otherColumns = tableColumns.filter(function (col) {
        return col.type !== TABLE_DATA_TYPE &&
            col.type !== TABLE_GROUP_TYPE &&
            col.type !== TABLE_FLEX_TYPE;
    });
    if (firstVisibleColumnIndex) {
        var firstGroupIndex = tableColumns.indexOf(groupColumns[0]);
        otherColumns.splice(0, Math.min(firstVisibleColumnIndex, firstGroupIndex));
    }
    return __spread$2(groupColumns, otherColumns, dataColumns, flexColumns);
};

var tableColumnsWithDraftGrouping = function (tableColumns, grouping, draftGrouping, showColumnWhenGrouped) { return tableColumns
    .reduce(function (acc, tableColumn) {
    if (tableColumn.type !== TABLE_DATA_TYPE) {
        acc.push(tableColumn);
        return acc;
    }
    var columnName = tableColumn.column && tableColumn.column.name || '';
    var columnGroupingExists = grouping
        .some(function (columnGrouping) { return columnGrouping.columnName === columnName; });
    var columnDraftGroupingExists = draftGrouping
        .some(function (columnGrouping) { return columnGrouping.columnName === columnName; });
    if ((!columnGroupingExists && !columnDraftGroupingExists)
        || showColumnWhenGrouped(columnName)) {
        acc.push(tableColumn);
    }
    else if ((!columnGroupingExists && columnDraftGroupingExists)
        || (columnGroupingExists && !columnDraftGroupingExists)) {
        acc.push(__assign$1(__assign$1({}, tableColumn), { draft: true }));
    }
    return acc;
    // tslint:disable-next-line: prefer-array-literal
}, []); };
var tableColumnsWithGrouping = function (columns, tableColumns, grouping, draftGrouping, indentColumnWidth, showColumnWhenGrouped) { return __spread$2(grouping.map(function (columnGrouping) {
    var groupedColumn = columns.find(function (column) { return column.name === columnGrouping.columnName; });
    return {
        key: TABLE_GROUP_TYPE.toString() + "_" + groupedColumn.name,
        type: TABLE_GROUP_TYPE,
        column: groupedColumn,
        width: indentColumnWidth,
    };
}), tableColumnsWithDraftGrouping(tableColumns, grouping, draftGrouping, showColumnWhenGrouped)); };
var tableRowsWithGrouping = function (tableRows, isGroupRow) { return tableRows.map(function (tableRow) {
    if (tableRow.type !== TABLE_DATA_TYPE || !isGroupRow(tableRow.row)) {
        return tableRow;
    }
    return __assign$1(__assign$1({}, tableRow), { key: TABLE_GROUP_TYPE.toString() + "_" + tableRow.row.compoundKey, type: TABLE_GROUP_TYPE });
}); };
var isRowLevelSummary = function (groupSummaryItems, colName) { return (groupSummaryItems.some(function (item) { return (!item.showInGroupFooter && item.alignByColumn && item.columnName === colName); })); };
var groupSummaryChains = function (tableRow, tableColumns, groupSummaryItems, firstVisibleColumnIndex) {
    var captionStarted = false;
    return sortAndSpliceColumns(tableColumns, firstVisibleColumnIndex)
        .reduce(function (acc, col) {
        var colName = (col.column && col.column.name);
        var isStartOfGroupCaption = col.type === TABLE_GROUP_TYPE
            && tableRow.row.groupedBy === colName;
        var isIndentColumn = col.type === TABLE_GROUP_TYPE
            && tableRow.row.groupedBy !== colName && !captionStarted;
        if (isStartOfGroupCaption) {
            captionStarted = true;
        }
        if (isStartOfGroupCaption || isIndentColumn) {
            acc.push([colName]);
        }
        else if (groupSummaryItems && isRowLevelSummary(groupSummaryItems, colName)) {
            acc.push([colName]);
            acc.push([]);
        }
        else {
            acc[acc.length - 1].push(colName);
        }
        return acc;
    }, [[]]);
};
var tableGroupCellColSpanGetter = function (getTableCellColSpan, groupSummaryItems, firstVisibleColumnIndex) { return function (params) {
    var _a;
    var tableRow = params.tableRow, tableColumns = params.tableColumns, tableColumn = params.tableColumn;
    if (tableRow.type === TABLE_GROUP_TYPE) {
        var colName_1 = (_a = tableColumn.column) === null || _a === void 0 ? void 0 : _a.name;
        var dataColumnGroupedBy_1 = tableRow.row.groupedBy === colName_1 && tableColumn.type !== TABLE_GROUP_TYPE;
        var chains = groupSummaryChains(tableRow, tableColumns, groupSummaryItems, firstVisibleColumnIndex);
        var chain = chains.find(function (ch) { return !dataColumnGroupedBy_1 && ch[0] === colName_1; });
        if (chain) {
            return chain.length;
        }
    }
    return getTableCellColSpan(params);
}; };

var isHeadingTableCell = function (tableRow, tableColumn) { return tableRow.type === TABLE_HEADING_TYPE && tableColumn.type === TABLE_DATA_TYPE; };
var isHeadingTableRow = function (tableRow) { return (tableRow.type === TABLE_HEADING_TYPE); };
var findChainByColumnIndex = function (chains, columnIndex) { return (chains.find(function (chain) { return (chain.start <= columnIndex && columnIndex < chain.start + chain.columns.length); })); };
var splitHeaderColumnChains = function (tableColumnChains, tableColumns, shouldSplitChain, extendChainProps) { return (tableColumnChains.map(function (row, rowIndex) { return row
    .reduce(function (acc, chain) {
    var currentChain = null;
    chain.columns.forEach(function (col) {
        var column = tableColumns.find(function (c) { return c.key === col.key; });
        var isNewGroup = shouldSplitChain(currentChain, column, rowIndex);
        if (isNewGroup) {
            var start = currentChain
                ? (currentChain.start + currentChain.columns.length)
                : chain.start;
            acc.push(__assign$1(__assign$1(__assign$1({}, chain), extendChainProps(column)), { start: start, columns: [] }));
            currentChain = acc[acc.length - 1];
        }
        currentChain.columns.push(column);
    });
    return acc;
}, []); })); };
var generateSimpleChains = function (rows, columns) { return (rows.map(function () { return ([{
        columns: columns,
        start: 0,
    }]); })); };
var nextColumnName = function (tableColumns, index) {
    var isNextColumnHasName = index < tableColumns.length - 1 && tableColumns[index + 1].column;
    return isNextColumnHasName
        ? tableColumns[index + 1].column.name
        : undefined;
};
var getNextColumnName = function (tableColumns, columnName) {
    var index = tableColumns.findIndex(function (elem) {
        return elem.column && elem.column.name === columnName;
    });
    return index >= 0
        ? nextColumnName(tableColumns, index)
        : undefined;
};

var tableRowsWithHeading = function (headerRows) { return __spread$2([
    { key: TABLE_HEADING_TYPE.toString(), type: TABLE_HEADING_TYPE }
], headerRows); };

var TABLE_BAND_TYPE = Symbol('band');
var BAND_GROUP_CELL = 'bandGroupCell';
var BAND_HEADER_CELL = 'bandHeaderCell';
var BAND_EMPTY_CELL = 'bandEmptyCell';
var BAND_DUPLICATE_RENDER = 'bandDuplicateRender';
var BAND_FILL_LEVEL_CELL = 'bandFillLevelCell';

var isBandedTableRow = function (tableRow) { return (tableRow.type === TABLE_BAND_TYPE); };
var isBandedOrHeaderRow = function (tableRow) { return isBandedTableRow(tableRow)
    || tableRow.type === TABLE_HEADING_TYPE; };
var isNoDataColumn = function (columnType) { return columnType !== TABLE_DATA_TYPE; };
var getColumnMeta = function (columnName, bands, tableRowLevel, key, level, title, result) {
    if (key === void 0) { key = ''; }
    if (level === void 0) { level = 0; }
    if (title === void 0) { title = null; }
    if (result === void 0) { result = null; }
    return bands.reduce(function (acc, band) {
        if (band.columnName === columnName) {
            return __assign$1(__assign$1({}, acc), { title: title, level: level, key: key });
        }
        if (band.children !== undefined) {
            var rowLevelPassed = level > tableRowLevel;
            var bandTitle = rowLevelPassed ? title : band.title;
            var bandKey = rowLevelPassed ? key : key + "_" + bandTitle;
            return getColumnMeta(columnName, band.children, tableRowLevel, bandKey, level + 1, bandTitle, acc);
        }
        return acc;
    }, result || { level: level, title: title, key: title });
};
var calculateBand = function (visibleBound, headerChain) {
    if (visibleBound) {
        var bandStart = Math.max(visibleBound[0], headerChain.start);
        var bandEnd = Math.min(visibleBound[1] + 1, headerChain.start + headerChain.columns.length);
        return [bandStart, bandEnd];
    }
    return [headerChain.start, headerChain.start + headerChain.columns.length];
};
var getBandComponent = function (_a, tableHeaderRows, tableColumns, columnBands, tableHeaderColumnChains, columnVisibleIntervals, bandLevelsVisibility) {
    var currentTableColumn = _a.tableColumn, tableRow = _a.tableRow, rowSpan = _a.rowSpan;
    if (rowSpan)
        return { type: BAND_DUPLICATE_RENDER, payload: null };
    var maxLevel = tableHeaderRows.filter(function (column) { return column.type === TABLE_BAND_TYPE; }).length + 1;
    var level = tableRow.level;
    var currentRowLevel = level === undefined
        ? maxLevel - 1 : level;
    var currentColumnMeta = currentTableColumn.type === TABLE_DATA_TYPE
        ? getColumnMeta(currentTableColumn.column.name, columnBands, currentRowLevel)
        : { level: 0, title: '' };
    var currentColumnIndex = tableColumns
        .findIndex(function (column) { return column.key === currentTableColumn.key; });
    var levelsCount = bandLevelsVisibility.length;
    var visibleLevelsCount = bandLevelsVisibility.filter(Boolean).length;
    if (currentColumnMeta.level < currentRowLevel) {
        var shouldFillLevel = currentRowLevel > 0 && visibleLevelsCount < levelsCount
            && !bandLevelsVisibility[currentRowLevel] && currentTableColumn.type === TABLE_STUB_TYPE;
        if (shouldFillLevel) {
            return { type: BAND_FILL_LEVEL_CELL, payload: null };
        }
        return { type: BAND_EMPTY_CELL, payload: null };
    }
    var previousTableColumn = tableColumns[currentColumnIndex - 1];
    var beforeBorder = false;
    if (currentColumnIndex > 0 && currentTableColumn.type === TABLE_DATA_TYPE
        && isNoDataColumn(previousTableColumn.type)) {
        beforeBorder = true;
    }
    var isStubColumn = currentTableColumn.type === TABLE_STUB_TYPE;
    var isColumnVisible = currentColumnIndex >= 0;
    if (currentColumnMeta.level === currentRowLevel) {
        if (isStubColumn) {
            var cellRowSpan = visibleLevelsCount < levelsCount
                ? visibleLevelsCount || 1
                : maxLevel;
            return {
                type: BAND_FILL_LEVEL_CELL,
                payload: {
                    rowSpan: cellRowSpan,
                },
            };
        }
        if (isColumnVisible) {
            return {
                type: BAND_HEADER_CELL,
                payload: __assign$1({ tableRow: tableHeaderRows.find(function (row) { return row.type === TABLE_HEADING_TYPE; }), rowSpan: maxLevel - currentRowLevel }, beforeBorder && { beforeBorder: beforeBorder }),
            };
        }
    }
    if (!isColumnVisible)
        return { type: BAND_EMPTY_CELL, payload: null };
    var currentColumnChain = findChainByColumnIndex(tableHeaderColumnChains[currentRowLevel], currentColumnIndex);
    var columnVisibleBoundary = columnVisibleIntervals.find(function (_a) {
        var _b = __read$2(_a, 2), start = _b[0], end = _b[1];
        return (start <= currentColumnIndex && currentColumnIndex <= end);
    });
    var _b = __read$2(calculateBand(columnVisibleBoundary, currentColumnChain), 2), bandStart = _b[0], bandEnd = _b[1];
    if (bandStart < currentColumnIndex) {
        return { type: null, payload: null };
    }
    return {
        type: BAND_GROUP_CELL,
        payload: __assign$1({ colSpan: bandEnd - bandStart, value: currentColumnMeta.title, column: currentColumnMeta }, beforeBorder && { beforeBorder: beforeBorder }),
    };
};

var emptyVirtualRows = {
    skip: Number.POSITIVE_INFINITY,
    rows: [],
};

var empty = {
    start: Number.POSITIVE_INFINITY,
    end: Number.NEGATIVE_INFINITY,
};
var getRowsInterval = function (r) { return (r === emptyVirtualRows
    ? empty
    : {
        start: r.skip,
        end: r.skip + r.rows.length,
    }); };
var getLength = function (a) { return a.end - a.start; };
var intersect = function (a, b) {
    if (a.end < b.start || b.end < a.start) {
        return empty;
    }
    return {
        start: Math.max(a.start, b.start),
        end: Math.min(a.end, b.end),
    };
};
var difference = function (a, b) {
    if (empty === intervalUtil.intersect(a, b)) {
        return a;
    }
    if (b.end < a.end) {
        return {
            start: b.end,
            end: a.end,
        };
    }
    if (a.start < b.start) {
        return {
            start: a.start,
            end: b.start,
        };
    }
    return empty;
};
var intervalUtil = {
    empty: empty,
    getRowsInterval: getRowsInterval,
    getLength: getLength,
    intersect: intersect,
    difference: difference,
};

var tableRowsWithBands = function (tableHeaderRows, columnBands, tableColumns) {
    var tableDataColumns = tableColumns.filter(function (column) { return column.type === TABLE_DATA_TYPE; });
    var getMaxNestedLevel = function (bands, level, result) {
        if (level === void 0) { level = 0; }
        if (result === void 0) { result = null; }
        return (bands.reduce(function (acc, column) {
            if (column.children !== undefined) {
                return getMaxNestedLevel(column.children, level + 1, acc);
            }
            var isDataColumn = tableDataColumns.findIndex(function (dataColumn) { return !!dataColumn.column && dataColumn.column.name === column.columnName; }) > -1;
            if (level > acc.level && isDataColumn) {
                return __assign$1(__assign$1({}, acc), { level: level });
            }
            return acc;
        }, result || { level: 0 }));
    };
    var tableBandHeaders = Array.from({
        length: getMaxNestedLevel(columnBands, 0).level,
    })
        .map(function (row, index) { return ({
        key: TABLE_BAND_TYPE.toString() + "_" + index,
        type: TABLE_BAND_TYPE,
        level: index,
    }); });
    return __spread$2(tableBandHeaders, tableHeaderRows);
};
var tableHeaderColumnChainsWithBands = function (tableHeaderRows, tableColumns, bands) {
    var chains = generateSimpleChains(tableHeaderRows, tableColumns);
    var maxBandRowIndex = tableHeaderRows
        .filter(function (row) { return row.type === TABLE_BAND_TYPE; })
        .length;
    var rawBandChains = chains.slice(0, maxBandRowIndex);
    var currentBand = null;
    var shouldSplitChain = function (chain, column, rowIndex) {
        if (rowIndex > maxBandRowIndex)
            return false;
        var columnName = column.column && column.column.name || '';
        currentBand = getColumnMeta(columnName, bands, rowIndex);
        return !chain
            || chain.key !== currentBand.key;
    };
    var extendChainProps = function () { return ({
        bandTitle: currentBand === null || currentBand === void 0 ? void 0 : currentBand.title,
        key: currentBand === null || currentBand === void 0 ? void 0 : currentBand.key,
    }); };
    var bandChains = splitHeaderColumnChains(rawBandChains, tableColumns, shouldSplitChain, extendChainProps);
    return __spread$2(bandChains, chains.slice(maxBandRowIndex));
};
var getBandLevels = function (columnsBands, levels, level) {
    if (levels === void 0) { levels = {}; }
    if (level === void 0) { level = 0; }
    columnsBands.forEach(function (band) {
        if (band.title) {
            levels[band.title] = level;
        }
        if (band.children) {
            getBandLevels(band.children, levels, level + 1);
        }
    });
    return levels;
};
var columnBandLevels = function (columnsBands) { return (getBandLevels(columnsBands)); };
var bandLevelsVisibility = function (columnIntervals, tableHeaderColumnChains, bandLevels) {
    var rowsWithBands = tableHeaderColumnChains
        .filter(function (r) { return r.filter(function (ch) { return !!ch.bandTitle; }).length; });
    var visibleIntervals = columnIntervals.map(function (_a) {
        var _b = __read$2(_a, 2), start = _b[0], end = _b[1];
        return ({ start: start, end: end });
    });
    var isBandChainVisible = function (chain) { return (visibleIntervals.some(function (interval) { return (intervalUtil.intersect(interval, { start: chain.start, end: chain.start + chain.columns.length - 1 }) !== intervalUtil.empty); })); };
    var getVisibleBandsByLevel = function (level) { return (
    // Note: a visible band level always matches with it's row
    rowsWithBands[level]
        ? rowsWithBands[level].filter(function (chain) { return (bandLevels[chain.bandTitle] === level && isBandChainVisible(chain)); })
        : []); };
    return rowsWithBands.reduce(function (acc, _, index) {
        var rowBands = getVisibleBandsByLevel(index);
        return __spread$2(acc, [!!rowBands.length]);
    }, []);
};
var columnVisibleIntervals = function (viewport, tableColumns) { return (viewport ? viewport.columns : [[0, tableColumns.length]]); };

var TABLE_DETAIL_TYPE = Symbol('detail');

var isDetailRowExpanded = function (expandedDetailRowIds, rowId) { return expandedDetailRowIds.indexOf(rowId) > -1; };
var isDetailToggleTableCell = function (tableRow, tableColumn) { return tableColumn.type === TABLE_DETAIL_TYPE && tableRow.type === TABLE_DATA_TYPE; };
var isDetailTableRow = function (tableRow) { return tableRow.type === TABLE_DETAIL_TYPE; };
var isDetailTableCell = function (tableColumn, tableColumns) { return tableColumns.indexOf(tableColumn) === 0; };

var tableRowsWithExpandedDetail = function (tableRows, expandedDetailRowIds, rowHeight) {
    var result = tableRows;
    expandedDetailRowIds
        .forEach(function (expandedRowId) {
        var rowIndex = result.findIndex(function (tableRow) { return tableRow.type === TABLE_DATA_TYPE && tableRow.rowId === expandedRowId; });
        if (rowIndex === -1)
            return;
        var insertIndex = rowIndex + 1;
        var _a = result[rowIndex], row = _a.row, rowId = _a.rowId;
        result = __spread$2(result.slice(0, insertIndex), [
            {
                rowId: rowId,
                row: row,
                key: TABLE_DETAIL_TYPE.toString() + "_" + rowId,
                type: TABLE_DETAIL_TYPE,
                height: rowHeight,
            }
        ], result.slice(insertIndex));
    });
    return result;
};
var tableColumnsWithDetail = function (tableColumns, toggleColumnWidth) { return __spread$2([
    { key: TABLE_DETAIL_TYPE.toString(), type: TABLE_DETAIL_TYPE, width: toggleColumnWidth }
], tableColumns); };
var tableDetailCellColSpanGetter = function (getTableCellColSpan) { return function (params) {
    var tableRow = params.tableRow, tableColumns = params.tableColumns, tableColumn = params.tableColumn;
    if (tableRow.type === TABLE_DETAIL_TYPE && tableColumns.indexOf(tableColumn) === 0) {
        return tableColumns.length;
    }
    return getTableCellColSpan(params);
}; };

var TABLE_SELECT_TYPE = Symbol('select');

var isSelectTableCell = function (tableRow, tableColumn) { return tableColumn.type === TABLE_SELECT_TYPE && tableRow.type === TABLE_DATA_TYPE; };
var isSelectAllTableCell = function (tableRow, tableColumn) { return tableColumn.type === TABLE_SELECT_TYPE && tableRow.type === TABLE_HEADING_TYPE; };
var isRowHighlighted = function (highlightRow, selection, tableRow) { return (highlightRow && selection && selection.includes(tableRow.rowId)); };

var tableColumnsWithSelection = function (tableColumns, selectionColumnWidth) { return __spread$2([
    { key: TABLE_SELECT_TYPE.toString(), type: TABLE_SELECT_TYPE, width: selectionColumnWidth }
], tableColumns); };

var VALID_UNITS$1 = ['px', '%', 'em', 'rem', 'vm', 'vh', 'vmin', 'vmax', ''];
var TABLE_ERROR = 'The columnExtension property of the Table plugin is given an invalid value.';
var isDataTableCell = function (tableRow, tableColumn) { return tableRow.type === TABLE_DATA_TYPE && tableColumn.type === TABLE_DATA_TYPE; };
var isHeaderStubTableCell = function (tableRow, headerRows) { return headerRows.indexOf(tableRow) > -1; };
var isDataTableRow = function (tableRow) { return tableRow.type === TABLE_DATA_TYPE; };
var isNoDataTableRow = function (tableRow) { return tableRow.type === TABLE_NODATA_TYPE; };
var isNoDataTableCell = function (tableColumn, tableColumns) { return tableColumns.indexOf(tableColumn) === 0; };
var isStubTableCell = function (tableRow) { return (tableRow.type === TABLE_STUB_TYPE); };
var checkTableColumnExtensions = function (columnExtensions) {
    if (columnExtensions) {
        columnExtensions.map(function (column) {
            var width = column.width;
            if (typeof width === 'string') {
                if (!isValidValue(width, VALID_UNITS$1)) {
                    throw new Error(TABLE_ERROR);
                }
            }
        });
    }
};

var getColumnExtension = function (columnExtensions, columnName) {
    if (!columnExtensions) {
        // tslint:disable-next-line:no-object-literal-type-assertion
        return {};
    }
    var columnExtension = columnExtensions.find(function (extension) { return extension.columnName === columnName; });
    if (!columnExtension) {
        // tslint:disable-next-line:no-object-literal-type-assertion
        return {};
    }
    return columnExtension;
};
var getColumnExtensionValueGetter = function (columnExtensions, extensionName, defaultValue) { return function (columnName) {
    if (columnExtensions) {
        var columnExtension = getColumnExtension(columnExtensions, columnName);
        var extensionValue = columnExtension[extensionName];
        return extensionValue !== undefined ? extensionValue : defaultValue;
    }
    return defaultValue;
}; };

var tableColumnsWithDataRows = function (columns, columnExtensions) { return columns.map(function (column) {
    var name = column.name;
    var columnExtension = getColumnExtension(columnExtensions, name);
    var width = convertWidth(columnExtension.width);
    return {
        column: column,
        key: TABLE_DATA_TYPE.toString() + "_" + name,
        type: TABLE_DATA_TYPE,
        width: width,
        align: columnExtension.align,
        wordWrapEnabled: columnExtension.wordWrapEnabled,
    };
}); };
var tableRowsWithDataRows = function (rows, getRowId, isRemoteRowsLoading) { return (!rows.length && !isRemoteRowsLoading
    ? [{ key: TABLE_NODATA_TYPE.toString(), type: TABLE_NODATA_TYPE }]
    : rows.map(function (row, dataIndex) {
        var rowId = getRowId(row);
        return {
            row: row,
            // dataIndex,
            rowId: rowId,
            type: TABLE_DATA_TYPE,
            key: TABLE_DATA_TYPE.toString() + "_" + rowId,
        };
    })); };
var tableCellColSpanGetter = function (params) {
    var tableRow = params.tableRow, tableColumns = params.tableColumns, tableColumn = params.tableColumn;
    if (tableRow.type === TABLE_NODATA_TYPE && tableColumns.indexOf(tableColumn) === 0) {
        return tableColumns.length;
    }
    return 1;
};

var visibleTableColumns = function (tableColumns, hiddenColumnNames) {
    if (tableColumns === void 0) { tableColumns = []; }
    return tableColumns.filter(function (tableColumn) { return tableColumn.type !== TABLE_DATA_TYPE
        || hiddenColumnNames.indexOf(tableColumn.column.name) === -1; });
};

var tableDataColumnsExist = function (tableColumns) { return tableColumns.some(function (column) { return column.type === TABLE_DATA_TYPE; }); };

var columnChooserItems = function (columns, hiddenColumnNames) { return columns.map(function (column) { return ({
    column: column,
    hidden: hiddenColumnNames.indexOf(column.name) !== -1,
}); }); };

var toggleColumn = function (hiddenColumnNames, columnName) { return (hiddenColumnNames.indexOf(columnName) === -1
    ? __spread$2(hiddenColumnNames, [columnName]) : hiddenColumnNames.filter(function (hiddenColumn) { return hiddenColumn !== columnName; })); };

var isTreeTableCell = function (tableRow, tableColumn, forColumnName) { return tableRow.type === TABLE_DATA_TYPE && tableColumn.type === TABLE_DATA_TYPE
    && tableColumn.column.name === forColumnName; };

var changeSearchValue = function (prevSearchValue, searchValue) { return searchValue; };

var searchFilterExpression = function (searchValue, columns, filterExpression) {
    var filters = columns.map(function (_a) {
        var name = _a.name;
        return ({ columnName: name, value: searchValue });
    });
    var selfFilterExpression = { filters: filters, operator: 'or' };
    if (!filterExpression) {
        return selfFilterExpression;
    }
    return {
        operator: 'and',
        filters: [filterExpression, selfFilterExpression],
    };
};

var getAvailableFilterOperationsGetter = function (getAvailableFilterOperations, availableFilterOperations, columnNames) { return function (columnName) { return (columnNames.indexOf(columnName) > -1 && availableFilterOperations)
    // tslint:disable-next-line: max-line-length
    || (typeof getAvailableFilterOperations === 'function' && getAvailableFilterOperations(columnName))
    || undefined; }; };

var FIXED_COLUMN_LEFT_SIDE = 'left';
var FIXED_COLUMN_RIGHT_SIDE = 'right';
var TABLE_FIXED_TYPE = Symbol('fixed');

var getFixedColumnKeys = function (tableColumns, fixedNames) { return tableColumns
    .filter(function (tableColumn) { return ((tableColumn.type === TABLE_DATA_TYPE && fixedNames.indexOf(tableColumn.column.name) !== -1)
    || fixedNames.indexOf(tableColumn.type) !== -1); })
    .map(function (_a) {
    var key = _a.key;
    return key;
}); };
var isFixedTableRow = function (tableRow) { return tableRow.type === TABLE_FIXED_TYPE; };
var calculatePosition = function (array, index, tableColumnDimensions) { return (index === 0
    ? 0
    : array
        .slice(0, index)
        .reduce(function (acc, target) { return acc + tableColumnDimensions[target] || 0; }, 0)); };
var calculateFixedColumnProps = function (_a, _b, tableColumns, tableColumnDimensions, tableHeaderColumnChains) {
    var tableColumn = _a.tableColumn;
    var leftColumns = _b.leftColumns, rightColumns = _b.rightColumns;
    var side = tableColumn.fixed;
    var targetArray = side === FIXED_COLUMN_LEFT_SIDE
        ? getFixedColumnKeys(tableColumns, leftColumns)
        : slice(getFixedColumnKeys(tableColumns, rightColumns)).reverse();
    var index = tableColumns.findIndex(function (_a) {
        var key = _a.key;
        return key === tableColumn.key;
    });
    var fixedIndex = targetArray.indexOf(tableColumn.key);
    var columnChain = findChainByColumnIndex(tableHeaderColumnChains[0], index);
    var showLeftDivider = columnChain.start === index && index !== 0;
    var showRightDivider = columnChain.start + columnChain.columns.length - 1 === index
        && index < tableColumns.length - 1;
    var position = calculatePosition(targetArray, fixedIndex, tableColumnDimensions);
    return {
        showRightDivider: showRightDivider,
        showLeftDivider: showLeftDivider,
        position: position,
        side: side,
    };
};

var tableColumnsWithFixed = function (tableColumns, leftColumns, rightColumns) { return tableColumns
    .map(function (tableColumn) {
    var fixed;
    if ((tableColumn.type === TABLE_DATA_TYPE
        && leftColumns.indexOf(tableColumn.column.name) !== -1)
        || leftColumns.indexOf(tableColumn.type) !== -1) {
        fixed = FIXED_COLUMN_LEFT_SIDE;
    }
    if ((tableColumn.type === TABLE_DATA_TYPE
        && rightColumns.indexOf(tableColumn.column.name) !== -1)
        || rightColumns.indexOf(tableColumn.type) !== -1) {
        fixed = FIXED_COLUMN_RIGHT_SIDE;
    }
    return fixed ? __assign$1(__assign$1({}, tableColumn), { fixed: fixed }) : tableColumn;
}); };
var tableHeaderRowsWithFixed = function (tableHeaderRows) { return __spread$2(tableHeaderRows, [
    { key: TABLE_FIXED_TYPE.toString(), type: TABLE_FIXED_TYPE, height: 0 },
]); };
var tableHeaderColumnChainsWithFixed = function (tableHeaderColumnChains, tableHeaderRows, tableColumns) {
    var chains = tableHeaderColumnChains
        || generateSimpleChains(tableHeaderRows, tableColumns);
    var shouldSplitChain = function (currentGroup, column) { return (!currentGroup || currentGroup.fixed !== column.fixed); };
    var extendChainProps = function (column) { return ({
        fixed: column.fixed,
    }); };
    return splitHeaderColumnChains(chains, tableColumns, shouldSplitChain, extendChainProps);
};

var TABLE_TOTAL_SUMMARY_TYPE = Symbol('totalSummary');
var TABLE_GROUP_SUMMARY_TYPE = Symbol('groupSummary');
var TABLE_TREE_SUMMARY_TYPE = Symbol('treeSummary');
var defaultFormatlessSummaries = ['count'];

var isTotalSummaryTableCell = function (tableRow, tableColumn) { return tableRow.type === TABLE_TOTAL_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE; };
var isGroupSummaryTableCell = function (tableRow, tableColumn) { return tableRow.type === TABLE_GROUP_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE; };
var isTreeSummaryTableCell = function (tableRow, tableColumn) { return tableRow.type === TABLE_TREE_SUMMARY_TYPE && tableColumn.type === TABLE_DATA_TYPE; };
var isTotalSummaryTableRow = function (tableRow) { return (tableRow.type === TABLE_TOTAL_SUMMARY_TYPE); };
var isGroupSummaryTableRow = function (tableRow) { return (tableRow.type === TABLE_GROUP_SUMMARY_TYPE); };
var isTreeSummaryTableRow = function (tableRow) { return (tableRow.type === TABLE_TREE_SUMMARY_TYPE); };
var getColumnSummaries = function (summaryItems, columnName, summaryValues, predicate) {
    if (predicate === void 0) { predicate = function () { return true; }; }
    return summaryItems
        .map(function (item, index) { return [item, index]; })
        .filter(function (_a) {
        var _b = __read$2(_a, 1), item = _b[0];
        return item.columnName === columnName && predicate(item);
    })
        .map(function (_a) {
        var _b = __read$2(_a, 2), item = _b[0], index = _b[1];
        return ({
            type: item.type,
            value: summaryValues[index],
        });
    });
};
var isFooterSummary = function (summaryItem) { return (summaryItem.showInGroupFooter); };
var isInlineGroupCaptionSummary = function (summaryItem) { return (!(summaryItem.showInGroupFooter ||
    summaryItem.alignByColumn)); };
var groupFooterSummaryExists = function (groupSummaryItems) { return groupSummaryItems === null || groupSummaryItems === void 0 ? void 0 : groupSummaryItems.some(isFooterSummary); };
var getGroupInlineSummaries = function (summaryItems, columns, summaryValues) {
    if (!summaryItems.some(isInlineGroupCaptionSummary)) {
        return [];
    }
    return columns.reduce(function (acc, column) {
        var colName = column.name;
        var summaries = getColumnSummaries(summaryItems, colName, summaryValues, isInlineGroupCaptionSummary);
        if (summaries.length) {
            acc.push({
                column: column,
                summaries: summaries,
            });
        }
        return acc;
    }, []);
};

var tableRowsWithTotalSummaries = function (footerRows) { return __spread$2([
    { key: TABLE_TOTAL_SUMMARY_TYPE.toString(), type: TABLE_TOTAL_SUMMARY_TYPE }
], footerRows); };
var tableRowsWithSummaries = function (tableRows, groupSummaryItems, treeSummaryItems, getRowLevelKey, isGroupRow, getRowId) {
    var hasGroupFooterSummary = groupFooterSummaryExists(groupSummaryItems);
    if (!getRowLevelKey || !(hasGroupFooterSummary || treeSummaryItems.length))
        return tableRows;
    var result = [];
    var closeLevel = function (level) {
        if (!level.opened)
            return;
        if (hasGroupFooterSummary && isGroupRow && isGroupRow(level.row)) {
            var compoundKey = level.row.compoundKey;
            result.push({
                key: TABLE_GROUP_SUMMARY_TYPE.toString() + "_" + compoundKey,
                type: TABLE_GROUP_SUMMARY_TYPE,
                row: level.row,
            });
        }
        else if (treeSummaryItems.length) {
            var rowId = getRowId(level.row);
            result.push({
                key: TABLE_TREE_SUMMARY_TYPE.toString() + "_" + rowId,
                type: TABLE_TREE_SUMMARY_TYPE,
                row: level.row,
            });
        }
    };
    var levels = [];
    tableRows.forEach(function (tableRow) {
        var row = tableRow.row;
        var levelKey = getRowLevelKey(row);
        if (levelKey) {
            var levelIndex = levels.findIndex(function (level) { return level.levelKey === levelKey; });
            if (levelIndex > -1) {
                levels.slice(levelIndex).reverse().forEach(closeLevel);
                levels = levels.slice(0, levelIndex);
            }
            if (!isGroupRow || !isGroupRow(row)) {
                levels = levels.map(function (level) { return (__assign$1(__assign$1({}, level), { opened: true })); });
            }
            levels.push({
                levelKey: levelKey,
                row: row,
                opened: false,
            });
        }
        else {
            levels = levels.map(function (level) { return (__assign$1(__assign$1({}, level), { opened: true })); });
        }
        result.push(tableRow);
    });
    levels.slice().reverse().forEach(closeLevel);
    return result;
};

var getTargetColumnGeometries = function (columnGeometries, sourceIndex) {
    var sourceWidth = columnGeometries[sourceIndex].right - columnGeometries[sourceIndex].left;
    var getWidthDifference = function (index) { return columnGeometries[index].right
        - columnGeometries[index].left
        - sourceWidth; };
    return columnGeometries
        .map(function (_a, targetIndex) {
        var top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left;
        var leftBorder = left;
        if (targetIndex > 0 && targetIndex <= sourceIndex) {
            leftBorder = Math.min(leftBorder, leftBorder - getWidthDifference(targetIndex - 1));
        }
        if (targetIndex > sourceIndex) {
            leftBorder = Math.max(leftBorder, leftBorder + getWidthDifference(targetIndex));
        }
        var rightBorder = right;
        if (targetIndex < columnGeometries.length - 1 && targetIndex >= sourceIndex) {
            rightBorder = Math.max(rightBorder, rightBorder + getWidthDifference(targetIndex + 1));
        }
        if (targetIndex < sourceIndex) {
            rightBorder = Math.min(rightBorder, rightBorder - getWidthDifference(targetIndex));
        }
        return {
            top: top,
            bottom: bottom,
            right: rightBorder,
            left: leftBorder,
        };
    });
};
var getCellGeometries = function (node) {
    var _a, _b;
    var _c = node.getBoundingClientRect(), left = _c.left, right = _c.right, width = _c.width;
    var styleLeft = parseInt((_a = node.style.left) === null || _a === void 0 ? void 0 : _a.toString().replace('px', ''), 10);
    var styleRight = parseInt((_b = node.style.right) === null || _b === void 0 ? void 0 : _b.toString().replace('px', ''), 10);
    if (!isNaN(styleLeft)) {
        var calculatedLeft = Math.max(styleLeft, left);
        return {
            left: calculatedLeft,
            right: calculatedLeft + width,
            isFixed: true,
        };
    }
    if (!isNaN(styleRight)) {
        // NOTE: get tableContainer (parent of first DIV element) to calculate 'right' value
        var tableContainer = node;
        while (tableContainer && tableContainer.nodeName !== 'DIV') {
            tableContainer = tableContainer.parentNode;
        }
        tableContainer = tableContainer === null || tableContainer === void 0 ? void 0 : tableContainer.parentNode;
        if (tableContainer) {
            var tableWidth = tableContainer.getBoundingClientRect().width;
            var calculatedRight = Math.min(tableWidth - styleRight, right);
            return {
                left: calculatedRight - width,
                right: calculatedRight,
                isFixed: true,
            };
        }
    }
    return { left: left, right: right };
};

var getTableColumnGeometries = function (columns, tableWidth) {
    var columnWidths = columns
        .map(function (column) { return column.width; });
    var freeSpace = tableWidth;
    var restrictedSpace = columnWidths
        .reduce(function (accum, width) { return accum + (typeof width === 'number' ? width : 0); }, 0);
    var freeSpacePortions = columnWidths
        .reduce(function (accum, width) { return accum + (typeof width !== 'number' ? 1 : 0); }, 0);
    var freeSpacePortion = (freeSpace - restrictedSpace) / freeSpacePortions;
    var lastRightPosition = 0;
    return columnWidths
        .map(function (width) { return (typeof width !== 'number' ? freeSpacePortion : width); })
        .map(function (width) {
        lastRightPosition += width;
        return {
            left: lastRightPosition - width,
            right: lastRightPosition,
        };
    });
};
var getTableTargetColumnIndex = function (columnGeometries, offset) {
    var indexes = columnGeometries.reduce(function (acc, _a, index) {
        var left = _a.left, right = _a.right;
        if (offset > left && offset < right) {
            acc.push(index);
        }
        return acc;
    }, []);
    if (indexes.length === 2) {
        return indexes.find(function (index) { return columnGeometries[index].isFixed; });
    }
    if (indexes.length === 1) {
        return indexes[0];
    }
    return -1;
};
var ANIMATION_DURATION = 200;
var getAnimationProgress = function (animation) { return (new Date().getTime() - animation.startTime) / ANIMATION_DURATION; };
var getAnimations = function (prevColumns, nextColumns, tableWidth, prevAnimations) {
    var resizing = prevColumns.map(function (column) { return column.key; }).join()
        === nextColumns.map(function (column) { return column.key; }).join();
    var prevColumnGeometries = new Map(getTableColumnGeometries(prevColumns, tableWidth)
        .map(function (geometry, index) { return [prevColumns[index].key, geometry]; })
        .map(function (_a) {
        var _b = __read$2(_a, 2), key = _b[0], geometry = _b[1];
        var animation = prevAnimations.get(key);
        if (!animation)
            return [key, geometry];
        var progress = easeOutCubic(getAnimationProgress(animation));
        var _c = animation.left, to = _c.to, from = _c.from;
        var left = ((to - from) * progress) + from;
        return [key, {
                left: left,
                right: geometry.right - (geometry.left - left),
            }];
        // tslint:disable-next-line:array-type
    }));
    var nextColumnGeometries = new Map(getTableColumnGeometries(nextColumns, tableWidth)
        // tslint:disable-next-line:array-type
        .map(function (geometry, index) { return [nextColumns[index].key, geometry]; }));
    return new Map(__spread$2(nextColumnGeometries.keys()).map(function (key) {
        var prev = prevColumnGeometries.get(key);
        var next = nextColumnGeometries.get(key);
        var result = { startTime: new Date().getTime(), style: {} };
        var takePrevColumnIntoAccount = !!prevAnimations.get(key) || (prev && !resizing);
        if (Math.abs((takePrevColumnIntoAccount ? prev.left : next.left) - next.left) > 1) {
            result.left = { from: prev.left, to: next.left };
        }
        return [key, result];
    })
        .filter(function (animation) { return animation[1].left; }));
};
var filterActiveAnimations = function (animations) { return new Map(__spread$2(animations.entries()).filter(function (_a) {
    var _b = __read$2(_a, 2), animation = _b[1];
    return getAnimationProgress(animation) < 1;
})); };
var evalAnimations = function (animations) { return new Map(__spread$2(animations.entries()).map(function (_a) {
    var _b = __read$2(_a, 2), key = _b[0], animation = _b[1];
    var progress = easeOutCubic(getAnimationProgress(animation));
    var result = __assign$1({}, animation.style);
    if (animation.left) {
        var offset = (animation.left.to - animation.left.from) * (progress - 1);
        result.transform = "translateX(" + offset + "px)";
    }
    return [key, result];
})); };

var isOnTheSameLine = function (geometry, y) { return (y >= geometry.top && y <= geometry.bottom); };
var rectToObject = function (_a) {
    var top = _a.top, right = _a.right, bottom = _a.bottom, left = _a.left;
    return ({
        top: top, right: right, bottom: bottom, left: left,
    });
};
var collapseGapsBetweenItems = function (geometries) { return (geometries.map(function (geometry, index) {
    if (index !== geometries.length - 1 && geometry.top === geometries[index + 1].top) {
        return __assign$1(__assign$1({}, geometry), { right: geometries[index + 1].left });
    }
    return geometry;
})); };
var getGroupCellTargetIndex = function (geometries, sourceIndex, _a) {
    var x = _a.x, y = _a.y;
    if (geometries.length === 0)
        return 0;
    var targetGeometries = sourceIndex !== -1
        ? getTargetColumnGeometries(geometries, sourceIndex)
        : geometries.map(rectToObject);
    var targetIndex = collapseGapsBetweenItems(targetGeometries)
        .findIndex(function (geometry, index) {
        var inVerticalBounds = isOnTheSameLine(geometry, y);
        var inHorizontalBounds = x >= geometry.left && x <= geometry.right;
        var shouldGoFirst = index === 0 && x < geometry.left;
        var shouldGoOnLineBreak = !inVerticalBounds
            && !!geometries[index - 1]
            && isOnTheSameLine(geometries[index - 1], y);
        return (inVerticalBounds && inHorizontalBounds)
            || shouldGoFirst
            || shouldGoOnLineBreak;
    });
    return targetIndex === -1 ? geometries.length : targetIndex;
};

/** @internal */
var arraysEqual = function (arrA, arrB, comparator) {
    if (comparator === void 0) { comparator = function (a, b) { return a === b; }; }
    if (arrA.length !== arrB.length) {
        return false;
    }
    for (var i = 0; i < arrA.length; i += 1) {
        if (!comparator(arrA[i], arrB[i])) {
            return false;
        }
    }
    return true;
};
var TOP_POSITION = Symbol('top');
var BOTTOM_POSITION = Symbol('bottom');

var VALID_UNITS$2 = ['px', ''];
/* tslint:disable max-line-length */
var VIRTUAL_TABLE_ERROR = 'The columnExtension property of the VirtualTable plugin is given an invalid value.';
var getViewport = function (state, getters, estimatedRowHeight, getRowHeight, getColumnWidth) {
    var viewportTop = state.viewportTop, viewportLeft = state.viewportLeft, containerWidth = state.containerWidth, containerHeight = state.containerHeight, headerHeight = state.headerHeight, footerHeight = state.footerHeight;
    var loadedRowsStart = getters.loadedRowsStart, tableBodyRows = getters.bodyRows, tableColumns = getters.columns, _a = getters.headerRows, tableHeaderRows = _a === void 0 ? [] : _a, _b = getters.footerRows, tableFooterRows = _b === void 0 ? [] : _b, isDataRemote = getters.isDataRemote, viewport = getters.viewport;
    var rows = getRowsVisibleBoundary(tableBodyRows, viewportTop, containerHeight - headerHeight - footerHeight, getRowHeight, loadedRowsStart, estimatedRowHeight, isDataRemote);
    var headerRows = getRowsVisibleBoundary(tableHeaderRows, 0, headerHeight, getRowHeight, 0, estimatedRowHeight, false);
    var footerRows = getRowsVisibleBoundary(tableFooterRows, 0, footerHeight, getRowHeight, 0, estimatedRowHeight, false);
    var columns = getColumnBoundaries(tableColumns, viewportLeft, containerWidth, getColumnWidth);
    // NOTE: prevent unnecessary updates
    // e.g. when rows changed but bounds remain the same.
    var result = viewport;
    if (viewportTop !== viewport.top) {
        result = __assign$1(__assign$1({}, result), { top: viewportTop });
    }
    if (viewportLeft !== viewport.left) {
        result = __assign$1(__assign$1({}, result), { left: viewportLeft });
    }
    if (containerWidth !== viewport.width) {
        result = __assign$1(__assign$1({}, result), { width: containerWidth });
    }
    if (containerHeight !== viewport.height) {
        result = __assign$1(__assign$1({}, result), { height: containerHeight });
    }
    if (!arraysEqual(rows, viewport.rows)) {
        result = __assign$1(__assign$1({}, result), { rows: rows });
    }
    if (!arraysEqual(headerRows, viewport.headerRows)) {
        result = __assign$1(__assign$1({}, result), { headerRows: headerRows });
    }
    if (!arraysEqual(footerRows, viewport.footerRows)) {
        result = __assign$1(__assign$1({}, result), { footerRows: footerRows });
    }
    if (!arraysEqual(columns, viewport.columns, arraysEqual)) {
        result = __assign$1(__assign$1({}, result), { columns: columns });
    }
    return result;
};
var checkColumnWidths = function (tableColumns) {
    return tableColumns.reduce(function (acc, tableColumn) {
        var width = tableColumn.width;
        if (typeof width === 'string') {
            var numb = parseInt(width, 10);
            var unit_1 = numb ? width.substr(numb.toString().length) : width;
            var isValidUnit = VALID_UNITS$2.some(function (validUnit) { return validUnit === unit_1; });
            if (!isValidUnit) {
                throw new Error(VIRTUAL_TABLE_ERROR);
            }
            acc.push(__assign$1(__assign$1({}, tableColumn), { width: numb }));
        }
        else {
            acc.push(tableColumn);
        }
        return acc;
    }, []);
};
var calculateScrollHeight = function (rowHeight, index) {
    return index > -1 ? rowHeight * index : undefined;
};
var getScrollTop = function (rows, rowsCount, rowId, rowHeight, isDataRemote) {
    if (rowId === TOP_POSITION) {
        return 0;
    }
    if (rowId === BOTTOM_POSITION) {
        return rowsCount * rowHeight;
    }
    var searchIndexRequired = !isDataRemote && rowId !== undefined;
    var indexById = searchIndexRequired
        ? rows.findIndex(function (row) { return row.rowId === rowId; })
        : undefined;
    return calculateScrollHeight(rowHeight, indexById);
};
var getTopRowId = function (viewport, tableBodyRows, isDataRemote) {
    var hasViewportRows = viewport && viewport.rows;
    var hasBodyRows = tableBodyRows && tableBodyRows.length;
    if (hasViewportRows && hasBodyRows && !isDataRemote) {
        var index = viewport.rows[0];
        return index < tableBodyRows.length ? tableBodyRows[index].rowId : undefined;
    }
    return undefined;
};

/**
 * Bundle of @devexpress/dx-react-grid
 * Generated: 2021-06-24
 * Version: 2.7.6
 * License: https://js.devexpress.com/Licensing
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics$1 = function(d, b) {
    extendStatics$1 = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics$1(d, b);
};

function __extends$1(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics$1(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign$2 = function() {
    __assign$2 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$2.apply(this, arguments);
};

function __rest$1(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __read$3(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

/** @deprecated */
function __spread$3() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read$3(arguments[i]));
    return ar;
}

var showColumnWhenGroupedGetter = function (showColumnsWhenGrouped, columnExtensions) {
    if (columnExtensions === void 0) { columnExtensions = []; }
    var map = columnExtensions.reduce(function (acc, columnExtension) {
        acc[columnExtension.columnName] = columnExtension.showWhenGrouped;
        return acc;
    }, {});
    return function (columnName) { return map[columnName] || showColumnsWhenGrouped; };
};
/** @internal */
var TableColumnsWithGrouping = react.memo(function (_a) {
    var indentColumnWidth = _a.indentColumnWidth, showColumnsWhenGrouped = _a.showColumnsWhenGrouped, columnExtensions = _a.columnExtensions;
    var tableColumnsComputed = function (_a) {
        var columns = _a.columns, tableColumns = _a.tableColumns, grouping = _a.grouping, draftGrouping = _a.draftGrouping;
        return tableColumnsWithGrouping(columns, tableColumns, grouping, draftGrouping, indentColumnWidth, showColumnWhenGroupedGetter(showColumnsWhenGrouped, columnExtensions));
    };
    return (react.createElement(Plugin, null,
        react.createElement(Getter, { name: "tableColumns", computed: tableColumnsComputed })));
});
TableColumnsWithGrouping.defaultProps = {
    indentColumnWidth: 0,
};

var GridCoreGetters = react.memo(function (_a) {
    var rows = _a.rows, columns = _a.columns, getRowId = _a.getRowId, getCellValue = _a.getCellValue;
    return (react.createElement(Plugin, null,
        react.createElement(Getter, { name: "rows", value: rows }),
        react.createElement(Getter, { name: "getRowId", value: rowIdGetter(getRowId, rows) }),
        react.createElement(Getter, { name: "columns", value: columns }),
        react.createElement(Getter, { name: "getCellValue", value: cellValueGetter(getCellValue, columns) })));
});

var TableColumnsWithDataRowsGetter = react.memo(function (_a) {
    var columnExtensions = _a.columnExtensions;
    var tableColumnsComputed = react.useCallback(function (_a) {
        var columns = _a.columns;
        return (tableColumnsWithDataRows(columns, columnExtensions));
    }, [columnExtensions]);
    checkTableColumnExtensions(columnExtensions);
    return (react.createElement(Plugin, null,
        react.createElement(Getter, { name: "tableColumns", computed: tableColumnsComputed })));
});

var visibleTableColumnsComputed = function (_a) {
    var tableColumns = _a.tableColumns, hiddenColumnNames = _a.hiddenColumnNames;
    return visibleTableColumns(tableColumns, hiddenColumnNames);
};
/** @internal */
var VisibleTableColumns = react.memo(function (_a) {
    var hiddenColumnNames = _a.hiddenColumnNames;
    return (react.createElement(Plugin, null,
        react.createElement(Getter, { name: "hiddenColumnNames", value: hiddenColumnNames }),
        react.createElement(Getter, { name: "tableColumns", computed: visibleTableColumnsComputed })));
});
VisibleTableColumns.defaultProps = {
    hiddenColumnNames: [],
};

/** @internal */
var OrderedTableColumns = function (_a) {
    var order = _a.order;
    var columnsComputed = function (_a) {
        var tableColumns = _a.tableColumns;
        return orderedColumns(tableColumns, order);
    };
    return (react.createElement(Plugin, null,
        react.createElement(Getter, { name: "tableColumns", computed: columnsComputed })));
};
OrderedTableColumns.defaultProps = {
    order: [],
};

var GridCore = /*#__PURE__*/ (function (_super) {
    __extends$1(GridCore, _super);
    function GridCore() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GridCore.prototype.render = function () {
        var _a = this.props, Root = _a.rootComponent, restProps = __rest$1(_a, ["rootComponent"]);
        return (react.createElement(Plugin, null,
            react.createElement(Getter, { name: "skip", value: 0 }),
            react.createElement(Getter, { name: "loadedRowsStart", value: 0 }),
            react.createElement(GridCoreGetters, __assign$2({}, restProps)),
            react.createElement(Template, { name: "root" },
                react.createElement(Root, null,
                    react.createElement(TemplatePlaceholder, { name: "header" }),
                    react.createElement(TemplatePlaceholder, { name: "body" }),
                    react.createElement(TemplatePlaceholder, { name: "footer" })))));
    };
    return GridCore;
}(react.PureComponent));

var GridBase = function (_a) {
    var rows = _a.rows, columns = _a.columns, getRowId = _a.getRowId, getCellValue = _a.getCellValue, rootComponent = _a.rootComponent, children = _a.children;
    return (react.createElement(PluginHost$1, null,
        react.createElement(GridCore, { rows: rows, columns: columns, getRowId: getRowId, getCellValue: getCellValue, rootComponent: rootComponent }),
        children));
};
/***
 * The Grid is a root container component designed to process and display data specified via
 * the `rows` property. You can configure columns using the `columns` property. The Grid's
 * functionality  is implemented in several plugins specified as child components.
 * See the plugins concept for details.
 * */
var Grid = GridBase;

var pluginDependencies = [
    { name: 'TableColumnVisibility' },
    { name: 'Toolbar' },
];
var ColumnChooserBase = /*#__PURE__*/ (function (_super) {
    __extends$1(ColumnChooserBase, _super);
    function ColumnChooserBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            visible: false,
        };
        _this.handleToggle = _this.handleToggle.bind(_this);
        _this.handleHide = _this.handleHide.bind(_this);
        _this.setButtonRef = _this.setButtonRef.bind(_this);
        return _this;
    }
    ColumnChooserBase.prototype.setButtonRef = function (button) {
        this.button = button;
    };
    ColumnChooserBase.prototype.handleToggle = function () {
        var visible = this.state.visible;
        this.setState({ visible: !visible });
    };
    ColumnChooserBase.prototype.handleHide = function () {
        this.setState({ visible: false });
    };
    ColumnChooserBase.prototype.render = function () {
        var _this = this;
        var _a = this.props, Overlay = _a.overlayComponent, Container = _a.containerComponent, Item = _a.itemComponent, ToggleButton = _a.toggleButtonComponent, messages = _a.messages;
        var getMessage = getMessagesFormatter(messages);
        var visible = this.state.visible;
        return (react.createElement(Plugin, { name: "ColumnChooser", dependencies: pluginDependencies },
            react.createElement(Template, { name: "toolbarContent" },
                react.createElement(TemplatePlaceholder, null),
                react.createElement(TemplateConnector, null, function (_a, _b) {
                    var columns = _a.columns, hiddenColumnNames = _a.hiddenColumnNames, isColumnTogglingEnabled = _a.isColumnTogglingEnabled;
                    var toggleColumnVisibility = _b.toggleColumnVisibility;
                    return (react.createElement(react.Fragment, null,
                        react.createElement(ToggleButton, { buttonRef: _this.setButtonRef, onToggle: _this.handleToggle, getMessage: getMessage, active: visible }),
                        react.createElement(Overlay, { visible: visible, target: _this.button, onHide: _this.handleHide },
                            react.createElement(Container, null, columnChooserItems(columns, hiddenColumnNames)
                                .map(function (item) {
                                var columnName = item.column.name;
                                var togglingEnabled = isColumnTogglingEnabled(columnName);
                                return (react.createElement(Item, { key: columnName, item: item, disabled: !togglingEnabled, onToggle: function () { return toggleColumnVisibility(columnName); } }));
                            })))));
                }))));
    };
    ColumnChooserBase.defaultProps = {
        messages: {},
    };
    ColumnChooserBase.components = {
        overlayComponent: 'Overlay',
        containerComponent: 'Container',
        itemComponent: 'Item',
        toggleButtonComponent: 'ToggleButton',
    };
    return ColumnChooserBase;
}(react.PureComponent));
/***
 * The ColumnChooser plugin allows a user to toggle grid columns' visibility at runtime.
 * The column chooser lists columns with checkboxes that control a corresponding
 * column's visibility.
 * */
var ColumnChooser = ColumnChooserBase;

var columnExtensionValueGetter = function (columnExtensions, defaultValue) { return (getColumnExtensionValueGetter(columnExtensions, 'filteringEnabled', defaultValue)); };
var filterExpressionComputed = function (_a) {
    var filters = _a.filters, filterExpressionValue = _a.filterExpression;
    return filterExpression(filters, filterExpressionValue);
};
var FilteringStateBase = /*#__PURE__*/ (function (_super) {
    __extends$1(FilteringStateBase, _super);
    function FilteringStateBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            filters: props.filters || props.defaultFilters,
        };
        var stateHelper = createStateHelper(_this, {
            filters: function () {
                var onFiltersChange = _this.props.onFiltersChange;
                return onFiltersChange;
            },
        });
        _this.changeColumnFilter = stateHelper.applyFieldReducer
            .bind(stateHelper, 'filters', changeColumnFilter);
        return _this;
    }
    // tslint:disable-next-line:member-ordering
    FilteringStateBase.getDerivedStateFromProps = function (nextProps, prevState) {
        var _a = nextProps.filters, filters = _a === void 0 ? prevState.filters : _a;
        return {
            filters: filters,
        };
    };
    FilteringStateBase.prototype.render = function () {
        var filters = this.state.filters;
        var _a = this.props, columnExtensions = _a.columnExtensions, columnFilteringEnabled = _a.columnFilteringEnabled;
        return (react.createElement(Plugin, { name: "FilteringState" },
            react.createElement(Getter, { name: "filters", value: filters }),
            react.createElement(Getter, { name: "filterExpression", computed: filterExpressionComputed }),
            react.createElement(Getter, { name: "isColumnFilteringEnabled", value: columnExtensionValueGetter(columnExtensions, columnFilteringEnabled) }),
            react.createElement(Action, { name: "changeColumnFilter", action: this.changeColumnFilter })));
    };
    FilteringStateBase.defaultProps = {
        defaultFilters: [],
        columnFilteringEnabled: true,
    };
    return FilteringStateBase;
}(react.PureComponent));
/** A plugin that manages the filtering state. */
var FilteringState = FilteringStateBase;

var pluginDependencies$1 = [
    { name: 'FilteringState', optional: true },
    { name: 'SearchState', optional: true },
];
var getCollapsedRowsComputed = function (_a) {
    var rows = _a.rows;
    return filteredCollapsedRowsGetter(rows);
};
var unwrappedRowsComputed = function (_a) {
    var rows = _a.rows;
    return unwrappedFilteredRows(rows);
};
var IntegratedFilteringBase = /*#__PURE__*/ (function (_super) {
    __extends$1(IntegratedFilteringBase, _super);
    function IntegratedFilteringBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntegratedFilteringBase.prototype.render = function () {
        var columnExtensions = this.props.columnExtensions;
        var getColumnPredicate = function (columnName) { return getColumnExtension(columnExtensions, columnName).predicate; };
        var rowsComputed = function (_a) {
            var rows = _a.rows, filterExpression = _a.filterExpression, getCellValue = _a.getCellValue, getRowLevelKey = _a.getRowLevelKey, getCollapsedRows = _a.getCollapsedRows;
            return filteredRows(rows, filterExpression, getCellValue, getColumnPredicate, getRowLevelKey, getCollapsedRows);
        };
        return (react.createElement(Plugin, { name: "IntegratedFiltering", dependencies: pluginDependencies$1 },
            react.createElement(Getter, { name: "rows", computed: rowsComputed }),
            react.createElement(Getter, { name: "getCollapsedRows", computed: getCollapsedRowsComputed }),
            react.createElement(Getter, { name: "rows", computed: unwrappedRowsComputed })));
    };
    return IntegratedFilteringBase;
}(react.PureComponent));
IntegratedFilteringBase.defaultPredicate = defaultFilterPredicate;
var IntegratedFiltering = IntegratedFilteringBase;

var columnExtensionValueGetter$1 = function (columnExtensions, defaultValue) { return getColumnExtensionValueGetter(columnExtensions, 'editingEnabled', defaultValue); };
var EditingStateBase = /*#__PURE__*/ (function (_super) {
    __extends$1(EditingStateBase, _super);
    function EditingStateBase(props) {
        var _this = _super.call(this, props) || this;
        var rowChanges = props.rowChanges || props.defaultRowChanges;
        var addedRows = props.addedRows || props.defaultAddedRows;
        var getRowChanges = function () {
            var stateRowChanges = _this.state.rowChanges;
            return stateRowChanges;
        };
        var getAddedRows = function () {
            var stateAddedRows = _this.state.addedRows;
            return stateAddedRows;
        };
        _this.state = {
            addedRows: addedRows,
            rowChanges: rowChanges,
            editingRowIds: props.editingRowIds || props.defaultEditingRowIds,
            deletedRowIds: props.deletedRowIds || props.defaultDeletedRowIds,
            editingCells: props.editingCells || props.defaultEditingCells,
        };
        var stateHelper = createStateHelper(_this, {
            editingRowIds: function () {
                var onEditingRowIdsChange = _this.props.onEditingRowIdsChange;
                return onEditingRowIdsChange;
            },
            editingCells: function () {
                var onEditingCellsChange = _this.props.onEditingCellsChange;
                return onEditingCellsChange;
            },
            addedRows: function () {
                var onAddedRowsChange = _this.props.onAddedRowsChange;
                return onAddedRowsChange;
            },
            rowChanges: function () {
                var onRowChangesChange = _this.props.onRowChangesChange;
                return onRowChangesChange;
            },
            deletedRowIds: function () {
                var onDeletedRowIdsChange = _this.props.onDeletedRowIdsChange;
                return onDeletedRowIdsChange;
            },
        });
        _this.startEditRows = stateHelper.applyFieldReducer
            .bind(stateHelper, 'editingRowIds', startEditRows);
        _this.stopEditRows = stateHelper.applyFieldReducer
            .bind(stateHelper, 'editingRowIds', stopEditRows);
        _this.startEditCells = stateHelper.applyFieldReducer
            .bind(stateHelper, 'editingCells', startEditCells);
        _this.stopEditCells = stateHelper.applyFieldReducer
            .bind(stateHelper, 'editingCells', stopEditCells);
        _this.changeRow = stateHelper.applyFieldReducer
            .bind(stateHelper, 'rowChanges', changeRow);
        _this.cancelChangedRows = stateHelper.applyFieldReducer
            .bind(stateHelper, 'rowChanges', cancelChanges);
        _this.commitChangedRows = function (_a) {
            var rowIds = _a.rowIds;
            var onCommitChanges = _this.props.onCommitChanges;
            onCommitChanges({
                changed: changedRowsByIds(getRowChanges(), rowIds),
            });
            _this.cancelChangedRows({ rowIds: rowIds });
        };
        _this.addRow = stateHelper.applyFieldReducer
            .bind(stateHelper, 'addedRows', addRow);
        _this.changeAddedRow = stateHelper.applyFieldReducer
            .bind(stateHelper, 'addedRows', changeAddedRow);
        _this.cancelAddedRows = stateHelper.applyFieldReducer
            .bind(stateHelper, 'addedRows', cancelAddedRows);
        _this.commitAddedRows = function (_a) {
            var rowIds = _a.rowIds;
            var onCommitChanges = _this.props.onCommitChanges;
            onCommitChanges({
                added: addedRowsByIds(getAddedRows(), rowIds),
            });
            _this.cancelAddedRows({ rowIds: rowIds });
        };
        _this.deleteRows = stateHelper.applyFieldReducer
            .bind(stateHelper, 'deletedRowIds', deleteRows);
        _this.cancelDeletedRows = stateHelper.applyFieldReducer
            .bind(stateHelper, 'deletedRowIds', cancelDeletedRows);
        _this.commitDeletedRows = function (_a) {
            var rowIds = _a.rowIds;
            var onCommitChanges = _this.props.onCommitChanges;
            onCommitChanges({ deleted: rowIds });
            _this.cancelDeletedRows({ rowIds: rowIds });
        };
        return _this;
    }
    EditingStateBase.getDerivedStateFromProps = function (nextProps, prevState) {
        var _a = nextProps.editingRowIds, editingRowIds = _a === void 0 ? prevState.editingRowIds : _a, _b = nextProps.editingCells, editingCells = _b === void 0 ? prevState.editingCells : _b, _c = nextProps.rowChanges, rowChanges = _c === void 0 ? prevState.rowChanges : _c, _d = nextProps.addedRows, addedRows = _d === void 0 ? prevState.addedRows : _d, _e = nextProps.deletedRowIds, deletedRowIds = _e === void 0 ? prevState.deletedRowIds : _e;
        return {
            editingRowIds: editingRowIds,
            editingCells: editingCells,
            rowChanges: rowChanges,
            addedRows: addedRows,
            deletedRowIds: deletedRowIds,
        };
    };
    EditingStateBase.prototype.render = function () {
        var _a = this.props, createRowChange = _a.createRowChange, columnExtensions = _a.columnExtensions, columnEditingEnabled = _a.columnEditingEnabled;
        var _b = this.state, editingRowIds = _b.editingRowIds, editingCells = _b.editingCells, rowChanges = _b.rowChanges, addedRows = _b.addedRows, deletedRowIds = _b.deletedRowIds;
        return (react.createElement(Plugin, { name: "EditingState" },
            react.createElement(Getter, { name: "createRowChange", value: createRowChangeGetter(createRowChange, columnExtensions) }),
            react.createElement(Getter, { name: "editingRowIds", value: editingRowIds }),
            react.createElement(Action, { name: "startEditRows", action: this.startEditRows }),
            react.createElement(Action, { name: "stopEditRows", action: this.stopEditRows }),
            react.createElement(Getter, { name: "editingCells", value: editingCells }),
            react.createElement(Action, { name: "startEditCells", action: this.startEditCells }),
            react.createElement(Action, { name: "stopEditCells", action: this.stopEditCells }),
            react.createElement(Getter, { name: "rowChanges", value: rowChanges }),
            react.createElement(Action, { name: "changeRow", action: this.changeRow }),
            react.createElement(Action, { name: "cancelChangedRows", action: this.cancelChangedRows }),
            react.createElement(Action, { name: "commitChangedRows", action: this.commitChangedRows }),
            react.createElement(Getter, { name: "addedRows", value: addedRows }),
            react.createElement(Action, { name: "addRow", action: this.addRow }),
            react.createElement(Action, { name: "changeAddedRow", action: this.changeAddedRow }),
            react.createElement(Action, { name: "cancelAddedRows", action: this.cancelAddedRows }),
            react.createElement(Action, { name: "commitAddedRows", action: this.commitAddedRows }),
            react.createElement(Getter, { name: "deletedRowIds", value: deletedRowIds }),
            react.createElement(Action, { name: "deleteRows", action: this.deleteRows }),
            react.createElement(Action, { name: "cancelDeletedRows", action: this.cancelDeletedRows }),
            react.createElement(Action, { name: "commitDeletedRows", action: this.commitDeletedRows }),
            react.createElement(Getter, { name: "isColumnEditingEnabled", value: columnExtensionValueGetter$1(columnExtensions, columnEditingEnabled) })));
    };
    EditingStateBase.defaultProps = {
        columnEditingEnabled: true,
        defaultEditingRowIds: [],
        defaultEditingCells: [],
        defaultRowChanges: {},
        defaultAddedRows: [],
        defaultDeletedRowIds: [],
    };
    return EditingStateBase;
}(react.PureComponent));
/***
 * A plugin that manages grid rows' editing state. It arranges grid rows
 * by different lists depending on a row's state.
 * */
var EditingState = EditingStateBase;

var PagingStateBase = /*#__PURE__*/ (function (_super) {
    __extends$1(PagingStateBase, _super);
    function PagingStateBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            currentPage: props.currentPage || props.defaultCurrentPage,
            pageSize: props.pageSize !== undefined ? props.pageSize : props.defaultPageSize,
        };
        var stateHelper = createStateHelper(_this, {
            currentPage: function () {
                var onCurrentPageChange = _this.props.onCurrentPageChange;
                return onCurrentPageChange;
            },
            pageSize: function () {
                var onPageSizeChange = _this.props.onPageSizeChange;
                return onPageSizeChange;
            },
        });
        _this.setCurrentPage = stateHelper.applyFieldReducer
            .bind(stateHelper, 'currentPage', setCurrentPage);
        _this.setPageSize = stateHelper.applyFieldReducer
            .bind(stateHelper, 'pageSize', setPageSize);
        return _this;
    }
    PagingStateBase.getDerivedStateFromProps = function (nextProps, prevState) {
        var _a = nextProps.currentPage, currentPage = _a === void 0 ? prevState.currentPage : _a, _b = nextProps.pageSize, pageSize = _b === void 0 ? prevState.pageSize : _b;
        return {
            currentPage: currentPage,
            pageSize: pageSize,
        };
    };
    PagingStateBase.prototype.render = function () {
        var _a = this.state, pageSize = _a.pageSize, currentPage = _a.currentPage;
        return (react.createElement(Plugin, { name: "PagingState" },
            react.createElement(Getter, { name: "currentPage", value: currentPage }),
            react.createElement(Getter, { name: "pageSize", value: pageSize }),
            react.createElement(Action, { name: "setCurrentPage", action: this.setCurrentPage }),
            react.createElement(Action, { name: "setPageSize", action: this.setPageSize })));
    };
    PagingStateBase.defaultProps = {
        defaultPageSize: 10,
        defaultCurrentPage: 0,
    };
    return PagingStateBase;
}(react.PureComponent));
/***
 * A plugin that manages the paging state. It controls the total page count depending on the
 * total row count and the specified page size, controls the currently selected page number
 * and changes it in response to the corresponding actions.
 * */
var PagingState = PagingStateBase;

var pluginDependencies$2 = [
    { name: 'PagingState' },
];
var rowsWithHeadersComputed = function (_a) {
    var rows = _a.rows, pageSize = _a.pageSize, getRowLevelKey = _a.getRowLevelKey;
    return rowsWithPageHeaders(rows, pageSize, getRowLevelKey);
};
var totalCountComputed = function (_a) {
    var rows = _a.rows;
    return rowCount(rows);
};
var paginatedRowsComputed = function (_a) {
    var rows = _a.rows, pageSize = _a.pageSize, page = _a.currentPage;
    return paginatedRows(rows, pageSize, page);
};
var currentPageComputed = function (_a, _b) {
    var page = _a.currentPage, totalCount = _a.totalCount, pageSize = _a.pageSize;
    var setCurrentPage = _b.setCurrentPage;
    return currentPage(page, totalCount, pageSize, setCurrentPage);
};
// eslint-disable-next-line react/prefer-stateless-function
var IntegratedPagingBase = /*#__PURE__*/ (function (_super) {
    __extends$1(IntegratedPagingBase, _super);
    function IntegratedPagingBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IntegratedPagingBase.prototype.render = function () {
        return (react.createElement(Plugin, { name: "IntegratedPaging", dependencies: pluginDependencies$2 },
            react.createElement(Getter, { name: "rows", computed: rowsWithHeadersComputed }),
            react.createElement(Getter, { name: "totalCount", computed: totalCountComputed }),
            react.createElement(Getter, { name: "currentPage", computed: currentPageComputed }),
            react.createElement(Getter, { name: "rows", computed: paginatedRowsComputed })));
    };
    return IntegratedPagingBase;
}(react.PureComponent));
/***
 * A plugin that performs built-in data paging. It also changes the current page if the provided
 * one cannot be applied due to fewer available pages.
 * */
var IntegratedPaging = IntegratedPagingBase;

var getTargetColumns = function (payload, columns) { return payload
    .filter(function (item) { return item.type === 'column'; })
    .map(function (item) { return columns.find(function (column) { return column.name === item.columnName; }); }); };
// tslint:disable-next-line: max-line-length
var DragDropProviderBase = /*#__PURE__*/ (function (_super) {
    __extends$1(DragDropProviderBase, _super);
    function DragDropProviderBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            payload: null,
            clientOffset: null,
        };
        _this.change = function (_a) {
            var payload = _a.payload, clientOffset = _a.clientOffset;
            return _this.setState({ payload: payload, clientOffset: clientOffset });
        };
        return _this;
    }
    DragDropProviderBase.prototype.componentDidMount = function () {
        this.bodyRef = document.body;
    };
    DragDropProviderBase.prototype.render = function () {
        var _this = this;
        var _a = this.props, Container = _a.containerComponent, Column = _a.columnComponent;
        var _b = this.state, payload = _b.payload, clientOffset = _b.clientOffset;
        return (react.createElement(Plugin, { name: "DragDropProvider" },
            react.createElement(Getter, { name: "draggingEnabled", value: true }),
            react.createElement(Template, { name: "root" },
                react.createElement(DragDropProvider, { onChange: this.change },
                    react.createElement(TemplatePlaceholder, null)),
                payload && (react.createElement(TemplateConnector, null, function (_a) {
                    var columns = _a.columns;
                    return (reactDom.createPortal(react.createElement(Container, { clientOffset: clientOffset }, getTargetColumns(payload, columns)
                        .map(function (column) { return (react.createElement(Column, { key: column.name, column: column })); })), _this.bodyRef));
                })))));
    };
    DragDropProviderBase.components = {
        containerComponent: 'Container',
        columnComponent: 'Column',
    };
    return DragDropProviderBase;
}(react.PureComponent));
// tslint:disable-next-line: max-line-length
/** A plugin that implements the drag-and-drop functionality and visualizes columns that are being dragged. */
var DragDropProvider$1 = DragDropProviderBase;

var pluginDependencies$8 = [
    { name: 'Table' },
    { name: 'DragDropProvider', optional: true },
];
var tableHeaderRowsComputed = function (_a) {
    var tableHeaderRows = _a.tableHeaderRows;
    return tableHeaderRowsWithReordering(tableHeaderRows);
};
// tslint:disable-next-line: max-line-length
var TableColumnReorderingRaw = /*#__PURE__*/ (function (_super) {
    __extends$1(TableColumnReorderingRaw, _super);
    function TableColumnReorderingRaw(props) {
        var _this = _super.call(this, props) || this;
        _this.cellDimensionGetters = {};
        _this.cellDimensions = [];
        _this.state = {
            order: props.defaultOrder,
            sourceColumnIndex: -1,
            targetColumnIndex: -1,
        };
        _this.onOver = _this.handleOver.bind(_this);
        _this.onLeave = _this.handleLeave.bind(_this);
        _this.onDrop = _this.handleDrop.bind(_this);
        return _this;
    }
    TableColumnReorderingRaw.prototype.getState = function () {
        var orderState = this.state.order;
        var _a = this.props.order, order = _a === void 0 ? orderState : _a;
        return __assign$2(__assign$2({}, this.state), { order: order });
    };
    TableColumnReorderingRaw.prototype.getDraftOrder = function () {
        var _a = this.getState(), order = _a.order, sourceColumnIndex = _a.sourceColumnIndex, targetColumnIndex = _a.targetColumnIndex;
        return draftOrder(order, sourceColumnIndex, targetColumnIndex);
    };
    TableColumnReorderingRaw.prototype.getAvailableColumns = function () {
        var _this = this;
        return this.getDraftOrder()
            .filter(function (columnName) { return !!_this.cellDimensionGetters[columnName]; });
    };
    TableColumnReorderingRaw.prototype.cacheCellDimensions = function () {
        var _this = this;
        this.cellDimensions = (this.cellDimensions && this.cellDimensions.length)
            ? this.cellDimensions
            : this.getAvailableColumns()
                .map(function (columnName) { return _this.cellDimensionGetters[columnName](); });
    };
    TableColumnReorderingRaw.prototype.resetCellDimensions = function () {
        this.cellDimensions = [];
    };
    TableColumnReorderingRaw.prototype.ensureCellDimensionGetters = function (tableColumns) {
        var _this = this;
        Object.keys(this.cellDimensionGetters)
            .forEach(function (columnName) {
            var columnIndex = tableColumns
                .findIndex(function (_a) {
                var type = _a.type, column = _a.column;
                return type === TABLE_DATA_TYPE && column.name === columnName;
            });
            if (columnIndex === -1) {
                delete _this.cellDimensionGetters[columnName];
            }
        });
    };
    // tslint:disable-next-line: max-line-length
    TableColumnReorderingRaw.prototype.storeCellDimensionsGetter = function (tableColumn, getter, tableColumns) {
        if (tableColumn.type === TABLE_DATA_TYPE) {
            this.cellDimensionGetters[tableColumn.column.name] = getter;
        }
        this.ensureCellDimensionGetters(tableColumns);
    };
    TableColumnReorderingRaw.prototype.handleOver = function (_a) {
        var payload = _a.payload, x = _a.clientOffset.x;
        var sourceColumnName = payload[0].columnName;
        var availableColumns = this.getAvailableColumns();
        var relativeSourceColumnIndex = availableColumns.indexOf(sourceColumnName);
        if (relativeSourceColumnIndex === -1)
            return;
        this.cacheCellDimensions();
        var cellDimensions = this.cellDimensions;
        var relativeTargetIndex = getTableTargetColumnIndex(cellDimensions, x);
        if (relativeTargetIndex === -1)
            return;
        var _b = this.getState(), prevSourceColumnIndex = _b.sourceColumnIndex, prevTargetColumnIndex = _b.targetColumnIndex;
        var draftOrder = this.getDraftOrder();
        var targetColumnIndex = draftOrder.indexOf(availableColumns[relativeTargetIndex]);
        if (targetColumnIndex === prevTargetColumnIndex)
            return;
        var sourceColumnIndex = prevSourceColumnIndex === -1
            ? draftOrder.indexOf(sourceColumnName)
            : prevSourceColumnIndex;
        this.setState({
            sourceColumnIndex: sourceColumnIndex,
            targetColumnIndex: targetColumnIndex,
        });
    };
    TableColumnReorderingRaw.prototype.handleLeave = function () {
        this.setState({
            sourceColumnIndex: -1,
            targetColumnIndex: -1,
        });
        this.resetCellDimensions();
    };
    TableColumnReorderingRaw.prototype.handleDrop = function () {
        var _a = this.getState(), sourceColumnIndex = _a.sourceColumnIndex, targetColumnIndex = _a.targetColumnIndex, order = _a.order;
        var onOrderChange = this.props.onOrderChange;
        if (sourceColumnIndex === -1 && targetColumnIndex === -1)
            return;
        var nextOrder = changeColumnOrder(order, {
            sourceColumnName: order[sourceColumnIndex],
            targetColumnName: order[targetColumnIndex],
        });
        this.setState({
            order: nextOrder,
            sourceColumnIndex: -1,
            targetColumnIndex: -1,
        });
        if (onOrderChange) {
            onOrderChange(nextOrder);
        }
        this.resetCellDimensions();
    };
    TableColumnReorderingRaw.prototype.render = function () {
        var _this = this;
        var _a = this.props, Container = _a.tableContainerComponent, Row = _a.rowComponent, Cell = _a.cellComponent;
        this.cellDimensionGetters = {};
        return (react.createElement(Plugin, { name: "TableColumnReordering", dependencies: pluginDependencies$8 },
            react.createElement(OrderedTableColumns, { order: this.getDraftOrder() }),
            react.createElement(Getter, { name: "tableHeaderRows", computed: tableHeaderRowsComputed }),
            react.createElement(Template, { name: "table" }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var draggingEnabled = _a.draggingEnabled;
                return (react.createElement(Container, __assign$2({}, params, { onOver: _this.onOver, onLeave: _this.onLeave, onDrop: _this.onDrop, draggingEnabled: draggingEnabled }),
                    react.createElement(TemplatePlaceholder, null)));
            })); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return tableRow.type === TABLE_REORDERING_TYPE;
                } }, function (params) { return (react.createElement(Row, __assign$2({}, params))); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return tableRow.type === TABLE_REORDERING_TYPE;
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var tableColumns = _a.tableColumns;
                return (react.createElement(Cell, __assign$2({}, params, { getCellDimensions: function (getter) { return _this.storeCellDimensionsGetter(params.tableColumn, getter, tableColumns); } })));
            })); })));
    };
    TableColumnReorderingRaw.defaultProps = {
        defaultOrder: [],
    };
    TableColumnReorderingRaw.components = {
        tableContainerComponent: 'TableContainer',
        rowComponent: 'Row',
        cellComponent: 'Cell',
    };
    return TableColumnReorderingRaw;
}(react.PureComponent));
var TableContainer = function (_a) {
    var onOver = _a.onOver, onLeave = _a.onLeave, onDrop = _a.onDrop, children = _a.children, draggingEnabled = _a.draggingEnabled;
    return (draggingEnabled ? (react.createElement(DropTarget, { onOver: onOver, onLeave: onLeave, onDrop: onDrop }, children)) : children);
};
/** A plugin that manages the displayed columns' order. */
var TableColumnReordering = withComponents({ TableContainer: TableContainer })(TableColumnReorderingRaw);

var RowPlaceholder = function (props) { return react.createElement(TemplatePlaceholder, { name: "tableRow", params: props }); };
var CellPlaceholder = function (props) { return react.createElement(TemplatePlaceholder, { name: "tableCell", params: props }); };
var tableHeaderRows = [];
var tableBodyRowsComputed = function (_a) {
    var rows = _a.rows, getRowId = _a.getRowId, isDataLoading = _a.isDataLoading;
    return (tableRowsWithDataRows(rows, getRowId, isDataLoading));
};
var tableFooterRows = [];
var defaultMessages = {
    noData: 'No data',
};
var TableBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableBase, _super);
    function TableBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableBase.prototype.render = function () {
        var _a = this.props, Layout = _a.layoutComponent, Cell = _a.cellComponent, Row = _a.rowComponent, NoDataRow = _a.noDataRowComponent, NoDataCell = _a.noDataCellComponent, StubRow = _a.stubRowComponent, StubCell = _a.stubCellComponent, StubHeaderCell = _a.stubHeaderCellComponent, columnExtensions = _a.columnExtensions, messages = _a.messages, containerComponent = _a.containerComponent, tableComponent = _a.tableComponent, headComponent = _a.headComponent, bodyComponent = _a.bodyComponent, footerComponent = _a.footerComponent;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages), messages));
        return (react.createElement(Plugin, { name: "Table" },
            react.createElement(Getter, { name: "tableHeaderRows", value: tableHeaderRows }),
            react.createElement(Getter, { name: "tableBodyRows", computed: tableBodyRowsComputed }),
            react.createElement(Getter, { name: "tableFooterRows", value: tableFooterRows }),
            react.createElement(TableColumnsWithDataRowsGetter, { columnExtensions: columnExtensions }),
            react.createElement(Getter, { name: "getTableCellColSpan", value: tableCellColSpanGetter }),
            react.createElement(Template, { name: "body" },
                react.createElement(TemplatePlaceholder, { name: "table" })),
            react.createElement(Template, { name: "table" },
                react.createElement(TemplateConnector, null, function (_a) {
                    var headerRows = _a.tableHeaderRows, bodyRows = _a.tableBodyRows, footerRows = _a.tableFooterRows, columns = _a.tableColumns, getTableCellColSpan = _a.getTableCellColSpan;
                    return (react.createElement(TemplatePlaceholder, { name: "tableLayout", params: {
                            tableComponent: tableComponent,
                            headComponent: headComponent,
                            bodyComponent: bodyComponent,
                            footerComponent: footerComponent,
                            containerComponent: containerComponent,
                            headerRows: headerRows,
                            bodyRows: bodyRows,
                            footerRows: footerRows,
                            columns: columns,
                            rowComponent: RowPlaceholder,
                            cellComponent: CellPlaceholder,
                            getCellColSpan: getTableCellColSpan,
                        } }));
                })),
            react.createElement(Template, { name: "tableLayout" }, function (params) { return (react.createElement(Layout, __assign$2({}, params))); }),
            react.createElement(Template, { name: "tableCell" }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var headerRows = _a.tableHeaderRows;
                return (isHeaderStubTableCell(params.tableRow, headerRows)
                    ? react.createElement(StubHeaderCell, __assign$2({}, params))
                    : react.createElement(StubCell, __assign$2({}, params)));
            })); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isDataTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var getCellValue = _a.getCellValue;
                var columnName = params.tableColumn.column.name;
                var value = getCellValue(params.tableRow.row, columnName);
                return (react.createElement(TemplatePlaceholder, { name: "valueFormatter", params: {
                        value: value,
                        row: params.tableRow.row,
                        column: params.tableColumn.column,
                    } }, function (content) { return (react.createElement(Cell, __assign$2({}, params, { row: params.tableRow.row, column: params.tableColumn.column, value: value }), content)); }));
            })); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isNoDataTableRow(tableRow);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var tableColumns = _a.tableColumns;
                if (isNoDataTableCell(params.tableColumn, tableColumns)) {
                    return (react.createElement(NoDataCell, __assign$2({}, params, { getMessage: getMessage })));
                }
                return null;
            })); }),
            react.createElement(Template, { name: "tableRow" }, function (params) { return (react.createElement(StubRow, __assign$2({}, params))); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isDataTableRow(tableRow);
                } }, function (params) { return (react.createElement(Row, __assign$2({}, params, { row: params.tableRow.row }))); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isNoDataTableRow(tableRow);
                } }, function (params) { return react.createElement(NoDataRow, __assign$2({}, params)); })));
    };
    TableBase.COLUMN_TYPE = TABLE_DATA_TYPE;
    TableBase.ROW_TYPE = TABLE_DATA_TYPE;
    TableBase.NODATA_ROW_TYPE = TABLE_NODATA_TYPE;
    TableBase.defaultProps = {
        messages: {},
    };
    TableBase.components = {
        tableComponent: 'Table',
        headComponent: 'TableHead',
        bodyComponent: 'TableBody',
        footerComponent: 'TableFooter',
        containerComponent: 'Container',
        layoutComponent: 'Layout',
        rowComponent: 'Row',
        cellComponent: 'Cell',
        noDataRowComponent: 'NoDataRow',
        noDataCellComponent: 'NoDataCell',
        stubRowComponent: 'StubRow',
        stubCellComponent: 'StubCell',
        stubHeaderCellComponent: 'StubHeaderCell',
    };
    return TableBase;
}(react.PureComponent));
/***
 * A plugin that renders Grid data as a table. This plugin enables you to customize
 * table rows and columns, and contains the Table Row and Table Cell components
 * that can be extended by other plugins
 * */
var Table = TableBase;

var TableSelectionBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableSelectionBase, _super);
    function TableSelectionBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableSelectionBase.prototype.render = function () {
        var _a = this.props, highlightRow = _a.highlightRow, selectByRowClick = _a.selectByRowClick, showSelectionColumn = _a.showSelectionColumn, showSelectAll = _a.showSelectAll, HeaderCell = _a.headerCellComponent, Cell = _a.cellComponent, Row = _a.rowComponent, selectionColumnWidth = _a.selectionColumnWidth;
        var tableColumnsComputed = function (_a) {
            var tableColumns = _a.tableColumns;
            return tableColumnsWithSelection(tableColumns, selectionColumnWidth);
        };
        return (react.createElement(Plugin, { name: "TableSelection", dependencies: [
                { name: 'Table' },
                { name: 'SelectionState' },
                { name: 'IntegratedSelection', optional: !showSelectAll },
            ] },
            showSelectionColumn && (react.createElement(Getter, { name: "tableColumns", computed: tableColumnsComputed })),
            highlightRow && (react.createElement(Getter, { name: "highlightSelectedRow", value: true })),
            (showSelectionColumn && showSelectAll) && (react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isSelectAllTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var selectAllAvailable = _a.selectAllAvailable, allSelected = _a.allSelected, someSelected = _a.someSelected;
                var toggleSelectAll = _b.toggleSelectAll;
                return (react.createElement(HeaderCell, __assign$2({}, params, { disabled: !selectAllAvailable, allSelected: allSelected, someSelected: someSelected, onToggle: function (select) { return toggleSelectAll(select); } })));
            })); })),
            showSelectionColumn && (react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isSelectTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var selection = _a.selection;
                var toggleSelection = _b.toggleSelection;
                return (react.createElement(Cell, __assign$2({}, params, { row: params.tableRow.row, selected: selection.indexOf(params.tableRow.rowId) !== -1, onToggle: function () { return toggleSelection({ rowIds: [params.tableRow.rowId] }); } })));
            })); })),
            (highlightRow || selectByRowClick) && (react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isDataTableRow(tableRow);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var selection = _a.selection;
                var toggleSelection = _b.toggleSelection;
                return (react.createElement(Row, __assign$2({}, params, { selectByRowClick: selectByRowClick, highlighted: isRowHighlighted(highlightRow, selection, params.tableRow), onToggle: function () { return toggleSelection({ rowIds: [params.tableRow.rowId] }); } })));
            })); }))));
    };
    TableSelectionBase.defaultProps = {
        highlightRow: false,
        selectByRowClick: false,
        showSelectAll: false,
        showSelectionColumn: true,
    };
    TableSelectionBase.components = {
        rowComponent: 'Row',
        cellComponent: 'Cell',
        headerCellComponent: 'HeaderCell',
    };
    TableSelectionBase.COLUMN_TYPE = TABLE_SELECT_TYPE;
    return TableSelectionBase;
}(react.PureComponent));
/***
 * A plugin that visualizes table rows' selection state by rendering selection checkboxes
 * and highlighting the selected rows.
 * */
var TableSelection = TableSelectionBase;

var getCellColSpanComputed = function (_a) {
    var getTableCellColSpan = _a.getTableCellColSpan;
    return tableDetailCellColSpanGetter(getTableCellColSpan);
};
var pluginDependencies$9 = [
    { name: 'RowDetailState' },
    { name: 'Table' },
];
var TableRowDetailBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableRowDetailBase, _super);
    function TableRowDetailBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableRowDetailBase.prototype.render = function () {
        var _a = this.props, rowHeight = _a.rowHeight, Content = _a.contentComponent, ToggleCell = _a.toggleCellComponent, Cell = _a.cellComponent, Row = _a.rowComponent, toggleColumnWidth = _a.toggleColumnWidth;
        var tableColumnsComputed = function (_a) {
            var tableColumns = _a.tableColumns;
            return tableColumnsWithDetail(tableColumns, toggleColumnWidth);
        };
        var tableBodyRowsComputed = function (_a) {
            var tableBodyRows = _a.tableBodyRows, expandedDetailRowIds = _a.expandedDetailRowIds;
            return tableRowsWithExpandedDetail(tableBodyRows, expandedDetailRowIds, rowHeight);
        };
        return (react.createElement(Plugin, { name: "TableRowDetail", dependencies: pluginDependencies$9 },
            react.createElement(Getter, { name: "tableColumns", computed: tableColumnsComputed }),
            react.createElement(Getter, { name: "tableBodyRows", computed: tableBodyRowsComputed }),
            react.createElement(Getter, { name: "getTableCellColSpan", computed: getCellColSpanComputed }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isDetailToggleTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var expandedDetailRowIds = _a.expandedDetailRowIds;
                var toggleDetailRowExpanded = _b.toggleDetailRowExpanded;
                return (react.createElement(ToggleCell, __assign$2({}, params, { row: params.tableRow.row, expanded: isDetailRowExpanded(expandedDetailRowIds, params.tableRow.rowId), onToggle: function () { return toggleDetailRowExpanded({ rowId: params.tableRow.rowId }); } })));
            })); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isDetailTableRow(tableRow);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var tableColumns = _a.tableColumns;
                if (isDetailTableCell(params.tableColumn, tableColumns)) {
                    return (react.createElement(Cell, __assign$2({}, params, { row: params.tableRow.row }), Content && react.createElement(Content, { row: params.tableRow.row })));
                }
                return null;
            })); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isDetailTableRow(tableRow);
                } }, function (params) { return (react.createElement(Row, __assign$2({}, params, { row: params.tableRow.row }))); })));
    };
    TableRowDetailBase.ROW_TYPE = TABLE_DETAIL_TYPE;
    TableRowDetailBase.COLUMN_TYPE = TABLE_DETAIL_TYPE;
    TableRowDetailBase.defaultProps = {
        contentComponent: function () { return null; },
    };
    TableRowDetailBase.components = {
        rowComponent: 'Row',
        cellComponent: 'Cell',
        toggleCellComponent: 'ToggleCell',
    };
    return TableRowDetailBase;
}(react.PureComponent));
/** A plugin that renders detail rows. */
var TableRowDetail = TableRowDetailBase;

var defaultSummaryMessages = {
    sum: 'Sum',
    min: 'Min',
    max: 'Max',
    avg: 'Avg',
    count: 'Count',
};

var TableSummaryContent = function (_a) {
    var column = _a.column, columnSummaries = _a.columnSummaries, formatlessSummaryTypes = _a.formatlessSummaryTypes, Item = _a.itemComponent, messages = _a.messages;
    var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultSummaryMessages), messages));
    var SummaryItem = function (_a) {
        var summary = _a.summary, children = _a.children;
        return (react.createElement(Item, { getMessage: getMessage, type: summary.type, value: summary.value }, children || String(summary.value)));
    };
    var isFormatlessSummary = function (summary) { return (summary.value === null
        || formatlessSummaryTypes.includes(summary.type)
        || defaultFormatlessSummaries.includes(summary.type)); };
    return (react.createElement(react.Fragment, null, columnSummaries.map(function (summary) {
        if (isFormatlessSummary(summary)) {
            return react.createElement(SummaryItem, { key: summary.type, summary: summary });
        }
        return (react.createElement(TemplatePlaceholder, { key: summary.type, name: "valueFormatter", params: {
                column: column,
                value: summary.value,
            } }, function (content) { return (react.createElement(SummaryItem, { summary: summary }, content)); }));
    })));
};

var getInlineSummaryComponent = function (column, summary, formatlessSummaries) { return function () { return ((summary.value === null || formatlessSummaries.includes(summary.type))
    ? react.createElement(react.Fragment, null, summary.value)
    : (react.createElement(TemplatePlaceholder, { key: summary.type, name: "valueFormatter", params: {
            column: column,
            value: summary.value,
        } }, function (content) { return content || summary.value; }))); }; };
var flattenGroupInlineSummaries = function (columns, tableRow, groupSummaryItems, groupSummaryValues, formatlessSummaries) { return (getGroupInlineSummaries(groupSummaryItems, columns, groupSummaryValues[tableRow.row.compoundKey])
    .map(function (colSummaries) { return (__spread$3(colSummaries.summaries.map(function (summary) { return (__assign$2(__assign$2({}, summary), { columnTitle: colSummaries.column.title, messageKey: summary.type + "Of", component: getInlineSummaryComponent(colSummaries.column, summary, formatlessSummaries) })); }))); })
    .reduce(function (acc, summaries) { return acc.concat(summaries); }, [])); };

var pluginDependencies$a = [
    { name: 'GroupingState' },
    { name: 'Table' },
    { name: 'DataTypeProvider', optional: true },
    { name: 'SummaryState', optional: true },
    { name: 'CustomSummary', optional: true },
    { name: 'IntegratedSummary', optional: true },
    { name: 'Table' },
    { name: 'DataTypeProvider', optional: true },
    { name: 'TableSelection', optional: true },
];
var side = 'left';
/** @internal */
var defaultMessages$1 = {
    countOf: 'Count: ',
    sumOf: 'Sum of {columnTitle} is ',
    maxOf: 'Max of {columnTitle} is ',
    minOf: 'Min of {columnTitle} is ',
    avgOf: 'Avg of {columnTitle} is ',
};
var tableBodyRowsComputed$1 = function (_a) {
    var tableBodyRows = _a.tableBodyRows, isGroupRow = _a.isGroupRow;
    return tableRowsWithGrouping(tableBodyRows, isGroupRow);
};
var getCellColSpanComputed$1 = function (_a) {
    var getTableCellColSpan = _a.getTableCellColSpan, groupSummaryItems = _a.groupSummaryItems, viewport = _a.viewport;
    var firstVisibleColumnIndex = viewport === null || viewport === void 0 ? void 0 : viewport.columns[0][0];
    return tableGroupCellColSpanGetter(getTableCellColSpan, groupSummaryItems, firstVisibleColumnIndex);
};
var TableGroupRowBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableGroupRowBase, _super);
    function TableGroupRowBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableGroupRowBase.prototype.render = function () {
        var _a = this.props, GroupCell = _a.cellComponent, Content = _a.contentComponent, Icon = _a.iconComponent, GroupRow = _a.rowComponent, Container = _a.containerComponent, GroupIndentCell = _a.indentCellComponent, InlineSummary = _a.inlineSummaryComponent, InlineSummaryItem = _a.inlineSummaryItemComponent, SummaryCell = _a.summaryCellComponent, SummaryItem = _a.summaryItemComponent, StubCell = _a.stubCellComponent, indentColumnWidth = _a.indentColumnWidth, contentCellPadding = _a.contentCellPadding, showColumnsWhenGrouped = _a.showColumnsWhenGrouped, columnExtensions = _a.columnExtensions, messages = _a.messages, formatlessSummaryTypes = _a.formatlessSummaryTypes;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages$1), messages));
        return (react.createElement(Plugin, { name: "TableGroupRow", dependencies: pluginDependencies$a },
            react.createElement(TableColumnsWithGrouping, { columnExtensions: columnExtensions, showColumnsWhenGrouped: showColumnsWhenGrouped, indentColumnWidth: indentColumnWidth }),
            react.createElement(Getter, { name: "tableBodyRows", computed: tableBodyRowsComputed$1 }),
            react.createElement(Getter, { name: "getTableCellColSpan", computed: getCellColSpanComputed$1 }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return isGroupTableRow(tableRow);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var grouping = _a.grouping, expandedGroups = _a.expandedGroups, groupSummaryItems = _a.groupSummaryItems, groupSummaryValues = _a.groupSummaryValues, columns = _a.columns;
                var toggleGroupExpanded = _b.toggleGroupExpanded;
                if (isGroupTableCell(params.tableRow, params.tableColumn)) {
                    var formatlessSummaries = defaultFormatlessSummaries
                        .concat(formatlessSummaryTypes);
                    var inlineSummaries_1 = groupSummaryItems
                        ? flattenGroupInlineSummaries(columns, params.tableRow, groupSummaryItems, groupSummaryValues, formatlessSummaries) : [];
                    var cellIndent = calculateGroupCellIndent(params.tableColumn, grouping, indentColumnWidth);
                    var contentIndent_1 = "calc(" + cellIndent + "px + " + contentCellPadding + ")";
                    return (react.createElement(TemplatePlaceholder, { name: "valueFormatter", params: {
                            column: params.tableColumn.column,
                            value: params.tableRow.row.value,
                        } }, function (content) { return (react.createElement(GroupCell, __assign$2({}, params, { contentComponent: Content, iconComponent: Icon, containerComponent: Container, row: params.tableRow.row, column: params.tableColumn.column, expanded: expandedGroups.indexOf(params.tableRow.row.compoundKey) !== -1, onToggle: function () { return toggleGroupExpanded({ groupKey: params.tableRow.row.compoundKey }); }, inlineSummaries: inlineSummaries_1, inlineSummaryComponent: InlineSummary, inlineSummaryItemComponent: InlineSummaryItem, getMessage: getMessage, position: contentIndent_1, side: side }), content)); }));
                }
                if (isGroupIndentTableCell(params.tableRow, params.tableColumn, grouping)) {
                    var fixedProps = {
                        side: side,
                        position: calculateGroupCellIndent(params.tableColumn, grouping, indentColumnWidth),
                    };
                    if (GroupIndentCell) {
                        return (react.createElement(GroupIndentCell, __assign$2({}, params, fixedProps, { row: params.tableRow.row, column: params.tableColumn.column })));
                    }
                    return react.createElement(TemplatePlaceholder, { params: fixedProps });
                }
                if (isGroupIndentStubTableCell(params.tableRow, params.tableColumn, grouping)) {
                    return react.createElement(TemplatePlaceholder, { params: params });
                }
                return null;
            })); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return (isGroupRowOrdinaryCell(tableRow, tableColumn));
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var groupSummaryItems = _a.groupSummaryItems, groupSummaryValues = _a.groupSummaryValues, grouping = _a.grouping, tableColumns = _a.tableColumns;
                var toggleGroupExpanded = _b.toggleGroupExpanded;
                var tableColumn = params.tableColumn, tableRow = params.tableRow;
                var onToggle = function () { return toggleGroupExpanded({ groupKey: tableRow.row.compoundKey }); };
                if (isRowSummaryCell(tableRow, tableColumn, grouping, groupSummaryItems)) {
                    var columnSummaries = getColumnSummaries(groupSummaryItems, tableColumn.column.name, groupSummaryValues[tableRow.row.compoundKey], function (summaryItem) { return (!summaryItem.showInGroupFooter &&
                        summaryItem.alignByColumn); });
                    return (react.createElement(SummaryCell, __assign$2({}, params, { row: params.tableRow.row, column: params.tableColumn.column, onToggle: onToggle }),
                        react.createElement(TableSummaryContent, { column: tableColumn.column, columnSummaries: columnSummaries, formatlessSummaryTypes: formatlessSummaryTypes, itemComponent: SummaryItem, messages: messages })));
                }
                // NOTE: ensure that right-aligned summary will fit into a column
                if (isPreviousCellContainSummary(tableRow, tableColumn, tableColumns, grouping, groupSummaryItems) || TABLE_FLEX_TYPE === tableColumn.type) {
                    return react.createElement(StubCell, __assign$2({}, params, { onToggle: onToggle }));
                }
                return react.createElement(TemplatePlaceholder, null);
            })); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return isGroupTableRow(tableRow);
                } }, function (params) { return (react.createElement(GroupRow, __assign$2({}, params, { row: params.tableRow.row }))); })));
    };
    TableGroupRowBase.ROW_TYPE = TABLE_GROUP_TYPE;
    TableGroupRowBase.COLUMN_TYPE = TABLE_GROUP_TYPE;
    TableGroupRowBase.defaultProps = {
        showColumnsWhenGrouped: false,
        formatlessSummaryTypes: [],
    };
    TableGroupRowBase.components = {
        rowComponent: 'Row',
        cellComponent: 'Cell',
        contentComponent: 'Content',
        iconComponent: 'Icon',
        containerComponent: 'Container',
        indentCellComponent: 'IndentCell',
        inlineSummaryComponent: 'InlineSummary',
        inlineSummaryItemComponent: 'InlineSummaryItem',
        summaryCellComponent: 'SummaryCell',
        summaryItemComponent: 'SummaryItem',
        stubCellComponent: 'StubCell',
    };
    return TableGroupRowBase;
}(react.PureComponent));
/** A plugin that renders group rows and enables them to expand and collapse. */
var TableGroupRow = TableGroupRowBase;

var tableHeaderRowsComputed$1 = function (_a) {
    var tableHeaderRows = _a.tableHeaderRows;
    return tableRowsWithHeading(tableHeaderRows || []);
};
var TableHeaderRowBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableHeaderRowBase, _super);
    function TableHeaderRowBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableHeaderRowBase.prototype.render = function () {
        var _a = this.props, showSortingControls = _a.showSortingControls, showGroupingControls = _a.showGroupingControls, HeaderCell = _a.cellComponent, HeaderRow = _a.rowComponent, Content = _a.contentComponent, SortLabel = _a.sortLabelComponent, GroupButton = _a.groupButtonComponent, Title = _a.titleComponent, messages = _a.messages;
        var getMessage = getMessagesFormatter(messages);
        return (react.createElement(Plugin, { name: "TableHeaderRow", dependencies: [
                { name: 'Table' },
                { name: 'SortingState', optional: !showSortingControls },
                { name: 'GroupingState', optional: !showGroupingControls },
                { name: 'DragDropProvider', optional: true },
                { name: 'TableColumnResizing', optional: true },
            ] },
            react.createElement(Getter, { name: "tableHeaderRows", computed: tableHeaderRowsComputed$1 }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isHeadingTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var sorting = _a.sorting, tableColumns = _a.tableColumns, draggingEnabled = _a.draggingEnabled, tableColumnResizingEnabled = _a.tableColumnResizingEnabled, isColumnSortingEnabled = _a.isColumnSortingEnabled, isColumnGroupingEnabled = _a.isColumnGroupingEnabled, columnResizingMode = _a.columnResizingMode;
                var changeColumnSorting = _b.changeColumnSorting, changeColumnGrouping = _b.changeColumnGrouping, changeTableColumnWidth = _b.changeTableColumnWidth, draftTableColumnWidth = _b.draftTableColumnWidth, cancelTableColumnWidthDraft = _b.cancelTableColumnWidthDraft, _c = _b.storeWidthGetters, storeWidthGetters = _c === void 0 ? function () { } : _c;
                var _d = params.tableColumn.column, columnName = _d.name, columnTitle = _d.title;
                var atLeastOneDataColumn = tableColumns
                    .filter(function (_a) {
                    var type = _a.type;
                    return type === TABLE_DATA_TYPE;
                }).length > 1;
                var sortingEnabled = isColumnSortingEnabled
                    && isColumnSortingEnabled(columnName);
                var groupingEnabled = isColumnGroupingEnabled
                    && isColumnGroupingEnabled(columnName)
                    && atLeastOneDataColumn;
                var nextColumnName = getNextColumnName(tableColumns, columnName);
                return (react.createElement(HeaderCell, __assign$2({}, params, { column: params.tableColumn.column, draggingEnabled: draggingEnabled && atLeastOneDataColumn, resizingEnabled: tableColumnResizingEnabled
                        && (!!nextColumnName || columnResizingMode === 'widget'), onWidthChange: function (_a) {
                        var shift = _a.shift;
                        return changeTableColumnWidth({
                            columnName: columnName, nextColumnName: nextColumnName, shift: shift,
                        });
                    }, onWidthDraft: function (_a) {
                        var shift = _a.shift;
                        return draftTableColumnWidth({
                            columnName: columnName, nextColumnName: nextColumnName, shift: shift,
                        });
                    }, onWidthDraftCancel: function () { return cancelTableColumnWidthDraft(); }, getCellWidth: function (getter) { return storeWidthGetters({
                        tableColumn: params.tableColumn,
                        getter: getter, tableColumns: tableColumns,
                    }); } }),
                    react.createElement(TemplatePlaceholder, { name: "tableHeaderCellBefore", params: {
                            column: params.tableColumn.column,
                        } }),
                    react.createElement(Content, { column: params.tableColumn.column, align: params.tableColumn.align }, showSortingControls ? (react.createElement(SortLabel, { column: params.tableColumn.column, align: params.tableColumn.align, direction: getColumnSortingDirection(sorting, columnName) || null, disabled: !sortingEnabled, onSort: function (_a) {
                            var direction = _a.direction, keepOther = _a.keepOther;
                            changeColumnSorting({ columnName: columnName, direction: direction, keepOther: keepOther });
                        }, getMessage: getMessage },
                        react.createElement(Title, null, columnTitle || columnName))) : (react.createElement(Title, null, columnTitle || columnName))),
                    showGroupingControls ? (react.createElement(GroupButton, { disabled: !groupingEnabled, onGroup: function () { return changeColumnGrouping({ columnName: columnName }); } })) : null));
            })); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isHeadingTableRow(tableRow);
                } }, function (params) { return react.createElement(HeaderRow, __assign$2({}, params)); })));
    };
    TableHeaderRowBase.ROW_TYPE = TABLE_HEADING_TYPE;
    TableHeaderRowBase.defaultProps = {
        showSortingControls: false,
        showGroupingControls: false,
        messages: {},
    };
    TableHeaderRowBase.components = {
        cellComponent: 'Cell',
        rowComponent: 'Row',
        contentComponent: 'Content',
        sortLabelComponent: 'SortLabel',
        titleComponent: 'Title',
        groupButtonComponent: 'GroupButton',
    };
    return TableHeaderRowBase;
}(react.PureComponent));
TableHeaderRowBase.components = {
    cellComponent: 'Cell',
    rowComponent: 'Row',
    contentComponent: 'Content',
    sortLabelComponent: 'SortLabel',
    titleComponent: 'Title',
    groupButtonComponent: 'GroupButton',
};
/***
 * A plugin that renders the table's header row. The Column's `title` field specifies the
 * column's title in the header row.The plugin also allows you to manage a column's sorting
 * and grouping state and initiate column dragging.
 * */
var TableHeaderRow = TableHeaderRowBase;

var CellPlaceholder$1 = function (props) { return react.createElement(TemplatePlaceholder, { params: props }); };
var bandLevelsVisibilityComputed = function (_a) {
    var columnIntervals = _a.columnVisibleIntervals, tableHeaderColumnChains = _a.tableHeaderColumnChains, bandLevels = _a.bandLevels;
    return bandLevelsVisibility(columnIntervals, tableHeaderColumnChains, bandLevels);
};
var columnVisibleIntervalsComputed = function (_a) {
    var viewport = _a.viewport, tableColumns = _a.tableColumns;
    return columnVisibleIntervals(viewport, tableColumns);
};
var TableBandHeaderBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableBandHeaderBase, _super);
    function TableBandHeaderBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableBandHeaderBase.prototype.render = function () {
        var _a = this.props, Cell = _a.cellComponent, Row = _a.rowComponent, HeaderCell = _a.bandedHeaderCellComponent, InvisibleCell = _a.invisibleCellComponent, columnBands = _a.columnBands;
        var tableHeaderRowsComputed = function (_a) {
            var tableHeaderRows = _a.tableHeaderRows, tableColumns = _a.tableColumns;
            return tableRowsWithBands(tableHeaderRows, columnBands, tableColumns);
        };
        var tableHeaderColumnChainsComputed = function (_a) {
            var tableHeaderRows = _a.tableHeaderRows, tableColumns = _a.tableColumns;
            return tableHeaderColumnChainsWithBands(tableHeaderRows, tableColumns, columnBands);
        };
        var bandLevels = columnBandLevels(columnBands);
        return (react.createElement(Plugin, { name: "TableBandHeader", dependencies: [
                { name: 'Table' },
                { name: 'TableHeaderRow' },
                { name: 'TableSelection', optional: true },
                { name: 'TableEditColumn', optional: true },
            ] },
            react.createElement(Getter, { name: "tableHeaderRows", computed: tableHeaderRowsComputed }),
            react.createElement(Getter, { name: "columnVisibleIntervals", computed: columnVisibleIntervalsComputed }),
            react.createElement(Getter, { name: "tableHeaderColumnChains", computed: tableHeaderColumnChainsComputed }),
            react.createElement(Getter, { name: "bandLevels", value: bandLevels }),
            react.createElement(Getter, { name: "bandLevelsVisibility", computed: bandLevelsVisibilityComputed }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isBandedOrHeaderRow(tableRow);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var tableColumns = _a.tableColumns, tableHeaderRows = _a.tableHeaderRows, tableHeaderColumnChains = _a.tableHeaderColumnChains, columnIntervals = _a.columnVisibleIntervals, levelsVisibility = _a.bandLevelsVisibility;
                var bandComponent = getBandComponent(params, tableHeaderRows, tableColumns, columnBands, tableHeaderColumnChains, columnIntervals, levelsVisibility);
                switch (bandComponent.type) {
                    case BAND_DUPLICATE_RENDER:
                        return react.createElement(TemplatePlaceholder, { params: __assign$2({}, params) });
                    case BAND_EMPTY_CELL:
                        return react.createElement(InvisibleCell, null);
                    case BAND_GROUP_CELL: {
                        var _b = bandComponent.payload, value = _b.value, payload = __rest$1(_b, ["value"]);
                        return (react.createElement(Cell, __assign$2({}, params, payload), value));
                    }
                    case BAND_HEADER_CELL:
                        return (react.createElement(TemplatePlaceholder, { name: "tableCell", params: __assign$2(__assign$2({}, params), bandComponent.payload) }));
                    case BAND_FILL_LEVEL_CELL:
                        return (react.createElement(Cell, __assign$2({}, params, bandComponent.payload, { style: { whiteSpace: 'pre' } }), ' '));
                    default:
                        return null;
                }
            })); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isHeadingTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(HeaderCell, __assign$2({ component: CellPlaceholder$1 }, params))); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isBandedTableRow(tableRow);
                } }, function (params) { return react.createElement(Row, __assign$2({}, params)); })));
    };
    TableBandHeaderBase.ROW_TYPE = TABLE_BAND_TYPE;
    TableBandHeaderBase.components = {
        cellComponent: 'Cell',
        rowComponent: 'Row',
        bandedHeaderCellComponent: 'BandedHeaderCell',
        invisibleCellComponent: 'InvisibleCell',
    };
    return TableBandHeaderBase;
}(react.PureComponent));
TableBandHeaderBase.components = {
    cellComponent: 'Cell',
    rowComponent: 'Row',
    bandedHeaderCellComponent: 'BandedHeaderCell',
    invisibleCellComponent: 'InvisibleCell',
};
/** A plugin that renders the banded cells. */
var TableBandHeader = TableBandHeaderBase;

var pluginDependencies$b = [
    { name: 'FilteringState' },
    { name: 'Table' },
    { name: 'DataTypeProvider', optional: true },
];
var defaultMessages$2 = {
    filterPlaceholder: 'Filter...',
    contains: 'Contains',
    notContains: 'Does not contain',
    startsWith: 'Starts with',
    endsWith: 'Ends with',
    equal: 'Equals',
    notEqual: 'Does not equal',
    greaterThan: 'Greater than',
    greaterThanOrEqual: 'Greater than or equal to',
    lessThan: 'Less than',
    lessThanOrEqual: 'Less than or equal to',
};
var TableFilterRowBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableFilterRowBase, _super);
    function TableFilterRowBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            filterOperations: {},
        };
        return _this;
    }
    TableFilterRowBase.prototype.render = function () {
        var _this = this;
        var _a = this.props, rowHeight = _a.rowHeight, showFilterSelector = _a.showFilterSelector, FilterCell = _a.cellComponent, FilterRow = _a.rowComponent, FilterSelector = _a.filterSelectorComponent, iconComponent = _a.iconComponent, toggleButtonComponent = _a.toggleButtonComponent, EditorComponent = _a.editorComponent, messages = _a.messages;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages$2), messages));
        var tableHeaderRowsComputed = function (_a) {
            var tableHeaderRows = _a.tableHeaderRows;
            return tableHeaderRowsWithFilter(tableHeaderRows, rowHeight);
        };
        return (react.createElement(Plugin, { name: "TableFilterRow", dependencies: pluginDependencies$b },
            react.createElement(Getter, { name: "tableHeaderRows", computed: tableHeaderRowsComputed }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isFilterTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var filters = _a.filters, isColumnFilteringEnabled = _a.isColumnFilteringEnabled, getAvailableFilterOperations = _a.getAvailableFilterOperations, isDataRemote = _a.isDataRemote;
                var changeColumnFilter = _b.changeColumnFilter, scrollToRow = _b.scrollToRow;
                var filterOperations = _this.state.filterOperations;
                var columnName = params.tableColumn.column.name;
                var filter = getColumnFilterConfig(filters, columnName);
                var onFilter = function (config) {
                    if (isDataRemote) {
                        scrollToRow(TOP_POSITION);
                    }
                    changeColumnFilter({ columnName: columnName, config: config });
                };
                var columnFilterOperations = getColumnFilterOperations(getAvailableFilterOperations, columnName);
                var selectedFilterOperation = getSelectedFilterOperation(filterOperations, columnName, filter, columnFilterOperations);
                var handleFilterOperationChange = function (value) {
                    var _a;
                    _this.setState({
                        filterOperations: __assign$2(__assign$2({}, filterOperations), (_a = {}, _a[columnName] = value, _a)),
                    });
                    if (filter && !isFilterValueEmpty(filter.value)) {
                        onFilter({ value: filter.value, operation: value });
                    }
                };
                var handleFilterValueChange = function (value) { return onFilter(!isFilterValueEmpty(value)
                    ? { value: value, operation: selectedFilterOperation }
                    : null); };
                var filteringEnabled = isColumnFilteringEnabled(columnName);
                return (react.createElement(TemplatePlaceholder, { name: "valueEditor", params: {
                        column: params.tableColumn.column,
                        value: filter ? filter.value : undefined,
                        onValueChange: handleFilterValueChange,
                        disabled: !filteringEnabled,
                    } }, function (content) { return (react.createElement(FilterCell, __assign$2({}, params, { getMessage: getMessage, column: params.tableColumn.column, filter: filter, filteringEnabled: filteringEnabled, onFilter: onFilter }),
                    showFilterSelector
                        ? (react.createElement(FilterSelector, { toggleButtonComponent: toggleButtonComponent, iconComponent: iconComponent, value: selectedFilterOperation, availableValues: columnFilterOperations, onChange: handleFilterOperationChange, disabled: !filteringEnabled, getMessage: getMessage })) : null,
                    content || (react.createElement(EditorComponent, { value: filter ? filter.value : undefined, disabled: !filteringEnabled, getMessage: getMessage, onChange: handleFilterValueChange })))); }));
            })); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isFilterTableRow(tableRow);
                } }, function (params) { return react.createElement(FilterRow, __assign$2({}, params)); })));
    };
    TableFilterRowBase.ROW_TYPE = TABLE_FILTER_TYPE;
    TableFilterRowBase.defaultProps = {
        showFilterSelector: false,
        messages: {},
    };
    TableFilterRowBase.components = {
        rowComponent: 'Row',
        cellComponent: 'Cell',
        filterSelectorComponent: 'FilterSelector',
        iconComponent: 'Icon',
        editorComponent: 'Editor',
        toggleButtonComponent: 'ToggleButton',
    };
    return TableFilterRowBase;
}(react.PureComponent));
/** A plugin that renders a filter row. */
var TableFilterRow = TableFilterRowBase;

var pluginDependencies$c = [
    { name: 'EditingState' },
    { name: 'Table' },
    { name: 'DataTypeProvider', optional: true },
];
var TableEditRowBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableEditRowBase, _super);
    function TableEditRowBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableEditRowBase.prototype.render = function () {
        var _a = this.props, EditCell = _a.cellComponent, EditRow = _a.rowComponent, rowHeight = _a.rowHeight;
        var tableBodyRowsComputed = function (_a) {
            var tableBodyRows = _a.tableBodyRows, editingRowIds = _a.editingRowIds, addedRows = _a.addedRows;
            return tableRowsWithEditing(tableBodyRows, editingRowIds, addedRows, rowHeight);
        };
        return (react.createElement(Plugin, { name: "TableEditRow", dependencies: pluginDependencies$c },
            react.createElement(Getter, { name: "tableBodyRows", computed: tableBodyRowsComputed }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isEditTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var getCellValue = _a.getCellValue, createRowChange = _a.createRowChange, rowChanges = _a.rowChanges, isColumnEditingEnabled = _a.isColumnEditingEnabled;
                var changeAddedRow = _b.changeAddedRow, changeRow = _b.changeRow;
                var _c = params.tableRow, rowId = _c.rowId, row = _c.row;
                var column = params.tableColumn.column;
                var columnName = column.name;
                var isNew = isAddedTableRow(params.tableRow);
                var changedRow = isNew
                    ? row
                    : __assign$2(__assign$2({}, row), getRowChange(rowChanges, rowId));
                var value = getCellValue(changedRow, columnName);
                var onValueChange = function (newValue) {
                    var changeArgs = {
                        rowId: rowId,
                        change: createRowChange(changedRow, newValue, columnName),
                    };
                    if (isNew) {
                        changeAddedRow(changeArgs);
                    }
                    else {
                        changeRow(changeArgs);
                    }
                };
                var editingEnabled = isColumnEditingEnabled(columnName);
                return (react.createElement(TemplatePlaceholder, { name: "valueEditor", params: {
                        column: column,
                        row: row,
                        value: value,
                        onValueChange: onValueChange,
                        disabled: !editingEnabled,
                    } }, function (content) { return (react.createElement(EditCell, __assign$2({}, params, { row: row, column: column, value: value, editingEnabled: editingEnabled, onValueChange: onValueChange }), content)); }));
            })); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!(isEditTableRow(tableRow) || isAddedTableRow(tableRow));
                } }, function (params) { return (react.createElement(EditRow, __assign$2({}, params, { row: params.tableRow.row }))); })));
    };
    TableEditRowBase.ADDED_ROW_TYPE = TABLE_ADDED_TYPE;
    TableEditRowBase.EDIT_ROW_TYPE = TABLE_EDIT_TYPE;
    TableEditRowBase.components = {
        rowComponent: 'Row',
        cellComponent: 'Cell',
    };
    return TableEditRowBase;
}(react.PureComponent));
/** A plugin that renders a row being edited. */
var TableEditRow = TableEditRowBase;

var pluginDependencies$d = [
    { name: 'EditingState' },
    { name: 'Table' },
];
var defaultMessages$3 = {
    addCommand: 'New',
    editCommand: 'Edit',
    deleteCommand: 'Delete',
    commitCommand: 'Save',
    cancelCommand: 'Cancel',
};
var TableEditColumnBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableEditColumnBase, _super);
    function TableEditColumnBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableEditColumnBase.prototype.render = function () {
        var _a = this.props, Cell = _a.cellComponent, HeaderCell = _a.headerCellComponent, Command = _a.commandComponent, showAddCommand = _a.showAddCommand, showEditCommand = _a.showEditCommand, showDeleteCommand = _a.showDeleteCommand, width = _a.width, messages = _a.messages;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages$3), messages));
        var tableColumnsComputed = function (_a) {
            var tableColumns = _a.tableColumns;
            return tableColumnsWithEditing(tableColumns, width);
        };
        return (react.createElement(Plugin, { name: "TableEditColumn", dependencies: pluginDependencies$d },
            react.createElement(Getter, { name: "tableColumns", computed: tableColumnsComputed }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isHeadingEditCommandsTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (getters, actions) { return (react.createElement(HeaderCell, __assign$2({}, params), showAddCommand && (react.createElement(Command, { id: "add", text: getMessage('addCommand'), onExecute: function () { return actions.addRow(); } })))); })); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isEditCommandsTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (getters, actions) {
                var isEdit = isEditTableRow(params.tableRow);
                var isNew = isAddedTableRow(params.tableRow);
                var isEditing = isEdit || isNew;
                var rowIds = [params.tableRow.rowId];
                return (react.createElement(Cell, __assign$2({}, params, { row: params.tableRow.row }),
                    showEditCommand && !isEditing && (react.createElement(Command, { id: "edit", text: getMessage('editCommand'), onExecute: function () { return actions.startEditRows({ rowIds: rowIds }); } })),
                    showDeleteCommand && !isEditing && (react.createElement(Command, { id: "delete", text: getMessage('deleteCommand'), onExecute: function () {
                            actions.deleteRows({ rowIds: rowIds });
                            actions.commitDeletedRows({ rowIds: rowIds });
                        } })),
                    isEditing && (react.createElement(Command, { id: "commit", text: getMessage('commitCommand'), onExecute: function () {
                            if (isNew) {
                                actions.commitAddedRows({ rowIds: rowIds });
                            }
                            else {
                                actions.stopEditRows({ rowIds: rowIds });
                                actions.commitChangedRows({ rowIds: rowIds });
                            }
                        } })),
                    isEditing && (react.createElement(Command, { id: "cancel", text: getMessage('cancelCommand'), onExecute: function () {
                            if (isNew) {
                                actions.cancelAddedRows({ rowIds: rowIds });
                            }
                            else {
                                actions.stopEditRows({ rowIds: rowIds });
                                actions.cancelChangedRows({ rowIds: rowIds });
                            }
                        } }))));
            })); })));
    };
    TableEditColumnBase.COLUMN_TYPE = TABLE_EDIT_COMMAND_TYPE;
    TableEditColumnBase.defaultProps = {
        showAddCommand: false,
        showEditCommand: false,
        showDeleteCommand: false,
        width: 140,
        messages: {},
    };
    TableEditColumnBase.components = {
        cellComponent: 'Cell',
        headerCellComponent: 'HeaderCell',
        commandComponent: 'Command',
    };
    return TableEditColumnBase;
}(react.PureComponent));
/***
 * A plugin that renders a command column. This column contains controls used for row editing,
 * creating, or deleting and committing/canceling changes.
 * */
var TableEditColumn = TableEditColumnBase;
/* tslint:enable: max-line-length */

var pluginDependencies$f = [
    { name: 'PagingState' },
];
var defaultMessages$4 = {
    showAll: 'All',
    info: function (_a) {
        var from = _a.from, to = _a.to, count = _a.count;
        return "" + from + (from < to ? "-" + to : '') + " of " + count;
    },
};
var PagingPanelBase = /*#__PURE__*/ (function (_super) {
    __extends$1(PagingPanelBase, _super);
    function PagingPanelBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PagingPanelBase.prototype.render = function () {
        var _a = this.props, Pager = _a.containerComponent, pageSizes = _a.pageSizes, messages = _a.messages;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages$4), messages));
        return (react.createElement(Plugin, { name: "PagingPanel", dependencies: pluginDependencies$f },
            react.createElement(Template, { name: "footer" },
                react.createElement(TemplatePlaceholder, null),
                react.createElement(TemplateConnector, null, function (_a, _b) {
                    var currentPage = _a.currentPage, pageSize = _a.pageSize, totalCount = _a.totalCount;
                    var setCurrentPage = _b.setCurrentPage, setPageSize = _b.setPageSize;
                    return (react.createElement(Pager, { currentPage: currentPage, pageSize: pageSize, totalCount: totalCount, totalPages: pageCount(totalCount, pageSize), pageSizes: pageSizes, getMessage: getMessage, onCurrentPageChange: setCurrentPage, onPageSizeChange: setPageSize }));
                }))));
    };
    PagingPanelBase.defaultProps = {
        pageSizes: [],
        messages: {},
    };
    PagingPanelBase.components = {
        containerComponent: 'Container',
    };
    return PagingPanelBase;
}(react.PureComponent));
/** A plugin that renders the paging panel used for navigation through data pages. */
var PagingPanel = PagingPanelBase;

var defaultProps$3 = {
    draggingEnabled: false,
    onDragStart: function () { },
    onDragEnd: function () { },
};
// tslint:disable-next-line: max-line-length
var ItemLayout = /*#__PURE__*/ (function (_super) {
    __extends$1(ItemLayout, _super);
    function ItemLayout(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            dragging: false,
        };
        return _this;
    }
    ItemLayout.prototype.render = function () {
        var _this = this;
        var _a = this.props, item = _a.item, Item = _a.itemComponent, draggingEnabled = _a.draggingEnabled, onDragStart = _a.onDragStart, onDragEnd = _a.onDragEnd;
        var dragging = this.state.dragging;
        var itemElement = react.createElement(Item, { item: __assign$2(__assign$2({}, item), { draft: dragging || item.draft }) });
        return (draggingEnabled ? (react.createElement(DragSource, { payload: [{ type: 'column', columnName: item.column.name }], onStart: function () {
                _this.setState({ dragging: true });
                onDragStart();
            }, onEnd: function () {
                _this.setState({ dragging: false });
                onDragEnd();
            } }, itemElement)) : (itemElement));
    };
    ItemLayout.defaultProps = defaultProps$3;
    return ItemLayout;
}(react.PureComponent));

var defaultProps$1$1 = {
    onGroup: function () { },
    draggingEnabled: false,
    isColumnGroupingEnabled: function () { return false; },
    onGroupDraft: function () { },
    onGroupDraftCancel: function () { },
};
// tslint:disable-next-line: max-line-length
var GroupPanelLayoutBase = /*#__PURE__*/ (function (_super) {
    __extends$1(GroupPanelLayoutBase, _super);
    function GroupPanelLayoutBase(props) {
        var _this = _super.call(this, props) || this;
        _this.itemRefs = [];
        _this.draggingColumnName = null;
        _this.state = {
            sourceColumnName: null,
            targetItemIndex: -1,
        };
        _this.handleDragEvent = function (eventHandler, _a) {
            var payload = _a.payload, restArgs = __rest$1(_a, ["payload"]);
            var isColumnGroupingEnabled = _this.props.isColumnGroupingEnabled;
            var columnName = payload[0].columnName;
            if (isColumnGroupingEnabled(columnName)) {
                eventHandler(__assign$2({ payload: payload }, restArgs));
            }
        };
        _this.onEnter = function (_a) {
            var payload = _a.payload;
            _this.setState({
                sourceColumnName: payload[0].columnName,
            });
        };
        _this.onOver = function (_a) {
            var clientOffset = _a.clientOffset;
            var _b = _this.props, onGroupDraft = _b.onGroupDraft, items = _b.items;
            var _c = _this.state, sourceColumnName = _c.sourceColumnName, prevTargetItemIndex = _c.targetItemIndex;
            // eslint-disable-next-line react/no-find-dom-node
            var itemGeometries = _this.itemRefs
                .map(function (ref) { return reactDom.findDOMNode(ref).getBoundingClientRect(); });
            var sourceItemIndex = items.findIndex(function (_a) {
                var column = _a.column;
                return column.name === sourceColumnName;
            });
            var targetItemIndex = getGroupCellTargetIndex(itemGeometries, sourceItemIndex, clientOffset);
            if (prevTargetItemIndex === targetItemIndex)
                return;
            onGroupDraft({
                columnName: sourceColumnName,
                groupIndex: targetItemIndex,
            });
            _this.setState({ targetItemIndex: targetItemIndex });
        };
        _this.onLeave = function () {
            var onGroupDraft = _this.props.onGroupDraft;
            var sourceColumnName = _this.state.sourceColumnName;
            if (!_this.draggingColumnName) {
                _this.resetState();
                return;
            }
            onGroupDraft({
                columnName: sourceColumnName,
                groupIndex: -1,
            });
            _this.setState({
                targetItemIndex: -1,
            });
        };
        _this.onDrop = function () {
            var onGroup = _this.props.onGroup;
            var _a = _this.state, sourceColumnName = _a.sourceColumnName, targetItemIndex = _a.targetItemIndex;
            _this.resetState();
            onGroup({
                columnName: sourceColumnName,
                groupIndex: targetItemIndex,
            });
        };
        _this.onDragStart = function (columnName) {
            _this.draggingColumnName = columnName;
        };
        _this.onDragEnd = function () {
            _this.draggingColumnName = null;
            var _a = _this.state, sourceColumnName = _a.sourceColumnName, targetItemIndex = _a.targetItemIndex;
            var onGroup = _this.props.onGroup;
            if (sourceColumnName && targetItemIndex === -1) {
                onGroup({
                    columnName: sourceColumnName,
                });
            }
            _this.resetState();
        };
        return _this;
    }
    GroupPanelLayoutBase.prototype.resetState = function () {
        var onGroupDraftCancel = this.props.onGroupDraftCancel;
        onGroupDraftCancel();
        this.setState({
            sourceColumnName: null,
            targetItemIndex: -1,
        });
    };
    GroupPanelLayoutBase.prototype.render = function () {
        var _this = this;
        var _a = this.props, items = _a.items, EmptyMessage = _a.emptyMessageComponent, Container = _a.containerComponent, Item = _a.itemComponent, draggingEnabled = _a.draggingEnabled, isColumnGroupingEnabled = _a.isColumnGroupingEnabled;
        this.itemRefs = [];
        var groupPanel = (items.length ? (react.createElement(Container, null, items.map(function (item) {
            var columnName = item.column.name;
            return (react.createElement(ItemLayout, { key: columnName, ref: function (element) { return element && _this.itemRefs.push(element); }, item: item, itemComponent: Item, draggingEnabled: draggingEnabled && isColumnGroupingEnabled(columnName), onDragStart: function () { return _this.onDragStart(columnName); }, onDragEnd: _this.onDragEnd }));
        }))) : (react.createElement(EmptyMessage, null)));
        return draggingEnabled
            ? (react.createElement(DropTarget, { onEnter: function (args) { return _this.handleDragEvent(_this.onEnter, args); }, onOver: function (args) { return _this.handleDragEvent(_this.onOver, args); }, onLeave: function (args) { return _this.handleDragEvent(_this.onLeave, args); }, onDrop: function (args) { return _this.handleDragEvent(_this.onDrop, args); } }, groupPanel))
            : groupPanel;
    };
    GroupPanelLayoutBase.defaultProps = defaultProps$1$1;
    return GroupPanelLayoutBase;
}(react.PureComponent));
/** @internal */
var GroupPanelLayout = GroupPanelLayoutBase;

var defaultMessages$5 = {
    groupByColumn: 'Drag a column header here to group by that column',
};
var defaultProps$2$1 = {
    showSortingControls: false,
    showGroupingControls: false,
    messages: {},
};
var GroupingPanelRaw = /*#__PURE__*/ (function (_super) {
    __extends$1(GroupingPanelRaw, _super);
    function GroupingPanelRaw() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GroupingPanelRaw.prototype.render = function () {
        var _a = this.props, LayoutComponent = _a.layoutComponent, Container = _a.containerComponent, Item = _a.itemComponent, EmptyMessage = _a.emptyMessageComponent, showSortingControls = _a.showSortingControls, showGroupingControls = _a.showGroupingControls, messages = _a.messages;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages$5), messages));
        var EmptyMessagePlaceholder = function () { return (react.createElement(EmptyMessage, { getMessage: getMessage })); };
        var ItemPlaceholder = function (_a) {
            var item = _a.item;
            var columnName = item.column.name;
            return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var sorting = _a.sorting, isColumnSortingEnabled = _a.isColumnSortingEnabled, isColumnGroupingEnabled = _a.isColumnGroupingEnabled;
                var changeColumnGrouping = _b.changeColumnGrouping, changeColumnSorting = _b.changeColumnSorting;
                var sortingEnabled = isColumnSortingEnabled && isColumnSortingEnabled(columnName);
                var groupingEnabled = isColumnGroupingEnabled && isColumnGroupingEnabled(columnName);
                return (react.createElement(Item, { item: item, sortingEnabled: sortingEnabled, groupingEnabled: groupingEnabled, showSortingControls: showSortingControls, sortingDirection: showSortingControls
                        ? getColumnSortingDirection(sorting, columnName) : undefined, showGroupingControls: showGroupingControls, onGroup: function () { return changeColumnGrouping({ columnName: columnName }); }, onSort: function (_a) {
                        var direction = _a.direction, keepOther = _a.keepOther;
                        return changeColumnSorting({ columnName: columnName, direction: direction, keepOther: keepOther });
                    } }));
            }));
        };
        return (react.createElement(Plugin, { name: "GroupingPanel", dependencies: [
                { name: 'GroupingState' },
                { name: 'Toolbar' },
                { name: 'SortingState', optional: !showSortingControls },
            ] },
            react.createElement(Template, { name: "toolbarContent" },
                react.createElement(TemplateConnector, null, function (_a, _b) {
                    var columns = _a.columns, grouping = _a.grouping, draftGrouping = _a.draftGrouping, draggingEnabled = _a.draggingEnabled, isColumnGroupingEnabled = _a.isColumnGroupingEnabled, isDataRemote = _a.isDataRemote;
                    var changeColumnGrouping = _b.changeColumnGrouping, draftColumnGrouping = _b.draftColumnGrouping, cancelColumnGroupingDraft = _b.cancelColumnGroupingDraft, scrollToRow = _b.scrollToRow;
                    var onGroup = function (config) {
                        if (isDataRemote) {
                            scrollToRow(TOP_POSITION);
                        }
                        changeColumnGrouping(config);
                    };
                    return react.createElement(LayoutComponent, { items: groupingPanelItems(columns, grouping, draftGrouping), isColumnGroupingEnabled: isColumnGroupingEnabled, draggingEnabled: draggingEnabled, onGroup: onGroup, onGroupDraft: draftColumnGrouping, onGroupDraftCancel: cancelColumnGroupingDraft, itemComponent: ItemPlaceholder, emptyMessageComponent: EmptyMessagePlaceholder, containerComponent: Container });
                }),
                react.createElement(TemplatePlaceholder, null))));
    };
    GroupingPanelRaw.defaultProps = defaultProps$2$1;
    GroupingPanelRaw.components = {
        layoutComponent: 'Layout',
        containerComponent: 'Container',
        itemComponent: 'Item',
        emptyMessageComponent: 'EmptyMessage',
    };
    return GroupingPanelRaw;
}(react.PureComponent));
/***
 * A plugin that renders the Grouping Panel in the Grid's header. This panel displays grouped
 * columns and allows a user to modify grouping options.Optionally, the plugin allows an end-user
 * to change grouped columns' sorting order and render sorting indicators.
 * */
var GroupingPanel = withComponents({ Layout: GroupPanelLayout })(GroupingPanelRaw);

var DataTypeProviderBase = /*#__PURE__*/ (function (_super) {
    __extends$1(DataTypeProviderBase, _super);
    function DataTypeProviderBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DataTypeProviderBase.prototype.render = function () {
        var _a = this.props, columnNames = _a.for, Formatter = _a.formatterComponent, Editor = _a.editorComponent, availableFilterOperations = _a.availableFilterOperations;
        var getAvailableFilterOperationsComputed = function (_a) {
            var getAvailableFilterOperations = _a.getAvailableFilterOperations;
            return getAvailableFilterOperationsGetter(getAvailableFilterOperations, availableFilterOperations, columnNames);
        };
        return (react.createElement(Plugin, { name: "DataTypeProvider", key: columnNames.join('_') },
            react.createElement(Getter, { name: "getAvailableFilterOperations", computed: getAvailableFilterOperationsComputed }),
            Formatter
                ? (react.createElement(Template, { name: "valueFormatter", predicate: function (_a) {
                        var column = _a.column;
                        return columnNames.includes(column.name);
                    } }, function (params) { return react.createElement(Formatter, __assign$2({}, params)); }))
                : null,
            Editor
                ? (react.createElement(Template, { name: "valueEditor", predicate: function (_a) {
                        var column = _a.column;
                        return columnNames.includes(column.name);
                    } }, function (params) { return react.createElement(Editor, __assign$2({}, params)); }))
                : null));
    };
    return DataTypeProviderBase;
}(react.PureComponent));
// tslint:disable-next-line: max-line-length
/** A plugin that allows you to customize formatting options and editors depending on the data type. */
var DataTypeProvider = DataTypeProviderBase;

var pluginDependencies$g = [
    { name: 'Table' },
];
var defaultMessages$6 = {
    noColumns: 'Nothing to show',
};
var columnExtensionValueGetter$4 = function (columnExtensions, defaultValue) { return getColumnExtensionValueGetter(columnExtensions, 'togglingEnabled', defaultValue); };
// tslint:disable-next-line: max-line-length
var TableColumnVisibilityBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableColumnVisibilityBase, _super);
    function TableColumnVisibilityBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            hiddenColumnNames: props.hiddenColumnNames || props.defaultHiddenColumnNames,
        };
        var stateHelper = createStateHelper(_this, {
            hiddenColumnNames: function () {
                var onHiddenColumnNamesChange = _this.props.onHiddenColumnNamesChange;
                return onHiddenColumnNamesChange;
            },
        });
        _this.toggleColumnVisibility = stateHelper.applyFieldReducer.bind(stateHelper, 'hiddenColumnNames', toggleColumn);
        return _this;
    }
    TableColumnVisibilityBase.getDerivedStateFromProps = function (nextProps, prevState) {
        var _a = nextProps.hiddenColumnNames, hiddenColumnNames = _a === void 0 ? prevState.hiddenColumnNames : _a;
        return {
            hiddenColumnNames: hiddenColumnNames,
        };
    };
    TableColumnVisibilityBase.prototype.render = function () {
        var _a = this.props, EmptyMessage = _a.emptyMessageComponent, messages = _a.messages;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages$6), messages));
        var hiddenColumnNames = this.state.hiddenColumnNames;
        var _b = this.props, columnExtensions = _b.columnExtensions, columnTogglingEnabled = _b.columnTogglingEnabled;
        return (react.createElement(Plugin, { name: "TableColumnVisibility", dependencies: pluginDependencies$g },
            react.createElement(VisibleTableColumns, { hiddenColumnNames: hiddenColumnNames }),
            react.createElement(Getter, { name: "isColumnTogglingEnabled", value: columnExtensionValueGetter$4(columnExtensions, columnTogglingEnabled) }),
            react.createElement(Action, { name: "toggleColumnVisibility", action: this.toggleColumnVisibility }),
            react.createElement(Template, { name: "table" }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var tableColumns = _a.tableColumns;
                return (tableDataColumnsExist(tableColumns)
                    ? react.createElement(TemplatePlaceholder, null)
                    : (react.createElement(EmptyMessage, __assign$2({ getMessage: getMessage }, params))));
            })); })));
    };
    TableColumnVisibilityBase.defaultProps = {
        defaultHiddenColumnNames: [],
        messages: {},
        columnTogglingEnabled: true,
    };
    TableColumnVisibilityBase.components = {
        emptyMessageComponent: 'EmptyMessage',
    };
    return TableColumnVisibilityBase;
}(react.PureComponent));
TableColumnVisibilityBase.components = {
    emptyMessageComponent: 'EmptyMessage',
};
/* tslint:disable: max-line-length */
/** A plugin that manages Grid columns' visibility. */
var TableColumnVisibility = TableColumnVisibilityBase;
/* tslint:enable: max-line-length */

var ToolbarBase = /*#__PURE__*/ (function (_super) {
    __extends$1(ToolbarBase, _super);
    function ToolbarBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ToolbarBase.prototype.render = function () {
        var _a = this.props, Root = _a.rootComponent, FlexibleSpaceComponent = _a.flexibleSpaceComponent;
        return (react.createElement(Plugin, { name: "Toolbar" },
            react.createElement(Template, { name: "header" },
                react.createElement(Root, null,
                    react.createElement(TemplatePlaceholder, { name: "toolbarContent" })),
                react.createElement(TemplatePlaceholder, null)),
            react.createElement(Template, { name: "toolbarContent" },
                react.createElement(FlexibleSpaceComponent, null))));
    };
    ToolbarBase.components = {
        rootComponent: 'Root',
        flexibleSpaceComponent: 'FlexibleSpace',
    };
    return ToolbarBase;
}(react.PureComponent));
/** A plugin that renders the Grid toolbar. */
var Toolbar = ToolbarBase;

var TableTreeColumnBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableTreeColumnBase, _super);
    function TableTreeColumnBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableTreeColumnBase.prototype.render = function () {
        var _a = this.props, forColumnName = _a.for, showSelectionControls = _a.showSelectionControls, showSelectAll = _a.showSelectAll, Indent = _a.indentComponent, ExpandButton = _a.expandButtonComponent, Checkbox = _a.checkboxComponent, Content = _a.contentComponent, Cell = _a.cellComponent;
        return (react.createElement(Plugin, { name: "TableTreeColumn", dependencies: [
                { name: 'DataTypeProvider', optional: true },
                { name: 'TreeDataState' },
                { name: 'SelectionState', optional: !showSelectionControls },
                { name: 'IntegratedSelection', optional: !showSelectAll },
                { name: 'Table' },
                { name: 'TableHeaderRow', optional: true },
            ], key: forColumnName },
            react.createElement(Getter, { name: "tableTreeColumnName", value: forColumnName }),
            react.createElement(Template, { name: "tableHeaderCellBefore", predicate: function (_a) {
                    var column = _a.column;
                    return column.name === forColumnName;
                } },
                react.createElement(ExpandButton, { visible: false, expanded: false, onToggle: function () { } }),
                showSelectionControls && showSelectAll && (react.createElement(TemplateConnector, null, function (_a, _b) {
                    var selectAllAvailable = _a.selectAllAvailable, allSelected = _a.allSelected, someSelected = _a.someSelected;
                    var toggleSelectAll = _b.toggleSelectAll;
                    return (react.createElement(Checkbox, { disabled: !selectAllAvailable, checked: allSelected, indeterminate: someSelected, onChange: toggleSelectAll }));
                }))),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isTreeTableCell(tableRow, tableColumn, forColumnName);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                var getCollapsedRows = _a.getCollapsedRows, expandedRowIds = _a.expandedRowIds, selection = _a.selection, isTreeRowLeaf = _a.isTreeRowLeaf, getTreeRowLevel = _a.getTreeRowLevel, getCellValue = _a.getCellValue;
                var toggleRowExpanded = _b.toggleRowExpanded, toggleSelection = _b.toggleSelection;
                var _c = params.tableRow, row = _c.row, rowId = _c.rowId;
                var columnName = params.tableColumn.column.name;
                var value = getCellValue(row, columnName);
                var collapsedRows = getCollapsedRows(row);
                return (react.createElement(TemplatePlaceholder, { name: "valueFormatter", params: {
                        value: value,
                        row: row,
                        column: params.tableColumn.column,
                    } }, function (content) { return (react.createElement(Cell, __assign$2({}, params, { row: row, column: params.tableColumn.column, value: value }),
                    react.createElement(Indent, { level: getTreeRowLevel(row) }),
                    react.createElement(ExpandButton, { visible: collapsedRows ? !!collapsedRows.length : !isTreeRowLeaf(row), expanded: expandedRowIds.indexOf(rowId) > -1, onToggle: function () { return toggleRowExpanded({ rowId: rowId }); } }),
                    showSelectionControls && (react.createElement(Checkbox, { disabled: false, checked: selection.indexOf(rowId) > -1, indeterminate: false, onChange: function () { return toggleSelection({ rowIds: [rowId] }); } })),
                    react.createElement(Content, null, content || value))); }));
            })); })));
    };
    TableTreeColumnBase.defaultProps = {
        showSelectionControls: false,
        showSelectAll: false,
    };
    TableTreeColumnBase.components = {
        cellComponent: 'Cell',
        contentComponent: 'Content',
        indentComponent: 'Indent',
        expandButtonComponent: 'ExpandButton',
        checkboxComponent: 'Checkbox',
    };
    return TableTreeColumnBase;
}(react.PureComponent));
/** A plugin that renders a table column with a toggle button and sorting indicators. */
var TableTreeColumn = TableTreeColumnBase;

var SearchStateBase = /*#__PURE__*/ (function (_super) {
    __extends$1(SearchStateBase, _super);
    function SearchStateBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: props.value || props.defaultValue,
        };
        var stateHelper = createStateHelper(_this, {
            value: function () {
                var onValueChange = _this.props.onValueChange;
                return onValueChange;
            },
        });
        _this.changeValue = stateHelper.applyFieldReducer
            .bind(stateHelper, 'value', changeSearchValue);
        return _this;
    }
    SearchStateBase.getDerivedStateFromProps = function (nextProps, prevState) {
        var _a = nextProps.value, value = _a === void 0 ? prevState.value : _a;
        return {
            value: value,
        };
    };
    SearchStateBase.prototype.render = function () {
        var value = this.state.value;
        var filterExpressionComputed = function (_a) {
            var filterExpression = _a.filterExpression, columns = _a.columns;
            return searchFilterExpression(value, columns, filterExpression);
        };
        return (react.createElement(Plugin, { name: "SearchState" },
            react.createElement(Getter, { name: "filterExpression", computed: filterExpressionComputed }),
            react.createElement(Getter, { name: "searchValue", value: value }),
            react.createElement(Action, { name: "changeSearchValue", action: this.changeValue })));
    };
    SearchStateBase.defaultProps = {
        defaultValue: '',
    };
    return SearchStateBase;
}(react.PureComponent));
/** A plugin that manages the search state. */
var SearchState = SearchStateBase;

var pluginDependencies$i = [
    { name: 'Toolbar' },
    { name: 'SearchState' },
];
var defaultMessages$7 = {
    searchPlaceholder: 'Search...',
};
var SearchPanelBase = /*#__PURE__*/ (function (_super) {
    __extends$1(SearchPanelBase, _super);
    function SearchPanelBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SearchPanelBase.prototype.render = function () {
        var _a = this.props, Input = _a.inputComponent, messages = _a.messages;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages$7), messages));
        return (react.createElement(Plugin, { name: "SearchPanel", dependencies: pluginDependencies$i },
            react.createElement(Template, { name: "toolbarContent" },
                react.createElement(TemplatePlaceholder, null),
                react.createElement(TemplateConnector, null, function (_a, _b) {
                    var searchValue = _a.searchValue, isDataRemote = _a.isDataRemote;
                    var changeSearchValue = _b.changeSearchValue, scrollToRow = _b.scrollToRow;
                    var onValueChange = function (value) {
                        if (isDataRemote) {
                            scrollToRow(TOP_POSITION);
                        }
                        changeSearchValue(value);
                    };
                    return react.createElement(Input, { value: searchValue, onValueChange: onValueChange, getMessage: getMessage });
                }))));
    };
    SearchPanelBase.defaultProps = {
        messages: {},
    };
    SearchPanelBase.components = {
        inputComponent: 'Input',
    };
    return SearchPanelBase;
}(react.PureComponent));
/** A plugin that renders the Search Panel. */
var SearchPanel = SearchPanelBase;

var tableHeaderRowsComputed$2 = function (_a) {
    var tableHeaderRows = _a.tableHeaderRows;
    return tableHeaderRowsWithFixed(tableHeaderRows);
};
var tableHeaderColumnChainsComputed = function (_a) {
    var tableColumns = _a.tableColumns, tableHeaderRows = _a.tableHeaderRows, tableHeaderColumnChains = _a.tableHeaderColumnChains;
    return tableHeaderColumnChainsWithFixed(tableHeaderColumnChains, tableHeaderRows, tableColumns);
};
var CellPlaceholder$2 = function (props) { return react.createElement(TemplatePlaceholder, { params: props }); };
var pluginDependencies$j = [
    { name: 'Table' },
    { name: 'TableBandHeader', optional: true },
    { name: 'TableColumnReordering', optional: true },
    { name: 'TableEditColumn', optional: true },
    { name: 'TableEditRow', optional: true },
    { name: 'TableFilterRow', optional: true },
    { name: 'TableGroupRow', optional: true },
    { name: 'TableHeaderRow', optional: true },
    { name: 'TableRowDetail', optional: true },
    { name: 'TableSelection', optional: true },
    { name: 'TableSummaryRow', optional: true },
    { name: 'TableTreeColumn', optional: true },
];
// tslint:disable-next-line: max-line-length
var TableFixedColumnsBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableFixedColumnsBase, _super);
    function TableFixedColumnsBase(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            tableColumnDimensions: {},
        };
        return _this;
    }
    TableFixedColumnsBase.prototype.handleListenerSizeChange = function (key, width) {
        var tableColumnDimensions = this.state.tableColumnDimensions;
        if (tableColumnDimensions[key] !== width) {
            this.setState(function (state) {
                var _a;
                return ({
                    tableColumnDimensions: __assign$2(__assign$2({}, state.tableColumnDimensions), (_a = {}, _a[key] = width, _a)),
                });
            });
        }
    };
    TableFixedColumnsBase.prototype.render = function () {
        var _this = this;
        var _a = this.props, Cell = _a.cellComponent, ListenerRow = _a.listenerRowComponent, ListenerCell = _a.listenerCellComponent;
        var leftColumns = this.props.leftColumns;
        var rightColumns = this.props.rightColumns;
        var tableColumnsComputed = function (_a) {
            var tableColumns = _a.tableColumns;
            return tableColumnsWithFixed(tableColumns, leftColumns, rightColumns);
        };
        return (react.createElement(Plugin, { name: "TableFixedColumns", dependencies: pluginDependencies$j },
            react.createElement(Getter, { name: "tableHeaderRows", computed: tableHeaderRowsComputed$2 }),
            react.createElement(Getter, { name: "tableColumns", computed: tableColumnsComputed }),
            react.createElement(Getter, { name: "tableHeaderColumnChains", computed: tableHeaderColumnChainsComputed }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableColumn = _a.tableColumn;
                    return !!tableColumn.fixed;
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var tableColumns = _a.tableColumns, tableHeaderColumnChains = _a.tableHeaderColumnChains, selection = _a.selection, highlightSelectedRow = _a.highlightSelectedRow;
                var selected = isRowHighlighted(highlightSelectedRow, selection, params.tableRow);
                var tableColumnDimensions = _this.state.tableColumnDimensions;
                var fixedColumnProps = calculateFixedColumnProps(params, { leftColumns: leftColumns, rightColumns: rightColumns }, tableColumns, tableColumnDimensions, tableHeaderColumnChains);
                return (react.createElement(Cell, __assign$2({}, params, fixedColumnProps, { component: CellPlaceholder$2, selected: selected })));
            })); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isFixedTableRow(tableRow);
                } }, function (params) { return (react.createElement(ListenerRow, __assign$2({}, params))); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isFixedTableRow(tableRow);
                } }, function (params) { return (react.createElement(ListenerCell, __assign$2({}, params, { listen: !!params.tableColumn.fixed, onSizeChange: function (_a) {
                    var width = _a.width;
                    return _this.handleListenerSizeChange(params.tableColumn.key, width);
                } }))); })));
    };
    TableFixedColumnsBase.components = {
        cellComponent: 'Cell',
        listenerRowComponent: 'ListenerRow',
        listenerCellComponent: 'ListenerCell',
    };
    TableFixedColumnsBase.defaultProps = {
        leftColumns: [],
        rightColumns: [],
    };
    return TableFixedColumnsBase;
}(react.PureComponent));
/** A plugin that enables you to fix columns to the left and right sides of the grid. */
var TableFixedColumns = TableFixedColumnsBase;

var dependencies$1 = [
    { name: 'DataTypeProvider', optional: true },
    { name: 'SummaryState' },
    { name: 'CustomSummary', optional: true },
    { name: 'IntegratedSummary', optional: true },
    { name: 'Table' },
    { name: 'TableTreeColumn', optional: true },
];
var tableBodyRowsComputed$2 = function (_a) {
    var tableBodyRows = _a.tableBodyRows, getRowLevelKey = _a.getRowLevelKey, isGroupRow = _a.isGroupRow, getRowId = _a.getRowId, groupSummaryItems = _a.groupSummaryItems, treeSummaryItems = _a.treeSummaryItems;
    return tableRowsWithSummaries(tableBodyRows, groupSummaryItems, treeSummaryItems, getRowLevelKey, isGroupRow, getRowId);
};
var tableFooterRowsComputed = function (_a) {
    var tableFooterRows = _a.tableFooterRows, totalSummaryItems = _a.totalSummaryItems;
    return totalSummaryItems.length
        ? tableRowsWithTotalSummaries(tableFooterRows)
        : tableFooterRows;
};
var TableSummaryRowBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableSummaryRowBase, _super);
    function TableSummaryRowBase() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TableSummaryRowBase.prototype.renderContent = function (column, columnSummaries) {
        var _a = this.props, formatlessSummaryTypes = _a.formatlessSummaryTypes, Item = _a.itemComponent, messages = _a.messages;
        return (react.createElement(TableSummaryContent, { column: column, columnSummaries: columnSummaries, formatlessSummaryTypes: formatlessSummaryTypes, itemComponent: Item, messages: messages }));
    };
    TableSummaryRowBase.prototype.render = function () {
        var _this = this;
        var _a = this.props, TotalRow = _a.totalRowComponent, GroupRow = _a.groupRowComponent, TreeRow = _a.treeRowComponent, TotalCell = _a.totalCellComponent, GroupCell = _a.groupCellComponent, TreeCell = _a.treeCellComponent, TreeColumnCell = _a.treeColumnCellComponent, TreeColumnContent = _a.treeColumnContentComponent, TreeColumnIndent = _a.treeColumnIndentComponent;
        return (react.createElement(Plugin, { name: "TableSummaryRow", dependencies: dependencies$1 },
            react.createElement(Getter, { name: "tableBodyRows", computed: tableBodyRowsComputed$2 }),
            react.createElement(Getter, { name: "tableFooterRows", computed: tableFooterRowsComputed }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isTotalSummaryTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var totalSummaryItems = _a.totalSummaryItems, totalSummaryValues = _a.totalSummaryValues;
                var columnSummaries = getColumnSummaries(totalSummaryItems, params.tableColumn.column.name, totalSummaryValues);
                return (react.createElement(TotalCell, __assign$2({}, params, { column: params.tableColumn.column }), _this.renderContent(params.tableColumn.column, columnSummaries)));
            })); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isGroupSummaryTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var groupSummaryItems = _a.groupSummaryItems, groupSummaryValues = _a.groupSummaryValues;
                var columnSummaries = getColumnSummaries(groupSummaryItems, params.tableColumn.column.name, groupSummaryValues[params.tableRow.row.compoundKey], function (summaryItem) { return isFooterSummary(summaryItem); });
                return (react.createElement(GroupCell, __assign$2({}, params, { column: params.tableColumn.column }), _this.renderContent(params.tableColumn.column, columnSummaries)));
            })); }),
            react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                    var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                    return isTreeSummaryTableCell(tableRow, tableColumn);
                } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                var treeSummaryItems = _a.treeSummaryItems, treeSummaryValues = _a.treeSummaryValues, tableTreeColumnName = _a.tableTreeColumnName, getRowId = _a.getRowId, getTreeRowLevel = _a.getTreeRowLevel;
                var columnSummaries = getColumnSummaries(treeSummaryItems, params.tableColumn.column.name, treeSummaryValues[getRowId(params.tableRow.row)]);
                if (tableTreeColumnName === params.tableColumn.column.name) {
                    return (react.createElement(TreeColumnCell, __assign$2({}, params, { column: params.tableColumn.column }),
                        react.createElement(TreeColumnIndent, { level: getTreeRowLevel(params.tableRow.row) }),
                        react.createElement(TreeColumnContent, null, _this.renderContent(params.tableColumn.column, columnSummaries))));
                }
                return (react.createElement(TreeCell, __assign$2({}, params, { column: params.tableColumn.column }), _this.renderContent(params.tableColumn.column, columnSummaries)));
            })); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isTotalSummaryTableRow(tableRow);
                } }, function (params) { return (react.createElement(TotalRow, __assign$2({}, params))); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isGroupSummaryTableRow(tableRow);
                } }, function (params) { return (react.createElement(GroupRow, __assign$2({}, params))); }),
            react.createElement(Template, { name: "tableRow", predicate: function (_a) {
                    var tableRow = _a.tableRow;
                    return !!isTreeSummaryTableRow(tableRow);
                } }, function (params) { return (react.createElement(TreeRow, __assign$2({}, params))); })));
    };
    TableSummaryRowBase.TREE_ROW_TYPE = TABLE_TREE_SUMMARY_TYPE;
    TableSummaryRowBase.GROUP_ROW_TYPE = TABLE_GROUP_SUMMARY_TYPE;
    TableSummaryRowBase.TOTAL_ROW_TYPE = TABLE_TOTAL_SUMMARY_TYPE;
    TableSummaryRowBase.defaultProps = {
        formatlessSummaryTypes: [],
        messages: {},
    };
    TableSummaryRowBase.components = {
        totalRowComponent: 'TotalRow',
        groupRowComponent: 'GroupRow',
        treeRowComponent: 'TreeRow',
        totalCellComponent: 'TotalCell',
        groupCellComponent: 'GroupCell',
        treeCellComponent: 'TreeCell',
        treeColumnCellComponent: 'TableTreeCell',
        treeColumnContentComponent: 'TableTreeContent',
        treeColumnIndentComponent: 'TableTreeIndent',
        itemComponent: 'Item',
    };
    return TableSummaryRowBase;
}(react.PureComponent));
/** A plugin that renders table rows that display a total, group, and tree summary. */
var TableSummaryRow = TableSummaryRowBase;

var pluginDependencies$m = [
    { name: 'EditingState' },
    { name: 'Table' },
    { name: 'DataTypeProvider', optional: true },
];
var rowsWithEditingCellsComputed = function (_a) {
    var tableBodyRows = _a.tableBodyRows, editingCells = _a.editingCells;
    return rowsWithEditingCells(tableBodyRows, editingCells);
};
var columnsWithEditingCellsComputed = function (_a) {
    var tableColumns = _a.tableColumns, editingCells = _a.editingCells;
    return columnsWithEditingCells(tableColumns, editingCells);
};
/* tslint:disable-next-line max-line-length*/
var INLINE_CELL_EDITING_ERROR = 'The startEditAction property of the InlineCellEditing plugin is given an invalid value.';
// tslint:disable-next-line: max-line-length
var TableInlineCellEditingBase = function (props) {
    var EditCell = props.cellComponent, startEditAction = props.startEditAction, selectTextOnEditStart = props.selectTextOnEditStart;
    return (react.createElement(Plugin, { name: "TableInlineCellEditing", dependencies: pluginDependencies$m },
        react.createElement(Getter, { name: "tableBodyRows", computed: rowsWithEditingCellsComputed }),
        react.createElement(Getter, { name: "tableColumns", computed: columnsWithEditingCellsComputed }),
        react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                return tableRow.type === TABLE_DATA_TYPE &&
                    tableColumn.type === TABLE_DATA_TYPE;
            } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
            var _c;
            var startEditCells = _b.startEditCells;
            var rowId = params.tableRow.rowId, column = params.tableColumn.column;
            var columnName = column.name;
            if (startEditAction !== 'click' && startEditAction !== 'doubleClick') {
                throw new Error(INLINE_CELL_EDITING_ERROR);
            }
            var startEditCellCallback = function () {
                return startEditCells({
                    editingCells: [{ rowId: rowId, columnName: columnName }],
                });
            };
            var eventName = startEditAction === 'click' ? 'onClick' : 'onDoubleClick';
            var newParams = __assign$2(__assign$2({}, params), (_c = {}, _c[eventName] = startEditCellCallback, _c));
            return react.createElement(TemplatePlaceholder, { params: newParams });
        })); }),
        react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                var tableRow = _a.tableRow, tableColumn = _a.tableColumn;
                return tableRow.hasEditCell && tableColumn.hasEditCell;
            } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
            var getCellValue = _a.getCellValue, createRowChange = _a.createRowChange, rowChanges = _a.rowChanges, isColumnEditingEnabled = _a.isColumnEditingEnabled;
            var changeRow = _b.changeRow, stopEditCells = _b.stopEditCells, commitChangedRows = _b.commitChangedRows, cancelChangedRows = _b.cancelChangedRows;
            var _c = params.tableRow, rowId = _c.rowId, row = _c.row, column = params.tableColumn.column;
            var columnName = column.name;
            var changedRow = __assign$2(__assign$2({}, row), getRowChange(rowChanges, rowId));
            var value = getCellValue(changedRow, columnName);
            var onValueChange = function (newValue) {
                var changeArgs = {
                    rowId: rowId,
                    change: createRowChange(changedRow, newValue, columnName),
                };
                changeRow(changeArgs);
            };
            var onKeyDown = function (_a) {
                var key = _a.key;
                if (key === 'Enter') {
                    commitChangedRows({ rowIds: [rowId] });
                    stopEditCells({ editingCells: [{ rowId: rowId, columnName: columnName }] });
                }
                else if (key === 'Escape') {
                    cancelChangedRows({ rowIds: [rowId] });
                    stopEditCells({ editingCells: [{ rowId: rowId, columnName: columnName }] });
                }
            };
            var onBlur = function () {
                commitChangedRows({ rowIds: [rowId] });
                stopEditCells({ editingCells: [{ rowId: rowId, columnName: columnName }] });
            };
            var onFocus = selectTextOnEditStart ? function (e) { return e.target.select(); } : function () { };
            var editingEnabled = isColumnEditingEnabled(columnName);
            return (react.createElement(TemplatePlaceholder, { name: "valueEditor", params: {
                    column: column,
                    row: row,
                    value: value,
                    onValueChange: onValueChange,
                    disabled: !editingEnabled,
                } }, function (content) { return (react.createElement(EditCell, __assign$2({}, params, { row: row, column: column, value: value, editingEnabled: editingEnabled, onValueChange: onValueChange, autoFocus: true, onKeyDown: onKeyDown, onBlur: onBlur, onFocus: onFocus }), content)); }));
        })); })));
};
TableInlineCellEditingBase.components = {
    cellComponent: 'Cell',
};
TableInlineCellEditingBase.defaultProps = {
    startEditAction: 'click',
    selectTextOnEditStart: false,
};
// tslint:disable-next-line: max-line-length
var TableInlineCellEditing = TableInlineCellEditingBase;

var defaultMessages$8 = {
    showExportMenu: 'Export',
    exportAll: 'Export all data',
    exportSelected: 'Export selected rows',
};
var ExportPanelBase = /*#__PURE__*/ (function (_super) {
    __extends$1(ExportPanelBase, _super);
    function ExportPanelBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { visible: false };
        _this.setButtonRef = function (button) { return _this.button = button; };
        _this.handleToggle = function () {
            var visible = _this.state.visible;
            _this.setState({ visible: !visible });
        };
        _this.handleHide = function () { return _this.setState({ visible: false }); };
        return _this;
    }
    ExportPanelBase.prototype.render = function () {
        var _this = this;
        var _a = this.props, ToggleButton = _a.toggleButtonComponent, Menu = _a.menuComponent, MenuItem = _a.menuItemComponent, messages = _a.messages, startExport = _a.startExport;
        var visible = this.state.visible;
        var getMessage = getMessagesFormatter(__assign$2(__assign$2({}, defaultMessages$8), messages));
        return (react.createElement(Plugin, { name: "ExportPanel", dependencies: [
                { name: 'SelectionState', optional: true },
                { name: 'Toolbar' },
            ] },
            react.createElement(Template, { name: "toolbarContent" },
                react.createElement(TemplatePlaceholder, null),
                react.createElement(TemplateConnector, null, function (_a) {
                    var selection = _a.selection;
                    return (react.createElement(react.Fragment, null,
                        react.createElement(ToggleButton, { buttonRef: _this.setButtonRef, onToggle: _this.handleToggle, getMessage: getMessage }),
                        react.createElement(Menu, { visible: visible, onHide: _this.handleHide, target: _this.button },
                            react.createElement(MenuItem, { key: "exportAll", text: getMessage('exportAll'), onClick: function () {
                                    _this.handleHide();
                                    startExport();
                                } }),
                            (selection === null || selection === void 0 ? void 0 : selection.length) ? (react.createElement(MenuItem, { key: "exportSelected", text: getMessage('exportSelected'), onClick: function () {
                                    _this.handleHide();
                                    startExport({ selectedOnly: true });
                                } })) : null)));
                }))));
    };
    ExportPanelBase.components = {
        toggleButtonComponent: 'ToggleButton',
        menuComponent: 'Menu',
        menuItemComponent: 'MenuItem',
    };
    return ExportPanelBase;
}(react.PureComponent));
var ExportPanel = ExportPanelBase;

var getRowStyle = function (_a) {
    var row = _a.row;
    return (row.height !== undefined
        ? ({ height: row.height + "px" })
        : undefined);
};
var isNumber = function (value) {
    return typeof value === 'number' || !Number.isNaN(Number(value));
};

/* globals requestAnimationFrame cancelAnimationFrame */
var TableLayoutBase = /*#__PURE__*/ (function (_super) {
    __extends$1(TableLayoutBase, _super);
    function TableLayoutBase(props) {
        var _this = _super.call(this, props) || this;
        _this.savedOffsetWidth = -1;
        _this.raf = -1;
        _this.state = {
            animationState: new Map(),
        };
        _this.animations = new Map();
        _this.savedScrollWidth = {};
        _this.tableRef = react.createRef();
        return _this;
    }
    TableLayoutBase.prototype.componentDidUpdate = function (prevProps) {
        var columns = this.props.columns;
        var prevColumns = prevProps.columns;
        var animationState = this.state.animationState;
        var activeAnimationExists = !shallowEqual(columns, prevColumns)
            || !!animationState.size || !!this.animations.size;
        // NOTE: animation should be recomputed only when columns are changed or
        // an active animation is in progress. Otherwise it will be recalculated on
        // each scroll event.
        if (activeAnimationExists) {
            this.processAnimation(prevColumns);
        }
    };
    TableLayoutBase.prototype.processAnimation = function (prevColumns) {
        var columns = this.props.columns;
        var tableWidth = this.getTableWidth(prevColumns, columns);
        this.animations = getAnimations(prevColumns, columns, tableWidth, this.animations);
        cancelAnimationFrame(this.raf);
        this.raf = requestAnimationFrame(this.processAnimationFrame.bind(this));
    };
    TableLayoutBase.prototype.getTableWidth = function (prevColumns, columns) {
        var _a = this.tableRef.current, offsetWidth = _a.offsetWidth, scrollWidth = _a.scrollWidth;
        var animationState = this.state.animationState;
        var widthChanged = this.savedOffsetWidth !== offsetWidth
            || !this.savedScrollWidth[columns.length];
        var columnCountChanged = columns.length !== prevColumns.length;
        if (columnCountChanged || (widthChanged && !animationState.size)) {
            this.savedScrollWidth = {};
            this.savedScrollWidth[columns.length] = scrollWidth;
            this.savedOffsetWidth = offsetWidth;
        }
        return this.savedScrollWidth[columns.length];
    };
    TableLayoutBase.prototype.getColumns = function () {
        var columns = this.props.columns;
        var animationState = this.state.animationState;
        var result = columns;
        var isFixedWidth = columns
            .filter(function (column) { return column.width === undefined || column.width === 'auto'; })
            .length === 0;
        if (isFixedWidth) {
            // presumably a flex column added here instead of in a getter in the Table plugin
            // to make sure that all manipulations on taleColumns have already done earlier
            result = __spread$3(result, [{ key: TABLE_FLEX_TYPE.toString(), type: TABLE_FLEX_TYPE }]);
        }
        if (animationState.size) {
            result = result
                .map(function (column) { return (animationState.has(column.key)
                ? __assign$2(__assign$2({}, column), { animationState: animationState.get(column.key) }) : column); });
        }
        return result;
    };
    TableLayoutBase.prototype.processAnimationFrame = function () {
        var animationComponentState = this.state.animationState;
        this.animations = filterActiveAnimations(this.animations);
        if (!this.animations.size) {
            if (animationComponentState.size) {
                this.setState({ animationState: new Map() });
            }
            return;
        }
        var animationState = evalAnimations(this.animations);
        this.setState({ animationState: animationState });
    };
    TableLayoutBase.prototype.render = function () {
        var _a = this.props, Layout = _a.layoutComponent, minColumnWidth = _a.minColumnWidth, restProps = __rest$1(_a, ["layoutComponent", "minColumnWidth"]);
        var columns = this.getColumns();
        var minWidth = columns
            .map(function (column) { return column.width || (column.type === TABLE_FLEX_TYPE ? 0 : minColumnWidth); })
            .filter(function (value) { return value !== 'auto' && value !== 0; })
            .map(function (value) { return isNumber(value) ? value + "px" : value; })
            .join(' + ');
        return (react.createElement(Layout, __assign$2({}, restProps, { tableRef: this.tableRef, columns: columns, minWidth: minWidth, minColumnWidth: minColumnWidth })));
    };
    return TableLayoutBase;
}(react.PureComponent));
/** @internal */
var TableLayout = TableLayoutBase;

/** @internal */
var ColumnGroup = /*#__PURE__*/ (function (_super) {
    __extends$1(ColumnGroup, _super);
    function ColumnGroup() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ColumnGroup.prototype.render = function () {
        var columns = this.props.columns;
        return (react.createElement("colgroup", null, columns.map(function (_a) {
            var key = _a.key, width = _a.width;
            var styleWidth = typeof width === 'number' ? width + "px" : width;
            return (react.createElement("col", { key: key, style: width !== undefined
                    ? { width: styleWidth }
                    : undefined }));
        })));
    };
    return ColumnGroup;
}(react.PureComponent));

var VirtualRowLayout = /*#__PURE__*/ (function (_super) {
    __extends$1(VirtualRowLayout, _super);
    function VirtualRowLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VirtualRowLayout.prototype.shouldComponentUpdate = function (nextProps) {
        var _a = this.props, prevCells = _a.cells, prevRow = _a.row;
        var nextCells = nextProps.cells, nextRow = nextProps.row;
        if (prevRow !== nextRow || prevCells.length !== nextCells.length) {
            return true;
        }
        var propsAreNotEqual = nextCells.some(function (nextCell, i) {
            var prevCell = prevCells[i];
            return prevCell.column !== nextCell.column || prevCell.colSpan !== nextCell.colSpan;
        });
        return propsAreNotEqual;
    };
    VirtualRowLayout.prototype.render = function () {
        var _a = this.props, row = _a.row, cells = _a.cells, Row = _a.rowComponent, Cell = _a.cellComponent;
        return (react.createElement(Row, { tableRow: row, style: getRowStyle({ row: row }) }, cells.map(function (_a) {
            var column = _a.column, colSpan = _a.colSpan;
            return (react.createElement(Cell, { key: column.key, tableRow: row, tableColumn: column, colSpan: colSpan }));
        })));
    };
    return VirtualRowLayout;
}(react.Component));

// tslint:disable-next-line: max-line-length
var VirtualTableLayoutBlock = /*#__PURE__*/ (function (_super) {
    __extends$1(VirtualTableLayoutBlock, _super);
    function VirtualTableLayoutBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VirtualTableLayoutBlock.prototype.render = function () {
        var _a = this.props, name = _a.name, tableRef = _a.tableRef, collapsedGrid = _a.collapsedGrid, minWidth = _a.minWidth, blockRefsHandler = _a.blockRefsHandler, rowRefsHandler = _a.rowRefsHandler, Table = _a.tableComponent, Body = _a.bodyComponent, cellComponent = _a.cellComponent, rowComponent = _a.rowComponent, marginBottom = _a.marginBottom;
        return (react.createElement(RefHolder, { ref: function (ref) { return blockRefsHandler(name, ref); } },
            react.createElement(Table, { tableRef: tableRef, style: __assign$2({ minWidth: minWidth + "px" }, marginBottom ? { marginBottom: marginBottom + "px" } : null) },
                react.createElement(ColumnGroup, { columns: collapsedGrid.columns }),
                react.createElement(Body, null, collapsedGrid.rows.map(function (visibleRow) {
                    var row = visibleRow.row, _a = visibleRow.cells, cells = _a === void 0 ? [] : _a;
                    return (react.createElement(RefHolder, { key: row.key, ref: function (ref) { return rowRefsHandler(row, ref); } },
                        react.createElement(VirtualRowLayout, { row: row, cells: cells, rowComponent: rowComponent, cellComponent: cellComponent })));
                })))));
    };
    VirtualTableLayoutBlock.defaultProps = {
        blockRefsHandler: function () { },
        rowRefsHandler: function () { },
        tableRef: react.createRef(),
    };
    return VirtualTableLayoutBlock;
}(react.PureComponent));

var AUTO_HEIGHT = 'auto';
var defaultProps$3$1 = {
    headerRows: [],
    footerRows: [],
    headComponent: function () { return null; },
    headTableComponent: function () { return null; },
    footerComponent: function () { return null; },
    footerTableComponent: function () { return null; },
};
/** @internal */
// tslint:disable-next-line: max-line-length
var VirtualTableLayout = /*#__PURE__*/ (function (_super) {
    __extends$1(VirtualTableLayout, _super);
    function VirtualTableLayout(props) {
        var _this = _super.call(this, props) || this;
        _this.rowRefs = new Map();
        _this.blockRefs = new Map();
        _this.viewportTop = 0;
        _this.containerHeight = 600;
        _this.containerWidth = 800;
        _this.viewportLeft = 0;
        _this.getRowHeight = function (row) {
            var rowHeights = _this.state.rowHeights;
            var estimatedRowHeight = _this.props.estimatedRowHeight;
            if (row) {
                var storedHeight = rowHeights.get(row.key);
                if (storedHeight !== undefined)
                    return storedHeight;
                if (row.height)
                    return row.height;
            }
            return estimatedRowHeight;
        };
        _this.registerRowRef = function (row, ref) {
            if (ref === null) {
                _this.rowRefs.delete(row);
            }
            else {
                _this.rowRefs.set(row, ref);
            }
        };
        _this.registerBlockRef = function (name, ref) {
            if (ref === null) {
                _this.blockRefs.delete(name);
            }
            else {
                _this.blockRefs.set(name, ref);
            }
        };
        _this.onScroll = function (e) {
            var node = e.target;
            if (_this.shouldSkipScrollEvent(e)) {
                return;
            }
            var viewportTop = node.scrollTop, viewportLeft = node.scrollLeft;
            _this.viewportTop = viewportTop;
            _this.viewportLeft = viewportLeft;
            _this.updateViewport();
        };
        _this.handleContainerSizeChange = function (_a) {
            var width = _a.width, height = _a.height;
            _this.containerHeight = height;
            _this.containerWidth = width;
            _this.updateViewport();
        };
        _this.state = {
            rowHeights: new Map(),
            height: 0,
            headerHeight: 0,
            bodyHeight: 0,
            footerHeight: 0,
            visibleRowBoundaries: {},
        };
        var headerHeight = props.headerRows
            .reduce(function (acc, row) { return acc + _this.getRowHeight(row); }, 0);
        var footerHeight = props.footerRows
            .reduce(function (acc, row) { return acc + _this.getRowHeight(row); }, 0);
        _this.state = __assign$2(__assign$2({}, _this.state), { headerHeight: headerHeight,
            footerHeight: footerHeight });
        _this.getColumnWidthGetter = memoize(function (tableColumns, tableWidth, minColumnWidth) { return (getColumnWidthGetter(tableColumns, tableWidth, minColumnWidth)); });
        return _this;
    }
    VirtualTableLayout.prototype.componentDidMount = function () {
        this.storeRowHeights();
        this.storeBlockHeights();
    };
    VirtualTableLayout.prototype.componentDidUpdate = function (prevProps) {
        this.storeRowHeights();
        this.storeBlockHeights();
        var _a = this.props, bodyRows = _a.bodyRows, columns = _a.columns;
        // NOTE: the boundaries depend not only on scroll position and container dimensions
        // but on body rows too. This boundaries update is especially important when
        // lazy loading is used because by the time that all involved events are handled
        // no rows are loaded yet.
        var bodyRowsChanged = prevProps.bodyRows !== bodyRows;
        // Also it's the only place where we can respond to the column count change
        var columnCountChanged = prevProps.columns.length !== columns.length;
        if (bodyRowsChanged || columnCountChanged) {
            this.updateViewport();
        }
    };
    VirtualTableLayout.getDerivedStateFromProps = function (nextProps, prevState) {
        var prevRowHeight = prevState.rowHeights;
        var rowHeights = __spread$3(nextProps.headerRows, nextProps.bodyRows, nextProps.footerRows).reduce(function (acc, row) {
            var rowHeight = prevRowHeight.get(row.key);
            if (rowHeight !== undefined) {
                acc.set(row.key, rowHeight);
            }
            return acc;
        }, new Map());
        return { rowHeights: rowHeights };
    };
    VirtualTableLayout.prototype.storeRowHeights = function () {
        var _this = this;
        var rowsWithChangedHeights = Array.from(this.rowRefs.entries())
            .map(function (_a) {
            var _b = __read$3(_a, 2), row = _b[0], ref = _b[1];
            return [row, reactDom.findDOMNode(ref)];
        })
            .filter(function (_a) {
            var _b = __read$3(_a, 2), node = _b[1];
            return !!node;
        })
            .map(function (_a) {
            var _b = __read$3(_a, 2), row = _b[0], node = _b[1];
            return [row, node.getBoundingClientRect().height];
        })
            .filter(function (_a) {
            var _b = __read$3(_a, 1), row = _b[0];
            return row.type !== TABLE_STUB_TYPE;
        })
            .filter(function (_a) {
            var _b = __read$3(_a, 2), row = _b[0], height = _b[1];
            return height !== _this.getRowHeight(row);
        });
        if (rowsWithChangedHeights.length) {
            var rowHeights_1 = this.state.rowHeights;
            rowsWithChangedHeights
                .forEach(function (_a) {
                var _b = __read$3(_a, 2), row = _b[0], height = _b[1];
                return rowHeights_1.set(row.key, height);
            });
            this.setState({
                rowHeights: rowHeights_1,
            });
        }
    };
    VirtualTableLayout.prototype.storeBlockHeights = function () {
        var _this = this;
        var getBlockHeight = function (blockName) { return (_this.blockRefs.get(blockName)
            ? reactDom.findDOMNode(_this.blockRefs.get(blockName)).getBoundingClientRect().height
            : 0); };
        var headerHeight = getBlockHeight('header');
        var bodyHeight = getBlockHeight('body');
        var footerHeight = getBlockHeight('footer');
        var _a = this.state, prevHeaderHeight = _a.headerHeight, prevBodyHeight = _a.bodyHeight, prevFooterHeight = _a.footerHeight;
        if (prevHeaderHeight !== headerHeight
            || prevBodyHeight !== bodyHeight
            || prevFooterHeight !== footerHeight) {
            this.setState({
                headerHeight: headerHeight,
                bodyHeight: bodyHeight,
                footerHeight: footerHeight,
            });
        }
    };
    VirtualTableLayout.prototype.shouldSkipScrollEvent = function (e) {
        var node = e.target;
        // NOTE: prevent nested scroll to update viewport
        if (node !== e.currentTarget) {
            return true;
        }
        // NOTE: normalize position:
        // in Firefox and Chrome (zoom > 100%) when scrolled to the bottom
        // in Edge when scrolled to the right edge
        var correction = 1;
        var nodeHorizontalOffset = parseInt(node.scrollLeft + node.clientWidth, 10) - correction;
        var nodeVerticalOffset = parseInt(node.scrollTop + node.clientHeight, 10) - correction;
        // NOTE: prevent iOS to flicker in bounces and correct rendering on high dpi screens
        if (node.scrollTop < 0
            || node.scrollLeft < 0
            || nodeHorizontalOffset > Math.max(node.scrollWidth, node.clientWidth)
            || nodeVerticalOffset > Math.max(node.scrollHeight, node.clientHeight)) {
            return true;
        }
        return false;
    };
    VirtualTableLayout.prototype.updateViewport = function () {
        var _a = this.props, viewport = _a.viewport, setViewport = _a.setViewport;
        var newViewport = this.calculateViewport();
        if (viewport !== newViewport) {
            setViewport(newViewport);
        }
    };
    VirtualTableLayout.prototype.calculateViewport = function () {
        var _a = this, state = _a.state, viewportTop = _a.viewportTop, viewportLeft = _a.viewportLeft, containerHeight = _a.containerHeight, containerWidth = _a.containerWidth;
        var _b = this.props, loadedRowsStart = _b.loadedRowsStart, bodyRows = _b.bodyRows, headerRows = _b.headerRows, footerRows = _b.footerRows, estimatedRowHeight = _b.estimatedRowHeight, columns = _b.columns, minColumnWidth = _b.minColumnWidth, isDataRemote = _b.isDataRemote, viewport = _b.viewport;
        var getColumnWidth = this.getColumnWidthGetter(columns, containerWidth, minColumnWidth);
        return getViewport(__assign$2(__assign$2({}, state), { viewportTop: viewportTop, viewportLeft: viewportLeft, containerHeight: containerHeight, containerWidth: containerWidth }), { loadedRowsStart: loadedRowsStart, columns: columns, bodyRows: bodyRows, headerRows: headerRows, footerRows: footerRows, isDataRemote: isDataRemote, viewport: viewport }, estimatedRowHeight, this.getRowHeight, getColumnWidth);
    };
    VirtualTableLayout.prototype.getCollapsedGrids = function (viewport) {
        var _a = this, containerWidth = _a.containerWidth, viewportLeft = _a.viewportLeft;
        var _b = this.props, headerRows = _b.headerRows, bodyRows = _b.bodyRows, footerRows = _b.footerRows, columns = _b.columns, loadedRowsStart = _b.loadedRowsStart, totalRowCount = _b.totalRowCount, getCellColSpan = _b.getCellColSpan, minColumnWidth = _b.minColumnWidth;
        var getColumnWidth = this.getColumnWidthGetter(columns, containerWidth, minColumnWidth);
        return getCollapsedGrids({
            headerRows: headerRows,
            bodyRows: bodyRows,
            footerRows: footerRows,
            columns: columns,
            loadedRowsStart: loadedRowsStart,
            totalRowCount: totalRowCount,
            getCellColSpan: getCellColSpan,
            viewportLeft: viewportLeft,
            containerWidth: containerWidth,
            viewport: viewport,
            getRowHeight: this.getRowHeight,
            getColumnWidth: getColumnWidth,
        });
    };
    VirtualTableLayout.prototype.render = function () {
        var _a = this.props, Container = _a.containerComponent, HeadTable = _a.headTableComponent, FootTable = _a.footerTableComponent, Table = _a.tableComponent, Head = _a.headComponent, Body = _a.bodyComponent, Footer = _a.footerComponent, tableRef = _a.tableRef, height = _a.height, headerRows = _a.headerRows, footerRows = _a.footerRows, minColumnWidth = _a.minColumnWidth, minWidth = _a.minWidth, cellComponent = _a.cellComponent, rowComponent = _a.rowComponent, viewport = _a.viewport, scrollTop = _a.scrollTop;
        var _b = this.state, headerHeight = _b.headerHeight, bodyHeight = _b.bodyHeight, footerHeight = _b.footerHeight;
        var containerHeight = this.containerHeight;
        var collapsedGrids = this.getCollapsedGrids(viewport);
        var commonProps = {
            cellComponent: cellComponent,
            rowComponent: rowComponent,
            minColumnWidth: minColumnWidth,
            minWidth: minWidth,
            blockRefsHandler: this.registerBlockRef,
            rowRefsHandler: this.registerRowRef,
        };
        var sizerHeight = height === AUTO_HEIGHT ? null : height;
        return (react.createElement(Sizer, { onSizeChange: this.handleContainerSizeChange, containerComponent: Container, style: { height: sizerHeight }, onScroll: this.onScroll, scrollTop: scrollTop },
            (!!headerRows.length) && (react.createElement(VirtualTableLayoutBlock, __assign$2({}, commonProps, { name: "header", collapsedGrid: collapsedGrids.headerGrid, tableComponent: HeadTable, bodyComponent: Head }))),
            react.createElement(VirtualTableLayoutBlock, __assign$2({}, commonProps, { name: "body", collapsedGrid: collapsedGrids.bodyGrid, tableComponent: Table, bodyComponent: Body, tableRef: tableRef, marginBottom: Math.max(0, containerHeight - headerHeight - bodyHeight - footerHeight) })),
            (!!footerRows.length) && (react.createElement(VirtualTableLayoutBlock, __assign$2({}, commonProps, { name: "footer", collapsedGrid: collapsedGrids.footerGrid, tableComponent: FootTable, bodyComponent: Footer })))));
    };
    VirtualTableLayout.defaultProps = defaultProps$3$1;
    return VirtualTableLayout;
}(react.PureComponent));

var getColumnStyle = function (_a) {
    var column = _a.column;
    return column.animationState;
};
/** @internal */
var RowLayout = react.memo(function (props) {
    var row = props.row, columns = props.columns, Row = props.rowComponent, Cell = props.cellComponent, getCellColSpan = props.getCellColSpan;
    var getColSpan = react.useCallback(function (tableRow, tableColumn) { return getCellColSpan({ tableRow: tableRow, tableColumn: tableColumn, tableColumns: columns }); }, [columns, getCellColSpan]);
    return (react.createElement(Row, { tableRow: row, style: getRowStyle({ row: row }) }, columns
        .map(function (column) { return (react.createElement(Cell, { key: column.key, tableRow: row, tableColumn: column, style: getColumnStyle({ column: column }), colSpan: getColSpan(row, column) })); })));
});

/** @internal */
var RowsBlockLayout = /*#__PURE__*/ (function (_super) {
    __extends$1(RowsBlockLayout, _super);
    function RowsBlockLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RowsBlockLayout.prototype.render = function () {
        var _a = this.props, rows = _a.rows, columns = _a.columns, Block = _a.blockComponent, rowComponent = _a.rowComponent, cellComponent = _a.cellComponent, getCellColSpan = _a.getCellColSpan;
        return (react.createElement(Block, null, rows
            .map(function (row) { return (react.createElement(RowLayout, { key: row.key, row: row, columns: columns, rowComponent: rowComponent, cellComponent: cellComponent, getCellColSpan: getCellColSpan })); })));
    };
    return RowsBlockLayout;
}(react.PureComponent));

var defaultProps$4 = {
    headerRows: [],
    footerRows: [],
    headComponent: function () { return null; },
    footerComponent: function () { return null; },
};
/** @internal */
var StaticTableLayout = /*#__PURE__*/ (function (_super) {
    __extends$1(StaticTableLayout, _super);
    function StaticTableLayout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticTableLayout.prototype.render = function () {
        var _a = this.props, headerRows = _a.headerRows, bodyRows = _a.bodyRows, footerRows = _a.footerRows, columns = _a.columns, minWidth = _a.minWidth, Container = _a.containerComponent, Table = _a.tableComponent, headComponent = _a.headComponent, bodyComponent = _a.bodyComponent, footerComponent = _a.footerComponent, rowComponent = _a.rowComponent, cellComponent = _a.cellComponent, getCellColSpan = _a.getCellColSpan, tableRef = _a.tableRef;
        var commonProps = {
            columns: columns,
            rowComponent: rowComponent,
            cellComponent: cellComponent,
            getCellColSpan: getCellColSpan,
        };
        return (react.createElement(Container, null,
            react.createElement(Table, { tableRef: tableRef, style: { minWidth: "calc(" + minWidth + ")" } },
                react.createElement(ColumnGroup, { columns: columns }),
                !!headerRows.length && (react.createElement(RowsBlockLayout, __assign$2({ rows: headerRows, blockComponent: headComponent }, commonProps))),
                react.createElement(RowsBlockLayout, __assign$2({ rows: bodyRows, blockComponent: bodyComponent }, commonProps)),
                !!footerRows.length && (react.createElement(RowsBlockLayout, __assign$2({ rows: footerRows, blockComponent: footerComponent }, commonProps))))));
    };
    StaticTableLayout.defaultProps = defaultProps$4;
    return StaticTableLayout;
}(react.PureComponent));

/** @internal */
var emptyViewport = {
    columns: [[0, 0]],
    rows: [0, 0],
    headerRows: [0, 0],
    footerRows: [0, 0],
    top: 0,
    left: 0,
    width: 800,
    height: 600,
};
var tableColumnsComputed = function (_a) {
    var tableColumns = _a.tableColumns;
    return checkColumnWidths(tableColumns);
};
/** @internal */
var makeVirtualTable = function (Table, _a) {
    var VirtualLayout = _a.VirtualLayout, FixedHeader = _a.FixedHeader, FixedFooter = _a.FixedFooter, SkeletonCell = _a.SkeletonCell, defaultEstimatedRowHeight = _a.defaultEstimatedRowHeight, defaultHeight = _a.defaultHeight;
    var VirtualTable = /*#__PURE__*/ (function (_super) {
        __extends$1(VirtualTable, _super);
        function VirtualTable(props) {
            var _this = _super.call(this, props) || this;
            _this.setViewport = function (viewport) {
                _this.setState({ viewport: viewport });
            };
            _this.state = {
                viewport: emptyViewport,
                nextRowId: undefined,
            };
            _this.layoutRenderComponent = connectProps(VirtualLayout, function () {
                var _a = _this.props, headTableComponent = _a.headTableComponent, footerTableComponent = _a.footerTableComponent;
                return {
                    headTableComponent: headTableComponent,
                    footerTableComponent: footerTableComponent,
                };
            });
            _this.scrollToRow = function (nextRowId) { return _this.setState({ nextRowId: nextRowId }); };
            return _this;
        }
        VirtualTable.prototype.componentDidUpdate = function (prevProps, prevState) {
            var prevId = prevState.nextRowId;
            var currentId = this.state.nextRowId;
            var areIdsEqual = currentId !== undefined && currentId === prevId;
            this.layoutRenderComponent.update();
            if (areIdsEqual) {
                this.setState({ nextRowId: undefined });
            }
        };
        VirtualTable.prototype.render = function () {
            var _this = this;
            var _a = this.props, height = _a.height, estimatedRowHeight = _a.estimatedRowHeight, SkeletonStubCell = _a.skeletonCellComponent, children = _a.children, restProps = __rest$1(_a, ["height", "estimatedRowHeight", "skeletonCellComponent", "children"]);
            var _b = this.state, stateViewport = _b.viewport, nextId = _b.nextRowId;
            return (react.createElement(Plugin, { name: "VirtualTable" },
                react.createElement(Table, __assign$2({ layoutComponent: this.layoutRenderComponent }, restProps)),
                react.createElement(Action, { name: "setViewport", action: this.setViewport }),
                react.createElement(Action, { name: "scrollToRow", action: this.scrollToRow }),
                react.createElement(Getter, { name: "viewport", value: stateViewport }),
                react.createElement(Getter, { name: "tableColumns", computed: tableColumnsComputed }),
                react.createElement(Template, { name: "tableLayout" }, function (params) { return (react.createElement(TemplateConnector, null, function (_a, _b) {
                    var availableRowCount = _a.availableRowCount, loadedRowsStart = _a.loadedRowsStart, tableBodyRows = _a.tableBodyRows, isDataRemote = _a.isDataRemote, viewport = _a.viewport;
                    var setViewport = _b.setViewport;
                    var onTopRowChange = _this.props.onTopRowChange;
                    var rowId = getTopRowId(viewport, tableBodyRows, isDataRemote);
                    onTopRowChange(rowId);
                    var totalRowCount = availableRowCount || tableBodyRows.length;
                    var scrollTop = getScrollTop(tableBodyRows, totalRowCount, nextId, estimatedRowHeight, isDataRemote);
                    return (react.createElement(TemplatePlaceholder, { params: __assign$2(__assign$2({}, params), { totalRowCount: totalRowCount,
                            loadedRowsStart: loadedRowsStart,
                            isDataRemote: isDataRemote,
                            height: height,
                            estimatedRowHeight: estimatedRowHeight,
                            setViewport: setViewport,
                            viewport: viewport,
                            scrollTop: scrollTop }) }));
                })); }),
                react.createElement(Template, { name: "tableCell", predicate: function (_a) {
                        var tableRow = _a.tableRow;
                        return !!isStubTableCell(tableRow);
                    } }, function (params) { return (react.createElement(TemplateConnector, null, function (_a) {
                    var isDataRemote = _a.isDataRemote;
                    return (isDataRemote ? react.createElement(SkeletonStubCell, __assign$2({}, params)) : react.createElement(TemplatePlaceholder, null));
                })); })));
        };
        VirtualTable.defaultProps = {
            estimatedRowHeight: defaultEstimatedRowHeight,
            height: defaultHeight,
            headTableComponent: FixedHeader,
            footerTableComponent: FixedFooter,
            skeletonCellComponent: SkeletonCell,
            onTopRowChange: function () { },
        };
        VirtualTable.TOP_POSITION = TOP_POSITION;
        VirtualTable.BOTTOM_POSITION = BOTTOM_POSITION;
        return VirtualTable;
    }(react.PureComponent));
    Object.values(Table.components).forEach(function (name) {
        VirtualTable[name] = Table[name];
    });
    VirtualTable.FixedHeader = FixedHeader;
    VirtualTable.FixedFooter = FixedFooter;
    VirtualTable.SkeletonCell = SkeletonCell;
    return VirtualTable;
};

var InlineSummaryItem = react.memo(function (_a) {
    var _b = _a.summary, messageKey = _b.messageKey, columnTitle = _b.columnTitle, SummaryComponent = _b.component, getMessage = _a.getMessage;
    return (react.createElement(react.Fragment, null,
        getMessage(messageKey, { columnTitle: columnTitle }),
        react.createElement(SummaryComponent, null)));
});

export { Sizer as A, firstRowOnPage as B, ColumnChooser as C, DataTypeProvider as D, EditingState as E, FilteringState as F, Grid as G, lastRowOnPage as H, IntegratedFiltering as I, Draggable as J, DragSource as K, getCellGeometries as L, calculateStartPage as M, PagingState as P, SearchState as S, TableRowDetail as T, VirtualTableLayout as V, IntegratedPaging as a, DragDropProvider$1 as b, GroupingPanel as c, InlineSummaryItem as d, TableGroupRow as e, TableSelection as f, Table as g, TableFilterRow as h, TableHeaderRow as i, TableBandHeader as j, TableEditRow as k, TableEditColumn as l, makeVirtualTable as m, TableColumnVisibility as n, TableColumnReordering as o, Toolbar as p, TableTreeColumn as q, SearchPanel as r, TableFixedColumns as s, TableSummaryRow as t, TableInlineCellEditing as u, ExportPanel as v, withComponents as w, PagingPanel as x, TableLayout as y, StaticTableLayout as z };
