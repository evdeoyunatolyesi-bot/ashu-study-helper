import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prettyDate, minutesToLabel } from "@/lib/utils";
import {
  BookOpen,
  Clock3,
  ListTodo,
  Target,
  ArrowUpRight,
} from "lucide-react";

export default async function Dashboard() {
  const db = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [
    { data: tasks },
    { data: sessions },
    { data: exams },
    { data: events },
    { data: rules },
  ] = await Promise.all([
    db.from("tasks").select("*").neq("status", "completed"),
    db.from("study_sessions").select("duration_minutes,started_at")
      .gte("started_at", today + "T00:00:00"),
    db.from("examinations").select("*")
      .gte("exam_date", today).order("exam_date").limit(4),
    db.from("timetable_events").select("*")
      .eq("event_date", today).order("start_time"),
    db.from("study_rules").select("*"),
  ]);

  const mins = (sessions || []).reduce(
    (n, s) => n + (s.duration_minutes || 0), 0
  );

  const cards = [
    [ListTodo, "Pending tasks", String(tasks?.length || 0), "text-violet-300"],
    [Clock3, "Study today", minutesToLabel(mins), "text-cyan-300"],
    [BookOpen, "Study sessions", String(sessions?.length || 0), "text-blue-300"],
    [Target, "Study rules", String(rules?.length || 0), "text-fuchsia-300"],
  ] as const;

  return (
    <>
      <div className="mb-8">
        <p className="label">{prettyDate()}</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          Welcome back, <span className="gradient-text">Student</span>.
        </h1>
        <p className="muted mt-2">
          A focused plan turns big goals into daily progress.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {cards.map(([Icon, label, value, color]) => (
          <div className="glass card" key={label}>
            <div className="flex justify-between">
              <span className="label">{label}</span>
              <Icon className={color} />
            </div>
            <div className="text-3xl font-bold mt-5">{value}</div>
            <p className="text-xs text-slate-500 mt-1">
              Based on your saved records
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="glass card">
          <div className="flex justify-between mb-5">
            <h2 className="text-lg font-semibold">Today's timetable</h2>
            <Link href="/app/timetable" className="text-xs text-cyan-300">
              Manage <ArrowUpRight size={13} className="inline" />
            </Link>
          </div>

          {events?.length ? events.map((e) => (
            <div key={e.id} className="flex gap-4 py-3 border-b border-white/5">
              <div className="text-cyan-200 text-sm w-24">
                {e.start_time?.slice(0, 5)} – {e.end_time?.slice(0, 5)}
              </div>
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-xs muted">{e.subject || e.event_type}</p>
              </div>
            </div>
          )) : (
            <p className="muted text-sm py-8 text-center">
              No sessions scheduled for today.
            </p>
          )}
        </section>

        <section className="glass card">
          <div className="flex justify-between mb-5">
            <h2 className="text-lg font-semibold">Upcoming examinations</h2>
            <Link href="/app/exams" className="text-xs text-cyan-300">
              View all <ArrowUpRight size={13} className="inline" />
            </Link>
          </div>

          {exams?.length ? exams.map((e) => (
            <div key={e.id} className="flex justify-between items-center py-3 border-b border-white/5">
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-xs muted">{e.subject || "Subject not set"}</p>
              </div>
              <span className="text-xs text-violet-200 bg-violet-400/10 rounded-full px-3 py-1">
                {Math.max(0, Math.ceil(
                  (new Date(e.exam_date).getTime() - Date.now()) / 86400000
                ))} days
              </span>
            </div>
          )) : (
            <p className="muted text-sm py-8 text-center">
              Add an exam to start your countdown.
            </p>
          )}
        </section>
      </div>

      <section className="mt-5 glass card">
        <h2 className="font-semibold mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            ["Add Task", "/app/tasks"],
            ["Create Timetable", "/app/timetable"],
            ["Start Focus Session", "/app/focus"],
            ["Add Study Rule", "/app/rules"],
            ["Create Notes", "/app/notes"],
          ].map(([t, u]) => (
            <Link
              className="rounded-xl border border-slate-700 px-4 py-3 text-sm hover:border-violet-400 hover:bg-violet-400/5"
              href={u}
              key={u}
            >
              ＋ {t}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
