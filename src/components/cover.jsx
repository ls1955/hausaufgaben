import {StyleSheet, TouchableOpacity} from 'react-native';

// The album or folder cover that could contain thumbnail as children.
export default function Cover({onNav, children}) {
  return (
    <TouchableOpacity onPress={onNav} style={styles.cover}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cover: {
    minWidth: 100,
    minHeight: 100,
    backgroundColor: 'rgb(69, 69, 71)',
  },
});
