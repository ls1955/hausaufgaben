import {Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import {useContext, useState} from 'react';
import {DarkTheme} from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import SelectDropdown from 'react-native-select-dropdown';

import {organizeDownloadFolder} from '../../utils';
import {CATEGORY_OPTIONS} from '../../appConfigs';
import {AlbumsContext} from '../../contexts/AlbumsContext';

// A modal that shows up for user to organize his/her download folder.
export default function OrganizeDownloadModal({navigation}) {
  const [folderTitle, setFolderTitle] = useState('');
  const [isToStaging, setIsToStaging] = useState(false);
  const [category, setCategory] = useState('');
  const albums = useContext(AlbumsContext);

  const handleOrganize = async () => {
    try {
      if (folderTitle === '' && category === '') {
        // TODO: notify with flash message
        console.log('Please enter a folderTitle or select a category');
        return;
      }
      await organizeDownloadFolder({
        title: folderTitle,
        category,
        isToStaging,
        albums,
      });
      // TODO: notify with a flash message.
    } catch (error) {
      // TODO: Warn with flash message.
      console.error(error);
    }
  };
  const handleClose = () => navigation.goBack();

  return (
    <View style={styles.modalContainer}>
      <View>
        <FolderTitleInput value={folderTitle} onChangeText={setFolderTitle} />
      <StagingCheckbox value={isToStaging} onValueChange={setIsToStaging} />
        <Text style={styles.inBetweenText}>Or</Text>
        <CategorySelect onSelect={setCategory} />
      </View>
      <ActionButtons onOrganize={handleOrganize} onCancel={handleClose} />
    </View>
  );
}

function FolderTitleInput({value, onChangeText}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="new-folder-title"
      style={styles.folderTitleInput}
    />
  );
}

function CategorySelect({onSelect}) {
  return (
    <SelectDropdown
      data={CATEGORY_OPTIONS}
      onSelect={onSelect}
      buttonTextAfterSelection={item => item}
      defaultButtonText="select-a-category"
      rowStyle={styles.selectRow}
      buttonStyle={styles.selectButton}
      rowTextStyle={styles.selectSelectedRow}
      buttonTextStyle={styles.selectText}
      selectedRowTextStyle={[styles.selectText, styles.selectSelectedRow]}
    />
  );
}

function StagingCheckbox({value, onValueChange}) {
  return (
    <View style={styles.checkBoxContainer}>
      <CheckBox value={value} onValueChange={onValueChange} />
      <Text>To Staging Folder</Text>
    </View>
  );
}

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
    marginTop: 'auto',
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
    borderBottomWidth: 1, borderBottomColor: "white"
  },
  selectButton: {
    backgroundColor: 'rgb(40, 40, 40)',
    color: DarkTheme.colors.text,
  },
  selectText: {color: DarkTheme.colors.text},
  buttonsContainer: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 15}
});
