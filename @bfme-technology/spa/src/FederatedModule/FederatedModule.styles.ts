
// Styling for loading spinner container
export const spinnerStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    margin: '20px 0',
    minHeight: '200px',
    width: '100%',
  },
  spinner: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#0df',
    animation: 'spin 1s linear infinite',
  },
};

// Styling for error message container
export const errorStyle = {
  container: {
    padding: '24px',
    borderLeft: '4px solid #ef4444',
    margin: '20px 0',
    width: '100%',
  },
};

// Append keyframes dynamic style for spin animation if not present
export const injectKeyframes = () => {
  if (typeof document !== 'undefined') {
    const styleId = 'mfe-container-spinner-css';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.appendChild(
        document.createTextNode(`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `)
      );
      document.head.appendChild(style);
    }
  }
};
