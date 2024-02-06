import {useContext, useEffect} from 'react';
import {View} from 'react-native';

import {FoldersContext} from '../contexts/folders-context';
import Cover from './cover';
import TitleText from './title-text';
import Thumbnail from './thumbnail';
import {getThumbnailUri} from '../../utils';

// A component that represent a folder cover.
export default function Folder({title, navigation}) {
  const {folders, setFolders} = useContext(FoldersContext);
  const {count, mediaUris} = folders[title];
  const thumbnailUri = mediaUris[0];

  useEffect(() => {
    const loadThumbnail = async () => {
      if (mediaUris.length >= 1) return;

      const uri = await getThumbnailUri({folderTitle: title});
      setFolders(prev => ({...prev, [title]: {mediaUris: [uri], count}}));
    };
    loadThumbnail();
  }, []);

  const handleNav = () => navigation.navigate('FolderContents', {title});

  return (
    <View
      style={{
        alignItems: 'center',
        marginBottom: 20,
        marginRight: 15,
        width: '28%',
      }}>
      <Cover onNav={handleNav}>
        {thumbnailUri && <Thumbnail source={{uri: thumbnailUri}} />}
      </Cover>
      <TitleText>{title}</TitleText>
      <TitleText style={{fontSize: 12, marginTop: 2}}>{count}</TitleText>
    </View>
  );
}
