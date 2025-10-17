import RelayRuntime, { type Environment } from "relay-runtime";
const { graphql, fetchQuery } = RelayRuntime;
import {
  BlobReader,
  BlobWriter,
  TextReader,
  Uint8ArrayReader,
  ZipWriter,
} from "@zip.js/zip.js";
import { uploadQuery } from "__generated__/uploadQuery.graphql";

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB chunks

export const createZip = async (files: {
  [key: string]: Blob | string | Uint8Array | ReadableStream | File;
}): Promise<Blob> => {
  const zipFileWriter = new BlobWriter();
  const zipWriter = new ZipWriter(zipFileWriter);
  for (const [key, value] of Object.entries(files)) {
    if (typeof value === "string") {
      await zipWriter.add(key, new TextReader(value));
    } else if (value instanceof Blob) {
      await zipWriter.add(key, new BlobReader(value));
    } else if (value instanceof Uint8Array) {
      await zipWriter.add(key, new Uint8ArrayReader(value));
    } else {
      await zipWriter.add(key, value);
    }
  }
  await zipWriter.close();
  const zipFileBlob = await zipFileWriter.getData();
  return zipFileBlob;
};

const initiateResumableUpload = async (
  url: string,
  totalSize: number,
  setUploadFilesProgress?: (progress: number) => void
): Promise<string> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/octet-stream",
      "x-goog-resumable": "start",
      "Content-Length": "0",
    },
  });
  setUploadFilesProgress?.(
    0.01
  );

  if (!response.ok) {
    throw new Error(`Failed to initiate upload: ${response.statusText}`);
  }

  const uploadUrl = response.headers.get("Location");
  if (!uploadUrl) {
    throw new Error("No upload URL received from server");
  }

  return uploadUrl;
};

const uploadChunk = async (
  uploadUrl: string,
  chunk: Blob,
  start: number,
  end: number,
  total: number
) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Range": `bytes ${start}-${end - 1}/${total}`,
      "Content-Length": chunk.size.toString(),
    },
    body: chunk,
  });

  if (!response.ok && response.status !== 308) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response;
};

const uploadFileInChunks = async (
  uploadUrl: string,
  file: Blob,
  setUploadFilesProgress?: (progress: number) => void
) => {
  const totalSize = file.size;

  let start = 0;
  let end = Math.min(CHUNK_SIZE, totalSize);

  while (start < totalSize) {
    const chunk = file.slice(start, end);
    const response = await uploadChunk(uploadUrl, chunk, start, end, totalSize);
    setUploadFilesProgress?.(start / totalSize);
    if (response.status === 308) {
      const rangeHeader = response.headers.get("Range");
      if (rangeHeader) {
        const uploadedBytes = parseInt(rangeHeader.split("-")[1]) + 1;
        start = uploadedBytes;
        end = Math.min(start + CHUNK_SIZE, totalSize);
      }
    } else if (response.ok) {
      break;
    }
  }
};

export const generateShortRandomName = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const handleUploadFileToCloud = async (
  environment: Environment,
  zipFile: Blob,
  setUploadFilesProgress?: (progress: number) => void
) => {
  const query = await fetchQuery<uploadQuery>(
    environment,
    graphql`
      query uploadQuery($filename: String!) {
        getSignedUrl(filename: $filename) {
          url
        }
      }
    `,
    {
      filename: `${generateShortRandomName()}.zip`,
    }
  ).toPromise();

  if (query?.getSignedUrl?.url) {
    const totalSize = zipFile.size;
    const url = query?.getSignedUrl?.url;
    // console.log("FileUploaded", url);
    const uploadUrl = await initiateResumableUpload(url, totalSize);
    await uploadFileInChunks(uploadUrl, zipFile);

    setUploadFilesProgress?.(1);
    return url;
  } else {
    throw new Error("Failed to generate upload URL for the zip file");
  }
};
