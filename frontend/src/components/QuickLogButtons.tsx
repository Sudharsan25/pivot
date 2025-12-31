import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { logUrge, fetchStats } from '@/store/urgesSlice';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { habitsAPI } from '@/lib/api';
import type { Habit } from '@/types/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type OutcomeType = 'resisted' | 'gave_in' | 'delayed';

interface Props {
  onClose: () => void;
}

export default function QuickLogButtons({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [customHabitName, setCustomHabitName] = useState<string>('');
  const [showHabitDropdown, setShowHabitDropdown] = useState(false);
  const [loading, setLoading] = useState<{
    resisted: boolean;
    gave_in: boolean;
    delayed: boolean;
  }>({
    resisted: false,
    gave_in: false,
    delayed: false,
  });

  // Fetch habits on mount
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const userHabits = await habitsAPI.getHabits();
        setHabits(userHabits);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load habits',
          variant: 'destructive',
        });
      }
    };
    loadHabits();
  }, [toast]);

  const handle = async (outcome: OutcomeType) => {
    if (!selectedHabitId && !isCustom) {
      toast({
        title: 'Please select a habit',
        description: 'Choose a habit before logging',
        variant: 'destructive',
      });
      return;
    }

    // Validate custom habit name if Custom is selected
    if (isCustom && !customHabitName.trim()) {
      toast({
        title: 'Please enter a custom habit name',
        description: 'Enter the custom habit name before logging',
        variant: 'destructive',
      });
      return;
    }

    setLoading((s) => ({ ...s, [outcome]: true }));
    try {
      let habitId = selectedHabitId;

      // If custom, create the habit first
      if (isCustom && customHabitName.trim()) {
        const newHabit = await habitsAPI.createHabit({
          name: customHabitName.trim(),
          type: 'custom',
        });
        habitId = newHabit.id;
        // Add to local habits list
        setHabits([...habits, newHabit]);
      }

      if (!habitId) {
        throw new Error('No habit selected');
      }

      // Call API
      await dispatch(
        logUrge({
          outcome,
          habitId,
        })
      ).unwrap();

      // Optimistic refresh (update stats)
      dispatch(fetchStats());

      // Toast messages
      if (outcome === 'resisted') {
        toast({
          title: 'Great job!',
          description: 'Urge logged successfully',
        });
      } else if (outcome === 'delayed') {
        toast({
          title: 'Good progress!',
          description: 'Delaying is a win too!',
        });
      } else {
        toast({ title: "That's okay!", description: 'Keep trying' });
      }

      onClose();
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to log urge',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => setLoading((s) => ({ ...s, [outcome]: false })), 700);
    }
  };

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);
  const displayName = isCustom
    ? 'Custom'
    : selectedHabit
      ? selectedHabit.name
      : 'Select habit (required)';

  return (
    <div className="flex flex-col gap-4">
      {/* Habit Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowHabitDropdown(!showHabitDropdown)}
          className={`w-full px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-between border transition-colors ${
            selectedHabitId || isCustom
              ? 'bg-celadon-100 text-celadon-900 border-celadon-300'
              : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
          }`}
        >
          <span>{displayName}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showHabitDropdown ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showHabitDropdown && (
          <div className="absolute top-full mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {/* All habits with labels */}
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => {
                  setSelectedHabitId(habit.id);
                  setIsCustom(false);
                  setCustomHabitName('');
                  setShowHabitDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-700 border-b flex items-center justify-between"
              >
                <span>{habit.name}</span>
                <span
                  className={`text-xs font-medium ml-2 px-2 py-0.5 rounded text-white ${
                    habit.type === 'standard'
                      ? 'bg-celadon-700'
                      : 'bg-muted-teal-400'
                  }`}
                >
                  {habit.type === 'standard' ? 'Standard' : 'Custom'}
                </span>
              </button>
            ))}
            {/* Custom option */}
            <button
              onClick={() => {
                setIsCustom(true);
                setSelectedHabitId('');
                setShowHabitDropdown(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-700 border-t-2 border-slate-300 font-semibold"
            >
              + Create Custom Habit
            </button>
            {(selectedHabitId || isCustom) && (
              <button
                onClick={() => {
                  setSelectedHabitId('');
                  setIsCustom(false);
                  setCustomHabitName('');
                  setShowHabitDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-500"
              >
                Clear selection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Custom Habit Name Input */}
      {isCustom && (
        <div>
          <Label className="text-sm font-medium text-muted-teal-700 mb-2">
            Custom habit name
          </Label>
          <Input
            value={customHabitName}
            onChange={(e) => setCustomHabitName(e.target.value)}
            placeholder="Enter your custom habit name"
            className="w-full rounded-lg border-2 border-muted-teal-200 min-h-[48px] focus:outline-none focus:border-celadon-500 focus:ring-2 focus:ring-celadon-200"
          />
        </div>
      )}

      <motion.button
        onClick={() => handle('resisted')}
        disabled={loading.resisted || loading.gave_in || loading.delayed}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full min-h-[56px] rounded-lg text-white font-bold text-lg transition-all duration-150 flex items-center justify-center ${
          loading.resisted ? 'opacity-75' : 'shadow-none'
        } bg-celadon-500 hover:bg-celadon-600 hover:shadow-md`}
      >
        {loading.resisted ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'I FOUGHT AN URGE'
        )}
      </motion.button>

      <motion.button
        onClick={() => handle('delayed')}
        disabled={loading.resisted || loading.gave_in || loading.delayed}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full min-h-[56px] rounded-lg text-white font-semibold text-lg transition-all duration-150 flex items-center justify-center ${
          loading.delayed ? 'opacity-75' : ''
        } bg-amber-500 hover:bg-amber-600`}
      >
        {loading.delayed ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'I Delayed It'
        )}
      </motion.button>

      <motion.button
        onClick={() => handle('gave_in')}
        disabled={loading.resisted || loading.gave_in || loading.delayed}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full min-h-[56px] rounded-lg text-white font-semibold text-lg transition-all duration-150 ${
          loading.gave_in ? 'opacity-75' : ''
        } bg-muted-teal-400 hover:bg-muted-teal-500`}
      >
        {loading.gave_in ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'I Gave In'
        )}
      </motion.button>
      <div className="mt-2 text-sm text-center text-blue-600">
        <Link to="/dashboard/info?page=1" className="hover:no-underline">
          Why this works?
        </Link>
      </div>
    </div>
  );
}
