import { ReactNode, createContext, useContext, useInsertionEffect, useLayoutEffect } from 'react'
import getTreeCtxData from './getTreeCtxData'

const TreeCtx = createContext<
   | (ReturnType<typeof getTreeCtxData> & {
        actions: { collapseFolder: (id: string) => void; expandFolder: (id: string) => void }
     })
   | null
>(null)

// hook for using the form context
export const useTreeCtx = () => useContext(TreeCtx)

export function FileTreeCtxProvider({ children }: { children: ReactNode }) {
   const state = getTreeCtxData()

   const expandFolder = (folderId?: string) => {
      const id = folderId
      if (!id) return

      state.set((state) => {
         state.TreeExpandState.set(folderId, true)
         return state
      })
   }

   const collapseFolder = (folderId?: string) => {
      const id = folderId
      if (!id) return

      state.set((state) => {
         state.TreeExpandState.set(folderId, false)
         return state
      })
   }

   useInsertionEffect(() => {
      state.set((state) => {
         state.Files.set('root', {
            id: 'root',
            childrenIds: ['0', '1', '2', '3'],
            isFolder: true,
            name: 'root',
            parentId: 'root',
         })
         state.Files.set('0', { id: '0', childrenIds: ['5'], isFolder: true, name: 'Javascript', parentId: 'root' })
         state.Files.set('1', { id: '1', childrenIds: [], isFolder: true, name: 'Rust', parentId: 'root' })
         state.Files.set('2', { id: '2', childrenIds: [], isFolder: true, name: 'Python', parentId: 'root' })
         state.Files.set('3', { id: '3', childrenIds: [], isFolder: true, name: 'elixier', parentId: 'root' })

         state.Files.set('5', { id: '5', isFolder: false, name: 'ReactJS', parentId: '0' })
         return state
      }, false)
   }, [])

   return (
      <TreeCtx.Provider value={{ ...state, actions: { expandFolder, collapseFolder } }}>{children}</TreeCtx.Provider>
   )
}
