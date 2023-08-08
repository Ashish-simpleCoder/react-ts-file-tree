import type { Folder } from '../../FileTreeContext/Ctx.type'
import { useContextActions, useTreeCtxStateSelector, useTreeStateDispatch } from '../../FileTreeContext/useTreeCtxState'
import { useEventListener } from '../../hooks/useEventListener'
import { getKeyState } from '../../utils/getKeyState'
import TreeContextMenu from '../TreeContextMenu/TreeContextMenu'
import TreeInputContainer from '../TreeInputContainer/TreeInputContainer'
import TreeFolder from './TreeFolder/TreeFolder'

export default function FileTree() {
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const RootNode = useTreeCtxStateSelector((state) => state.Files.get('root') as Folder)
   const state = useTreeCtxStateSelector((state) => state)
   const TreeActionDispatch = useTreeStateDispatch()
   const { collapseFolder, expandFolder } = useContextActions()


   // highlight logic for file/folder
   // collapse-expand logic
   useEventListener(TreeContainerRef.current, 'click', (e) => {
      const shouldShowFileInputState = getKeyState(state, (state) => state.shouldShowFileInput)
      if (shouldShowFileInputState) return
      if (
         !(e.target as HTMLElement).classList.contains('file-item') &&
         !(e.target as HTMLElement).classList.contains('folder-item')
      )
         return

      const itemId = (e.target as HTMLElement).getAttribute('data-id')
      if (!itemId) return

      TreeActionDispatch((state) => {
         const item = state.Files.get(itemId)
         if (!item) return state

         if (item.isFolder) {
            const isFolderExpanded = state.TreeExpandState.get(item.id)
            if (isFolderExpanded) {
               collapseFolder(item.id)
            } else {
               ;(item as Folder).childrenIds.length > 0 && expandFolder(item.id)
            }
         }
         if (!item.isFolder) {
         }

         state.HighlightedItem.id = item.id
         state.FocusedTreeItem.item = item
         state.FocusedTreeItem.target = e.target
         return state
      })
   })

   return (
      <section className='h-[100vh] w-64 border border-gray-700 bg-gray-900 fixed'>
         <TreeInputContainer />
         <ul ref={TreeContainerRef} className='w-full overflow-auto' style={{ height: 'calc(100vh - 36px)' }}>
            {/* {RootNode && <Tree item={RootNode} />} */}
            {RootNode && <TreeFolder folder={RootNode} />}
         </ul>
         <TreeContextMenu />
      </section>
   )
}
