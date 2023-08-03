import { ElementRef, RefObject, useRef, useState } from 'react'
import { useContextActions, useTreeCtxStateSelector, useTreeStateDispatch } from '../FileTreeContext/useTreeCtxState'
import { useEventListener } from '../hooks/useEventListener'
import { createPortal } from 'react-dom'
import { Folder } from '../FileTreeContext/Ctx.type'

export default function UpdateItemNameInput__Portal({ fileInputRef }: { fileInputRef: RefObject<HTMLInputElement> }) {
   const FocusedItem = useTreeCtxStateSelector((state) => state.FocusedTreeItem.item)
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const FocusedItemTarget = useTreeCtxStateSelector((state) => state.FocusedTreeItem.target)

   const portalContainer = FocusedItemTarget
   const elementRef = useRef<ElementRef<'form'>>(null)

   if (!portalContainer) return null

   const PortalElement = () => {
      const parent: Folder = useTreeCtxStateSelector(
         (state) => state.Files.get(state.Files.get(FocusedItem?.id ?? '')?.parentId ?? '') as Folder,
         false
      )
      const Files = useTreeCtxStateSelector((state) => state.Files, false)
      const TreeDispatch = useTreeStateDispatch()
      const { hideFileInput, highlightFileOrFolder } = useContextActions()
      const [newName, setName] = useState(FocusedItem?.name ?? '')
      const [error, setError] = useState<string | null>(null)

      const handleChange = (value: string) => {
         setName(value)
         setError(null)
         if (!value) {
            setError('Pls input file name')
            return
         }
         // run loop for the children
         parent.childrenIds.forEach((id) => {
            if (value == Files.get(id)?.name) {
               setError('File already exists')
               return
            }
         })
      }

      const updateItemName = () => {
         if (!FocusedItem) return
         TreeDispatch((state) => {
            const item = state.Files.get(FocusedItem?.id ?? '')
            if (!item) return state
            if (!error) {
               item.name = newName
            }
            item.isRenaming = false
            state.isRenamingItem = false
            return state
         })
         highlightFileOrFolder(FocusedItem.id)
         hideFileInput()
      }

      useEventListener(TreeContainerRef.current, 'click', (e) => {
         if (elementRef.current?.contains(e.target as Node)) return
         // if space key pressed and inputElement is focused then don't trigger save event
         if (document.activeElement == fileInputRef.current) return
         updateItemName()

         // disabling this code due forgot why I added it
         // if ((e.target as HTMLElement).nodeName == 'BUTTON') return
      })
      // save on contexmenu
      useEventListener(TreeContainerRef.current, 'contextmenu', () => {
         updateItemName()
      })

      // we can also use TreeContainerRef.current instead of document
      useEventListener(document, 'keydown', (e) => {
         if (e.key != 'Escape') return
         updateItemName()
      })

      return (
         <form
            onSubmit={(e) => {
               e.preventDefault()
               if (error) return
               updateItemName()
            }}
            className='w-auto h-5 relative'
            ref={elementRef}
         >
            <span>
               <input
                  className='z-10 h-5 outline-none focus:border leading-5 w-full'
                  placeholder='new file'
                  value={newName}
                  onChange={(e) => handleChange(e.target.value)}
                  ref={fileInputRef}
                  autoFocus
               />
            </span>
            {error && <span className='absolute w-full mt-1 top-full left-0 bg-red-500 text-black'>{error}</span>}
         </form>
      )
   }
   // @ts-ignore
   return createPortal(<PortalElement />, portalContainer)
}
