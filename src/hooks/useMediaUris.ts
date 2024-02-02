import {useContext, useEffect, useState} from 'react';

import {FoldersContext} from '../contexts/folders-context';
import {getMediaUris} from '../../utils';

// Returns folder's media URIs. Lazy load and mutate FoldersContext if all image hasn't load.
export default function useMediaUris(folder: string): {
  mediaUris: string[];
  actualSize: number;
} {
  const folders = useContext(FoldersContext);
  const {mediaUris, count} = folders[folder];
  const [result, setResult] = useState(mediaUris);

  useEffect(() => {
    const fetchMediaUris = async () => {
      if (mediaUris.length === count) return;

      const newData = await getMediaUris({folderTitle: folder});
      folders[folder].mediaUris = newData;
      setResult(newData);
    };
    fetchMediaUris();
  }, []);

  return {mediaUris: result, actualSize: count};
}
