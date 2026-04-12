# InternsBridge 🚀

A futuristic dark-themed internship & job platform for students and companies.

## Tech Stack
- **React 18** (Create React App)
- **CSS Modules** (scoped styling)
- **Firebase** (Firestore + Hosting)
- **Vercel** (alternative hosting)

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm start
```
Opens at [http://localhost:3000](http://localhost:3000)

### 3. Build for production
```bash
npm run build
```

---

## Deploy to Vercel (Easiest)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your repo → click **Deploy**
4. Done! Vercel auto-detects React and uses `vercel.json` for routing.

---

## Deploy to Firebase Hosting

### First time setup
```bash
npm install -g firebase-tools
firebase login
firebase init
```
- Select **Hosting** and **Firestore**
- Set public directory to: `build`
- Configure as single-page app: **Yes**

### Update `.firebaserc` with your project ID
```json
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"
  }
}
```

### Deploy
```bash
npm run build
firebase deploy
```

---

## Project Structure

```
internsbridge/
├── public/
│   └── index.html              # HTML shell
├── src/
│   ├── index.js                # React entry point
│   ├── index.css               # Global styles & CSS variables
│   ├── App.js                  # Root component, page routing
│   ├── data.js                 # Jobs & companies data
│   └── components/
│       ├── Navbar.js           # Sticky navigation
│       ├── Navbar.module.css
│       ├── StudentPage.js      # Job listings & search
│       ├── StudentPage.module.css
│       ├── CompaniesPage.js    # Company directory
│       ├── CompaniesPage.module.css
│       ├── PostJobPage.js      # Post a job form
│       ├── PostJobPage.module.css
│       ├── ProfilePage.js      # Student dashboard
│       ├── ProfilePage.module.css
│       ├── Toast.js            # Notification toast
│       └── Toast.module.css
├── firebase.json               # Firebase hosting + Firestore config
├── firestore.rules             # Firestore security rules
├── .firebaserc                 # Firebase project reference
├── vercel.json                 # Vercel SPA routing
├── .gitignore
└── package.json
```

---

## Adding Firebase (Optional)

To connect real data, install Firebase SDK:
```bash
npm install firebase
```

Create `src/firebase.js`:
```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

Then replace the static `data.js` with Firestore reads using `getDocs` / `collection`.

---

## Customization

- **Colors & theme**: Edit CSS variables in `src/index.css`
- **Jobs data**: Edit `src/data.js`
- **Companies**: Edit `COMPANIES` array in `src/data.js`
- **Fonts**: Change Google Fonts import in `public/index.html` + `--font-display` / `--font-body` in `index.css`
