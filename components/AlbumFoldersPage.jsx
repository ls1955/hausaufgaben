import {SafeAreaView, StyleSheet, View} from 'react-native';

import Folder from './Folder';

// A page that shows folders inside an album.
export default function AlbumFoldersPage({folderTitles, status, onStatus}) {
  const folders = folderTitles.map((title, i) => {
    return (
      <Folder
        key={i}
        title={title}
        status={status}
        onStatus={onStatus}
        isFromAlbum={true}
      />
    );
  });

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.galleryLayout}>{folders}</View>
    </SafeAreaView>
  );
}

// This is an Ad-hoc style sheet, in future will likely be replace by FlatList
const styles = StyleSheet.create({
  // used by homepage and album
  galleryLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Kinda a hack to replace "flex-between", by applying marginRight +15 to every children,
    // then remove the marginRight of last children
    marginRight: -15,
  },
});
