export default async function CandidateDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Candidate Profile</h1>
        <p className="text-muted-foreground">Viewing details for Candidate ID: {id}</p>
      </div>

      <div className="p-6 bg-card border border-border rounded-lg shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-foreground">AI Generated Interview Questions</h2>
        <ul className="space-y-4 list-decimal list-inside text-foreground">
          <li className="pl-2">
            <span className="font-medium">Can you describe a time you optimized a slow PostgreSQL query?</span>
            <p className="text-sm text-muted-foreground mt-1 ml-4 block">Focus on their indexing strategies and execution plan analysis.</p>
          </li>
          <li className="pl-2">
            <span className="font-medium">How do you handle state management in large React applications?</span>
            <p className="text-sm text-muted-foreground mt-1 ml-4 block">Look for understanding of Context API vs external stores like Redux/Zustand.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
