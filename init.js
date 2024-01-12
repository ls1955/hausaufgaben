import {PermissionsAndroid} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import {
  sortObjectByKeyAlphabetically,
  sortSetNumerically
} from './utils';
import {
  NON_GROUP_FOLDERS,
  NUMERIC_ORDER_ALBUMS,
  SPECIAL_FOLDER_PREFIXES,
} from './appConfigs';

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

// Returns all folders title and count from this device.
const loadFolders = async () => {
  const folders = await CameraRoll.getAlbums();
  const newFolders = {};

  folders.forEach(({title, count}) => {
    newFolders[title] = {count, mediaUris: []};
  });

  return sortObjectByKeyAlphabetically({object: newFolders, ignoreCase: true});
};

// Returns an albums object that contain grouped folders.
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
    } else if (/^[^\w]/.test(folderTitle)) {
      // when it contain non English character
      albums['...'] ??= new Set();
      albums['...'].add(folderTitle);
    } else {
      const albumTitle = folderTitle[0].toUpperCase();

      albums[albumTitle] ??= new Set();
      albums[albumTitle].add(folderTitle);
    }
  });

  for (const album of NUMERIC_ORDER_FOLDERS) {
    if (albums[album] == null) return

    albums[album] = sortSetNumerically({set: albums[album]});
  }

  return sortObjectByKeyAlphabetically({object: albums});
};

export {getPermission, loadFolders, getGroupedAlbums};
