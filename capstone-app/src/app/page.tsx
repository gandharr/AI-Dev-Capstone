import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-foreground">
          Smarter Interviews, <span className="text-primary">Instantly</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
          Generate role-specific, dynamic interview questions on the fly by analyzing candidate resumes with AI.
        </p>
      </div>
      <div className="flex space-x-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-primary-foreground bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/candidates"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-foreground bg-background border border-border rounded-md shadow-sm hover:bg-muted transition-colors"
        >
          View Candidates
        </Link>
      </div>
    </div>
  );
}
