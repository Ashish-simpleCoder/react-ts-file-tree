import type { Folder } from '../../../FileTreeContext/Ctx.type'
import { type MouseEvent, type SVGProps } from 'react'

import {
   useContextActions,
   useTreeCtxStateSelector,
   useTreeStateDispatch,
} from '../../../FileTreeContext/useTreeCtxState'
import Tree from '../Tree'

export default function TreeFolder({ folder }: { folder: Folder }) {
   const { collapseFolder, expandFolder } = useContextActions()
   const treeDispatch = useTreeStateDispatch()
   const isFolderExpanded = useTreeCtxStateSelector((state) => state.TreeExpandState.get(folder.id))
   const childrenIds = useTreeCtxStateSelector((state) => (state.Files.get(folder.id) as Folder).childrenIds)
   const Files = useTreeCtxStateSelector((state) => state.Files)

   const handleFolderClick = (e: MouseEvent<HTMLElement>) => {
      treeDispatch((state) => {
         if (state.FocusedTreeItem.item?.id != folder.id) {
            // adding the high-light class to current focused item
            e.currentTarget.classList.add('bg-black')
            // removing the high-light class from old-focused item
            // @ts-ignore
            state.FocusedTreeItem.target?.classList.remove('bg-black')
         } else {
            // @ts-ignore
            e.target.classList.add('bg-black')
         }
         state.FocusedTreeItem.item = folder
         state.FocusedTreeItem.target = e.currentTarget
         return state
      }, false)
      if (isFolderExpanded) {
         collapseFolder(folder.id)
      } else {
         expandFolder(folder.id)
      }
   }

   return (
      <>
         <button
            onClick={handleFolderClick}
            data-id={folder.id}
            className='folder-folder w-full flex items-end p-1'
            tabIndex={-1}
         >
            {childrenIds.length > 0 && (
               <RightAngledArrow rotate={isFolderExpanded ? '90deg' : '0deg'} height={'16px'} width={'16px'} />
            )}
            <FolderIcon height={'16px'} width={'16px'} className='mr-2' />
            <span className='leading-5'>{folder.name}</span>
         </button>
         {isFolderExpanded && (
            <ul>
               {childrenIds.map((child_id) => {
                  const node = Files.get(child_id)
                  if (node) {
                     return <Tree key={child_id} item={node} />
                  }
                  return null
               })}
            </ul>
         )}
      </>
   )
}

export function FolderIcon(props: SVGProps<SVGSVGElement>) {
   return (
      <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' {...props}>
         <path
            fill='currentColor'
            d='M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2Z'
         ></path>
      </svg>
   )
}

export function RightAngledArrow(props: SVGProps<SVGSVGElement> & { rotate?: string }) {
   return (
      <svg
         xmlns='http://www.w3.org/2000/svg'
         width='0.7em'
         height='0.7em'
         viewBox='0 0 24 24'
         style={{ transform: `rotate(${props.rotate})`, marginRight: '5px' }}
         {...props}
      >
         <path
            fill='currentColor'
            d='M7.15 21.1q-.375-.375-.375-.888t.375-.887L14.475 12l-7.35-7.35q-.35-.35-.35-.875t.375-.9q.375-.375.888-.375t.887.375l8.4 8.425q.15.15.213.325T17.6 12q0 .2-.063.375t-.212.325L8.9 21.125q-.35.35-.863.35T7.15 21.1Z'
         ></path>
      </svg>
   )
}
