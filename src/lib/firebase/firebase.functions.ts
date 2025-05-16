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

<<<<<<< HEAD
export async function uploadFile(file: File, { onUpload, progress, deleteUrl }: UploadImageOptions) {
=======
export async function uploadFile(
  file: File,
  { onUpload, progress, deleteUrl }: UploadImageOptions
) {
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
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
<<<<<<< HEAD

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword", // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/vnd.ms-excel", // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "text/plain", // .txt
    "application/x-hwp", // .hwp
    // 필요에 따라 다른 MIME 타입 추가
  ];

  files.forEach((file) => {
    console.log("Attempting to upload file:", file.name, "Type:", file.type);
    // file.type이 비어있는 경우도 고려 (예: 일부 시스템에서 확장자만 있고 MIME 타입이 없는 경우)
    // 이 경우 파일 확장자로 추가 검사를 할 수도 있지만, 우선은 MIME 타입 기준으로 처리합니다.
    if (file && allowedMimeTypes.includes(file.type)) {
      console.log("Allowed file type, proceeding with upload:", file.name);
      uploadFile(file, options);
    } else {
      console.warn("Disallowed file type or no file, skipping upload:", file.name, "Type:", file.type);
      // 사용자에게 알림을 줄 수도 있습니다.
      // 예를 들어 options 객체에 onError 콜백을 추가하여 호출할 수 있습니다.
=======
  files.forEach((file) => {
    console.log(file.name);
    if (
      file &&
      (file.type.startsWith("image/") || file.type.endsWith("/pdf"))
    ) {
      uploadFile(file, options);
>>>>>>> c109fa3 (사이드바 커스텀 추가 ,ai 이미지,파일,링크 추가작업중)
    }
  });
}
