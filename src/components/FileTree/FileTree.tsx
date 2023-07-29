import type { Folder } from '../../FileTreeContext/Ctx.type'
import { useContextActions, useTreeCtxStateSelector, useTreeStateDispatch } from '../../FileTreeContext/useTreeCtxState'
import { useEventListener } from '../../hooks/useEventListener'
import TreeContextMenu from '../TreeContextMenu/TreeContextMenu'
import TreeInputContainer from '../TreeInputContainer/TreeInputContainer'
import TreeFolder from './TreeFolder/TreeFolder'

export default function FileTree() {
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const RootNode = useTreeCtxStateSelector((state) => state.Files.get('root') as Folder)
   const TreeActionDispatch = useTreeStateDispatch()
   const { collapseFolder, expandFolder } = useContextActions()


   useEventListener(window, 'keydown', (e) => {
      if (e.key != 'Escape') return
      TreeActionDispatch((state) => {
         state.showTreeContextMenu = false
         return state
      })
   })

   useEventListener(TreeContainerRef.current, 'click', (e) => {
      if (!(e.target as HTMLElement).classList.contains("file-item") && !(e.target as HTMLElement).classList.contains("folder-item")) return

      const itemId = (e.target as HTMLElement).getAttribute("data-id")
      if (!itemId) return


      TreeActionDispatch((state) => {
         const item = state.Files.get(itemId)
         if (!item) return state

         if (item.isFolder) {
            const isFolderExpanded = state.TreeExpandState.get(item.id)
            if (isFolderExpanded) {
               collapseFolder(item.id)
            } else {
               expandFolder(item.id)
            }
         }
         if (!item.isFolder) {

         }

         state.showTreeContextMenu = false
         state.HighlightedItem.id = item.id
         state.FocusedTreeItem.item = item
         state.FocusedTreeItem.target = e.target
         return state
      })

   })


   // const Files = useTreeCtxStateSelector((state) => state.Files)
   // console.log({ Files })

   return (
      <section className='h-[100vh] w-64 border border-gray-700 bg-gray-900 p-'>
         <TreeInputContainer />
         <ul ref={TreeContainerRef} className='w-full'>
            {/* {RootNode && <Tree item={RootNode} />} */}
            {RootNode && <TreeFolder folder={RootNode} />}
         </ul>
         <TreeContextMenu />
      </section>
   )
}
