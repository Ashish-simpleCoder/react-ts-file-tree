import { useSyncExternalStore } from 'react'
import { useTreeCtx } from './FileTreeContext'
import { StoreCtxState } from './getTreeCtxData'

export function useTreeCtxStateSelector<SelectorOutput>(
   selector: (state: StoreCtxState) => SelectorOutput,
   watch: boolean = true
): SelectorOutput {
   const Store = useTreeCtx()
   if (!Store) throw new Error('no form store found.')
   if (!watch) {
      const state = selector(Store.get())
      return state
   }
   const state = useSyncExternalStore(Store.observe, () => selector(Store.get()))
   return state
}

export function useTreeStateDispatch() {
   const FormStore = useTreeCtx()
   if (!FormStore) throw new Error('no form store found.')

   return FormStore.set
}

export function useContextActions() {
   const FormStore = useTreeCtx()
   if (!FormStore) throw new Error('no form store found.')

   return FormStore.actions
}
