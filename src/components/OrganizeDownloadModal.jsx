import {Modal, Pressable, Text, TextInput, View} from 'react-native';
import {useState} from 'react';
import CheckBox from '@react-native-community/checkbox';

import {organizeDownloadFolder} from '../utils';

// A modal that shows up for user to organize his/her download folder.
export default function OrganizeDownloadModal(onShowModal) {
  const [folderTitle, setFolderTitle] = useState('');
  const [isToStaging, setIsToStaging] = useState(false);
  const [category, setCategory] = useState('');

  const handleOrganize = async () => {
    try {
      await organizeDownloadFolder({folder: folderTitle, isToStaging});
      // TODO: Notify with a flash message.
    } catch (error) {
      // TODO: Warn with flash message.
      console.error(error);
    }
  };
  const handleClose = () => onShowModal(false);

  return (
    <Modal transparent={true} onRequestClose={handleClose}>
      <View>
        <FolderTitleInput value={folderTitle} onChangeText={setFolderTitle} />
        <StagingCheckbox value={isToStaging} onValueChange={setIsToStaging} />
      </View>
      <ActionButtons onOrganize={handleOrganize} onCancel={handleClose} />
    </Modal>
  );
}

function FolderTitleInput({value, onChangeText}) {
  return (
    <TextInput value={value} onChangeText={onChangeText} autoFocus={true} />
  );
}

function StagingCheckbox({value, onValueChange}) {
  return (
    <View>
      <CheckBox value={value} onValueChange={onValueChange} />
      <Text>To Staging Folder</Text>
    </View>
  );
}

function ActionButtons({onOrganize, onCancel}) {
  return (
    <View>
      <Pressable onPress={onOrganize}>
        <Text>Organize</Text>
      </Pressable>
      <Pressable onPress={onCancel}>
        <Text>Cancel</Text>
      </Pressable>
    </View>
  );
}
