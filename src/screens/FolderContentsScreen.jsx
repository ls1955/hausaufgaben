import {SafeAreaView} from 'react-native';

import Medias from '../components/Medias';

// A screen that show contents inside the folder.
export default function FolderContentScreen({navigation, route: {params}}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Medias title={params.title} navigation={navigation} />
    </SafeAreaView>
  );
}
