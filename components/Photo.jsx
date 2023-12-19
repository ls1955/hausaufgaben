import {Image, View} from 'react-native';
import Swiper from 'react-native-swiper';

// A component that support swiping across photos while showing one at the time.
export default function Photo({uris, status}) {
  const photos = uris.map((uri, i) => {
    return (
      <View
        key={i}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{width: '100%', flex: 1}}
          resizeMode="contain"
          source={{uri}}
        />
      </View>
    );
  });

  return (
    <Swiper
      index={status['selectedPhotoIndex']}
      loop={false}
      showsPagination={false}>
      {photos}
    </Swiper>
  );
}
