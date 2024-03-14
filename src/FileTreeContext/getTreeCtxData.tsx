import { MutableRefObject, useCallback, useRef } from 'react'
import { FileTreeType, TFocusedNode } from './Ctx.type'

export type StoreCtxState = {
   Files: FileTreeType
   FilesListRef: MutableRefObject<HTMLUListElement | null>
   TreeExpandState: Map<string, boolean>
   FocusedNode: TFocusedNode
   shouldShowFolderInput: boolean
   shouldShowFileInput: boolean
   showTreeContextMenu: boolean
   isRenamingItem: boolean
   HighlightedNode: { id: string | null }
}

export type StoreCtxData = {
   get: () => StoreCtxState
   set: (value: StoreCtxState | ((state: StoreCtxState) => StoreCtxState), notify?: boolean) => void
   observe: (cb: () => void) => () => void
}

export default function getTreeCtxData(): StoreCtxData {
   const StoreData = useRef<StoreCtxState>({
      Files: new Map(),
      FilesListRef: { current: null },
      TreeExpandState: new Map(),
      FocusedNode: {
         item: null,
         target: null,
      },
      shouldShowFolderInput: false,
      shouldShowFileInput: false,
      showTreeContextMenu: false,
      isRenamingItem: false,
      HighlightedNode: { id: "" }
   })

   const observers = useRef(new Set<() => void>())

   // get all store data
   const get = useCallback(() => StoreData.current, [])

   // set all store data
   const set = useCallback(
      (value: StoreCtxState | ((state: StoreCtxState) => StoreCtxState), notify: boolean = true) => {
         if (typeof value != 'function') {
            StoreData.current = value
         } else {
            StoreData.current = value(StoreData.current)
         }
         if (notify) {
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
