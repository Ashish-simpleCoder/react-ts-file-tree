import { Prettify } from "src/types/types";

export type ItemType = { id: string, name: string, isFolder: boolean, childrenIds: string[], parentId?: string }
export type File = { id: string, name: string, isFolder: boolean, parentId: string,isRenaming: boolean, newName:string }
export type Folder = Prettify<File & { childrenIds: string[] }>
export type TFocusedNode = { item: File | Folder | null; target: EventTarget | null }

export type FileTreeType = Map<string, File | Folder>