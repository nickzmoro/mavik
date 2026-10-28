export function getInitials(name: string, fallback = "?") {
  const nameParts = name.trim().split(/\s+/).filter(Boolean);

  if (nameParts.length === 0) {
    return fallback;
  }

  const firstInitial = nameParts[0].charAt(0);
  const lastInitial =
    nameParts.length > 1
      ? nameParts[nameParts.length - 1].charAt(0)
      : nameParts[0].charAt(1);

  return `${firstInitial}${lastInitial}`.toUpperCase();
}
