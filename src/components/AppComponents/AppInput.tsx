import { ComponentProps, ElementRef, RefObject } from 'react'

interface InputProps extends ComponentProps<'input'> {
   inputRef?: RefObject<ElementRef<'input'>>
}
export default function AppInput(props: InputProps) {
   const { inputRef, className, ...rest } = props

   return <input ref={inputRef} className={`${className}`} {...rest} />
}
