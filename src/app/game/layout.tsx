import { ReactNode } from "react";

export default function GameLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gradient-to-b from-blue-50 to-purple-50">
      {children}
    </main>
  );
} 