import { r as react } from './index-0ff745df.js';

var useEnhancedEffect = typeof window !== 'undefined' ? react.useLayoutEffect : react.useEffect;
/**
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 *
 * @param {function} fn
 */

function useEventCallback(fn) {
  var ref = react.useRef(fn);
  useEnhancedEffect(function () {
    ref.current = fn;
  });
  return react.useCallback(function () {
    return (ref.current).apply(void 0, arguments);
  }, []);
}

var TransitionGroupContext = react.createContext(null);

/**
 * @ignore - internal component.
 */

var ListContext = react.createContext({});

export { ListContext as L, TransitionGroupContext as T, useEventCallback as u };
