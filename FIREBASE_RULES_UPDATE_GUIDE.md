# 🔐 Firebase Firestore Rules Update Guide

## Problem Identified

You're experiencing **permission-denied errors** when trying to receive messages in your app. The issue is that your Firestore security rules are too restrictive and don't properly allow users to query messages where they are the recipient.

### Specific Errors You're Seeing:
- `FirebaseError: [code=permission-denied]: Missing or insufficient permissions`
- Messages can be sent but not received by the project owner
- Errors occur in `MessagesPage.tsx` when loading conversations

## Root Cause

The current Firestore rules for the `messages` collection don't properly support the queries your app makes:

```javascript
// These queries in MessagesPage.tsx require proper rules:
where('toUserId', '==', currentUser.uid)   // Receive messages
where('fromUserId', '==', currentUser.uid) // Sent messages
```

## Solution: Update Firestore Rules

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your **cofndrly** project
3. In the left sidebar, click **Firestore Database**
4. Click the **Rules** tab at the top

### Step 2: Replace the Rules

Copy the ENTIRE content from `FIRESTORE_RULES.txt` and paste it into the Firebase Console Rules editor.

**The key changes for messages collection:**

```javascript
// Messages collection - stores conversations
match /messages/{messageId} {
  // Users can create messages when authenticated
  allow create: if request.auth != null &&
                   request.resource.data.fromUserId == request.auth.uid;
  
  // Users can read messages where they are sender or recipient
  // This allows queries like: where('toUserId', '==', uid) and where('fromUserId', '==', uid)
  allow read: if request.auth != null &&
                 (resource.data.fromUserId == request.auth.uid || 
                  resource.data.toUserId == request.auth.uid);
  
  // Users can update messages (e.g., mark as read)
  // Only the recipient can update (to mark as read)
  allow update: if request.auth != null &&
                   resource.data.toUserId == request.auth.uid;
}
```

### Step 3: Publish the Rules
1. After pasting the new rules, click **Publish** button
2. Wait for confirmation that rules are published (usually takes a few seconds)

### Step 4: Test the Changes
1. **Clear your browser cache** or open an **Incognito/Private window**
2. Sign in to your app
3. Have someone send you a project interest message
4. Check if you can now receive the message in the Messages page
5. Verify no console errors appear

## What Changed?

### 1. **Messages Collection** (Main Fix)
- ✅ Added proper validation that sender is authenticated user
- ✅ Allows reading messages where user is sender OR recipient
- ✅ Supports the specific Firestore queries used in your app
- ✅ Only recipients can mark messages as read

### 2. **Projects Collection** (Added)
- ✅ Users can create their own projects
- ✅ All authenticated users can browse projects
- ✅ Only project owners can edit/delete their projects

### 3. **Users Collection** (Already Good)
- ✅ Anyone can create account (signup)
- ✅ Only approved users visible for matching
- ✅ Admin can manage all users

## Why This Fixes Your Issue

**Before:** The rules said `allow read: if request.auth != null;` which seems permissive, but Firestore requires rules that explicitly allow the specific query conditions being used.

**After:** The new rules explicitly allow queries filtering by `toUserId` and `fromUserId` matching the authenticated user, which is exactly what `MessagesPage.tsx` does.

## Security Notes

These rules are secure because:
- ✅ Users can only read their own messages (sender or recipient)
- ✅ Users can only create messages from their own account (no spoofing)
- ✅ Users can only mark their received messages as read
- ✅ All operations require authentication
- ✅ Users cannot access other people's conversations

## Verification Checklist

After updating rules, verify these work:

- [ ] Send a project interest message (should still work)
- [ ] Receive a project interest message (should now work!)
- [ ] View messages list in Messages page (no permission errors)
- [ ] Open a conversation and see messages (should work)
- [ ] Send messages in chat (should still work)
- [ ] View projects page (should work)
- [ ] Create a new project (should work)
- [ ] No console errors for permissions

## If Issues Persist

1. **Check Firebase Console** → Firestore Database → Rules tab to confirm rules were published
2. **Clear browser cache completely** and reload the app
3. **Check browser console** for specific error messages
4. **Verify you're signed in** - these rules require authentication
5. **Check that messages have correct structure:**
   - `fromUserId` field exists
   - `toUserId` field exists
   - Both fields are strings matching user IDs

## Additional Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Query Security in Firestore](https://firebase.google.com/docs/firestore/security/rules-query)

---

**Need Help?** If issues persist after following this guide, check:
1. Firebase Console for any rule syntax errors
2. Browser console for detailed error messages
3. Ensure Firebase project is the correct one (cofndrly)

