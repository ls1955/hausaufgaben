import { createContext } from "react";

// {folderTitle => {count, mediaUris: [] of uri}}
// NOTE: 
// The count is kept, although it seems like duplicate information that could be obtain via length
// of mediaUris. This is because in actuality, the app will LAZILY load the mediaUris, hence for folder
// that have not been accessed, the length will be 0, which is not accurate.
export const FoldersContext = createContext({});
