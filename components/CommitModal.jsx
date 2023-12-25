import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';

import {organizeDownloadFolder} from '../utils';

// This modal is show when user want to move downloaded images/videos into a new directory.
// It includes a folder name text input, and predefined options (like Vanilla, Doujin, etc...)
// is plan to be included in the future.
export default function CommitModal({status, onStatus}) {
  const [folderTitle, setFolderTitle] = useState('');
  const [isToStaging, setIsToStaging] = useState(false);

  const handleCommit = async () => {
    try {
      await organizeDownloadFolder({folder: folderTitle, isToStaging});
      // TODO: Replace with a flash message in app.
      console.log('The files had been successfully moved.');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={true}
      onRequestClose={() => onStatus({...status, showModal: false})}>
      <View style={styles.body}>
        <TextInput
          onChangeText={setFolderTitle}
          placeholder="folder-name"
          value={folderTitle}
          autoFocus={true}
          style={styles.input}
        />
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isToStaging}
            onValueChange={val => setIsToStaging(val)}
          />
          <Text>To staging folder</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <Pressable onPress={handleCommit} style={styles.button}>
            <Text style={styles.buttonText}>Commit</Text>
          </Pressable>
          <Pressable
            onPress={() => onStatus({...status, showModal: false})}
            style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  body: {
    borderColor: 'rgb(200, 200, 200)',
    borderWidth: 1,
    marginTop: 40,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderBottomColor: 'rgb(200, 200, 200)',
    borderBottomWidth: 1,
    paddingBottom: 2,
  },
  checkboxContainer: {
    marginVertical: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
