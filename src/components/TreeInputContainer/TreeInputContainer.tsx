import { useEffect } from 'react'
import { useContextActions, useTreeCtxStateSelector } from '../../FileTreeContext/useTreeCtxState'
import { FileIcon } from '../FileTree/TreeFile/TreeFile'
import { FolderIcon } from '../FileTree/TreeFolder/TreeFolder'

export default function TreeInputContainer() {
   const { toggleFolderInputVisibility, toggleFileInputVisibility } = useContextActions()
   const shouldShowFolderInput = useTreeCtxStateSelector((state) => state.shouldShowFolderInput)
   const shouldShowFileInput = useTreeCtxStateSelector((state) => state.shouldShowFileInput)

   return (
      <div>
         <button onClick={toggleFolderInputVisibility} title='create file'>
            <FolderIcon />
         </button>
         <button onClick={toggleFileInputVisibility} title='create file'>
            <FileIcon />
         </button>
         {shouldShowFolderInput && (
            <div className='flex items-center'>
               <FolderIcon className='mr-2' />
               <input
                  // ref={(node) => node && inputRefs.current.set('file-input-ref', node)}
                  // style={{ display: shouldShowFolderInput ? 'block' : 'none', zIndex: '2' }}
                  className='z-10 p-1'
                  placeholder='new folder'
               />
            </div>
         )}
         {shouldShowFileInput && (
            <div className='flex items-center'>
               <FileIcon className='mr-2' />
               <input
                  // ref={(node) => node && inputRefs.current.set('file-input-ref', node)}
                  // style={{ display: shouldShowFolderInput ? 'block' : 'none', zIndex: '2' }}
                  className='z-10 p-1'
                  placeholder='new file'
               />
            </div>
         )}
      </div>
   )
}
