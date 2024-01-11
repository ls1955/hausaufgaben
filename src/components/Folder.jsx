import {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

import {FoldersContext} from '../../contexts/FoldersContext';
import Cover from './Cover';
import {abbreviate, getThumbnailUri} from '../../utils';

// A component that represent a folder cover.
export default function Folder({title, navigation}) {
  const [_, setRerender] = useState(false);
  const {mediaUris, count} = useContext(FoldersContext)[title];

  // NOTE: due to mutation of mediaUris, the thumbnail will be loaded twice, causing same image
  // to be pushed into the mediaUris, thus prevent loading of rest of folder content later on.
  // Should NOT be an issue during production.
  useEffect(() => {
    const lazyLoadThumbNail = async () => {
      if (mediaUris.length > 0) return;

      const thumbnailUri = await getThumbnailUri({folderTitle: title});
      mediaUris.push(thumbnailUri);
      setRerender(true);
    };
    lazyLoadThumbNail();
  }, []);

  const handleNav = () => navigation.navigate('FolderContents', {title});

  return (
    <View style={{alignItems: 'center', marginBottom: 20, marginRight: 15}}>
      <Cover onNav={handleNav}>
        {mediaUris.length >= 1 && (
          <Image source={{uri: mediaUris[0]}} style={styles.image} />
        )}
      </Cover>
      <Text style={{fontWeight: 'bold'}}>{abbreviate({title})}</Text>
      <Text style={{fontSize: 12, marginTop: 2}}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {width: 108, height: 108, resizeMode: 'cover'},
});
