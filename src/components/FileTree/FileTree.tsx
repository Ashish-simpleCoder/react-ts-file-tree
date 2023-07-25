import type { Folder } from '../../FileTreeContext/Ctx.type'
import { useTreeCtxStateSelector, useTreeStateDispatch } from '../../FileTreeContext/useTreeCtxState'
import { useEventListener } from '../../hooks/useEventListener'
import TreeContextMenu from '../TreeContextMenu/TreeContextMenu'
import TreeInputContainer from '../TreeInputContainer/TreeInputContainer'
import Tree from './Tree'

export default function FileTree() {
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const RootNode = useTreeCtxStateSelector((state) => state.Files.get('root') as Folder)
   const TreeActionDispatch = useTreeStateDispatch()

   useEventListener(window, 'keydown', (e) => {
      if (e.key != 'Escape') return
      TreeActionDispatch((state) => {
         state.shouldShowFileInput = false
         state.shouldShowFolderInput = false
         state.showTreeContextMenu = false
         return state
      })
   })

   // const Files = useTreeCtxStateSelector((state) => state.Files)
   // console.log({ Files })

   return (
      <section className='h-[100vh] w-64 border border-gray-700 bg-gray-900 p-'>
         <TreeInputContainer />
         <ul ref={TreeContainerRef} className='w-full'>
            {RootNode && <Tree item={RootNode} />}
         </ul>
         <TreeContextMenu />
      </section>
   )
}