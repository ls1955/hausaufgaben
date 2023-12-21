import { PermissionsAndroid } from "react-native";
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

import { NON_GROUP_FOLDERS } from "./appConfigs";

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
  
    folders.forEach((item) => {
      newFolders[item['title']] = {count: item['count'], imageUris: null}
    });
  
    return newFolders;
  };

// Returns an albums object that contain grouped folders.
const getGroupedAlbums = folders => {
  const albums = {};

  Object.keys(folders).forEach(folderTitle => {
    if (NON_GROUP_FOLDERS.has(folderTitle)) return;

    const albumTitle = folderTitle[0].toUpperCase();

    albums[albumTitle] = albums[albumTitle] ?? new Set();
    albums[albumTitle].add(folderTitle);
  })
  return albums;
};

export {getPermission, loadFolders, getGroupedAlbums}
