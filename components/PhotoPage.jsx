import {SafeAreaView} from 'react-native';

import Photo from './Photo';

// A page that shows photos one at a time.
export default function PhotoPage({uris, status, onStatus, isFromAlbum}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Photo
        uris={uris}
        status={status}
        onStatus={onStatus}
        fromAlbum={isFromAlbum}
      />
    </SafeAreaView>
  );
}
