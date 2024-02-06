import {useContext} from 'react';
import ImageView from 'react-native-image-viewing';

import {FoldersContext} from '../contexts/folders-context';

// The screen that shows media one at a time.
export default function MediaScreen({navigation, route: {params}}) {
  const {index, folderTitle} = params;
  const {folders} = useContext(FoldersContext);
  const {mediaUris} = folders[folderTitle];

  const handleGoBack = () => navigation.goBack();

  return (
    <ImageView
      images={mediaUris.map(uri => ({uri}))}
      imageIndex={index}
      visible
      onRequestClose={handleGoBack}
      HeaderComponent={() => null}
      presentationStyle="overFullScreen"
    />
  );
}
