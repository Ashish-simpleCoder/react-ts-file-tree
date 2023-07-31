import type { ElementRef, RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTreeCtxStateSelector } from '../FileTreeContext/useTreeCtxState'
import { useEventListener } from '../hooks/useEventListener'
import { FileIcon } from './FileTree/TreeFile/TreeFile'
import { FolderIcon } from './FileTree/TreeFolder/TreeFolder'

export default function NewItemInput__Portal({
   fileInputRef,
   folderInputRef,
   handleCreateSubmit,
}: {
   fileInputRef: RefObject<HTMLInputElement>
   folderInputRef: RefObject<HTMLInputElement>
   handleCreateSubmit: () => void
}) {
   const FocusedItem = useTreeCtxStateSelector((state) => state.FocusedTreeItem.item)
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const FocusedItemTarget = useTreeCtxStateSelector((state) => state.FocusedTreeItem.target)
   const isExpanded = useTreeCtxStateSelector((state) => state.TreeExpandState.get(FocusedItem?.id ?? ''))
   const shouldShowFolderInput = useTreeCtxStateSelector((state) => state.shouldShowFolderInput)
   const shouldShowFileInput = useTreeCtxStateSelector((state) => state.shouldShowFileInput)

   const [portalContainer, setPortalContainer] = useState<HTMLElement | null | undefined>(null)
   const elementRef = useRef<ElementRef<'li'>>(null)
   const portalParentElement = (FocusedItemTarget as HTMLButtonElement)?.parentElement

   
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
         setPortalContainer(TreeContainerRef.current)
      }
   }, [isExpanded])

   useEventListener(TreeContainerRef.current, 'click', (e) => {
      // @ts-ignore
      if (elementRef.current?.contains(e.target)) return
      handleCreateSubmit()
   })

   if (!portalContainer) return null

   const PortalElement = () => {
      return (
         <li className={`${FocusedItem?.id == 'root' || !FocusedItem?.isFolder ? '' : 'pl-4'}`} ref={elementRef}>
            <form
               onSubmit={(e) => {
                  e.preventDefault()
                  handleCreateSubmit()
               }}
               className='w-auto p-1'
            >
               <div className={`flex items-center ${shouldShowFileInput ? '' : 'hidden'}`}>
                  <FileIcon className='mr-2 shrink-0' />
                  <input
                     className='z-10 p-1 h-7 outline-none focus:border leading-5 w-full'
                     placeholder='new file'
                     ref={fileInputRef}
                     autoFocus
                  />
               </div>
               <div className={`flex items-center ${shouldShowFolderInput ? '' : 'hidden'}`}>
                  <FolderIcon className='mr-2 shrink-0' />
                  <input
                     className='z-10 p-1 h-7 outline-none focus:border leading-5 w-full'
                     placeholder='new folder'
                     ref={folderInputRef}
                     autoFocus
                  />
               </div>
               <button className='invisible hidden'></button>
            </form>
         </li>
      )
   }
   return createPortal(<PortalElement />, portalContainer)
}
