import type { SVGProps } from 'react'

import { useContextActions, useStateSelector } from '../../FileTreeContext/useTreeCtxState'
import AddNewItem__Portal from '../Portals/AddNewItemInput.portal'
import UpdateItemNameInput__Portal from '../Portals/UpdateItemNameInput.portal'

export default function TreeInputContainer() {
   const { toggleFolderInputVisibility, toggleFileInputVisibility, collapseTree, refreshTree } = useContextActions()

   const shouldShowFolderInput = useStateSelector((state) => state.shouldShowFolderInput)
   const shouldShowFileInput = useStateSelector((state) => state.shouldShowFileInput)
   const focusedNode = useStateSelector((state) => state.FocusedNode.item)
   const isRenamingItem = useStateSelector((state) => state.isRenamingItem)

   return (
      <div className='py-2 h-9'>
         <div className='px-2 flex justify-end gap-1'>
            <button onClick={toggleFolderInputVisibility} title={'New folder in ' + focusedNode?.name}>
               <CodiconNewFolder />
            </button>
            <button onClick={toggleFileInputVisibility} title={'New file in ' + focusedNode?.name}>
               <CodiconNewFile />
            </button>
            <button onClick={refreshTree} title='Refresh Tree'>
               <MaterialSymbolsRefresh />
            </button>
            <button onClick={collapseTree} title='Collapse Folders in Explorer'>
               <CarbonCollapseAll />
            </button>
         </div>

         {/* portals for creating and updating files */}
         {(shouldShowFolderInput || shouldShowFileInput) && !isRenamingItem && <AddNewItem__Portal />}
         {shouldShowFileInput && isRenamingItem && <UpdateItemNameInput__Portal />}
      </div>
   )
}

export function MaterialSymbolsRefresh(props: SVGProps<SVGSVGElement>) {
   return (
      <svg
         xmlns='http://www.w3.org/2000/svg'
         width='1em'
         height='1em'
         viewBox='0 0 24 24'
         className='shrink-0'
         {...props}
      >
         <path
            fill='#888888'
            d='M12 20q-3.35 0-5.675-2.325T4 12q0-3.35 2.325-5.675T12 4q1.725 0 3.3.712T18 6.75V4h2v7h-7V9h4.2q-.8-1.4-2.188-2.2T12 6Q9.5 6 7.75 7.75T6 12q0 2.5 1.75 4.25T12 18q1.925 0 3.475-1.1T17.65 14h2.1q-.7 2.65-2.85 4.325T12 20Z'
         ></path>
      </svg>
   )
}

export function CarbonCollapseAll(props: SVGProps<SVGSVGElement>) {
   return (
      <svg
         xmlns='http://www.w3.org/2000/svg'
         width='1em'
         height='1em'
         viewBox='0 0 32 32'
         className='shrink-0'
         {...props}
      >
         <path fill='#888888' d='M30 15h-2V7H13V5h15a2.002 2.002 0 0 1 2 2Z'></path>
         <path fill='#888888' d='M25 20h-2v-8H8v-2h15a2.002 2.002 0 0 1 2 2Z'></path>
         <path
            fill='#888888'
            d='M18 27H4a2.002 2.002 0 0 1-2-2v-8a2.002 2.002 0 0 1 2-2h14a2.002 2.002 0 0 1 2 2v8a2.002 2.002 0 0 1-2 2ZM4 17v8h14.001L18 17Z'
         ></path>
      </svg>
   )
}

export function CodiconNewFile(props: SVGProps<SVGSVGElement>) {
   return (
      <svg
         xmlns='http://www.w3.org/2000/svg'
         width='1em'
         height='1em'
         viewBox='0 0 16 16'
         className='shrink-0'
         {...props}
      >
         <path
            fill='#888888'
            fillRule='evenodd'
            d='m9.5 1.1l3.4 3.5l.1.4v2h-1V6H8V2H3v11h4v1H2.5l-.5-.5v-12l.5-.5h6.7l.3.1zM9 2v3h2.9L9 2zm4 14h-1v-3H9v-1h3V9h1v3h3v1h-3v3z'
            clipRule='evenodd'
         ></path>
      </svg>
   )
}

export function CodiconNewFolder(props: SVGProps<SVGSVGElement>) {
   return (
      <svg
         xmlns='http://www.w3.org/2000/svg'
         width='1em'
         height='1em'
         viewBox='0 0 16 16'
         className='shrink-0'
         {...props}
      >
         <path
            fill='#888888'
            fillRule='evenodd'
            d='M14.5 2H7.71l-.85-.85L6.51 1h-5l-.5.5v11l.5.5H7v-1H1.99V6h4.49l.35-.15l.86-.86H14v1.5l-.001.51h1.011V2.5L14.5 2zm-.51 2h-6.5l-.35.15l-.86.86H2v-3h4.29l.85.85l.36.15H14l-.01.99zM13 16h-1v-3H9v-1h3V9h1v3h3v1h-3v3z'
            clipRule='evenodd'
         ></path>
      </svg>
   )
}
