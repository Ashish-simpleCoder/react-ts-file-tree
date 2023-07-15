import { MouseEvent, ReactNode, createContext, useContext, useInsertionEffect, useLayoutEffect } from 'react'
import getTreeCtxData from './getTreeCtxData'
import { Folder } from './Ctx.type'

const TreeCtx = createContext<
   | (ReturnType<typeof getTreeCtxData> & {
        actions: {
           collapseFolder: (id: string) => void
           expandFolder: (id: string) => void
           toggleFolderInputVisibility: (e: MouseEvent<HTMLButtonElement>) => void
           toggleFileInputVisibility: (e: MouseEvent<HTMLButtonElement>) => void
        }
     })
   | null
>(null)

// hook for using the form context
export const useTreeCtx = () => useContext(TreeCtx)

export function FileTreeCtxProvider({ children }: { children: ReactNode }) {
   const state = getTreeCtxData()

   const expandFolder = (folderId?: string) => {
      const id = folderId || state.get().FocusedTreeItem.item?.id
      if (!id) return

      state.set((state) => {
         state.TreeExpandState.set(id, true)
         return state
      })
   }

   const collapseFolder = (folderId?: string) => {
      const id = folderId || state.get().FocusedTreeItem.item?.id
      if (!id) return

      state.set((state) => {
         state.TreeExpandState.set(id, false)
         return state
      })
   }

   const toggleFolderInputVisibility = (_e: MouseEvent<HTMLButtonElement>) => {
      expandFolder()
      state.set((state) => {
         state.shouldShowFolderInput = !state.shouldShowFolderInput
         state.shouldShowFileInput = false
         return state
      })
   }
   const toggleFileInputVisibility = (_e: MouseEvent<HTMLButtonElement>) => {
      expandFolder()
      state.set((state) => {
         state.shouldShowFileInput = !state.shouldShowFileInput
         state.shouldShowFolderInput = false
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

         // setting
         state.FocusedTreeItem.item = state.Files.get('root') as Folder
         return state
      }, false)
   }, [])

   return (
      <TreeCtx.Provider
         value={{
            ...state,
            actions: { expandFolder, collapseFolder, toggleFolderInputVisibility, toggleFileInputVisibility },
         }}
      >
         {children}
      </TreeCtx.Provider>
   )
}
