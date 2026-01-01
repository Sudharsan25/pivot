/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats } from '@/store/urgesSlice';
import { urgesAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Tooltip from '@radix-ui/react-tooltip';
import { FeedbackForm } from '@/components/FeedbackForm';

interface UrgeTypeStat {
  habitId: string;
  habitName: string;
  totalResisted: number;
  totalGaveIn: number;
  totalDelayed: number;
  totalUrges: number;
}

function AnimatedCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number | null = null;
    const start = performance.now();
    const from = display;
    const to = value;
    const duration = 600;
    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const current = Math.round(from + (to - from) * t);
      setDisplay(current);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{display}</span>;
}

/**
 * Very small inline time-series chart implementation using SVG.
 * Expects data: Array<{ bucket: string, habitName: string, count: number }>
 */
function TimeSeriesChart({
  data,
  height = 220,
  colors = ['#06b6d4', '#7c3aed', '#a3e635', '#fb7185', '#f59e0b', '#60a5fa'],
}: {
  data: Array<{ bucket: string; habitName: string; count: number }>;
  height?: number;
  colors?: string[];
}) {
  // Build axis points
  const { points, types, buckets } = useMemo(() => {
    const bucketSet = new Set<string>();
    const typeSet = new Set<string>();
    for (const r of data) {
      bucketSet.add(r.bucket);
      typeSet.add(r.habitName);
    }
    const buckets = Array.from(bucketSet).sort();
    const types = Array.from(typeSet).sort();

    // Build points: for each bucket, map counts per type
    const points = buckets.map((b) => {
      const entry: Record<string, number | string> = { bucket: b };
      for (const t of types) {
        entry[t] = 0;
      }
      return entry;
    });

    for (const r of data) {
      const idx = buckets.indexOf(r.bucket);
      if (idx >= 0)
        points[idx][r.habitName] =
          (points[idx][r.habitName] as number) + r.count;
    }

    console.log(
      '[TimeSeriesChart] Buckets:',
      buckets,
      'Types:',
      types,
      'Points:',
      points
    );
    return { points, types, buckets };
  }, [data]);

  if (buckets.length === 0) {
    console.log('[TimeSeriesChart] No buckets, returning null');
    return null;
  }

  const width = Math.max(300, buckets.length * 80);
  const padding = { top: 16, right: 12, bottom: 40, left: 40 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  // max value across all series
  const max = Math.max(
    1,
    ...points.flatMap((p) =>
      Object.keys(p)
        .filter((k) => k !== 'bucket')
        .map((k) => Number(p[k] as number))
    )
  );

  console.log(
    '[TimeSeriesChart] Max value:',
    max,
    'Width:',
    width,
    'Inner:',
    innerW,
    'Height:',
    innerH
  );

  const x = (i: number) => {
    if (buckets.length === 1) {
      return padding.left + innerW / 2;
    }
    return padding.left + (i / (buckets.length - 1)) * innerW;
  };

  const y = (v: number) => padding.top + innerH - (v / max) * innerH;

  const seriesPaths = types.map((t, ti) => {
    const pathPoints = points
      .map(
        (p, i) =>
          `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(2)} ${y(Number(p[t] as number)).toFixed(2)}`
      )
      .join(' ');
    console.log(`[TimeSeriesChart] Series "${t}":`, pathPoints);
    return { type: t, path: pathPoints, color: colors[ti % colors.length] };
  });

  return (
    <div className="overflow-x-auto">
      <svg
        width={width}
        height={height}
        className="mx-auto border border-slate-200 rounded"
      >
        <rect x={0} y={0} width={width} height={height} fill="#fafafa" />

        {/* grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <line
            key={i}
            x1={padding.left}
            x2={width - padding.right}
            y1={padding.top + innerH * (1 - f)}
            y2={padding.top + innerH * (1 - f)}
            stroke="#e6eef6"
            strokeWidth={1}
          />
        ))}

        {/* Y axis */}
        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#94a3b8"
          strokeWidth={2}
        />

        {/* X axis */}
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#94a3b8"
          strokeWidth={2}
        />

        {/* series */}
        {seriesPaths.map((s) => (
          <path
            key={s.type}
            d={s.path}
            fill="none"
            stroke={s.color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* data points as circles */}
        {points.map((p, pi) =>
          types.map((t, ti) => (
            <circle
              key={`${pi}-${t}`}
              cx={x(pi)}
              cy={y(Number(p[t] as number))}
              r={4}
              fill={colors[ti % colors.length]}
              opacity={0.7}
            />
          ))
        )}

        {/* x labels */}
        {buckets.map((b, i) => (
          <text
            key={b}
            x={x(i)}
            y={height - 8}
            fontSize={10}
            textAnchor="middle"
            fill="#475569"
          >
            {new Date(b).toLocaleDateString()}
          </text>
        ))}

        {/* Y axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
          const val = Math.round(max * f);
          return (
            <text
              key={`y-${i}`}
              x={padding.left - 8}
              y={padding.top + innerH * (1 - f) + 4}
              fontSize={9}
              textAnchor="end"
              fill="#64748b"
            >
              {val}
            </text>
          );
        })}
      </svg>

      {/* legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {seriesPaths.map((s) => (
          <div key={s.type} className="flex items-center gap-2 text-sm">
            <span
              style={{
                width: 12,
                height: 8,
                background: s.color,
                display: 'inline-block',
                borderRadius: 2,
              }}
            />
            <span className="text-slate-700 font-medium">{s.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StatsPage() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((s) => s.urges);
  const [statsByType, setStatsByType] = useState<UrgeTypeStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<'urge-stats' | 'time-series'>(
    'urge-stats'
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Default to today's date in YYYY-MM-DD format
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [timeSeries, setTimeSeries] = useState<
    Array<{ bucket: string; habitName: string; count: number }>
  >([]);
  const [tsLoading, setTsLoading] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchStats());
    loadStatsByType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const loadStatsByType = async () => {
    setIsLoading(true);
    try {
      const data = await urgesAPI.getStatsByType();
      // Ensure totalDelayed is present (for backward compatibility)
      const normalizedData = data.map((stat) => ({
        ...stat,
        totalDelayed: stat.totalDelayed || 0,
      }));
      setStatsByType(normalizedData);
    } catch (e) {
      console.error('Failed to load stats by habit:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await Promise.all([dispatch(fetchStats()).unwrap(), loadStatsByType()]);
      //setLastUpdated(new Date());
    } catch (e) {
      console.error('Failed to refresh:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTimeSeries = async (dateStr: string) => {
    console.log(`[StatsPage.loadTimeSeries] Starting load for date=${dateStr}`);
    setTsLoading(true);
    try {
      const data = await urgesAPI.getTimeSeriesByDate(dateStr);
      console.log(
        `[StatsPage.loadTimeSeries] Received ${data?.length || 0} entries:`,
        data
      );
      setTimeSeries(data || []);
    } catch (e) {
      console.error(
        '[StatsPage.loadTimeSeries] Failed to load time-series:',
        e
      );
    } finally {
      setTsLoading(false);
    }
  };

  const total = stats?.totalUrges ?? 0;
  //const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <h2 className="text-3xl font-semibold text-slate-800">Stats</h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={isLoading || loading.fetchingStats}
            variant="ghost"
            size="sm"
            className="inline-flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 transition-transform ${isLoading || loading.fetchingStats ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as any);
          if (v === 'time-series') loadTimeSeries(selectedDate);
        }}
        className="space-y-4"
      >
        <Tabs.List className="flex gap-2">
          <Tabs.Trigger
            value="urge-stats"
            className="px-3 py-1 rounded-md bg-slate-100"
          >
            Stats
          </Tabs.Trigger>
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Tabs.Trigger
                  value="time-series"
                  disabled
                  className="px-3 py-1 rounded-md bg-slate-100 opacity-50 cursor-not-allowed"
                >
                  Time Analysis
                </Tabs.Trigger>
              </Tooltip.Trigger>
              <Tooltip.Content className="bg-slate-800 text-white text-sm rounded px-2 py-1">
                Coming soon
              </Tooltip.Content>
            </Tooltip.Root>
          </Tooltip.Provider>
        </Tabs.List>

        <Tabs.Content value="urge-stats">
          {/* Overall Stats */}
          {stats && total > 0 && (
            <motion.div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">
                Overall Stats
                <Link
                  to="/dashboard/info?page=0"
                  className="ml-3 text-sm text-blue-600 font-light hover:underline hidden sm:inline"
                >
                  Why this works?
                </Link>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center p-4 bg-celadon-50 rounded-lg">
                  <p className="text-sm text-celadon-700 mb-2">Resisted</p>
                  <AnimatedCounter
                    value={stats.totalResisted}
                    className="text-4xl font-bold text-celadon-600"
                  />
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-700 mb-2">Delayed</p>
                  <AnimatedCounter
                    value={stats.totalDelayed || 0}
                    className="text-4xl font-bold text-amber-600"
                  />
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-muted-teal-50 rounded-lg">
                  <p className="text-sm text-muted-teal-700 mb-2">Gave In</p>
                  <AnimatedCounter
                    value={stats.totalGaveIn}
                    className="text-4xl font-bold text-muted-teal-500"
                  />
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-lime-cream-50 rounded-lg">
                  <p className="text-sm text-lime-cream-700 mb-2">Total</p>
                  <AnimatedCounter
                    value={stats.totalUrges}
                    className="text-4xl font-bold text-lime-cream-700"
                  />
                </div>
              </div>
              {/* Medical Disclaimer */}
              <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <h4 className="font-semibold text-amber-900 text-sm mb-2">
                    Disclaimer: About this data
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    These stats reflect your logged progress over time. They are
                    meant for self-reflection and do not represent mental health
                    or clinical information.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats by Urge Type - Columnar View */}
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ) : statsByType.length === 0 && total === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <p className="text-2xl font-semibold text-slate-800">
                No urges logged yet
              </p>
              <p className="text-sm text-muted-teal-700 mt-3">
                Start by logging your first urge on the Home page.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800">
                Breakdown by Habit
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {statsByType.map((stat, idx) => (
                  <motion.div
                    key={stat.habitId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <h4 className="font-semibold text-slate-800 mb-4">
                      {stat.habitName}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Resisted</span>
                        <span className="text-lg font-bold text-celadon-600">
                          {stat.totalResisted}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Delayed</span>
                        <span className="text-lg font-bold text-amber-600">
                          {stat.totalDelayed || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Gave In</span>
                        <span className="text-lg font-bold text-muted-teal-500">
                          {stat.totalGaveIn}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-700">
                            Total
                          </span>
                          <span className="text-lg font-bold text-lime-cream-700">
                            {stat.totalUrges}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Button */}
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setFeedbackOpen(true)}
              className="text-slate-700 hover:text-slate-900"
            >
              Leave your feedback
            </Button>
          </div>
        </Tabs.Content>

        <Tabs.Content value="time-series">
          <div className="space-y-4">
            {/* Date navigation */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const prev = new Date(selectedDate);
                    prev.setDate(prev.getDate() - 1);
                    const dateStr = prev.toISOString().split('T')[0];
                    setSelectedDate(dateStr);
                    loadTimeSeries(dateStr);
                  }}
                >
                  ← Previous day
                </Button>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    loadTimeSeries(e.target.value);
                  }}
                  className="px-3 py-2 border border-slate-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-celadon-500"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const next = new Date(selectedDate);
                    next.setDate(next.getDate() + 1);
                    const dateStr = next.toISOString().split('T')[0];
                    setSelectedDate(dateStr);
                    loadTimeSeries(dateStr);
                  }}
                >
                  Next day →
                </Button>
              </div>
            </div>

            {/* Chart */}
            {tsLoading ? (
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ) : timeSeries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <p className="text-2xl font-semibold text-slate-800">
                  No urges logged on{' '}
                  {new Date(selectedDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Select a different date to view hourly urge patterns
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Hourly urge occurrences on{' '}
                  {new Date(selectedDate).toLocaleDateString()}
                </h3>
                <TimeSeriesChart data={timeSeries} />
              </div>
            )}
          </div>
        </Tabs.Content>
      </Tabs.Root>

      <div className="pt-6 border-t border-muted-teal-200">
        {/* <p className="text-sm text-slate-600">
          Last updated:{' '}
          {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'never'}
        </p> */}
      </div>

      <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </motion.div>
  );
}
