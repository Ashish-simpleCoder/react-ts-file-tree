import type { MouseEvent } from 'react'
import type { PartialBy } from 'src/types/types'
import type { File, Folder } from './Ctx.type'

import { flushSync } from 'react-dom'

import getTreeCtxData from './getTreeCtxData'
import { getCurrentTimeStamp } from 'src/utils/get-current-time-stamp'

export default function getContextActions(state: ReturnType<typeof getTreeCtxData>) {
   // toggle-collapse api ------------------------------------------
   const collapseTree = () => {
      state.set((state) => {
         state.TreeExpandState.clear()
         state.TreeExpandState.set('root', true)
         return state
      })
   }
   const refreshTree = () => {
      state.set((state) => {
         state.Files = new Map(state.Files)
         return state
      })
   }
   const expandFolder = (folderId?: string) => {
      const id = folderId || state.get().FocusedNode.item?.id
      if (!id) return

      state.set((state) => {
         state.TreeExpandState.set(id, true)
         return state
      })
   }

   const collapseFolder = (folderId?: string) => {
      const id = folderId || state.get().FocusedNode.item?.id
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
   const createFile = (file: PartialBy<File, 'isFolder' | 'id' | 'parentId' | 'isRenaming' | 'newName'>) => {
      if (!file.name) return
      if (!file.parentId && !state.get().FocusedNode.item?.id) return
      file.isFolder = false
      file.isRenaming = false
      file.newName = file.name

      const id = file.id ?? getCurrentTimeStamp()
      flushSync(() => {
         state.set((state) => {
            let parentItem = state.Files.get(file.parentId || state.FocusedNode.item!.id || 'root')!

            if (!parentItem?.isFolder && parentItem?.parentId) {
               parentItem = state.Files.get(parentItem?.parentId)!
            }
            state.Files.set(id, { ...file, id, parentId: parentItem.id } as File)
            ;(state.Files.get(parentItem.id) as Folder).childrenIds = [...(parentItem as Folder).childrenIds, id]
            return state
         })
      })
      // highlight newly created file
      highlightFileOrFolder(id)

      return id
   }

   const createFolder = (
      folder: PartialBy<Folder, 'isFolder' | 'id' | 'parentId' | 'childrenIds' | 'isRenaming' | 'newName'>
   ) => {
      if (!folder.name) return
      if (!folder.parentId && !state.get().FocusedNode.item?.id) return

      folder.isFolder = true
      folder.childrenIds = folder.childrenIds ?? []
      folder.isRenaming = false
      folder.newName = folder.name

      const id = folder.id ?? getCurrentTimeStamp()

      flushSync(() => {
         state.set((state) => {
            let parentItem = state.Files.get(folder.parentId || state.FocusedNode.item!.id || 'root')!

            if (!parentItem?.isFolder && parentItem?.parentId) {
               parentItem = state.Files.get(parentItem?.parentId)!
            }
            state.Files.set(id, { ...folder, id, parentId: parentItem.id } as Folder)
            ;(state.Files.get(parentItem.id) as Folder).childrenIds = [...(parentItem as Folder).childrenIds, id]
            return state
         })
      })
      // highlight newly created folder
      highlightFileOrFolder(id)

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
      if (!target) return

      // target.classList.add('bg-black')
      // @ts-ignore

      state.set((state) => {
         // @ts-ignore
         // state.FocusedNode?.target?.classList.remove('bg-black')
         state.HighlightedNode.id = id
         state.FocusedNode = {
            item: state.Files.get(id) || null,
            target,
         }
         return state
      })
   }
   // hightlight file/folder api -----------------------------------
   const hideAllInputs = () => {
      state.set((state) => {
         state.shouldShowFileInput = false
         state.shouldShowFolderInput = false
         return state
      })
   }

   return {
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
      collapseTree,
      refreshTree,
      hideAllInputs,
   }
}
