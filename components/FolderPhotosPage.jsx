import { SafeAreaView } from "react-native";

import Photos from "./Photos";

// A page that show Photos inside Folder.
export default function FolderPhotosPage({
  uris,
  status,
  onStatus,
  isFromAlbum,
}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <Photos
        uris={uris}
        status={status}
        onStatus={onStatus}
        fromAlbum={isFromAlbum}
      />
    </SafeAreaView>
  );
}
