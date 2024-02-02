import {useContext} from 'react';
import {View} from 'react-native';

import {FoldersContext} from '../contexts/folders-context';
import useThumbnailUri from '../hooks/useThumbnailUri';
import Cover from './cover';
import TitleText from './title-text';
import Thumbnail from './thumbnail';

// A component that represent a folder cover.
export default function Folder({title, navigation}) {
  const folders = useContext(FoldersContext);
  const {count} = folders[title];
  const {thumbnailUri} = useThumbnailUri(title);

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
