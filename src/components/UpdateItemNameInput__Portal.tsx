import { ElementRef, RefObject, useRef, useState } from 'react'
import { useTreeCtxStateSelector } from '../FileTreeContext/useTreeCtxState'
import { useEventListener } from '../hooks/useEventListener'
import { createPortal } from 'react-dom'

export default function UpdateItemNameInput__Portal({
   fileInputRef,
   updateItemName,
}: {
   fileInputRef: RefObject<HTMLInputElement>
   updateItemName: () => void
}) {
   const FocusedItem = useTreeCtxStateSelector((state) => state.FocusedTreeItem.item)
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const FocusedItemTarget = useTreeCtxStateSelector((state) => state.FocusedTreeItem.target)

   const portalContainer = FocusedItemTarget
   const elementRef = useRef<ElementRef<'form'>>(null)

   useEventListener(TreeContainerRef.current, 'click', (e) => {
      if (elementRef.current?.contains(e.target as Node)) return
      // if space key pressed and inputElement is focused then don't trigger save event
      if (document.activeElement == fileInputRef.current) return
      updateItemName()

      // disabling this code due forgot why I added it
      // if ((e.target as HTMLElement).nodeName == 'BUTTON') return
   })

   if (!portalContainer) return null

   const PortalElement = () => {
      const [newName, setName] = useState(FocusedItem?.name ?? '')

      return (
         <form
            onSubmit={(e) => {
               e.preventDefault()
               updateItemName()
            }}
            className='w-auto'
            ref={elementRef}
         >
            <span>
               <input
                  className='z-10 h-7 outline-none focus:border leading-5 w-full'
                  placeholder='new file'
                  value={newName}
                  onChange={(e) => setName(e.target.value)}
                  ref={fileInputRef}
                  autoFocus
               />
            </span>
         </form>
      )
   }
   // @ts-ignore
   return createPortal(<PortalElement />, portalContainer)
}
