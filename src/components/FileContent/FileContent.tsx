import { useStateSelector } from '../../FileTreeContext/useTreeCtxState'

export default function FileContent() {
   const selectedFile = useStateSelector((state) => state.FocusedNode.item?.name)
   return (
      <section
         className='file-content relative h-[100vh] left-64 flex items-center justify-center'
         style={{ width: 'calc(100% - 16rem)' }}
      >
         <h3>{selectedFile}</h3>
      </section>
   )
}
