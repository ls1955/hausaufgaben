import { NON_GROUP_FOLDERS } from "../appConfigs";

// Returns an albums object that contain grouped folders.
export default getGroupedAlbums = folders => {
  const albums = {};

  for (const folderTitle of Object.keys(folders)) {
    if (NON_GROUP_FOLDERS.has(folderTitle)) return;

    albums[folderTitle] = albums[folderTitle] ?? new Set();
    albums[folderTitle].add(folderTitle);
  }

  return albums;
};
