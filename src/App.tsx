import { FileTreeCtxProvider } from './FileTreeContext/FileTreeContext'
import FileTree from './components/FileTree/FileTree'

export default function App() {
   return (
      <div>
         <h1>React-Typescript File Tree.</h1>
         <FileTreeCtxProvider>
            <FileTree />
         </FileTreeCtxProvider>
      </div>
   )
}
