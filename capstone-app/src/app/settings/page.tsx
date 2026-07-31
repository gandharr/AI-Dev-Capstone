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

        <div className="p-6 bg-card border border-border rounded-lg shadow-sm space-y-4">
          <h2 className="text-xl font-medium text-foreground">API Configuration</h2>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">OpenAI API Key</label>
            <input 
              type="password" 
              placeholder="sk-..."
              className="w-full p-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
            />
            <p className="text-xs text-muted-foreground">Your key is stored securely and never shared.</p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors">
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}
