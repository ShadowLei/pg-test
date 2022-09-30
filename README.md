# pg-test

#This is a test for pg Memory Leak issue


1. Modify `config.json` - `TODO here` parts for your test db connection.
2. Run `db.sql` to create db | table
4. Check `src/app.ts`, uncomment the prepare data section to insert more than 20,000 records w/ cmd: `npm run start`.
5. Revert & run the test in `src/app.ts` (by default 200 concurrent operations) to verify w/ cmd: `npm run start`

