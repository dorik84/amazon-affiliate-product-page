// app/unauthorized/page.tsx
export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Unauthorized Access</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </div>
  );
}
