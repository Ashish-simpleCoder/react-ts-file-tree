import { useRef } from 'react'

export default function useSyncedRef<T>(value: T) {
   const ref = useRef(value)
   ref.current = value
   return ref.current
}
