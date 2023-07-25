import { useEffect, useRef } from 'react'
import { useContextActions, useTreeCtxStateSelector } from '../../FileTreeContext/useTreeCtxState'
import { FileIcon } from '../FileTree/TreeFile/TreeFile'
import { FolderIcon } from '../FileTree/TreeFolder/TreeFolder'
import { useEventListener } from '../../hooks/useEventListener'
import { flushSync } from 'react-dom'

export default function TreeInputContainer() {
   const { toggleFolderInputVisibility, toggleFileInputVisibility, createFile, createFolder, hideFileInput, hideFolderInput, highlightFileOrFolder } = useContextActions()
   const shouldShowFolderInput = useTreeCtxStateSelector((state) => state.shouldShowFolderInput)
   const shouldShowFileInput = useTreeCtxStateSelector((state) => state.shouldShowFileInput)
   const fileInputRef = useRef<HTMLInputElement>(null)
   const folderInputRef = useRef<HTMLInputElement>(null)

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


   useEventListener(document, 'keyup', (e) => {
      if (e.key != 'Enter') return
      if (!shouldShowFileInput && !shouldShowFolderInput) return

      if (shouldShowFileInput) {
         const name = fileInputRef.current?.value
         if (!name) return
         let id: string | undefined = ""
         flushSync(() => {
            id = createFile({ name })
         })
         highlightFileOrFolder(id)
         hideFileInput()
      }
      if (shouldShowFolderInput) {
         const name = folderInputRef.current?.value
         if (!name) return
         let id: string | undefined = ""
         flushSync(() => {
            id = createFolder({ name })
         })
         highlightFileOrFolder(id)
         hideFolderInput()
      }
   })

   return (
      <div>
         <button onClick={toggleFolderInputVisibility} title='create file'>
            <FolderIcon />
         </button>
         <button onClick={toggleFileInputVisibility} title='create file'>
            <FileIcon />
         </button>

         <div className={`flex items-center ${shouldShowFileInput ? '' : 'hidden'}`}>
            <FileIcon className='mr-2' />
            <input className='z-10 p-1' placeholder='new file' ref={fileInputRef} />
         </div>
         <div className={`flex items-center ${shouldShowFolderInput ? '' : 'hidden'}`}>
            <FolderIcon className='mr-2' />
            <input className='z-10 p-1' placeholder='new folder' ref={folderInputRef} />
         </div>
      </div>
   )
}
