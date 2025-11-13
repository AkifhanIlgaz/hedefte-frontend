"use client";

export default function NotAuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-md border p-4 rounded-2xl">{children}</div>
    </div>
  );
}
