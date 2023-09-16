import type { ElementRef, ReactNode, RefObject } from 'react'
import useKeyListener from '../../hooks/useKeyListener'
import { useEventListener } from '../../hooks/useEventListener'

interface AppContextMenuProps {
   children?: ReactNode
   contextMenuRef: RefObject<ElementRef<'div'>>
   containerClassName?: string
   ulClassName?: string
   liClassName?: string
   onClose?: () => void
}

export default function AppContextMenu(props: AppContextMenuProps) {
   const { children, contextMenuRef, containerClassName = '', ulClassName = '', onClose = () => {} } = props

   useKeyListener('keydown', ['Escape'], onClose)
   useEventListener(document, 'click', (e) => {
      if (!contextMenuRef.current?.contains(e.target as Node)) {
         onClose()
      }
   })

   return (
      <div className={`app-context-menu ${containerClassName}`} ref={contextMenuRef}>
         <ul className={`${ulClassName}`}>{children}</ul>
      </div>
   )
}
