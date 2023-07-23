import type { File, Folder } from '../../FileTreeContext/Ctx.type'
import TreeFile from './TreeFile/TreeFile'
import TreeFolder from './TreeFolder/TreeFolder'

export default function Tree({ item }: { item: File | Folder }) {
   if (!item) return null
   return (
      <>
         <li className={item.id != 'root' ? 'pl-4' : ''}>
            {item.isFolder && <TreeFolder folder={item as Folder} />}
            {!item.isFolder && <TreeFile file={item} />}
         </li>
      </>
   )
}
