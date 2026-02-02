/**
 * Dashboard Layout
 * 
 * Shared layout for authenticated dashboard pages.
 * This layout is protected by the Clerk middleware.
 */
export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
