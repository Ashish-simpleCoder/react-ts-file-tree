import type { Folder } from '../../FileTreeContext/Ctx.type'
import { useTreeCtxStateSelector } from '../../FileTreeContext/useTreeCtxState'
import Tree from './Tree'

export default function FileTree() {
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const RootNode = useTreeCtxStateSelector((state) => state.Files.get('root') as Folder)

   return (
      <section className='tree-container  '>
         <ul ref={TreeContainerRef}>{RootNode && <Tree item={RootNode} />}</ul>
      </section>
   )
}
