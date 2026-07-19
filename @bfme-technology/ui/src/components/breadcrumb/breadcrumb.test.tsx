import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Breadcrumbs from "./breadcrumb";

describe("Breadcrumbs Component", () => {
  const renderWithRouter = (initialPath = "/") => {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Breadcrumbs />
      </MemoryRouter>
    );
  };

  test("should render home breadcrumb on root path", () => {
    renderWithRouter("/");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    const breadcrumb = screen.getByRole("navigation");
    expect(breadcrumb).toBeInTheDocument();
  });

  test("should render breadcrumbs for single path segment", () => {
    renderWithRouter("/leads");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Leads")).toBeInTheDocument();
  });

  test("should render breadcrumbs for multiple path segments", () => {
    renderWithRouter("/leads/add");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Leads")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
  });

  test("should capitalize first letter of breadcrumb items", () => {
    renderWithRouter("/jobsheet");

    expect(screen.getByText("Jobsheet")).toBeInTheDocument();
  });

  test("should mark last breadcrumb item as active", () => {
    renderWithRouter("/leads/add");

    const lastItem = screen.getByText("Add").closest("li");
    expect(lastItem).toBeInTheDocument();
    expect(lastItem).toHaveAttribute("aria-current", "page");
  });

  test("should render dashboard icon", () => {
    renderWithRouter("/");

    const icon = screen.getByRole("link").querySelector("i.fa-dashboard");
    expect(icon).toBeInTheDocument();
  });

  test("should create proper links for non-active items", () => {
    renderWithRouter("/leads/add/new");

    const leadsLink = screen.getByText("Leads").closest("a");
    expect(leadsLink).toHaveAttribute("href", "/leads");

    const addLink = screen.getByText("Add").closest("a");
    expect(addLink).toHaveAttribute("href", "/leads/add");
  });

  test("should handle paths with special characters", () => {
    renderWithRouter("/my-path");

    expect(screen.getByText("My Path")).toBeInTheDocument();
  });
});
