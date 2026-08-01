import Link from "next/link";

export default function Candidates() {
  const mockCandidates = [
    { id: "1", name: "Alice Smith", role: "Frontend Developer" },
    { id: "2", name: "Bob Johnson", role: "Backend Engineer" },
    { id: "3", name: "Charlie Davis", role: "Product Manager" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">Candidates</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors">
          Upload Resume
        </button>
      </div>
      
      <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
        <ul className="divide-y divide-border">
          {mockCandidates.map((candidate) => (
            <li key={candidate.id} className="p-4 hover:bg-muted/50 transition-colors">
              <Link href={`/candidates/${candidate.id}`} className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-foreground">{candidate.name}</h3>
                  <p className="text-sm text-muted-foreground">{candidate.role}</p>
                </div>
                <span className="text-primary hover:underline text-sm font-medium">View Details &rarr;</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
