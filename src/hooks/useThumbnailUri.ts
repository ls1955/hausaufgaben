import {useContext, useEffect, useState} from 'react';

import {FoldersContext} from '../contexts/FoldersContext';
import {getThumbnailUri} from '../../utils';

// Returns folder's thumbnailUri. Lazy load and mutate FoldersContext if it does not exist.
export default function useThumbnailUri(folder: string): {
  thumbnailUri: string | undefined;
} {
  const folders = useContext(FoldersContext);
  const mediaURIs = folders[folder].mediaUris;
  const [thumbnailUri, setThumbnailUri] = useState<string | undefined>(
    mediaURIs[0],
  );

  useEffect(() => {
    const loadUri = async () => {
      if (thumbnailUri) return;

      const uri = await getThumbnailUri({folderTitle: folder});

      folders[folder].mediaUris = [uri];
      setThumbnailUri(uri);
    };
    loadUri();
  }, []);

  return {thumbnailUri};
}
