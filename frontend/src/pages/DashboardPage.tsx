import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats } from '@/store/urgesSlice';
import { urgesAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import PanicButton from '@/components/PanicButton';

interface UrgeTypeStat {
  urgeType: string;
  totalResisted: number;
  totalGaveIn: number;
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

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((s) => s.urges);
  const [statsByType, setStatsByType] = useState<UrgeTypeStat[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchStats());
    loadStatsByType();
  }, [dispatch]);

  const loadStatsByType = async () => {
    setIsLoading(true);
    try {
      const data = await urgesAPI.getStatsByType();
      setStatsByType(data);
    } catch (e) {
      console.error('Failed to load stats by type:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await Promise.all([dispatch(fetchStats()).unwrap(), loadStatsByType()]);
    } catch (e) {
      console.error('Failed to refresh:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const total = stats?.totalUrges ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <h2 className="text-3xl font-semibold text-slate-800">Dashboard</h2>
        <Button
          onClick={handleRefresh}
          disabled={isLoading || loading.fetchingStats}
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 transition-transform ${
              isLoading || loading.fetchingStats ? 'animate-spin' : ''
            }`}
          />
          Refresh
        </Button>
      </div>

      {/* Panic Button */}
      <div className="mb-8">
        <PanicButton />
      </div>

      {/* Overall Stats */}
      {stats && total > 0 && (
        <motion.div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">
            Overall Stats
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-celadon-50 rounded-lg">
              <p className="text-sm text-celadon-700 mb-2">Resisted</p>
              <AnimatedCounter
                value={stats.totalResisted}
                className="text-4xl font-bold text-celadon-600"
              />
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-lime-cream-50 rounded-lg">
              <p className="text-sm text-lime-cream-700 mb-2">Total</p>
              <AnimatedCounter
                value={stats.totalUrges}
                className="text-4xl font-bold text-lime-cream-700"
              />
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-muted-teal-50 rounded-lg">
              <p className="text-sm text-muted-teal-700 mb-2">Gave In</p>
              <AnimatedCounter
                value={stats.totalGaveIn}
                className="text-4xl font-bold text-muted-teal-500"
              />
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
            Breakdown by Urge Type
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {statsByType.map((stat, idx) => (
              <motion.div
                key={stat.urgeType}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h4 className="font-semibold text-slate-800 mb-4">
                  {stat.urgeType}
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Resisted</span>
                    <span className="text-lg font-bold text-celadon-600">
                      {stat.totalResisted}
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

                  {/* Progress bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                      <span>Success Rate</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-celadon-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            stat.totalUrges > 0
                              ? Math.round(
                                  (stat.totalResisted / stat.totalUrges) * 100
                                )
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-700 font-semibold mt-1 block">
                      {stat.totalUrges > 0
                        ? Math.round(
                            (stat.totalResisted / stat.totalUrges) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
