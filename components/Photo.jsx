import Gallery from 'react-native-image-gallery';

// A component that takes a lits of uris, and show one photo at the time. Support swiping and zooming.
export default function Photo({uris, status, onStatus, isFromAlbum}) {
  const nextState = isFromAlbum ? 'inFolderFromAlbum' : 'inFolder';

  const images = uris.map(uri => ({source: {uri}}));

  return (
    <Gallery
      style={{flex: 1, backgroundColor: 'black'}}
      images={images}
      initialPage={status['selectedPhotoIndex']}
      onRequestClose={() => onStatus({...status, state: nextState})}
    />
  );
}
