import type { File, Folder } from 'src/FileTreeContext/Ctx.type'
import { Else, If, Then } from 'classic-react-components'
import AppLi from 'src/components/AppComponents/AppLi'
import TreeFile from './TreeFile/TreeFile'
import TreeFolder from './TreeFolder/TreeFolder'

export default function Tree({ item }: { item: File | Folder }) {
   if (!item) return null
   return (
      <>
         <AppLi className={`px-0 py-0 ${item.parentId != 'root' ? 'pl-4' : ''}`}>
            <If condition={item.isFolder}>
               <Then>
                  <TreeFolder folder={item as Folder} />
               </Then>
               <Else>
                  <TreeFile file={item} />
               </Else>
            </If>
         </AppLi>
      </>
   )
}
