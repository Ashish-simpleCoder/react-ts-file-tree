import { ComponentProps, ElementRef, RefObject } from 'react'

interface ButtonProps extends ComponentProps<'button'> {
   buttonRef?: RefObject<ElementRef<'button'>>
}

export default function AppButton(props: ButtonProps) {
   const { buttonRef, className = '', children, ...rest } = props

   return (
      <button ref={buttonRef} className={`${className}`} type="button" {...rest}>
         {children}
      </button>
   )
}
