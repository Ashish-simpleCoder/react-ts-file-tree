import { flushSync } from 'react-dom'
import { FormEvent, SVGProps, useEffect, useRef } from 'react'
import { useContextActions, useTreeCtxStateSelector } from '../../FileTreeContext/useTreeCtxState'
import { FileIcon } from '../FileTree/TreeFile/TreeFile'
import { FolderIcon } from '../FileTree/TreeFolder/TreeFolder'

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
   const shouldShowFolderInput = useTreeCtxStateSelector((state) => state.shouldShowFolderInput)
   const shouldShowFileInput = useTreeCtxStateSelector((state) => state.shouldShowFileInput)
   const FocusedItem = useTreeCtxStateSelector((state) => state.FocusedTreeItem.item)
   const fileInputRef = useRef<HTMLInputElement>(null)
   const folderInputRef = useRef<HTMLInputElement>(null)


   const handleCreateSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (shouldShowFileInput) {
         const name = fileInputRef.current?.value
         if (!name) return
         let id: string | undefined = ''
         flushSync(() => {
            id = createFile({ name })
         })
         highlightFileOrFolder(id)
         hideFileInput()
      }
      if (shouldShowFolderInput) {
         const name = folderInputRef.current?.value
         if (!name) return
         let id: string | undefined = ''
         flushSync(() => {
            id = createFolder({ name })
         })
         highlightFileOrFolder(id)
         hideFolderInput()
      }
   }

   useEffect(() => {
      if (shouldShowFileInput) {
         fileInputRef.current?.focus()
      }
      if (shouldShowFolderInput) {
         folderInputRef.current?.focus()
      }

      return () => {
         if (!shouldShowFileInput) {
            fileInputRef.current!.value = ''
         }
         if (!shouldShowFolderInput) {
            folderInputRef.current!.value = ''
         }
      }
   }, [shouldShowFileInput, shouldShowFolderInput])


   return (
      <div className='py-2'>
         <div className='px-2 flex justify-end gap-1'>
            <button onClick={toggleFolderInputVisibility} title={'New folder in ' + FocusedItem?.name}>
               <FolderIcon height="18px" width="18px" />
            </button>
            <button onClick={toggleFileInputVisibility} title={'New file in ' + FocusedItem?.name}>
               <FileIcon height="18px" width="18px" />
            </button>
            <button onClick={refreshTree} title='Refresh Tree'>
               <span><MaterialSymbolsRefresh height="18px" width="18px" /></span>
            </button>
            <button onClick={collapseTree} title='Collapse Folders in Explorer'>
               <span><CarbonCollapseAll height="18px" width="18px" /></span>
            </button>
         </div>
         <form onSubmit={handleCreateSubmit}>
            <div className={`flex items-center ${shouldShowFileInput ? '' : 'hidden'}`}>
               <FileIcon className='mr-2' />
               <input className='z-10 p-1 h-7 outline-none focus:border' placeholder='new file' ref={fileInputRef} />
            </div>
            <div className={`flex items-center ${shouldShowFolderInput ? '' : 'hidden'}`}>
               <FolderIcon className='mr-2' />
               <input className='z-10 p-1 h-7 outline-none focus:border' placeholder='new folder' ref={folderInputRef} />
            </div>
            <button className='invisible hidden'></button>
         </form>
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