import type { File, Folder } from '../../FileTreeContext/Ctx.type'
import AppLi from '../AppComponents/AppLi'
import TreeFile from './TreeFile/TreeFile'
import TreeFolder from './TreeFolder/TreeFolder'

export default function Tree({ item }: { item: File | Folder }) {
   if (!item) return null
   return (
      <>
         <AppLi className={`px-0 py-0 ${item.parentId != 'root' ? 'pl-4' : ''}`}>
            {item.isFolder && <TreeFolder folder={item as Folder} />}
            {!item.isFolder && <TreeFile file={item} />}
         </AppLi>
      </>
   )
}
