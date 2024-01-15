import {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import FastImage from 'react-native-fast-image';

import {FoldersContext} from '../../contexts/FoldersContext';
import Cover from './Cover';
import {abbreviate, getThumbnailUri} from '../../utils';

// A component that represent a folder cover.
export default function Folder({title, navigation}) {
  const [_, setRerender] = useState(false);
  const folders = useContext(FoldersContext);
  const {mediaUris, count} = folders[title];

  useEffect(() => {
    const lazyLoadThumbNail = async () => {
      if (mediaUris.length > 0) return;

      const thumbnailUri = await getThumbnailUri({folderTitle: title});

      folders[title].mediaUris = [thumbnailUri];
      setRerender(true);
    };
    lazyLoadThumbNail();
  }, []);

  const handleNav = () => navigation.navigate('FolderContents', {title});

  return (
    <View style={{alignItems: 'center', marginBottom: 20, marginRight: 15}}>
      <Cover onNav={handleNav}>
        {mediaUris.length >= 1 && (
          <FastImage source={{uri: mediaUris[0]}} style={styles.image} />
        )}
      </Cover>
      <Text style={{fontWeight: 'bold'}}>{abbreviate({title})}</Text>
      <Text style={{fontSize: 12, marginTop: 2}}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {width: 100, height: 100, resizeMode: 'cover'},
});
