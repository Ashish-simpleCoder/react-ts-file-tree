import { useRef } from "react";
import { useEventListener } from "./useEventListener";

type Options = boolean | AddEventListenerOptions;

export default function useKeyEventListener<K extends keyof GlobalEventHandlersEventMap>(
    type: K,
    keys: string[],
    handler: (event: GlobalEventHandlersEventMap[K]) => void,
    options?: Options & { preventDefault?: boolean } & { shouldAddEvent?: boolean },
) {
    const pressedKeysMap = useRef<Array<string>>([]);
    const shouldAddEvent = options?.shouldAddEvent

    const listener = (event: GlobalEventHandlersEventMap[K]) => {
        if ("key" in event) {
            //   if (pressedKeysMap.current.length == 0) {
            event.ctrlKey && pressedKeysMap.current.push("Control");
            event.shiftKey && pressedKeysMap.current.push("Shift");
            event.altKey && pressedKeysMap.current.push("Alt");
            // } else {
            !pressedKeysMap.current.includes(event.key) && pressedKeysMap.current.push(event.key);

            if (keys.toString() == pressedKeysMap.current.toString()) {
                if (options?.preventDefault) event.preventDefault();
                handler(event);
            }
            //  }
        }
    };

    const clearPressedKey = () => {
        pressedKeysMap.current.pop();
    };

    useEventListener(document, type, listener, options, shouldAddEvent);

    useEventListener(document, "keyup", clearPressedKey, options, shouldAddEvent);
    useEventListener(window, "blur", () => pressedKeysMap.current = [], shouldAddEvent)
    useEventListener(window, "contextmenu", () => pressedKeysMap.current = [], shouldAddEvent)
}
