import {Image, ScrollView, TouchableOpacity} from 'react-native';

// The photos inside a Folder component. This component will be render when a folder has been clicked.
export default function Photos({uris, status, onStatus}) {
  const handleStatus = index => () => {
    return onStatus({...status, state: 'inPhoto', selectedPhotoIndex: index});
  };

  const photos = uris.map((uri, i) => {
    return (
      <TouchableOpacity
        key={i}
        style={{width: '25%'}}
        onPress={handleStatus(i)}>
        <Image
          style={{width: '100%', minHeight: 100}}
          source={{uri}}
          onError={e => console.error(e.nativeEvent.error)}
        />
      </TouchableOpacity>
    );
  });

  return (
    <ScrollView
      contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {photos}
    </ScrollView>
  );
}
