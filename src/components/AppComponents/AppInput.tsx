import { ComponentProps, ElementRef, RefObject } from 'react'

interface InputProps extends ComponentProps<'input'> {
   inputRef: RefObject<ElementRef<'input'>>
}
export default function AppInput(props: InputProps) {
   const { inputRef } = props

   return <input placeholder='new file' ref={inputRef} {...props} />
}
