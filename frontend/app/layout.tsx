import { NavBar } from "@/components/landing/NavBar";

export default function RootLayout({
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