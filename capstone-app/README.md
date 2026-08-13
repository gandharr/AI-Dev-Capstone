This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Generative UI & Tool Contract

This project features Generative UI with interactive tool components. The chat assistant can utilize the following server-side tool:

### `scoreLead`
**Description**: Scores a lead based on company information.
**Trigger**: Called when the AI has gathered `companyName`, `employeeCount`, and `industry`.

**Schema**:
```typescript
{
  companyName: string;   // The name of the company.
  employeeCount: number; // The number of employees at the company.
  industry: string;      // The industry the company operates in.
}
```

**Return Shape**:
```typescript
{
  companyName: string; // The company name provided
  score: number;       // A calculated score from 0 to 100
  tier: string;        // 'Tier 1', 'Tier 2', or 'Tier 3' based on score
  timestamp: string;   // ISO string timestamp of the scoring
}
```

**UI States**:
- **`input-streaming`**: Displays a skeleton loading state ("Gathering info...").
- **`input-available`**: Displays an active executing state ("Scoring lead...").
- **`output-available` (Success)**: Renders a Score Card component with the score, industry, and employee count.
- **`output-error` (Error)**: Displays an error card (try providing "Error" as the company name to see this).

### `analyzeMarketTrends`
**Description**: Analyzes market trends for a specific industry or sector.
**Trigger**: Called when the AI needs to show trends, growth, or market charts.

**Schema**:
```typescript
{
  industry: string; // The industry to analyze (e.g., tech, healthcare, finance)
}
```

**Return Shape**:
```typescript
{
  industry: string; // The industry analyzed
  trend: 'up' | 'down' | 'flat'; // The overall trend direction
  dataPoints: {
    month: string; // The month (e.g., 'Jan')
    value: number; // The value for that month
  }[];
}
```

**UI States**:
- **`input-streaming`**: Displays a skeleton loading state ("Preparing market analysis...").
- **`input-available`**: Displays an active executing state ("Analyzing market trends...").
- **`output-available` (Success)**: Renders a responsive, hand-rolled SVG bar chart showing the time-series data.
- **`output-error` (Error)**: Displays an error card.

