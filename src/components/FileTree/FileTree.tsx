import type { Folder } from 'src/FileTreeContext/Ctx.type'
import { If } from 'classic-react-components'
import { useContextActions, useStateSelector, useContextDispatch } from 'src/FileTreeContext/useTreeCtxState'
import { useEventListener } from 'src/hooks/useEventListener'
import { getKeyState } from 'src/utils/getKeyState'
import TreeContextMenu from 'src/components/TreeContextMenu/TreeContextMenu'
import TreeInputContainer from 'src/components/TreeInputContainer/TreeInputContainer'
import TreeFolder from './TreeFolder/TreeFolder'

export default function FileTree() {
   const treeContainerRef = useStateSelector((state) => state.FilesListRef, false)
   const RootNode = useStateSelector((state) => state.Files.get('root') as Folder)
   const state = useStateSelector((state) => state)
   const dispatch = useContextDispatch()
   const { collapseFolder, expandFolder } = useContextActions()


   // Event-Delegation modal for file/folder clicking
   // highlight logic for file/folder
   // collapse-expand logic
   useEventListener(treeContainerRef.current, 'click', (e) => {
      // @ts-ignore
      const isAnyFileInputVisible = getKeyState( state, (state) => state.shouldShowFileInput || state.shouldShowFolderInput )
      if (isAnyFileInputVisible) return

      const target = e.target as HTMLElement

      // if clicked file-folder then proceed
      if (
         !target.classList.contains('file-item') &&
         !target.classList.contains('folder-item')
      ) {
         return
      }

      const itemId = target.getAttribute('data-id')
      if (!itemId) return

      dispatch((state) => {
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
         state.HighlightedNode.id = item.id
         state.FocusedNode.item = item
         state.FocusedNode.target = e.target
         return state
      })
   })

   return (
      <section className='h-[100vh] w-64 border-0 border-gray-700 bg-gray-800 fixed'>
         <TreeInputContainer />

         <ul ref={treeContainerRef} className='w-full overflow-auto h-[calc(100vh-36px)]'>
            <If condition={RootNode}>
               <TreeFolder folder={RootNode} />
            </If>
         </ul>
         
         <TreeContextMenu />
      </section>
   )
}
