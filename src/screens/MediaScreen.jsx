import {useContext} from 'react';
import ImageView from 'react-native-image-viewing';

import {FoldersContext} from '../contexts/FoldersContext';

// The screen that shows media one at a time.
export default function MediaScreen({navigation, route: {params}}) {
  const {index, folderTitle} = params;
  const mediaUris = useContext(FoldersContext)[folderTitle].mediaUris;

  const handleGoBack = () => navigation.goBack();

  return (
    <ImageView
      images={mediaUris.map(uri => ({uri}))}
      imageIndex={index}
      visible={true}
      onRequestClose={handleGoBack}
      HeaderComponent={() => null}
    />
  );
}
