import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useContext, useState} from 'react';
import {DarkTheme} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import {Picker} from '@react-native-picker/picker';

import {
  organizeDownloadFolder,
  showErrorFlash,
  showInvalidInputFlash,
  showSuccessOrganizeFlash,
} from '../../utils';
import {CATEGORY_OPTIONS} from '../../app-configs';
import {AlbumsContext} from '../contexts/albums-context';

// A modal that shows up for user to organize their download folder.
export default function OrganizeDownloadModal({navigation}) {
  const [folderTitle, setFolderTitle] = useState('');
  const [isToStaging, setIsToStaging] = useState(false);
  const [category, setCategory] = useState('');
  const albums = useContext(AlbumsContext);

  const handleOrganize = async () => {
    try {
      if (folderTitle === '' && category === '') return showInvalidInputFlash();

      navigation.goBack();
      await organizeDownloadFolder({
        folderTitle,
        category,
        isToStaging,
        albums,
      });

      showSuccessOrganizeFlash();
    } catch (error) {
      showErrorFlash({error});
    }
  };
  const handleClose = () => navigation.goBack();

  return (
    <View style={styles.modalContainer}>
      <View>
        <FolderTitleInput value={folderTitle} onChangeText={setFolderTitle} />
        <StagingCheckbox value={isToStaging} onValueChange={setIsToStaging} />
        <CategoryPicker
          defaultValue={category}
          onSelect={setCategory}
          options={CATEGORY_OPTIONS}
        />
      </View>
      <ActionButtons onOrganize={handleOrganize} onCancel={handleClose} />
    </View>
  );
}

// Input for folder title. Note that folder input have higher priority than category option, which mean
// folder input will be use when both are present.
function FolderTitleInput({value, onChangeText}) {
  return (
    <TextInput
      autoFocus
      value={value}
      onChangeText={onChangeText}
      placeholder="new-folder-title"
      style={styles.folderTitleInput}
    />
  );
}

// Checkbox to determine whether given folder should be move to staging_area folder. Will not move the
// folder to staging_area if it is created from category option. This behavior is in discussion.
function StagingCheckbox({value, onValueChange}) {
  return (
    <View style={styles.checkBoxContainer}>
      <CheckBox value={value} onValueChange={onValueChange} />
      <Text>To Staging Folder</Text>
    </View>
  );
}

// The picker to select a category.
function CategoryPicker({defaultValue, onSelect, options}) {
  const handleSelect = newVal => onSelect(newVal);
  const items = options.map((option, i) => (
    <Picker.Item key={i} label={option} value={option} />
  ));

  return (
    <Picker
      selectedValue={defaultValue}
      onValueChange={handleSelect}
      mode="dropdown">
      {items}
    </Picker>
  );
}

// A container that holds organize and cancel button.
function ActionButtons({onOrganize, onCancel}) {
  return (
    <View style={styles.buttonsContainer}>
      <Pressable onPress={onOrganize}>
        <Text>Organize</Text>
      </Pressable>
      <Pressable onPress={onCancel}>
        <Text>Cancel</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgb(40, 40, 40)',
    marginTop: '40%',
    borderRadius: 10,
    padding: 20,
  },
  inBetweenText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 0,
  },
  folderTitleInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingBottom: 0,
    marginTop: 15,
    marginBottom: 5,
    fontSize: 20,
  },
  checkBoxContainer: {flexDirection: 'row', alignItems: 'center'},
  selectRow: {
    backgroundColor: 'rgb(40, 40, 40)',
    color: DarkTheme.colors.text,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  selectSelectedRow: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  selectButton: {
    backgroundColor: 'rgb(40, 40, 40)',
    color: DarkTheme.colors.text,
  },
  selectText: {color: DarkTheme.colors.text},
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
});
