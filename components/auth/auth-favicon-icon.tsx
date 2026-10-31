import Image from "next/image";

export function AuthFaviconIcon() {
  return (
    <span
      aria-hidden="true"
      className="mb-2 flex size-14 items-center justify-center"
    >
      <Image
        src="/zaion-logo-favicon.webp"
        alt=""
        width={63}
        height={64}
        className="mb-2 block h-16 w-15.75 max-w-none"
      />
    </span>
  );
}
