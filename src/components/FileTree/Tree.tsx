import type { File, Folder } from '../../FileTreeContext/Ctx.type'
import TreeFile from './TreeFile/TreeFile'
import TreeFolder from './TreeFolder/TreeFolder'

export default function Tree({ item }: { item: File | Folder }) {
   if (!item) return null
   return (
      <>
         <li style={{ paddingLeft: '20px' }}>
            {item.isFolder && <TreeFolder folder={item as Folder} />}
            {!item.isFolder && <TreeFile file={item} />}
         </li>
      </>
   )
}
