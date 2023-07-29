import { SVGProps } from 'react'
import type { File } from '../../../FileTreeContext/Ctx.type'
import { useTreeCtxStateSelector } from '../../../FileTreeContext/useTreeCtxState'

export default function TreeFile({ file }: { file: File }) {
   const isRenaming = useTreeCtxStateSelector(state => state.Files.get(file.id)?.isRenaming)
   const isHighlighted = useTreeCtxStateSelector(state => state.HighlightedItem.id == file.id)


   return (
      <>
         <button
            data-id={file.id}
            className={`file-item w-full flex items-end ${isRenaming ? "px-1" : "p-1"} ${isHighlighted ? "bg-black" : ""}`}
            tabIndex={-1}
         >
            <FileIcon height={'16px'} width={'16px'} className='shrink-0 mr-2 pointer-events-none' />
            {!isRenaming && <span className='leading-5 pointer-events-none'>{file.name}</span>}
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
