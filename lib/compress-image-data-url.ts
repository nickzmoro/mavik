export function compressImageDataUrl(
  dataUrl: string,
  maxWidth = 1024,
  quality = 0.9,
) {
  return new Promise<string>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, maxWidth / image.naturalWidth);
      const canvas = document.createElement("canvas");

      canvas.width = Math.round(image.naturalWidth * scale);
      canvas.height = Math.round(image.naturalHeight * scale);

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas indisponível"));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    image.onerror = () => reject(new Error("Imagem inválida"));
    image.src = dataUrl;
  });
}
