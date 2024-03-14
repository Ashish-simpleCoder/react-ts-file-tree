import { ComponentProps, ElementRef, RefObject } from 'react'
import { cn } from 'src/lib/cn-merge'

interface ButtonProps extends ComponentProps<'button'> {
   buttonRef?: RefObject<ElementRef<'button'>>
}

export default function AppButton(props: ButtonProps) {
   const { buttonRef, className = '', children, ...rest } = props

   return (
      <button ref={buttonRef} className={cn("text-lg", className)} type="button" {...rest}>
         {children}
      </button>
   )
}
