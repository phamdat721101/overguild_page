import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CodeSandboxSection, NetworkShowcaseSection, TractionSection } from "./EcosystemShowcase";

describe("Ecosystem showcase", () => {
  it("renders dated public product proof without exposing the OverGuild repository", () => {
    render(<TractionSection />);

    expect(screen.getByText("Weekly n-payment downloads")).toBeInTheDocument();
    expect(screen.getByText("AS OF AUG 17–23, 2026")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /npm downloads api/i })).toHaveAttribute(
      "href",
      "https://api.npmjs.org/downloads/point/last-week/n-payment",
    );
    expect(screen.getByRole("link", { name: "HyperMove" })).toHaveAttribute("href", "https://www.hypermove.xyz/");
    expect(screen.getByRole("link", { name: "OpenX" })).toHaveAttribute("href", "https://openx.the-valley.xyz/");
    expect(screen.queryByText("OverGuild source")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
  });

  it("renders the three network spotlights with source links", () => {
    render(<NetworkShowcaseSection />);

    expect(screen.getByText("GOAT Network")).toBeInTheDocument();
    expect(screen.getByText("XRPL")).toBeInTheDocument();
    expect(screen.getByText("t54 Labs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore xrpl/i })).toHaveAttribute("href", "https://xrpl.org/");
  });

  it("renders only the verified n-payment snippet and copies it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<CodeSandboxSection />);

    expect(screen.getByRole("tab", { name: "n-payment" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "HyperMove" })).not.toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "OpenX" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /copy code snippet/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(expect.stringContaining("fetchWithPayment")));
    expect(screen.getByText("Copied")).toBeInTheDocument();
  });
});
