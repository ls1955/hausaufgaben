import {Image, ScrollView} from 'react-native';

// The photos inside a Folder component. This component will be render when a folder has been clicked.
export default function Photos({uris}) {
  // TODO: Exit back to Folder when clicked back button

  const photos = uris.map((uri, i) => {
    return (
      <Image
        key={i}
        style={{width: '25%', minHeight: 100}}
        source={{uri}}
        onError={e => console.error(e.nativeEvent.error)}
      />
    );
  });

  return (
    <ScrollView
      contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {photos}
    </ScrollView>
  );
}
