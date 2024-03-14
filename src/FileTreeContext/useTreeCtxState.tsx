import { useSyncExternalStore } from 'react'
import { useTreeCtx } from './FileTreeContext'
import { StoreCtxState } from './getTreeCtxData'

export function useStateSelector<SelectorOutput>(
   selector: (state: StoreCtxState) => SelectorOutput,
   watch: boolean = true
): SelectorOutput {
   const store = useTreeCtx()

   if (!store) throw new Error('no form store found.')

   if (!watch) {
      const state = selector(store.get())
      return state
   }

   const state = useSyncExternalStore(store.observe, () => selector(store.get()))
   return state
}

export function useContextDispatch() {
   const store = useTreeCtx()

   if (!store) throw new Error('no form store found.')

   return store.set
}

export function useContextActions() {
   const store = useTreeCtx()
   
   if (!store) throw new Error('no form store found.')

   return store.actions
}
