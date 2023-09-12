import { ElementRef, useRef } from 'react'
import { flushSync } from 'react-dom'
import { useEventListener } from '../../hooks/useEventListener'
import { useContextActions, useStateSelector, useStateDispatch } from '../../FileTreeContext/useTreeCtxState'
import useKeyListener from '../../hooks/useKeyListener'

export default function TreeContextMenu() {
   const ctxMenuRef = useRef<ElementRef<'div'>>(null)
   const FocusedItem = useStateSelector((state) => state.FocusedTreeItem.item)
   const Files = useStateSelector((state) => state.Files, false)
   const showTreeContextMenu = useStateSelector((state) => state.showTreeContextMenu)
   const treeContainerRef = useStateSelector((state) => state.FilesListRef, false)
   const { deleteFile, deleteFolder, expandFolder, toggleFolderInputVisibility, toggleFileInputVisibility } =
      useContextActions()
   const dispatch = useStateDispatch()

   const closeContextMenu = () => {
      dispatch((state) => {
         state.showTreeContextMenu = false
         return state
      })
   }
   const handleRename = () => {
      dispatch((state) => {
         const itemId = FocusedItem?.id ?? ''
         const item = state.Files.get(itemId)
         if (item) {
            item.isRenaming = true
         }
         state.shouldShowFileInput = true
         state.isRenamingItem = true
         return state
      })
      closeContextMenu()
   }

   useEventListener(treeContainerRef.current, 'contextmenu', (e) => {
      e.preventDefault()

      flushSync(() => {
         dispatch((state) => {
            const item = state.Files.get((e.target as HTMLButtonElement).getAttribute('data-id')!)!

            if (!item) {
               state.HighlightedItem.id = 'root'
               state.FocusedTreeItem = {
                  item: state.Files.get('root')!,
                  target: document.querySelector('button[data-id=root]'),
               }
            } else {
               state.HighlightedItem.id = item.id
               state.FocusedTreeItem.item = item
               state.FocusedTreeItem.target = e.target
            }
            state.showTreeContextMenu = true
            return state
         })
      })

      const menu = ctxMenuRef.current
      if (!menu) return
      const menuHeight = menu.clientHeight ?? 70
      const extraHeight = 20
      let left = e.clientX + 5
      let top = e.clientY

      // to prevent going outside of the tree-container
      if (window.innerWidth - e.clientX < 100) {
         left = window.innerWidth - 100
      }
      // to prevent going outside of the tree-container
      if (window.innerHeight - e.clientY < menuHeight) {
         top = window.innerHeight - menuHeight - extraHeight
      }

      menu.style.left = left + 'px'
      menu.style.top = top + 'px'
   })

   useEventListener(
      document,
      'click',
      (e) => {
         const contextMenu = ctxMenuRef.current
         if (!contextMenu?.contains(e.target as Node)) {
            closeContextMenu()
         }
      },
      {},
      showTreeContextMenu
   )

   useKeyListener(
      'keydown',
      ['Delete'],
      (e) => {
         const id = (e.target as HTMLElement).getAttribute('data-id')
         if (!id) return

         const isFolder = Files.get(id)?.isFolder
         if (isFolder) return deleteFolder(id)

         deleteFile(id)
      },
      { shouldAddEvent: true }
   )

   useKeyListener(
      'keydown',
      ['F2'],
      () => {
         handleRename()
         expandFolder(FocusedItem?.id)
      },
      { shouldAddEvent: true, preventDefault: true }
   )

   useKeyListener('keydown', ['Escape'], closeContextMenu, { shouldAddEvent: showTreeContextMenu })

   return (
      <>
         {showTreeContextMenu && (
            <>
               <div
                  id='tree-context-menu'
                  className='w-64 rounded-sm border border-gray-700 fixed left-10 bg-slate-800 z-10'
                  ref={ctxMenuRef}
               >
                  <ul>
                     {FocusedItem?.isFolder && (
                        <>
                           <li
                              className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700'
                              onClick={() => {
                                 toggleFileInputVisibility()
                                 closeContextMenu()
                              }}
                           >
                              <span>New File</span>
                           </li>
                           <li
                              className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700'
                              onClick={() => {
                                 toggleFolderInputVisibility()
                                 closeContextMenu()
                              }}
                           >
                              <span>New Folder</span>
                           </li>
                           {FocusedItem.id != 'root' && (
                              <>
                                 <li
                                    className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700 flex justify-between'
                                    onClick={handleRename}
                                 >
                                    <span>Rename</span>
                                    <span>F2</span>
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
                        </>
                     )}
                     {!FocusedItem?.isFolder && (
                        <>
                           <li
                              className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700 flex justify-between'
                              onClick={handleRename}
                           >
                              <span>Rename</span>
                              <span>F2</span>
                           </li>
                           <li
                              className='cursor-pointer p-1 border border-x-0 border-t-0 border-gray-700 hover:bg-purple-700 flex justify-between'
                              onClick={() => {
                                 FocusedItem && deleteFile(FocusedItem.id)
                                 closeContextMenu()
                              }}
                           >
                              <span>Delete</span>
                              <span>del</span>
                           </li>
                        </>
                     )}
                  </ul>
               </div>
               {/* <div className='tree-context-menu-overlay fixed inset-0'></div> */}
            </>
         )}
      </>
   )
}
