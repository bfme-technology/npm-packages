import React, { useEffect, useState } from 'react';

export const Breadcrumb: React.FC = () => {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const pathParts = path.split('/').filter(Boolean);

  const breadcrumbItems = [
    { label: 'Dashboard', icon: 'fa-solid fa-chart-pie', path: '/' }
  ];

  pathParts.forEach((part, index) => {
    const label = part
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const itemPath = '/' + pathParts.slice(0, index + 1).join('/');
    breadcrumbItems.push({ label, icon: '', path: itemPath });
  });

  return (
    <nav className="flex text-sm text-text-secondary font-medium mb-4" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li key={item.path} className="inline-flex items-center">
              {index > 0 && (
                <i className="fa-solid fa-chevron-right text-[10px] mx-2 opacity-50"></i>
              )}
              {isLast ? (
                <span className="inline-flex items-center text-text-primary font-semibold">
                  {item.icon && <i className={`${item.icon} mr-1.5`}></i>}
                  {item.label}
                </span>
              ) : (
                <a 
                  href={item.path} 
                  className="inline-flex items-center hover:text-primary-accent transition-colors"
                >
                  {item.icon && <i className={`${item.icon} mr-1.5`}></i>}
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
