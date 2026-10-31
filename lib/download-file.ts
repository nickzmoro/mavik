export function downloadFile(fileName: string, file: Blob | string) {
  const fileUrl = typeof file === "string" ? file : URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = fileUrl;
  link.download = fileName;
  link.rel = "noopener";
  link.click();

  if (typeof file !== "string") {
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
  }
}

export async function downloadImage(imageUrl: string, fileName: string) {
  const imageBlob = await fetch(imageUrl).then((response) => response.blob());

  downloadFile(fileName, imageBlob);
}
