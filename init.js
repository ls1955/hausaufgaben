import {PermissionsAndroid} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import {NON_GROUP_FOLDERS, SPECIAL_FOLDER_PREFIXES} from './appConfigs';

// This file contain functions that is being use during App initialization.
// The functions and exports order are arranged in their calling order during initialization.

// Try to get storage access permission, return true if permission granted, else false.
const getPermission = async () => {
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );

  if (hasPermission) return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    {
      title: 'hausaufgaben read storage permission',
      message: 'To read your homework folders',
      buttonPositive: 'Ok',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

// Returns all folders title and count from this device. Note that returned folders object's keys
// are being sorted alphabetically.
const loadFolders = async () => {
  const folders = await CameraRoll.getAlbums();
  const newFolders = {};

  folders.forEach(item => {
    newFolders[item['title']] = {count: item['count'], imageUris: null};
  });

  return Object.fromEntries(Object.entries(newFolders).sort());
};

// Returns an albums object that contain grouped folders. Note that returned albums object is
// sorted alphabetically.
const getGroupedAlbums = folders => {
  const albums = {};

  Object.keys(folders).forEach(folderTitle => {
    if (NON_GROUP_FOLDERS.has(folderTitle)) return;

    const prefix = SPECIAL_FOLDER_PREFIXES.find(pre =>
      folderTitle.startsWith(pre),
    );

    if (prefix != null) {
      albums[prefix] ??= new Set();
      albums[prefix].add(folderTitle);
    } else if (/^\d+/.test(folderTitle)) {
      // when it start with digits
      albums['#'] ??= new Set();
      albums['#'].add(folderTitle);
    } else if (/[^\w]/.test(folderTitle)) {
      // when it contain non English character
      albums['...'] ??= new Set();
      albums['...'].add(folderTitle);
    } else {
      const albumTitle = folderTitle[0].toUpperCase();

      albums[albumTitle] ??= new Set();
      albums[albumTitle].add(folderTitle);
    }
  });

  // sort the albums alphabetically before return
  return Object.fromEntries(Object.entries(albums).sort());
};

export {getPermission, loadFolders, getGroupedAlbums};
