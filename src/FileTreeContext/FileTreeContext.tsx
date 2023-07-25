import { MouseEvent, ReactNode, createContext, useContext, useInsertionEffect } from 'react'
import getTreeCtxData from './getTreeCtxData'
import { File, Folder } from './Ctx.type'
import { PartialBy } from '../types/types'

const TreeCtx = createContext<
   | (ReturnType<typeof getTreeCtxData> & {
        actions: {
           collapseFolder: (id: string) => void
           expandFolder: (id: string) => void
           toggleFolderInputVisibility: (e?: MouseEvent<HTMLButtonElement>) => void
           toggleFileInputVisibility: (e?: MouseEvent<HTMLButtonElement>) => void
           deleteFile: (id: string) => void
           deleteFolder: (id: string) => void
           createFile: (file: PartialBy<File, 'isFolder' | 'id' | 'parentId'>) => string | undefined
           createFolder: (
              folder: PartialBy<Folder, 'isFolder' | 'id' | 'parentId' | 'childrenIds'>
           ) => string | undefined
           showFileInput: () => void
           showFolderInput: () => void
           hideFileInput: () => void
           hideFolderInput: () => void
           highlightFileOrFolder: (id: string) => void
        }
     })
   | null
>(null)

// hook for using the form context
export const useTreeCtx = () => useContext(TreeCtx)

export function FileTreeCtxProvider({ children }: { children: ReactNode }) {
   const state = getTreeCtxData()

   // toggle-collapse api ------------------------------------------
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

   const showFolderInput = () => {
      state.set((state) => {
         state.shouldShowFolderInput = true
         return state
      })
   }
   const hideFolderInput = () => {
      state.set((state) => {
         state.shouldShowFolderInput = false
         return state
      })
   }
   const showFileInput = () => {
      state.set((state) => {
         state.shouldShowFileInput = true
         return state
      })
   }
   const hideFileInput = () => {
      state.set((state) => {
         state.shouldShowFileInput = false
         return state
      })
   }

   const toggleFolderInputVisibility = (_e?: MouseEvent<HTMLButtonElement>) => {
      expandFolder()
      state.set((state) => {
         state.shouldShowFolderInput = !state.shouldShowFolderInput
         state.shouldShowFileInput = false
         return state
      })
   }

   const toggleFileInputVisibility = (_e?: MouseEvent<HTMLButtonElement>) => {
      expandFolder()
      state.set((state) => {
         state.shouldShowFileInput = !state.shouldShowFileInput
         state.shouldShowFolderInput = false
         return state
      })
   }
   // toggle-collapse api ------------------------------------------

   // add-item api ------------------------------------------
   const createFile = (file: PartialBy<File, 'isFolder' | 'id' | 'parentId'>) => {
      if (!file.parentId && !state.get().FocusedTreeItem.item?.id) return
      file.isFolder = false

      const id = file.id ?? Date.now().toString()

      state.set((state) => {
         let parentItem = state.Files.get(file.parentId || state.FocusedTreeItem.item!.id || 'root')!

         if (!parentItem?.isFolder && parentItem?.parentId) {
            parentItem = state.Files.get(parentItem?.parentId)!
         }
         state.Files.set(id, { ...file, id, parentId: parentItem.id } as File)

         ;(state.Files.get(parentItem.id) as Folder).childrenIds = [...(parentItem as Folder).childrenIds, id]
         return state
      })
      return id
   }

   const createFolder = (folder: PartialBy<Folder, 'isFolder' | 'id' | 'parentId' | 'childrenIds'>) => {
      if (!folder.parentId && !state.get().FocusedTreeItem.item?.id) return

      folder.isFolder = true
      folder.childrenIds = folder.childrenIds ?? []

      const id = folder.id ?? Date.now().toString()

      state.set((state) => {
         let parentItem = state.Files.get(folder.parentId || state.FocusedTreeItem.item!.id || 'root')!

         if (!parentItem?.isFolder && parentItem?.parentId) {
            parentItem = state.Files.get(parentItem?.parentId)!
         }
         state.Files.set(id, { ...folder, id, parentId: parentItem.id } as Folder)
         ;(state.Files.get(parentItem.id) as Folder).childrenIds = [...(parentItem as Folder).childrenIds, id]
         // const p = new Map(state.Files)
         // console.log(p)
         // state.Files = Map(state.Files)
         return state
      })
      return id
   }
   // add-item api ------------------------------------------

   // delete api -------------------------------------------
   const deleteItem = (id: string) => {
      state.set((state) => {
         state.Files.delete(id)
         return state
      })
   }

   const deleteChildren = (ids: string[]) => {
      if (!ids || ids.length == 0) return
      ids.forEach((id) => {
         const item = state.get().Files.get(id)
         if (item?.isFolder) {
            deleteChildren((item as Folder).childrenIds)
         }
         deleteItem(id)
      })
   }

   const deleteFolder = (id: string) => {
      const item = state.get().Files.get(id) as Folder
      if (!item) return

      deleteItem(id)
      deleteChildren(item.childrenIds)

      state.set((state) => {
         const parent = state.Files.get(item.parentId) as Folder
         ;(state.Files.get(item.parentId) as Folder).childrenIds.splice(parent.childrenIds.indexOf(id), 1)
         ;(state.Files.get(item.parentId) as Folder).childrenIds = [
            ...(state.Files.get(item.parentId) as Folder).childrenIds,
         ]

         return state
      })
   }

   const deleteFile = (id: string) => {
      const parentId = state.get().Files.get(id)?.parentId
      if (!parentId) return

      deleteItem(id)

      state.set((state) => {
         const parent = state.Files.get(parentId) as Folder
         ;(state.Files.get(parentId) as Folder).childrenIds.splice(parent.childrenIds.indexOf(id), 1)
         ;(state.Files.get(parentId) as Folder).childrenIds = [...(state.Files.get(parentId) as Folder).childrenIds]
         return state
      })
   }
   // delete api -------------------------------------------

   // hightlight file/folder api -----------------------------------

   const highlightFileOrFolder = (id: string) => {
      const target = document.querySelector(`button[data-id='${id}']`)
      if (!id || !target) return

      target.classList.add('bg-black')
      // @ts-ignore

      state.set((state) => {
         // @ts-ignore
         state.FocusedTreeItem?.target?.classList.remove('bg-black')
         state.FocusedTreeItem = {
            item: state.Files.get(id) || null,
            target,
         }
         return state
      })
   }
   // hightlight file/folder api -----------------------------------

   // initial data insertion
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

         state.Files.set('5', { id: '5', isFolder: true, name: 'ReactJS', parentId: '0', childrenIds: ['6'] })
         state.Files.set('6', { id: '6', isFolder: false, name: 'nextjs', parentId: '5' })

         state.TreeExpandState.set('root', true)

         // setting
         state.FocusedTreeItem.item = state.Files.get('root') as Folder
         return state
      }, false)
   }, [])

   return (
      <TreeCtx.Provider
         value={{
            ...state,
            actions: {
               expandFolder,
               collapseFolder,
               toggleFolderInputVisibility,
               toggleFileInputVisibility,
               deleteFolder,
               deleteFile,
               createFile,
               createFolder,
               showFileInput,
               showFolderInput,
               hideFileInput,
               hideFolderInput,
               highlightFileOrFolder,
            },
         }}
      >
         {children}
      </TreeCtx.Provider>
   )
}
