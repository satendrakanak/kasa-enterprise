"use client";

import { WeeklyProgress } from "@/types/user";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProgressChartProps {
  weeklyProgress: WeeklyProgress[];
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const normalizeWeeklyProgress = (weeklyProgress: WeeklyProgress[]) => {
  const progressByDay = new Map(
    weeklyProgress.map((item) => [
      item.day.slice(0, 3),
      Number(item.progress) || 0,
    ]),
  );

  return WEEK_DAYS.map((day) => ({
    day,
    progress: progressByDay.get(day) ?? 0,
  }));
};

export default function ProgressChart({ weeklyProgress }: ProgressChartProps) {
  const chartData = normalizeWeeklyProgress(weeklyProgress);
  const highestValue = Math.max(...chartData.map((item) => item.progress), 0);
  const hasProgress = chartData.some((item) => item.progress > 0);
  const chartMax = Math.max(100, Math.ceil(highestValue / 10) * 10);

  return (
    <div className="h-full rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#07111f] dark:shadow-[0_24px_70px_rgba(0,0,0,0.32)] md:p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700 dark:text-rose-200">
            Weekly Progress
          </p>

          <h4 className="mt-2 text-lg font-semibold text-slate-950 dark:text-white">
            Your learning rhythm
          </h4>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Progress completed across the current week.
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-right dark:border-rose-200/20 dark:bg-rose-200/10">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-700 dark:text-rose-200">
            Peak
          </p>

          <p className="text-lg font-semibold leading-none text-slate-950 dark:text-white">
            {highestValue}%
          </p>
        </div>
      </div>

      <div className="h-[220px] rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-[#0b1628]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 12, right: 10, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="weekly-progress-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.35} />
                <stop offset="65%" stopColor="#38bdf8" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="rgba(148,163,184,0.28)"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: "#94A3B8",
                fontWeight: 600,
              }}
            />

            <YAxis
              hide={!hasProgress}
              domain={[0, chartMax]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 11,
                fill: "#94A3B8",
                fontWeight: 500,
              }}
              tickFormatter={(value) => `${value}%`}
            />

            <Tooltip
              cursor={{ stroke: "#94A3B8", strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.10)",
                boxShadow: "0 20px 45px rgba(2,6,23,0.22)",
                background: "rgba(2,6,23,0.94)",
                color: "#F8FAFC",
              }}
              labelStyle={{
                color: "#F8FAFC",
                fontWeight: 700,
              }}
              formatter={(value) => [`${Number(value || 0)}%`, "Progress"]}
              labelFormatter={(label) => `${label}`}
            />

            <Area
              type="monotone"
              dataKey="progress"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#weekly-progress-fill)"
              dot={{
                r: 4,
                strokeWidth: 2,
                stroke: "#2563eb",
                fill: "#ffffff",
              }}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                stroke: "#2563eb",
                fill: "#ffffff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {!hasProgress ? (
        <p className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-4 text-sm leading-6 text-slate-500 dark:border-white/10 dark:bg-[#0b1628] dark:text-slate-400">
          Start watching lessons this week and your progress trend will appear
          here.
        </p>
      ) : null}
    </div>
  );
}
