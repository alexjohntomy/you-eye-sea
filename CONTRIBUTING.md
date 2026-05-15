# Contributing to YouEyeSea

Thanks for your interest in contributing! Here is a quick guide to get you started.

## Getting Started

1. Clone the repo
2. Run ```npm install``` to install dependencies
3. Run ```npx prisma dev --name="youeyesea"``` to start a local Prisma Postgres server and add the database URL to your environment variables (see env.example for reference)
4. Run ```npx prisma db push``` to push the schema to the database
5. Run ```npx tsx prisma/seed-sample-data.ts``` to seed the database with sample data (quickest, easiest) or if using [CSVs from UIC](https://oir.uic.edu/data/student-data/grade-distribution/), then place your CSVs in `/prisma/grade_distribution_data/`. You should then be able to run the `/prisma/seed.ts` script with minimal changes and see your database populate.

Then, run the development server as follows:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Codebase Overview

```
app/              — pages, API (OG image only), server utils
components/
  ui/             — shadcn/radix components (edit via CLI only)
  custom/         — app-specific components grouped by pane
lib/              — Prisma client, cache strategy, cn()
prisma/           — schema, migrations, seed scripts, sample CSVs
```

**Data flow:** Server Components query Prisma → pass data as props → Client Components render UI. No API routes except `/api/og` for page-specific OpenGraph images. URL search params drive all filters.

## Development Notes

- Sample data is pre-seeded in `prisma/sample_grade_distribution_data/` with fun characters
- Sample cache files (`sampleCourseList.tsx` etc.) are committed — search works out of the box in dev
- `process.env.NODE_ENV === "development"` switches behavior throughout (Prisma adapter, cache strategy, sample data merging)
- Recharts SSR warning is suppressed via `patches/recharts+3.8.1.patch` (auto-applied by `postinstall`)
- Semesters are stored as `"fall_2025"`, `"spring_2025"` etc. — `semesterToNumber()` converts to numeric sort keys (`20253`), `cleanSemesterName()` handles display (`"Fall 2025"`), optionally `{ format: "mini" }` for `"Fall '25"`


## Coding Standards

- **Components:** PascalCase (`GradeDistributionChart`), kebab-case filenames (`grade-distribution-chart.tsx`)
- **Utilities:** camelCase (`formatGradeData`, `calculateGPA`)
- **Server/Client split:** `*Server.tsx` fetches data → `*Pane.tsx` renders it (client)
- **Exports:** Named exports at bottom (`export { Foo }`), no default exports
- **`@/` path alias** for all imports
- **`const` over `let`** for non-mutating values
- **Interfaces/Types:** PascalCase, co-located with usage, avoid `any`
- **Data fetching:** Server Components query Prisma directly, `"use server"` only in `app/_util/` for mutations

## Before Submitting a PR

Ensure the UI is responsive (works on mobile, tablet, and desktop screen sizes) and works correctly in light and dark mode.

Run `npx tsc --noEmit` and address any type errors.

## Pull Request Process

1. Start by opening an issue describing the bug or feature
2. Fork the repo and create a branch
3. Make your changes
4. Run `npx tsc --noEmit` to check types
5. Open a PR referencing the issue
