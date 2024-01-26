import {useContext} from 'react';
import {StyleSheet, View} from 'react-native';

import FastImage from 'react-native-fast-image';

import {FoldersContext} from '../contexts/FoldersContext';
import Cover from './Cover';
import TitleText from './TitleText';
import useThumbnailURI from '../hooks/useThumbnailURI';

// A component that represent a folder cover.
export default function Folder({title, navigation}) {
  const folders = useContext(FoldersContext);
  const {count} = folders[title];
  const {thumbnailUri} = useThumbnailURI(title);

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
        {thumbnailUri && (
          <FastImage source={{uri: thumbnailUri}} style={styles.image} />
        )}
      </Cover>
      <TitleText>{title}</TitleText>
      <TitleText style={{fontSize: 12, marginTop: 2}}>{count}</TitleText>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {width: 100, height: 100, resizeMode: 'cover'},
});
