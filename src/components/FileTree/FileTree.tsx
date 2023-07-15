import type { Folder } from '../../FileTreeContext/Ctx.type'
import { useTreeCtxStateSelector } from '../../FileTreeContext/useTreeCtxState'
import Tree from './Tree'

export default function FileTree() {
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const RootNode = useTreeCtxStateSelector((state) => state.Files.get('root') as Folder)
   const FocusedItem = useTreeCtxStateSelector((state) => state.FocusedTreeItem)
   // console.log(FocusedItem)

   return (
      <section className='tree-container  '>
         <ul ref={TreeContainerRef} className='w-[300px]'>
            {RootNode && <Tree item={RootNode} />}
         </ul>
      </section>
   )
}
