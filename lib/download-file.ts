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
