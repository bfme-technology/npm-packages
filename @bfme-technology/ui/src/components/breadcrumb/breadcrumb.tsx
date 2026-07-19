import { useLocation, Link } from "react-router-dom";
import { Fragment } from "react";
import {
  breadcrumbActiveItemClass,
  breadcrumbContainerClass,
  breadcrumbItemClass,
  breadcrumbLinkClass,
  breadcrumbListClass,
  breadcrumbSeparatorClass,
} from "./breadcrumb.styles";
import { getNameFromURI } from "./breadcrumb.utils";

const Breadcrumbs = () => {
  const location = useLocation();

  // Split path into array and filter empty strings
  const pathnames = location.pathname.split("/").filter((x: string) => x);

  return (
    <nav aria-label="breadcrumb" className={breadcrumbContainerClass}>
      <ol className={breadcrumbListClass}>
        {/* Always show Home as the first item */}
        <li className={breadcrumbItemClass}>
          <Link to="/" className={breadcrumbLinkClass}>
            <i className="fa fal fa-dashboard mr-2"></i>Dashboard
          </Link>
        </li>

        {pathnames.length > 0 && (
          <li className={breadcrumbSeparatorClass} aria-hidden="true">
            <i className="fa-solid fa-chevron-right text-xs"></i>
          </li>
        )}

        {pathnames.map((value: string, index: number) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;

          return last ? (
            <li
              key={to}
              className={breadcrumbActiveItemClass}
              aria-current="page"
            >
              {getNameFromURI(to)}
            </li>
          ) : (
            <Fragment key={to}>
              <li className={breadcrumbItemClass}>
                <Link to={to} className={breadcrumbLinkClass}>
                  {getNameFromURI(to)}
                </Link>
              </li>
              <li className={breadcrumbSeparatorClass} aria-hidden="true">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
