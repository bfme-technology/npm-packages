export * from "./styles";

export const gridResponsiveStyles = `
@media (min-width: 640px) {
  .bfme-grid-desktop { display: block !important; }
  .bfme-grid-mobile { display: none !important; }
}
@media (max-width: 639.98px) {
  .bfme-grid-desktop { display: none !important; }
  .bfme-grid-mobile { display: flex !important; }
}
`;
