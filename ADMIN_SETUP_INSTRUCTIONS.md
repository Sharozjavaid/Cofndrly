# Admin Dashboard Setup Instructions

## Important: Follow these steps to fix the admin dashboard access issue

### Step 1: Update Firestore Rules in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules** (in the left sidebar)
4. Replace the current rules with the updated rules from `FIRESTORE_RULES.txt`
5. Click **Publish** to apply the changes

The new rules allow the admin user (`admin@cofndrly.com`) to read, update, and delete all users in the database.

### Step 2: Create Admin Account in Firebase Authentication

You need to create an admin user account in Firebase Authentication:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** (in the left sidebar)
4. Click on the **Users** tab
5. Click **Add user** button
6. Enter the following credentials:
   - **Email**: `admin@cofndrly.com`
   - **Password**: `cofndrly2025` (or your preferred secure password)
7. Click **Add user**

### Step 3: Test Admin Login

1. Open your app and navigate to `/admin`
2. Sign in with:
   - Email: `admin@cofndrly.com`
   - Password: `cofndrly2025` (or the password you set)
3. You should now be able to access the admin dashboard and see all applications

### What Changed?

**Before:**
- Admin login used sessionStorage (client-side only)
- Firestore rules didn't allow reading unapproved users
- Admin couldn't access pending applications

**After:**
- Admin login uses Firebase Authentication
- Firestore rules check if the authenticated user's email is `admin@cofndrly.com`
- Admin can read ALL users (approved and pending) in the dashboard
- Admin can update and delete any user

### Security Notes

- The admin account is protected by Firebase Authentication
- Only users signed in with `admin@cofndrly.com` email can access admin features
- Regular users can only read approved profiles (for matching)
- Make sure to use a strong password for the admin account in production

### Troubleshooting

**If you still see "Missing or insufficient permissions" error:**

1. Make sure you published the updated Firestore rules
2. Verify the admin user exists in Firebase Authentication with email `admin@cofndrly.com`
3. Sign out and sign in again with admin credentials
4. Check the browser console for any auth errors

**If admin login doesn't work:**

1. Make sure the admin account exists in Firebase Authentication
2. Verify you're using the correct password
3. Check that the email is exactly `admin@cofndrly.com` (case sensitive)

