import { useEffect } from 'react'
import type { Folder } from '../../FileTreeContext/Ctx.type'
import { useTreeCtxStateSelector } from '../../FileTreeContext/useTreeCtxState'
import TreeInputContainer from '../TreeInputContainer/TreeInputContainer'
import Tree from './Tree'

export default function FileTree() {
   const TreeContainerRef = useTreeCtxStateSelector((state) => state.FilesListRef, false)
   const RootNode = useTreeCtxStateSelector((state) => state.Files.get('root') as Folder)
   const Files = useTreeCtxStateSelector((state) => state.Files)
   // console.log(FocusedItem)

   console.log({ Files })
   // useEffect(() => {
   //    console.log('deleteFile')
   // }, [deleteFile])

   useEffect(() => {
      // deleteFile('5')
      // let i = setTimeout(() => deleteFolder('0'), 500)
      // return () => clearTimeout(i)
   }, [])

   return (
      <section>
         <TreeInputContainer />
         <ul ref={TreeContainerRef} className='w-[300px]'>
            {RootNode && <Tree item={RootNode} />}
         </ul>
      </section>
   )
}
