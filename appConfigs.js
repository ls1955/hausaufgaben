// This file contains various configurations related to the App itself.

// Number of columns for flat list showing albums and folders.
const GALLERY_FLAT_LIST_NUM_COLUMNS = 3;

// Number of columns for flat list showing image.
const PHOTO_FLAT_LIST_NUM_COLUMNS = 4;

// Maximum image amount per folder. It exists because CameraRoll require an image amount when
// fetching photos. Modify this if you think this isn't enough.
const MAX_IMAGE_PER_FOLDER = 300;

// Folders that do not wanna be put into a group.
const NON_GROUP_FOLDERS = new Set(['Download', 'Whatsapp', '相机', '下载']);

// Folders that start with any of these prefix will be grouped into their own group.
const SPECIAL_FOLDER_PREFIXES = [];

export {
  GALLERY_FLAT_LIST_NUM_COLUMNS,
  PHOTO_FLAT_LIST_NUM_COLUMNS,
  MAX_IMAGE_PER_FOLDER,
  NON_GROUP_FOLDERS,
  SPECIAL_FOLDER_PREFIXES
};
