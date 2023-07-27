import { ChangeEvent, FormEvent, MouseEvent, SVGProps } from 'react'
import type { File } from '../../../FileTreeContext/Ctx.type'
import { useTreeCtxStateSelector, useTreeStateDispatch } from '../../../FileTreeContext/useTreeCtxState'

export default function TreeFile({ file }: { file: File }) {
   const treeDispatch = useTreeStateDispatch()
   const isRenaming = useTreeCtxStateSelector(state => state.Files.get(file.id)?.isRenaming)
   const newName = useTreeCtxStateSelector(state => state.Files.get(file.id)?.newName)

   const handleFileClick = (e: MouseEvent<HTMLElement>) => {
      treeDispatch((state) => {
         state.showTreeContextMenu = false
         if (state.FocusedTreeItem.item?.id != file.id) {
            // adding the high-light class to current focused item
            e.currentTarget.classList.add('bg-black')
            // removing the high-light class from old-focused item
            // @ts-ignore
            state.FocusedTreeItem.target?.classList.remove('bg-black')
         } else {
            // @ts-ignore
            e.currentTarget.classList.add('bg-black')
         }
         state.FocusedTreeItem.item = file
         state.FocusedTreeItem.target = e.currentTarget
         return state
      })
   }

   const handleRenameChange = (e: ChangeEvent<HTMLInputElement>) => {
      treeDispatch(state => {
         state.Files.get(file.id)!.newName = e.target.value
         return state
      })
   }

   const updateName = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      treeDispatch(state => {
         const item = state.Files.get(file.id)
         if (!item) return state
         item.name = newName ?? item.name
         item.isRenaming = false
         return state
      })
   }

   if (!isRenaming) {
      return (
         <>
            <button
               onClick={handleFileClick}
               data-id={file.id}
               className={'folder-folder w-full flex items-end p-1'}
               tabIndex={-1}
            >
               <FileIcon height={'16px'} width={'16px'} className='mr-2 pointer-events-none' />
               <span className='leading-5 pointer-events-none'>{file.name}</span>
            </button>
         </>
      )
   }

   return (
      <>
         <button
            onClick={handleFileClick}
            data-id={file.id}
            className={'folder-folder w-full flex items-center'}
            tabIndex={-1}
         >
            <div className="w-4 h-4 mr-2">
               <FileIcon height={'16px'} width={'16px'} className='mr-2 pointer-events-none' />
            </div>
            <form onSubmit={updateName} className='w-auto'>
               <input value={newName} onChange={handleRenameChange} className='leading-5 p-1 w-full' autoFocus />
            </form>
         </button>
      </>
   )
}

export function FileIcon(props: SVGProps<SVGSVGElement>) {
   return (
      <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' {...props}>
         <path
            d='M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm2 4v2h10V7H7zm0 4v2h10v-2H7zm0 4v2h7v-2H7z'
            fill='currentColor'
         ></path>
      </svg>
   )
}
