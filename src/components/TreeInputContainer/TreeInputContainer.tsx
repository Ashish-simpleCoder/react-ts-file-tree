import { createPortal, flushSync } from 'react-dom'
import { ElementRef, SVGProps, useEffect, useRef, useState } from 'react'
import { useContextActions, useTreeCtxStateSelector, useTreeStateDispatch } from '../../FileTreeContext/useTreeCtxState'
import { FileIcon } from '../FileTree/TreeFile/TreeFile'
import { FolderIcon } from '../FileTree/TreeFolder/TreeFolder'
import { useEventListener } from '../../hooks/useEventListener'

export default function TreeInputContainer() {
   const {
      toggleFolderInputVisibility,
      toggleFileInputVisibility,
      createFile,
      createFolder,
      hideFileInput,
      hideFolderInput,
      highlightFileOrFolder,
      collapseTree,
      refreshTree
   } = useContextActions()
   const TreeDispatch = useTreeStateDispatch()

   const shouldShowFolderInput = useTreeCtxStateSelector((state) => state.shouldShowFolderInput)
   const shouldShowFileInput = useTreeCtxStateSelector((state) => state.shouldShowFileInput)
   const FocusedItem = useTreeCtxStateSelector((state) => state.FocusedTreeItem.item)
   const FocusedItemTarget = useTreeCtxStateSelector((state) => state.FocusedTreeItem.target)
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const isRenamingItem = useTreeCtxStateSelector((state) => state.isRenamingItem)

   const fileInputRef = useRef<HTMLInputElement>(null)
   const folderInputRef = useRef<HTMLInputElement>(null)

   // const portalParentElement = FocusedItem?.isFolder ? (FocusedItemTarget as HTMLButtonElement)?.parentElement : (FocusedItemTarget as HTMLButtonElement)?.parentElement?.parentElement?.parentElement
   const portalParentElement = (FocusedItemTarget as HTMLButtonElement)?.parentElement



   const handleCreateSubmit = () => {
      if (shouldShowFileInput) {
         const name = fileInputRef.current?.value ?? ""
         let id: string | undefined = ''
         flushSync(() => {
            id = createFile({ name })
         })
         id && highlightFileOrFolder(id)
         hideFileInput()
      }
      if (shouldShowFolderInput) {
         const name = folderInputRef.current?.value ?? ""
         let id: string | undefined = ''
         flushSync(() => {
            id = createFolder({ name })
         })
         id && highlightFileOrFolder(id)
         hideFolderInput()
      }
   }

   const updateItemName = () => {
      if (!FocusedItem) return
      if (!fileInputRef.current?.value) {
         // throw error
         // show tooltip error
         return
      }
      TreeDispatch(state => {
         const item = state.Files.get(FocusedItem?.id ?? "")
         if (!item) return state

         item.name = fileInputRef.current!.value
         item.isRenaming = false
         return state
      })
      highlightFileOrFolder(FocusedItem.id)
      hideFileInput()
   }

   const InputPortal = () => {
      const isExpanded = useTreeCtxStateSelector(state => state.TreeExpandState.get(FocusedItem?.id ?? ""))
      const [portalContainer, setPortalContainer] = useState<HTMLElement | null | undefined>(null)
      const elementRef = useRef<ElementRef<"li">>(null)

      useEffect(() => {
         // checking item type is folder or not
         if (FocusedItem?.isFolder && isExpanded && portalParentElement) {
            setPortalContainer(portalParentElement.querySelector("ul"))
            return
         }
         // item is not folder then get it's parent element
         if (FocusedItem && !FocusedItem.isFolder) {
            setPortalContainer(portalParentElement?.parentElement?.parentElement?.querySelector("ul"))
         } else {
            // if none, then set it to root container
            setPortalContainer(TreeContainerRef.current)
         }
      }, [isExpanded])


      useEventListener(TreeContainerRef.current, "click", (e) => {
         // @ts-ignore
         if (elementRef.current?.contains(e.target)) return
         handleCreateSubmit()
      })

      if (!portalContainer) return null

      const PortalElement = () => {
         return (
            <li className={`p-1 ${(FocusedItem?.id == "root" || !FocusedItem?.isFolder) ? "" : "pl-4"}`} ref={elementRef}>
               <form onSubmit={(e) => { e.preventDefault(); handleCreateSubmit() }} className='w-auto'>
                  <div className={`flex items-center ${shouldShowFileInput ? '' : 'hidden'}`}>
                     <FileIcon className='mr-2' />
                     <input className='z-10 p-1 h-7 outline-none focus:border leading-5 w-full' placeholder='new file' ref={fileInputRef} autoFocus />
                  </div>
                  <div className={`flex items-center ${shouldShowFolderInput ? '' : 'hidden'}`}>
                     <FolderIcon className='mr-2' />
                     <input className='z-10 p-1 h-7 outline-none focus:border leading-5 w-full' placeholder='new folder' ref={folderInputRef} autoFocus />
                  </div>
                  <button className='invisible hidden'></button>
               </form>
            </li>
         )
      }
      return createPortal(<PortalElement />, portalContainer)
   }

   const UpdateNameInputPortal = () => {
      const portalContainer = FocusedItemTarget
      const elementRef = useRef<ElementRef<"form">>(null)


      useEventListener(TreeContainerRef.current, "click", (e) => {
         // @ts-ignore
         if (elementRef.current?.contains(e.target)) return
         updateItemName()
      })

      if (!portalContainer) return null

      const PortalElement = () => {
         const [newName, setName] = useState(FocusedItem?.name ?? "")
         return (
            <form onSubmit={(e) => { e.preventDefault(); updateItemName() }} className='w-auto' ref={elementRef}>
               <span><input className='z-10 h-7 outline-none focus:border leading-5 w-full' placeholder='new file' value={newName} onChange={(e) => setName(e.target.value)} ref={fileInputRef} autoFocus /></span>
            </form>
         )
      }
      // @ts-ignore
      return createPortal(<PortalElement />, portalContainer)
   }


   // we can also use TreeContainerRef.current instead of document
   useEventListener(document, 'keydown', (e) => {
      if (e.key != 'Escape') return
      if (!isRenamingItem) {
         return handleCreateSubmit()
      }
      updateItemName()
   }, {}, shouldShowFileInput || shouldShowFolderInput)



   return (
      <div className='py-2'>
         <div className='px-2 flex justify-end gap-1'>
            <button onClick={toggleFolderInputVisibility} title={'New folder in ' + FocusedItem?.name}>
               <CodiconNewFolder height="18px" width="18px" />
            </button>
            <button onClick={toggleFileInputVisibility} title={'New file in ' + FocusedItem?.name}>
               <CodiconNewFile height="18px" width="18px" />
            </button>
            <button onClick={refreshTree} title='Refresh Tree'>
               <span><MaterialSymbolsRefresh height="18px" width="18px" /></span>
            </button>
            <button onClick={collapseTree} title='Collapse Folders in Explorer'>
               <span><CarbonCollapseAll height="18px" width="18px" /></span>
            </button>
         </div>

         {((shouldShowFolderInput || shouldShowFileInput) && !isRenamingItem) && <InputPortal />}
         {(shouldShowFileInput && isRenamingItem) && <UpdateNameInputPortal />}

      </div>
   )
}


