# Goal Description

The goal is to connect a secondary, read-only Prisma client to a MongoDB database containing the `videoclinic` data, specifically focusing on the `expertWeek` collection as described in the specification [`planning.md`](../../../mongodb-mapping/planning.md#entity-expert-week). An oRPC backend procedure will be created to query the database and a new page with a paginated, sortable, and searchable data table using shadcn components will be added to the application. A new menu item will link to this table.

## User Review Required

> [!WARNING]
> The database `_id` field for `expertWeek` is described as a `Long` in the specification. Prisma generally prefers `ObjectId` or generic `String` for MongoDB `_id` fields. I will model it as `BigInt` or `Int` along with other `Long` fields (`userId`, `version`). If there are issues querying `Long` IDs with Prisma, I may need to adjust the schema mapping.
> Do you have any preference for the menu name? I'll use "Expert Weeks" (translated as needed) under the Application layout by default.

## Proposed Changes

### Prisma & Environment Configuration
#### [MODIFY] `.env` & `.env.example`
- Add `MONGODB_URL` with the connection string `mongodb://dev:pwd@ferretdb.vc.str84ward.net:27018/videoclinic?tls=true&tlsInsecure=true`

#### [NEW] `prisma/schema-mongodb.prisma`
- Create a secondary Prisma schema for the `expertWeek` model.
- Configure generator to output to `../src/server/db/generated-mongodb`.

#### [MODIFY] `package.json`
- Update the `gen:prisma` script to generate both Prisma clients: `prisma generate --schema prisma/schema.prisma --no-hints && prisma generate --schema prisma/schema-mongodb.prisma --no-hints`.

#### [MODIFY] `src/server/db/index.ts`
- Initialize and export `dbMongoDB` from `generated-mongodb`.

### Phase 1: Backend Workflow
#### [NEW] `src/server/routers/expert-week.ts`
- Implement oRPC procedure `expertWeek.list` to fetch `expertWeek` data.
- Support offset-based pagination (`limit`, `page`), sorting (`sortBy`, `sortOrder`), and full-text search across string fields.
- **Search implementation:** 
  - To search across `UserProfile.displayName`, first execute a query against the `user` collection to find matching `_id`s, then pass those `userId`s via an `IN` operator (or use an aggregation/join if supported/optimal for MongoDB via Prisma).
  - Use Prisma's equivalent for MongoDB's `$or` and `$regex` by passing `where: { OR: [ { field: { contains: searchPhrase, mode: 'insensitive' } }, ... ] }`.
  - Ensure the search logic handles diacritics (e.g., matching "ö" with "o" if possible, or using MongoDB's native collations for diacritic-insensitive search by configuring the Prisma connection map/raw query if required).
- **Formatting Logic:** Implement a utility function to convert `slotsMo` through `slotsSu` arrays (which contain numbers 1-24) into coherent 24-hour format strings (e.g., `8-11, 13-15, 18-22`). If the array is empty, output `N/A`. Apply this to the returned data or as a dedicated frontend formatter.
- **Data fallback**: For unresolved users, return "Unknown User #[userId]".

#### [MODIFY] `src/server/router.ts` & `src/server/orpc.ts`
- Register the `expertWeek` router in the main oRPC router.

### Phase 2: Frontend Workflow
#### [NEW] `src/features/expert-week/pages/expert-weeks-page.tsx`
- Create the page rendering a data table with shadcn components.
- Integrate `@tanstack/react-table` with pagination (25, 50, 100), sorting, and search input.
- **Table adjustments:**
  - Drop `_id` and `version` columns from the visualization in the table (they won't be displayed).
  - Add a feature to enable and disable columns using the column visibility feature provided by shadcn's Data Table implementation (with a Dropdown Menu).
  - For weekday columns (`slots...`), display the transformed 24-hour time ranges (e.g., `8-11, 13-15, 18-22`) or `N/A`.
- **Error Handling:** Implement a dedicated error state component with a "Reload" button that displays instead of the table if the query fails.
- Fetch data using `useQuery` via the `orpc` client.

#### [NEW] `src/routes/app/expert-weeks/index.tsx`
- Define the TanStack route for the new page.

#### [MODIFY] `src/layout/app/main-nav-config.ts`
- Add "Expert Weeks" to `MAIN_NAV_LINKS`.

## Verification Plan

### Automated Tests
- Run `pnpm gen:prisma` to ensure both Prisma clients generate successfully.
- Run `pnpm typecheck` to verify TypeScript typings.
- Run `pnpm lint` to ensure code style compliance.
- Run `pnpm build` to verify the application builds without errors.

### Manual Verification
- Start the application with `pnpm dev`.
- Log in to the application and verify the new "Expert Weeks" menu item appears in the sidebar.
- Click the menu item and verify the data table loads `expertWeek` entries from the MongoDB database.
- Test pagination (switch between 25, 50, 100 items per page).
- Test column sorting by clicking on column headers.
- Test the search functionality by typing into the search input and verifying the table filters correctly across different fields.
- Test the column visibility toggles (ensure `_id` and `version` are excluded by default) and showing/hiding other columns.
