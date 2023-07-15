import { MutableRefObject, useCallback, useRef } from 'react'
import { FileTreeType, FocusedItem } from './Ctx.type'

export type StoreCtxState = {
   Files: FileTreeType
   FilesListRef: MutableRefObject<HTMLUListElement | null>
   TreeExpandState: Map<string, boolean>
   FocusedTreeItem: FocusedItem
}

type StoreCtxData = {
   get: () => StoreCtxState
   set: (value: StoreCtxState | ((state: StoreCtxState) => StoreCtxState), notify?: boolean) => void
   observe: (cb: () => void) => () => void
}

export default function getTreeCtxData(): StoreCtxData {
   const StoreData = useRef<StoreCtxState>({
      Files: new Map(),
      FilesListRef: { current: null },
      TreeExpandState: new Map(),
      FocusedTreeItem: {
         item: null,
         target: null,
      },
   })

   const observers = useRef(new Set<() => void>())

   // get all store data
   const get = useCallback(() => {
      return StoreData.current
   }, [])

   // set all store data
   const set = useCallback(
      (value: StoreCtxState | ((state: StoreCtxState) => StoreCtxState), notify: boolean = true) => {
         if (typeof value != 'function') {
            StoreData.current = value
         } else {
            StoreData.current = value(StoreData.current)
         }
         if (notify) {
            console.log(notify)
            // notifying all of the observers
            observers.current.forEach((observer) => observer())
         }
      },
      []
   )

   // add the observer to the list
   const observe = useCallback((cb: () => void) => {
      observers.current.add(cb)
      return () => observers.current.delete(cb)
   }, [])

   return { get, set, observe }
}