export function MaterialSymbolsRefresh(props: SVGProps<SVGSVGElement>) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}><path fill="#888888" d="M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.188-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20Z"></path></svg>
   )
}

export function CarbonCollapseAll(props: SVGProps<SVGSVGElement>) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 32 32" {...props}><path fill="#888888" d="M30 15h-2V7H13V5h15a2.002 2.002 0 0 1 2 2Z"></path><path fill="#888888" d="M25 20h-2v-8H8v-2h15a2.002 2.002 0 0 1 2 2Z"></path><path fill="#888888" d="M18 27H4a2.002 2.002 0 0 1-2-2v-8a2.002 2.002 0 0 1 2-2h14a2.002 2.002 0 0 1 2 2v8a2.002 2.002 0 0 1-2 2ZM4 17v8h14.001L18 17Z"></path></svg>
   )
}

export function CodiconNewFile(props: SVGProps<SVGSVGElement>) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props}><path fill="#888888" fillRule="evenodd" d="m9.5 1.1l3.4 3.5l.1.4v2h-1V6H8V2H3v11h4v1H2.5l-.5-.5v-12l.5-.5h6.7l.3.1zM9 2v3h2.9L9 2zm4 14h-1v-3H9v-1h3V9h1v3h3v1h-3v3z" clipRule="evenodd"></path></svg>
   )
}

export function CodiconNewFolder(props: SVGProps<SVGSVGElement>) {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16" {...props}><path fill="#888888" fillRule="evenodd" d="M14.5 2H7.71l-.85-.85L6.51 1h-5l-.5.5v11l.5.5H7v-1H1.99V6h4.49l.35-.15l.86-.86H14v1.5l-.001.51h1.011V2.5L14.5 2zm-.51 2h-6.5l-.35.15l-.86.86H2v-3h4.29l.85.85l.36.15H14l-.01.99zM13 16h-1v-3H9v-1h3V9h1v3h3v1h-3v3z" clipRule="evenodd"></path></svg>
   )
}