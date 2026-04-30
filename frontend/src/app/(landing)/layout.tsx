import { NavBar } from "@/components/landing/NavBar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      <main className="pt-16">
        {children}
      </main>
    </>
  );
}
