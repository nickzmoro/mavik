import Image from "next/image";

type AuthHeaderProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export function AuthHeader({ title, description, icon }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      {icon ?? (
        <Image
          src="/zaion-logo-purple.webp"
          alt="Zaion"
          width={1082}
          height={1288}
          priority
          className="mb-5 block h-10 w-auto"
        />
      )}
      <h1 className="m-0 font-display text-2xl sm:text-[32px] leading-[1.2] font-bold text-text">
        {title}
      </h1>
      <p className="m-0 text-base leading-[1.6] text-muted">{description}</p>
    </div>
  );
}
