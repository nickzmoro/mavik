import { legalInfo } from "@/lib/legal";

export function ContactEmailLink() {
  return (
    <a href={`mailto:${legalInfo.contactEmail}`}>{legalInfo.contactEmail}</a>
  );
}
