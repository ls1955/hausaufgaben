import {useContext} from 'react';
import {StatusBar, View} from 'react-native';
import ImageView from 'react-native-image-viewing';

import {FoldersContext} from '../contexts/FoldersContext';

// The screen that shows media one at a time.
export default function MediaScreen({navigation, route: {params}}) {
  const {index, folderTitle} = params;
  const mediaUris = useContext(FoldersContext)[folderTitle].mediaUris;

  const handleGoBack = () => navigation.goBack();

  return (
    <View>
      {/* Have to show the status bar at here to avoid weird visual behaviour */}
      {/* TOFIX: Investigate react-native-image-viewing */}
      <StatusBar hidden={false} />
      <ImageView
        images={mediaUris.map(uri => ({uri}))}
        imageIndex={index}
        visible={true}
        onRequestClose={handleGoBack}
        HeaderComponent={() => null}
      />
    </View>
  );
}
