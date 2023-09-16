import type { ComponentProps } from 'react'

export default function AppLi(props: ComponentProps<'li'>) {
   const { className, children, ...rest } = props

   return (
      <li className={`px-1 py-1 ${className}`} {...rest}>
         {children}
      </li>
   )
}
