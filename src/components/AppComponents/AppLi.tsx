import type { ComponentProps, ElementRef, RefObject } from 'react'

interface LiProps extends ComponentProps<'li'> {
   liRef?: RefObject<ElementRef<'li'>>
}

export default function AppLi(props: LiProps) {
   const { className, children,liRef, ...rest } = props

   return (
      <li className={`px-1 py-1 ${className}`} ref={liRef} {...rest}>
         {children}
      </li>
   )
}
