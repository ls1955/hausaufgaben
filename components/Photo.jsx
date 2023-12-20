import ImageView from 'react-native-image-viewing';

// A component that takes a lits of uris, and show one photo at the time. Support swiping and zooming.
export default function Photo({uris, status, onStatus, fromAlbum = false}) {
  const nextState = fromAlbum ? 'inFolderFromAlbum' : 'inFolder';

  return (
    <ImageView
      images={uris.map(uri => ({uri}))}
      imageIndex={status['selectedPhotoIndex']}
      visible={true}
      onRequestClose={() => onStatus({...status, state: nextState})}
      HeaderComponent={() => null}
    />
  );
}
