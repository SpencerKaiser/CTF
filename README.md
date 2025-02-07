# CTF

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Quality scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier

### Challenge Progress Data

Challenge progress data is stored within `./challengeProgress.json`; to reset it, simply delete the file and restart the app.

### Dev User Journey

Here is the ideal flow for devs to complete the CTF:

- Dev lands on homepage and inspects
- Dev sees the `/users/me` endpoint and notices the `expanded` query param
- Dev attempts `/users` endpoint and gets results
- Dev adds `expanded` to `/users` query and gets additional results (including last name)
  - Dev may either see the `hasTempPassword` value OR may see the header
- Dev attempts to sign into a user with their temp password set and sees error
- Dev successfully signs into user account (using the identified last name) and views items
- Dev sees (TODO) `/items` endpoint in browser and notices value indicating some are hidden
- Later, dev either paginates or uses all and identifies admin user
- Dev examines data and identifies admin with temp password and signs in as admin
- Dev queries ALL items using the same pagination associated with users (TODO)
- Dev identifies the secret item
- Dev attempts to make PUT/PATCH against the item to make it public

Enhancements:

- Confetti on progress
- Notification on sign in
- Add style to title of challenge and icon
- Add fake header/value to ctf response
- Add easter eggs to ctf response
