import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';

// An Image-like component to show thumbnail.
export default function Thumbnail({source}) {
  return <FastImage source={source} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {width: 100, height: 100, resizeMode: 'cover'},
});
