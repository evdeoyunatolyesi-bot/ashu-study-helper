# ASHU STUDY HELPER

A Next.js + Supabase academic organizer. No AI chat, tutor, assistant, or AI integration is included.

## Included
- Supabase email/password authentication and protected dashboard.
- Responsive dark dashboard and sidebar navigation.
- Persistent Supabase CRUD for subjects, timetable, tasks, study rules, habits, exams, notes, flashcards, quizzes and notifications.
- Focus timer with session logging.
- Analytics from recorded study sessions and task data.
- SQL schema with user-scoped Row Level Security.
- CSV export of selected records from the browser.

## Setup
1. Install Node.js 20+ and create a Supabase project.
2. In Supabase SQL Editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and add your Supabase project URL and anon key.
4. In Supabase Authentication settings, enable Email provider. For local testing, you may disable email confirmation; for production, keep confirmation enabled and configure SMTP.
5. Run:
   ```bash
   npm install
   npm run dev
   ```
6. Open http://localhost:3000 and sign up.

## Vercel
1. Push this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel Environment Variables.
4. Deploy. Add your Vercel domain to Supabase Auth URL Configuration (Site URL and Redirect URLs).

## Notes
- Supabase RLS is the security boundary. Never expose a service-role key in the browser.
- This is a functional foundation. Rich PDF preview, drag-and-drop timetable editing, browser push notifications, recurring-rule automation, and advanced quiz authoring are not included in this first source package.
- Upload fields store metadata/URLs; configure a private Supabase Storage bucket and policies before enabling production file uploads.
