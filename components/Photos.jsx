import {Image, ScrollView} from 'react-native';
// The photos inside a Folder component. This component will be render when a folder has been clicked.
export default function Photos({uris}) {
  // TODO: Exit back to Folder when clicked back button

  const photos = uris.map((uri, i) => {
    return (
      <Image
        key={i}
        style={{minWidth: 100, minHeight: 100, flex: 1}}
        source={{uri}}
      />
    );
  });

  return (
    <ScrollView style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>
      {photos}
    </ScrollView>
  );
}
