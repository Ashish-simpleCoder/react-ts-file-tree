import { FileTreeCtxProvider } from './FileTreeContext/FileTreeContext'
import FileTree from './components/FileTree/FileTree'

export default function App() {
   return (
      <div>
         <FileTreeCtxProvider>
            <FileTree />
         </FileTreeCtxProvider>
      </div>
   )
}
