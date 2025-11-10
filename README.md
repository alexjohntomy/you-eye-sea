
<h1 align="center">
  <img src="https://github.com/alexjohntomy/you-eye-sea/blob/main/public/logo.png" alt="YouEyeSea Logo" width="150">
    <a href="http://youeyesea.com">
        <h3>YouEyeSea</h3>
    </a>
</h1>

## Summary
YouEyeSea uses UIC’s publicly available official grade data to create a more intuitive front end featuring fuzzy search, fine-grain filtering, discussion boards, and data visualization. 

## Tech Stack

- [Next.js](https://nextjs.org/) – Framework
- [TypeScript](https://www.typescriptlang.org/) – Language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Prisma](https://www.prisma.io/) - Postgres & ORM
- [PapaParse](https://www.papaparse.com) - CSV Parsing
- [Prettier](https://prettier.io) - Code Formatting
- [Vercel](https://vercel.com/) – Deployment
- [shadcn/ui](https://ui.shadcn.com/) - Components

## Building from Source
First, create a Prisma database and set up your environment variables. Then, place your CSVs in `/prisma/grade_distribution_data/`. If using CSVs from UIC, you should be able to run the `/prisma/seed.ts` script with minimal changes and see your database populate. 

Then, run the development server as follows:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributions
Want to be part of YouEyeSea's development? You can do so by creating an issue in the repo, forking the project, creating a branch for your addition/fix, committing your changes, pushing to the main branch, and opening a pull request. If you have any ideas for features you'd like to see, feel free to open those in the issues panel too.

## License
YouEyeSea is licensed under [AGPL-V3](https://opensource.org/license/agpl-v3). See `LICENSE.txt` for more info.