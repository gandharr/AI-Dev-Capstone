// This is a Server Component that fetches data
export const dynamic = "force-dynamic"; // Ensures the health page always fetches fresh data

export default async function HealthPage() {
  // In a real app, this might fetch from an external FastAPI backend.
  // For now, we fetch from our own Next.js API route as a mock.
  const appUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL 
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` 
    : process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000";
      
  let healthData = null;
  let error = null;
  
  try {
    const res = await fetch(`${appUrl}/api/health`, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch health data: ${res.status}`);
    }
    healthData = await res.json();
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-foreground">System Health</h1>
      
      {error ? (
        <div className="p-4 bg-red-100 border border-red-300 rounded-md text-red-800">
          <p className="font-semibold">Error connecting to services:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${healthData?.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h2 className="text-xl font-medium text-foreground capitalize">Status: {healthData?.status || "Unknown"}</h2>
          </div>
          
          <div className="bg-muted p-4 rounded-md">
            <pre className="text-sm text-foreground overflow-auto">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
