import { CircleAlert } from "lucide-react";

export function FormAlert({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      className="flex gap-3 rounded-(--r-lg) border border-danger bg-danger-bg p-4"
    >
      <span aria-hidden="true" className="flex flex-none pt-0.5 text-danger">
        <CircleAlert size={18} />
      </span>
      <p className="m-0 text-sm leading-normal text-text">{message}</p>
    </div>
  );
}
