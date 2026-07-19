const root = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#f9fafb",
};

const loadingRoot = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1rem",
  background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
};

const loadingCard = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.75rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.05)",
  color: "#e2e8f0",
  fontSize: "0.875rem",
  padding: "0.75rem 1rem",
};

const contentWrap = {
  width: "100%",
  maxWidth: "1280px",
  margin: "0 auto",
  display: "flex",
  flex: 1,
  gap: "1.5rem",
  padding: "1.5rem",
  boxSizing: "border-box",
};

const main = {
  flex: 1,
  minWidth: 0,
};

const centerSection = {
  width: "100%",
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "1.5rem",
  boxSizing: "border-box",
};

export const documentationBaseStyles = {
  root,
  loadingRoot,
  loadingCard,
  contentWrap,
  main,
  centerSection,
};

export const documentationBaseLayoutStyles = documentationBaseStyles;
