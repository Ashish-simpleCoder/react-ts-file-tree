import type { Folder } from '../../FileTreeContext/Ctx.type'
import type { ElementRef } from 'react'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useContextActions, useStateSelector, useStateDispatch } from '../../FileTreeContext/useTreeCtxState'
import { useEventListener } from '../../hooks/useEventListener'
import AppInput from '../AppComponents/AppInput'

export default function UpdateItemNameInput__Portal() {
   const focusedNode = useStateSelector((state) => state.FocusedNode.item)
   const treeContainerRef = useStateSelector((state) => state.FilesListRef, false)
   const focusedNodeTarget = useStateSelector((state) => state.FocusedNode.target)

   const fileInputRef = useRef<HTMLInputElement>(null)
   const elementRef = useRef<ElementRef<'form'>>(null)
   const portalContainer = focusedNodeTarget

   if (!portalContainer) return null

   const PortalElement = () => {
      const parent: Folder = useStateSelector(
         (state) => state.Files.get(state.Files.get(focusedNode?.id ?? '')?.parentId ?? '') as Folder,
         false
      )
      const Files = useStateSelector((state) => state.Files, false)
      const TreeDispatch = useStateDispatch()
      const { hideFileInput, highlightFileOrFolder } = useContextActions()
      const [newName, setName] = useState(focusedNode?.name ?? '')
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
         if (!focusedNode) return
         TreeDispatch((state) => {
            const item = state.Files.get(focusedNode?.id ?? '')
            if (!item) return state
            if (!error) {
               item.name = newName
            }
            item.isRenaming = false
            state.isRenamingItem = false
            return state
         })
         highlightFileOrFolder(focusedNode.id)
         hideFileInput()
      }

      useEventListener(treeContainerRef.current, 'click', (e) => {
         if (elementRef.current?.contains(e.target as Node)) return
         // if space key pressed and inputElement is focused then don't trigger save event
         if (document.activeElement == fileInputRef.current) return
         updateItemName()

         // disabling this code due forgot why I added it
         // if ((e.target as HTMLElement).nodeName == 'BUTTON') return
      })
      // save on contexmenu
      useEventListener(treeContainerRef.current, 'contextmenu', () => {
         updateItemName()
      })

      // we can also use treeContainerRef.current instead of document
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
               <AppInput
                  className='z-10 h-5 outline-none focus:border leading-5 w-full'
                  placeholder='new file'
                  value={newName}
                  onChange={(e) => handleChange(e.target.value)}
                  inputRef={fileInputRef}
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
