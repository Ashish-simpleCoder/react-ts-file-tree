import { useEventListener } from '../../hooks/useEventListener'
import { useTreeCtxStateSelector, useTreeStateDispatch } from '../../FileTreeContext/useTreeCtxState'
import { flushSync } from 'react-dom'

export default function TreeContextMenu() {
   const FocusedItem = useTreeCtxStateSelector((state) => state.FocusedTreeItem.item)
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const Files = useTreeCtxStateSelector((state) => state.Files, false)
   const showTreeContextMenu = useTreeCtxStateSelector((state) => state.showTreeContextMenu)
   const TreeActionDispatch = useTreeStateDispatch()

   useEventListener(TreeContainerRef.current, 'contextmenu', (e) => {
      e.preventDefault()

      TreeActionDispatch((state) => {
         state.FocusedTreeItem.item = Files.get((e.target as HTMLButtonElement).getAttribute('data-id')!)!
         state.FocusedTreeItem.target = e.target
         return state
      }, false)

      flushSync(() => {
         TreeActionDispatch((state) => {
            state.showTreeContextMenu = true
            return state
         })
      })

      // const rect = (FocusedItem as HTMLButtonElement).getBoundingClientRect()
      const menu = document.getElementById('tree-context-menu')
      menu!.style.top = e.pageY + 'px'
      menu!.style.left = e.pageX + 'px'
   })

   useEventListener(
      document,
      'click',
      (e) => {
         // @ts-ignore
         if (!e.target.classList.contains('tree-context-menu-overlay')) return
         TreeActionDispatch((state) => {
            state.showTreeContextMenu = false
            return state
         })
      },
      {},
      showTreeContextMenu
   )

   return (
      <>
         {showTreeContextMenu && (
            <>
               <div
                  id='tree-context-menu'
                  className='w-64 rounded-sm border border-gray-700 fixed left-10 bg-slate-800 z-10'
               >
                  <ul>
                     {FocusedItem?.isFolder && (
                        <>
                           <li className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700'>
                              <span>New File</span>
                           </li>
                           <li className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700'>
                              <span>New Folder</span>
                           </li>
                        </>
                     )}
                     <li className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700'>
                        <span>Delete</span>
                     </li>
                  </ul>
               </div>
               <div className='tree-context-menu-overlay fixed inset-0'></div>
            </>
         )}
      </>
   )
}
