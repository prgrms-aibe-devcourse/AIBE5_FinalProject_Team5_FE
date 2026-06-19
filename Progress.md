# Progress

Last updated: 2026-06-19 (KST) — evening

## Current Workspace

- Frontend repo currently open: `D:\aibe5final\AIBE5_FinalProject_Team5_FE`
- Backend repo referenced during deployment/debugging: `D:\aibe5final\AIBE5_FinalProject_Team5_BE`
- Backend deployment target: AWS Elastic Beanstalk
- Elastic Beanstalk application: `team5-bootsignal`
- Elastic Beanstalk environment: `team5-bootsignal-prod`
- Region: `ap-northeast-2`
- Current public URL: `http://team5-bootsignal-prod.ap-northeast-2.elasticbeanstalk.com`
- Database: AWS RDS MySQL

## Completed

- Confirmed backend health endpoint implementation and security exposure.
- Verified `/api/health` is mapped and permitted without authentication.
- Confirmed the backend deployment flow uses GitHub Actions + Elastic Beanstalk, not CodePipeline.
- Verified backend GitHub Actions secrets were set:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
- Confirmed the backend app boots successfully after environment fixes.
- Verified the live backend health endpoint returns success.
- Confirmed the frontend is a Vite + React SPA with `BrowserRouter`, so static AWS hosting is appropriate.
- Verified the frontend production build succeeds with `npm.cmd run build`.
- Added frontend AWS deployment workflow:
  - [`.github/workflows/deploy-aws.yml`](.github/workflows/deploy-aws.yml)
- Added frontend AWS deployment notes:
  - [`docs/aws-deploy.md`](docs/aws-deploy.md)
- Added `VITE_API_BASE_URL` to `.env.example`.
- Confirmed the backend repo already contains S3-related configuration, but it is not yet active for user uploads.
- Documented the recommendation that the frontend should use its own S3 bucket, separate from backend artifact or future profile-image storage.

## Backend CI Investigation

- Investigated the failing backend GitHub Actions test job on PR `#72`.
- First failure cause:
  - Flyway placeholder/config mismatch during test startup.
  - Root cause was the test context not using the test profile cleanly.
- Applied a targeted test fix in the backend repo:
  - Added `@ActiveProfiles("test")` to `CourseSessionRepositorySortTest`.
- After that, the test context loaded and the Flyway issue no longer blocked startup.
- New failure cause:
  - `CourseSessionRepositorySortTest` fails on `bookmark` insert because `bookmark.user_id` points to a user row that does not exist in H2.
  - The FK violation is from `public.bookmark FOREIGN KEY(user_id) REFERENCES public.users(id)`.
- Resolution (direction changed):
  - Decided to fix the FK violation within the test itself using `userRepository.save()` to create minimal User rows before inserting bookmark rows.
  - `saveBookmarks()` now saves a real `User` entity via `userRepository` and uses its generated ID.
  - Also restored `@ActiveProfiles("test")`, `UserRepository`/`User` imports, and `userRepository` field that a linter had stripped.
  - All 3 tests in `CourseSessionRepositorySortTest` pass (`BUILD SUCCESSFUL` verified locally).

## Verified Notes

- Health controller:
  - `src/main/java/com/bootsignal/global/health/controller/HealthCheckController.java`
  - mapped to `/api/health`
- Security config:
  - `src/main/java/com/bootsignal/global/config/SecurityConfig.java`
  - includes permitAll for `/api/health`
- Backend test profile:
  - `src/test/resources/application-test.yml`
  - uses H2, disables Flyway, and keeps JPA in `create-drop`

## Current Status

- Backend service is reachable and no longer in a startup-failure state.
- Frontend AWS deployment path is defined as `GitHub Actions -> S3 -> CloudFront`.
- Frontend and backend S3 concerns should stay separated:
  - frontend static assets live in one bucket
  - backend artifacts can stay in EB deployment storage
  - backend file uploads can use a separate application bucket if needed later
- `CourseSessionRepositorySortTest` FK violation is resolved. All 3 tests pass locally.
- Remaining backend CI concern: confirm the fix passes on GitHub Actions (PR #72 or a new push).

## RDS Data Migration

- Dumped the full local Docker MySQL (`bootsignal`) using `mysqldump` inside the `bootsignal-mysql` container.
  - `--no-tablespaces` needed due to PROCESS privilege restriction.
  - Dump was done entirely inside the container to avoid PowerShell UTF-16 encoding issues.
- Imported the dump into RDS (`team5_bootsignal`) via the container's bash shell redirect.
- Verified import by running `SHOW TABLES;` against RDS — all tables present.
- `flyway_schema_history` was included in the dump, so Flyway will correctly skip V1 on next boot and only apply new migrations.
- RDS public access re-disabled after import. Security group IP rule (`39.125.67.220/32`) was pre-existing, not modified.

## Next Tasks

1. Push the `CourseSessionRepositorySortTest` fix to the backend repo and confirm CI passes on GitHub Actions.
2. Validate the frontend AWS workflow on a `main` push or manual dispatch (requires GitHub secrets: `VITE_API_BASE_URL`, `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_DISTRIBUTION_ID`).
3. Keep checking that no secrets or sensitive files are tracked in git.
4. Record any deployment or infrastructure changes here immediately.

## Claude Prompt

Use this prompt if you need to hand off the next step to Claude:

```text
Context:
- Frontend repo: D:\aibe5final\AIBE5_FinalProject_Team5_FE
- Backend repo: D:\aibe5final\AIBE5_FinalProject_Team5_BE
- We already added frontend AWS deployment support using GitHub Actions -> S3 -> CloudFront.
- Backend is on AWS Elastic Beanstalk and the live health check is working.
- The backend PR CI failed first because of Flyway/profile setup, and we fixed that by adding @ActiveProfiles("test") to CourseSessionRepositorySortTest.
- The remaining backend test failure is an H2 foreign key violation when inserting bookmark rows because the referenced user row does not exist.
- The user explicitly does NOT want a fake dummy-data workaround.
- The current direction is to use the existing SQL server data and import it into RDS instead.

Goal:
- Update progress tracking and continue the backend data migration / CI stabilization plan.

What to do next:
1. Inspect the existing SQL server schema/data import path.
2. Determine the safest way to migrate the full dataset into RDS.
3. Avoid inventing ad-hoc dummy rows unless absolutely necessary for test isolation.
4. Keep the progress log up to date after each meaningful step.
5. If any test or deployment change is made, verify it and record the result.
```

## Notes

- Update this file after every meaningful step.
- If a new chat is started, use this file as the source of truth instead of relying on long chat history.
- Do not store raw AWS keys, secrets, DB passwords, or tokens in this file.
