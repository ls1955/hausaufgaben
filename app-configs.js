// This file contains various app configurations.

// The app name. Usually use as the title of flash messages.
const APP_NAME = 'Hausaufgaben';

// Number of columns for flat list showing albums and folders.
const GALLERY_FLAT_LIST_NUM_COLUMNS = 3;

// Maximum image amount per folder. It exists because CameraRoll require an image amount when
// fetching photos. Modify this if you think this isn't enough.
const MAX_IMAGE_PER_FOLDER = 300;

// Folders that do not wanna be put into a group.
const NON_GROUP_FOLDERS = new Set(['Download', 'Whatsapp', '相机', '下载']);

// Folders that start with any of these prefix will be grouped into their own group.
const SPECIAL_FOLDER_PREFIXES = [];

// Albums where folders are sorted numerically.
const NUMERIC_ORDER_ALBUMS = new Set([]);

// Directories that will require scoped storage permissions in order to make use of Organize Download
// folder feature. User could give permission to custom path for each directory, as long as those
// path align with the purpose, it will work as expected.
//
// downloadDir: Usually the download folder on phone. It will be the source of files to organize from.
// defaultDir: The directory to use for storing general folder. For author use case, it is somewhere
// inside his SD card.
// doujinDir: The directory to store doujin. Could also be the same directory with defaultDir
// stagingDir: The directory to store folder that will be move to somewhere else. For author use case,
// this is where he puts the folder that take too much space on his tiny phone, before moving them to
// HDD later on at once.
//
const PERMISSION_REQUIRED_DIRECTORIES = [
  'downloadDir',
  'defaultDir',
  'doujinDir',
  'stagingDir',
];

// Category options use in organizing feature. They are use to determine which directory to use, as well
// as figuring out the new folder name. In author use case, the new folder name is category prepend by
// number, as such the name could be vanilla1 for first vanilla folder, vanilla2 for second vanilla folder,
// so on and so forth...
const CATEGORY_OPTIONS = ['', 'doujin', 'vanilla'];

export {
  APP_NAME,
  CATEGORY_OPTIONS,
  GALLERY_FLAT_LIST_NUM_COLUMNS,
  MAX_IMAGE_PER_FOLDER,
  NON_GROUP_FOLDERS,
  NUMERIC_ORDER_ALBUMS,
  PERMISSION_REQUIRED_DIRECTORIES,
  SPECIAL_FOLDER_PREFIXES,
};
