export const getNameFromURI = (uri: string): string => {
  if (!uri) return "";

  // Remove trailing slashes
  const cleanUri = uri.replace(/\/+$/, "");

  const segments = cleanUri.split("/").filter((segment) => segment.length > 0);

  if (segments.length === 0) return "";

  // Decode URI component and replace hyphens/underscores with spaces
  const lastSegment = segments[segments.length - 1];
  return decodeURIComponent(lastSegment)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
