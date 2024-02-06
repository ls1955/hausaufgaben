import {Dispatch, SetStateAction, createContext} from 'react';

export interface Folders {
  [folder: string]: Folder;
}

export interface Folder {
  count: number;
  mediaUris: string[];
}

interface FoldersContext {
  folders: Folders;
  setFolders: Dispatch<SetStateAction<Folders>>;
}

export const FoldersContext = createContext<FoldersContext>({
  folders: {},
  setFolders: () => {},
});

// NOTE:
// The count is kept, although it seems like duplicate information from mediaUris.length.
// This is because in actuality, the app will LAZILY load the mediaUris, hence for folder
// that have not been accessed before, mediaUris.length will be 0, which is not accurate.
