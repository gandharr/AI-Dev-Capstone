export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Recruiter Dashboard</h1>
      <p className="text-muted-foreground">Welcome back! Here is an overview of your recent interview generations.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-foreground">Total Candidates</h3>
          <p className="text-3xl font-bold text-primary mt-2">124</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-foreground">Questions Generated</h3>
          <p className="text-3xl font-bold text-primary mt-2">892</p>
        </div>
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-foreground">Active Roles</h3>
          <p className="text-3xl font-bold text-primary mt-2">12</p>
        </div>
      </div>
    </div>
  );
}
