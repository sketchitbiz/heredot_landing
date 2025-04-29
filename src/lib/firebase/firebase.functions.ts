import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  ref,
  ref as storageRef,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { FileData } from "firebase/vertexai";
import { ChangeEvent } from "react";

export interface FileUploadData extends FileData {
  name: string;
}
export interface UploadImageOptions {
  onUpload: (data: FileUploadData) => void;
  progress?: (progress: number) => void;
  deleteUrl?: string;
}

export function uploadImage(
  event: ChangeEvent<HTMLInputElement>,
  { onUpload, progress, deleteUrl }: UploadImageOptions
) {
  const files = event.target.files;
  if (!files || files.length == 0) return;
  uploadFile(files[0], {
    onUpload: (data) => {
      event.target.value = ""; // Clear the input value to allow re-uploading the same file;
      onUpload(data);
    },
    progress,
    deleteUrl,
  });
}

export async function uploadFile(
  file: File,
  { onUpload, progress, deleteUrl }: UploadImageOptions
) {
  const uploadRef = storageRef(getStorage(), `tmp/${file.name}`);
  const uploadTask = uploadBytesResumable(uploadRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot: UploadTaskSnapshot) => {
      const percent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      // console.log(`Upload is ${percent}% done`);
      if (progress) progress(percent);

      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      console.error(error);
    },
    () => {
      console.log("Upload complete");
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL: string) => {
        console.log("File available at", downloadURL);

        if (deleteUrl) {
          console.log("Delete  url", deleteUrl);

          deleteObject(storageRef(getStorage(), deleteUrl))
            .then(() => {
              console.log("File deleted successfully");
            })
            .catch((error: unknown) => {
              console.log("Uh-oh, an error occurred!", error);
            });
        }
        onUpload({
          name: file.name,
          fileUri: downloadURL,
          mimeType: file.type,
        });
      });
    }
  );
}

export function deleteImage(
  url: string,
  {
    onSuccess,
    onError,
  }: {
    onSuccess?: (url: string) => void;
    onError?: (url: string) => void;
  } = {}
) {
  deleteObject(storageRef(getStorage(), url))
    .then(() => {
      console.log("File deleted successfully");
      if (onSuccess) onSuccess(url);
    })
    .catch((error: unknown) => {
      console.log("Uh-oh, an error occurred!", error);
      if (onError) onError(url);
    });
}

export async function getMimeType(fileUrl: string): Promise<string | null> {
  try {
    // Create a reference to the file
    const fileRef = ref(getStorage(), fileUrl);

    // Get the metadata of the file
    const metadata = await getMetadata(fileRef);

    // Return the contentType (MIME type)
    return metadata.contentType || null;
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
}

export function uploadFiles(files: File[], options: UploadImageOptions) {
  if (!files) return;
  files.forEach((file) => {
    console.log(file.name);
    if (
      file &&
      (file.type.startsWith("image/") || file.type.endsWith("/pdf"))
    ) {
      uploadFile(file, options);
    }
  });
}
