import {createContext} from 'react';

interface FoldersContext {
  [folder: string]: {count: number; mediaUris: string[]};
}

export const FoldersContext = createContext<FoldersContext>({});

// NOTE: 
// The count is kept, although it seems like duplicate information from mediaUris.length.
// This is because in actuality, the app will LAZILY load the mediaUris, hence for folder
// that have not been accessed before, mediaUris.length will be 0, which is not accurate.
