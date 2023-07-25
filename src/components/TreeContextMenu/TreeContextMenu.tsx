import { flushSync } from 'react-dom'
import { useEventListener } from '../../hooks/useEventListener'
import { useContextActions, useTreeCtxStateSelector, useTreeStateDispatch } from '../../FileTreeContext/useTreeCtxState'
import useKeyListener from '../../hooks/useKeyListener'

export default function TreeContextMenu() {
   const FocusedItem = useTreeCtxStateSelector((state) => state.FocusedTreeItem.item)
   const Files = useTreeCtxStateSelector((state) => state.Files, false)
   const showTreeContextMenu = useTreeCtxStateSelector((state) => state.showTreeContextMenu)
   const { deleteFile, deleteFolder } = useContextActions()
   const TreeActionDispatch = useTreeStateDispatch()

   const closeContextMenu = () => {
      TreeActionDispatch((state) => {
         state.showTreeContextMenu = false
         return state
      })
   }

   useEventListener(window, 'contextmenu', (e) => {
      e.preventDefault()

      TreeActionDispatch((state) => {
         const item = state.Files.get((e.target as HTMLButtonElement).getAttribute('data-id')!)!

         // when context is opened on File-Tree container not on files
         if (!item) {
            // @ts-ignore
            state.FocusedTreeItem.target?.classList.remove("bg-black")
            state.FocusedTreeItem = { item: state.Files.get("root")!, target: document.querySelector("button[data-id=root]") }
            return state
         }
         if (state.FocusedTreeItem.item?.id != item.id) {
            // @ts-ignore
            e.target.classList.add('bg-black')
            // @ts-ignore
            state.FocusedTreeItem.target?.classList.remove('bg-black')
         } else {
            // @ts-ignore
            e.target.classList.add('bg-black')
         }
         state.FocusedTreeItem.item = item
         state.FocusedTreeItem.target = e.target
         return state
      })

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
         const contextMenu = document.querySelector('#tree-context-menu')

         // @ts-ignore
         if (contextMenu?.contains(e.target)) return
         TreeActionDispatch((state) => {
            state.showTreeContextMenu = false
            return state
         })

         // @ts-ignore
         // if (!e.target.classList.contains('tree-context-menu-overlay')) return
         // TreeActionDispatch((state) => {
         //    state.showTreeContextMenu = false
         //    return state
         // })
      },
      {},
      showTreeContextMenu
   )

   useKeyListener("keydown", ["Delete"], (e) => {
      const id = (e.target as HTMLElement).getAttribute("data-id")
      if (!id) return

      const isFolder = Files.get(id)?.isFolder
      if (isFolder) return deleteFolder(id)

      deleteFile(id)
   }, { shouldAddEvent: true })

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
                           <li
                              className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700 flex justify-between'
                              onClick={() => {
                                 deleteFolder(FocusedItem.id)
                                 closeContextMenu()
                              }}
                           >
                              <span>Delete</span>
                              <span>del</span>
                           </li>
                        </>
                     )}
                     {!FocusedItem?.isFolder && (
                        <li
                           className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700 flex justify-between'
                           onClick={() => {
                              FocusedItem && deleteFile(FocusedItem.id)
                              closeContextMenu
                           }}
                        >
                           <span>Delete</span>
                           <span>del</span>
                        </li>
                     )}
                  </ul>
               </div>
               {/* <div className='tree-context-menu-overlay fixed inset-0'></div> */}
            </>
         )}
      </>
   )
}
