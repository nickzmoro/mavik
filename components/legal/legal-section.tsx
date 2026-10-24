type LegalSectionProps = {
  id: string;
  number: number;
  title: string;
  children: React.ReactNode;
};

export function LegalSection({
  id,
  number,
  title,
  children,
}: LegalSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-8 text-base leading-[1.7] text-text [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_li]:mb-2 [&_p]:m-0 [&_p+p]:mt-4 [&_strong]:font-semibold [&_ul]:m-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6"
    >
      <h2
        id={`${id}-title`}
        className="m-0 mb-4 font-display text-xl leading-[1.3] font-bold text-text sm:text-2xl"
      >
        {number}. {title}
      </h2>
      {children}
    </section>
  );
}
