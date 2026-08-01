import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-primary">
                AI Interview
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/candidates"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
              >
                Candidates
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:border-border hover:text-foreground"
              >
                Settings
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-primary hover:border-primary/80 hover:text-primary/80"
              >
                Chat
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
             <Link
                href="/health"
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                System Status
              </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
