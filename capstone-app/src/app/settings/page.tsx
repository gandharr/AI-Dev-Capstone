export default function Settings() {
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      
      <div className="space-y-4">
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-medium text-foreground">Profile</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Email</label>
            <input 
              type="email" 
              disabled 
              value="recruiter@example.com"
              className="w-full p-2 bg-muted border border-border rounded-md text-foreground cursor-not-allowed" 
            />
          </div>
        </div>

        <SettingsForm />
      </div>
    </div>
  );
}
