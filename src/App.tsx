import { FileTreeCtxProvider } from 'src/FileTreeContext/FileTreeContext'
import FileTree from 'src/components/FileTree/FileTree'
import FileContent from 'src/components/FileContent/FileContent'

export default function App() {
   return (
      <FileTreeCtxProvider>
         <FileTree />
         <FileContent />
      </FileTreeCtxProvider>
   )
}
