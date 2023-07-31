import { FileTreeCtxProvider } from './FileTreeContext/FileTreeContext'
import FileTree from './components/FileTree/FileTree'
import FileContent from './components/FileContent/FileContent'

export default function App() {
   return (
      <FileTreeCtxProvider>
         <FileTree />
         <FileContent />
      </FileTreeCtxProvider>
   )
}
