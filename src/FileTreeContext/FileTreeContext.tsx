import { ReactNode, createContext, useContext, useInsertionEffect } from 'react'
import getTreeCtxData from './getTreeCtxData'
import { Folder } from './Ctx.type'
import getContextActions from './Context.actions'

const TreeCtx = createContext<
   | (ReturnType<typeof getTreeCtxData> & {
        actions: ReturnType<typeof getContextActions>
     })
   | null
>(null)

// hook for using the form context
export const useTreeCtx = () => useContext(TreeCtx)

export function FileTreeCtxProvider({ children }: { children: ReactNode }) {
   const state = getTreeCtxData()
   const actions = getContextActions(state)

   // initial data insertion
   useInsertionEffect(() => {
      state.set((state) => {
         state.Files.set('root', {
            id: 'root',
            childrenIds: ['0', '1', '2', '3'],
            isFolder: true,
            name: 'root',
            parentId: 'root',
            newName: 'root',
            isRenaming: false,
         })
         state.Files.set('0', {
            id: '0',
            childrenIds: ['5'],
            isFolder: true,
            name: 'Javascript',
            parentId: 'root',
            newName: 'Javascript',
            isRenaming: false,
         })
         state.Files.set('1', {
            id: '1',
            childrenIds: [],
            isFolder: true,
            name: 'Rust',
            parentId: 'root',
            newName: 'Rust',
            isRenaming: false,
         })
         state.Files.set('2', {
            id: '2',
            childrenIds: [],
            isFolder: true,
            name: 'Python',
            parentId: 'root',
            newName: 'Python',
            isRenaming: false,
         })
         state.Files.set('3', {
            id: '3',
            childrenIds: [],
            isFolder: true,
            name: 'Elixier',
            parentId: 'root',
            newName: 'Elixier',
            isRenaming: false,
         })

         state.Files.set('5', {
            id: '5',
            isFolder: true,
            name: 'ReactJS',
            parentId: '0',
            childrenIds: ['6'],
            newName: 'ReactJS',
            isRenaming: false,
         })
         state.Files.set('6', {
            id: '6',
            isFolder: false,
            name: 'nextjs',
            parentId: '5',
            newName: 'nextjs',
            isRenaming: false,
         })

         state.TreeExpandState.set('root', true)

         // setting
         state.FocusedNode.item = state.Files.get('root') as Folder
         return state
      }, false)
   }, [])

   return (
      <TreeCtx.Provider
         value={{
            ...state,
            actions,
         }}
      >
         {children}
      </TreeCtx.Provider>
   )
}
