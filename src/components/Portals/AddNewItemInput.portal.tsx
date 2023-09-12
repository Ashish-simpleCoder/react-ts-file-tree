import type { Folder } from '../../FileTreeContext/Ctx.type'
import type { ElementRef } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useContextActions, useStateSelector } from '../../FileTreeContext/useTreeCtxState'
import { useEventListener } from '../../hooks/useEventListener'
import { FileIcon } from '../FileTree/TreeFile/TreeFile'
import { FolderIcon } from '../FileTree/TreeFolder/TreeFolder'

export default function AddNewItem__Portal() {
   const FocusedItem = useStateSelector((state) => state.FocusedTreeItem.item)
   const treeContainerRef = useStateSelector((state) => state.FilesListRef, false)
   const FocusedItemTarget = useStateSelector((state) => state.FocusedTreeItem.target)
   const isExpanded = useStateSelector((state) => state.TreeExpandState.get(FocusedItem?.id ?? ''))
   const shouldShowFolderInput = useStateSelector((state) => state.shouldShowFolderInput)
   const shouldShowFileInput = useStateSelector((state) => state.shouldShowFileInput)

   const [portalContainer, setPortalContainer] = useState<HTMLElement | null | undefined>(null)
   const elementRef = useRef<ElementRef<'li'>>(null)
   const portalParentElement = (FocusedItemTarget as HTMLButtonElement)?.parentElement
   const fileInputRef = useRef<HTMLInputElement>(null)
   const folderInputRef = useRef<HTMLInputElement>(null)

   const { createFile, createFolder, hideAllInputs } = useContextActions()

   useEffect(() => {
      // checking item type is folder or not
      if (FocusedItem?.isFolder && isExpanded && portalParentElement) {
         setPortalContainer(portalParentElement.querySelector('ul'))
         return
      }
      // item is not folder then get it's parent element
      if (FocusedItem && !FocusedItem.isFolder) {
         setPortalContainer(portalParentElement?.parentElement?.parentElement?.querySelector('ul'))
      } else {
         // if none, then set it to root container
         setPortalContainer(treeContainerRef.current)
      }
   }, [isExpanded])

   if (!portalContainer) return null

   const PortalElement = () => {
      const parent: Folder = useStateSelector(
         (state) => state.Files.get(state.Files.get(FocusedItem?.id ?? '')?.parentId ?? '') as Folder,
         false
      )
      const Files = useStateSelector((state) => state.Files, false)
      const [error, setError] = useState<string | null>(null)
      const [newName, setName] = useState('')

      const handleChange = (value: string) => {
         setName(value)
         setError(null)
         if (!value) {
            setError('Pls input file name')
            return
         }
         // run loop for the children
         parent.childrenIds.forEach((id) => {
            if (value == Files.get(id)?.name) {
               setError('File already exists')
               return
            }
         })
      }

      const handleSaveItem = () => {
         if (error) {
            hideAllInputs()
            return
         }
         if (shouldShowFileInput) {
            createFile({ name: newName })
         }
         if (shouldShowFolderInput) {
            createFolder({ name: newName })
         }
         hideAllInputs()
      }

      // save when clicked any where in tree-container
      useEventListener(treeContainerRef.current, 'click', (e) => {
         if (elementRef.current?.contains(e.target as Node)) return

         // if space key pressed and inputElement is focused then don't trigger save event
         if (shouldShowFileInput && document.activeElement == fileInputRef.current) return
         if (shouldShowFolderInput && document.activeElement == folderInputRef.current) return

         handleSaveItem()
      })

      // we can also use treeContainerRef.current instead of document
      useEventListener(document, 'keydown', (e) => {
         if (e.key != 'Escape') return
         handleSaveItem()
      })

      // save on contexmenu
      useEventListener(treeContainerRef.current, 'contextmenu', () => {
         handleSaveItem()
      })

      return (
         <li className={`${FocusedItem?.id == 'root' || !FocusedItem?.isFolder ? '' : 'pl-4'}`} ref={elementRef}>
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  if (error) return
                  handleSaveItem()
               }}
               className='w-auto p-1 relative'
            >
               <div className={`flex items-center ${shouldShowFileInput ? '' : 'hidden'}`}>
                  <FileIcon className='mr-2 shrink-0' />
                  <input
                     className='z-10 p-1 h-5 outline-none focus:border leading-5 w-full'
                     placeholder='new file'
                     ref={fileInputRef}
                     onChange={(e) => handleChange(e.target.value)}
                     autoFocus
                  />
               </div>
               <div className={`flex items-center ${shouldShowFolderInput ? '' : 'hidden'}`}>
                  <FolderIcon className='mr-2 shrink-0' />
                  <input
                     className='z-10 p-1 h-5 outline-none focus:border leading-5 w-full'
                     placeholder='new folder'
                     ref={folderInputRef}
                     onChange={(e) => handleChange(e.target.value)}
                     autoFocus
                  />
               </div>
               {error && <span className='absolute w-full mt-1 top-full left-0 bg-red-500 text-black'>{error}</span>}

               <button className='invisible hidden'></button>
            </form>
         </li>
      )
   }

   return createPortal(<PortalElement />, portalContainer)
}