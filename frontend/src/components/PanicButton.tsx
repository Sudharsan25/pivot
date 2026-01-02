/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { logUrge } from '@/store/urgesSlice';
import { habitsAPI } from '@/lib/api';
import type { Habit, SubstituteActivity } from '@/types/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Activity, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const TIMER_DURATION = 3 * 60; // 3 minutes in seconds

// Default habits for users with no habits
const DEFAULT_HABITS = [
  'Social Media',
  'Gaming',
  'Junk Food',
  'Smoking',
  'Procrastination',
  'Other',
];

// Hardcoded activities list
const DEFAULT_ACTIVITIES: SubstituteActivity[] = [
  // Physical Activities
  {
    id: 'pushups',
    name: '10 Push-ups',
    description: 'Quick burst of movement to redirect energy',
    duration: 3,
    category: 'physical',
    icon: 'Dumbbell',
  },
  {
    id: 'wall-sits',
    name: 'Wall Sits',
    description: 'Hold a wall sit position, focus on the burn',
    duration: 2,
    category: 'physical',
    icon: 'Square',
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    description: 'Get your heart rate up',
    duration: 3,
    category: 'physical',
    icon: 'Zap',
  },
  {
    id: 'dance-break',
    name: 'Dance Break',
    description: 'Put on a song and move however feels good',
    duration: 4,
    category: 'physical',
    icon: 'Music',
  },
  {
    id: 'walk-block',
    name: 'Walk Around the Block',
    description: 'Fresh air and movement',
    duration: 5,
    category: 'physical',
    icon: 'Activity',
  },
  // Breathing Exercises
  {
    id: 'box-breathing',
    name: 'Box Breathing',
    description: 'Breathe in 4, hold 4, out 4, hold 4',
    duration: 4,
    category: 'breathing',
    icon: 'Circle',
  },
  {
    id: '478-breathing',
    name: '4-7-8 Breathing',
    description: 'Inhale 4, hold 7, exhale 8',
    duration: 3,
    category: 'breathing',
    icon: 'Wind',
  },
  {
    id: 'belly-breaths',
    name: 'Deep Belly Breaths',
    description: 'Focus on slow, deep breathing',
    duration: 3,
    category: 'breathing',
    icon: 'Wind',
  },
  // Mental Activities
  {
    id: 'count-backwards',
    name: 'Count Backwards from 100 by 7s',
    description: 'Mental challenge to occupy your mind',
    duration: 3,
    category: 'mental',
    icon: 'Calculator',
  },
  {
    id: '5-things-see',
    name: 'Name 5 Things You Can See',
    description: 'Grounding exercise',
    duration: 2,
    category: 'mental',
    icon: 'Eye',
  },
  {
    id: 'recite-lyrics',
    name: 'Recite Song Lyrics',
    description: 'Pick a favorite song and recite from memory',
    duration: 3,
    category: 'mental',
    icon: 'FileText',
  },
  {
    id: 'alphabet-game',
    name: 'Alphabet Game',
    description: 'Name something in the room for each letter',
    duration: 4,
    category: 'mental',
    icon: 'Brain',
  },
  // Creative Activities
  {
    id: 'doodle',
    name: 'Doodle Anything',
    description: 'Grab paper and draw without judgment',
    duration: 5,
    category: 'creative',
    icon: 'Pencil',
  },
  {
    id: 'stream-of-consciousness',
    name: 'Write Stream of Consciousness',
    description: 'Just write whatever comes to mind',
    duration: 4,
    category: 'creative',
    icon: 'Palette',
  },
  {
    id: 'describe-surroundings',
    name: 'Describe Your Surroundings',
    description: 'Write detailed descriptions of what you see',
    duration: 3,
    category: 'creative',
    icon: 'FileText',
  },
  // Sensory Activities
  {
    id: 'ice-cube',
    name: 'Ice Cube in Hand',
    description: 'Hold an ice cube, focus on the sensation',
    duration: 3,
    category: 'sensory',
    icon: 'Snowflake',
  },
  {
    id: 'smell-pleasant',
    name: 'Smell Something Pleasant',
    description: 'Coffee, essential oil, fresh air',
    duration: 2,
    category: 'sensory',
    icon: 'Flower2',
  },
  {
    id: 'water-sounds',
    name: 'Listen to Water Sounds',
    description: 'Focus on calming nature sounds',
    duration: 4,
    category: 'sensory',
    icon: 'Waves',
  },
  {
    id: 'touch-textures',
    name: 'Touch Different Textures',
    description: 'Feel soft, rough, smooth objects',
    duration: 3,
    category: 'sensory',
    icon: 'Hand',
  },
];

type Step =
  | 'select-habit'
  | 'choose-method'
  | 'activity-selection'
  | 'timer-running'
  | 'activity-running';

function PanicButton() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>('select-habit');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loadingHabits, setLoadingHabits] = useState(false);
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [selectedHabitName, setSelectedHabitName] = useState<string>('');
  const [isCustomHabit, setIsCustomHabit] = useState(false);
  const [customHabitName, setCustomHabitName] = useState<string>('');
  const [showHabitDropdown, setShowHabitDropdown] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<SubstituteActivity | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [timerStarted, setTimerStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const [showAbandonConfirm, setShowAbandonConfirm] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch habits when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadHabits = async () => {
        setLoadingHabits(true);
        try {
          const userHabits = await habitsAPI.getHabits();
          setHabits(userHabits);
        } catch (error) {
          console.error('Failed to load habits:', error);
        } finally {
          setLoadingHabits(false);
        }
      };
      loadHabits();
    }
  }, [isOpen]);

  // Timer logic
  useEffect(() => {
    if (timerStarted && !isPaused && timeRemaining > 0 && !timerComplete) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setTimerComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerStarted, isPaused, timeRemaining, timerComplete]);

  // Handle timer completion
  useEffect(() => {
    if (timerComplete && selectedHabitId) {
      dispatch(
        logUrge({
          outcome: 'resisted',
          habitId: selectedHabitId,
          notes: selectedActivity
            ? `Resisted after completing activity: ${selectedActivity.name}`
            : 'Resisted after 3-minute timer',
        })
      );

      const timer = setTimeout(() => {
        resetModal();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [timerComplete, selectedHabitId, selectedActivity, dispatch]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryColor = (category: SubstituteActivity['category']) => {
    switch (category) {
      case 'physical':
        return 'text-celadon-600';
      case 'breathing':
        return 'text-muted-teal-600';
      case 'mental':
        return 'text-dry-sage-600';
      case 'creative':
        return 'text-lime-cream-600';
      case 'sensory':
        return 'text-celadon-500';
      default:
        return 'text-celadon-600';
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[
      iconName
    ] as React.ComponentType<{
      className?: string;
    }>;
    return IconComponent || Activity;
  };

  const handleHabitSelect = (habitId: string, habitName: string) => {
    setSelectedHabitId(habitId);
    setSelectedHabitName(habitName);
    setIsCustomHabit(false);
    setCustomHabitName('');
    setShowHabitDropdown(false);
    setStep('choose-method');
  };

  const handleDefaultHabitSelect = async (habitName: string) => {
    if (habitName === 'Other') {
      setIsCustomHabit(true);
      setShowHabitDropdown(false);
      return;
    }
    // Create a new habit from default list
    try {
      const newHabit = await habitsAPI.createHabit({
        name: habitName,
        type: 'custom',
      });
      setSelectedHabitId(newHabit.id);
      setSelectedHabitName(newHabit.name);
      setHabits([...habits, newHabit]);
      setIsCustomHabit(false);
      setCustomHabitName('');
      setShowHabitDropdown(false);
      setStep('choose-method');
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const handleCreateCustomHabit = async () => {
    if (!customHabitName.trim()) return;
    try {
      const newHabit = await habitsAPI.createHabit({
        name: customHabitName.trim(),
        type: 'custom',
      });
      setSelectedHabitId(newHabit.id);
      setSelectedHabitName(newHabit.name);
      setHabits([...habits, newHabit]);
      setIsCustomHabit(false);
      setCustomHabitName('');
      setStep('choose-method');
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const handleStartTimer = () => {
    setStep('timer-running');
    setTimeRemaining(TIMER_DURATION);
    setTimerStarted(true);
    setIsPaused(false);
    setTimerComplete(false);
  };

  const handleSelectActivity = (activity: SubstituteActivity) => {
    setSelectedActivity(activity);
    setStep('activity-running');
    setTimeRemaining(activity.duration * 60);
    setTimerStarted(true);
    setIsPaused(false);
    setTimerComplete(false);
  };

  const handleCompleteActivity = () => {
    if (selectedHabitId && selectedActivity) {
      dispatch(
        logUrge({
          outcome: 'resisted',
          habitId: selectedHabitId,
          notes: `Completed activity early: ${selectedActivity.name}`,
        })
      );
    }
    resetModal();
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const handleClose = () => {
    if (step === 'timer-running' || step === 'activity-running') {
      setShowAbandonConfirm(true);
    } else {
      resetModal();
    }
  };

  const handleAbandonConfirm = () => {
    setShowAbandonConfirm(false);
    resetModal();
  };

  const handleAbandonCancel = () => {
    setShowAbandonConfirm(false);
  };

  const resetModal = () => {
    setIsOpen(false);
    setStep('select-habit');
    setSelectedHabitId(null);
    setSelectedHabitName('');
    setIsCustomHabit(false);
    setCustomHabitName('');
    setShowHabitDropdown(false);
    setSelectedActivity(null);
    setTimeRemaining(TIMER_DURATION);
    setTimerStarted(false);
    setIsPaused(false);
    setTimerComplete(false);
    setShowAbandonConfirm(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Get available habits (user habits + defaults if empty)
  const availableHabits = habits.length > 0 ? habits : [];
  const showDefaultHabits = habits.length === 0;

  // Confetti animation component
  const Confetti = () => {
    const confettiCount = 50;
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
    const confetti = Array.from({ length: confettiCount }, (_, i) => {
      const randomLeft = Math.random() * 100;
      const randomTop = Math.random() * 100;
      const randomDuration = 2 + Math.random();
      const randomDelay = Math.random() * 0.5;

      return (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: colors[i % 5],
            left: `${randomLeft}%`,
            top: `${randomTop}%`,
          }}
          initial={{ y: -100, opacity: 1, rotate: 0 }}
          animate={{
            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
            opacity: 0,
            rotate: 360,
          }}
          transition={{
            duration: randomDuration,
            delay: randomDelay,
            repeat: Infinity,
          }}
        />
      );
    });

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {confetti}
      </div>
    );
  };

  const renderHabitSelection = () => {
    const displayName = isCustomHabit
      ? customHabitName || 'Type custom habit...'
      : selectedHabitId
        ? selectedHabitName
        : showDefaultHabits
          ? 'Select a habit...'
          : 'Select habit...';

    return (
      <div className="space-y-6">
        <div className="relative">
          <button
            onClick={() =>
              !isCustomHabit && setShowHabitDropdown(!showHabitDropdown)
            }
            disabled={isCustomHabit || loadingHabits}
            className={`w-full px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-between border transition-colors min-h-12 ${
              selectedHabitId || isCustomHabit
                ? 'bg-celadon-100 text-celadon-900 border-celadon-300'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
            } ${loadingHabits ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="flex items-center gap-2">
              {loadingHabits && <Loader2 className="w-4 h-4 animate-spin" />}
              {displayName}
            </span>
            {!loadingHabits && !isCustomHabit && (
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showHabitDropdown ? 'rotate-180' : ''
                }`}
              />
            )}
          </button>

          {showHabitDropdown && !isCustomHabit && !loadingHabits && (
            <div className="absolute top-full mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg z-50 no-scrollbar">
              {availableHabits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => handleHabitSelect(habit.id, habit.name)}
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
              {showDefaultHabits && (
                <>
                  {DEFAULT_HABITS.map((habitName) => (
                    <button
                      key={habitName}
                      onClick={() => handleDefaultHabitSelect(habitName)}
                      className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-700 border-b"
                    >
                      {habitName}
                    </button>
                  ))}
                </>
              )}
              <button
                onClick={() => {
                  setIsCustomHabit(true);
                  setShowHabitDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-700 border-t-2 border-slate-300 font-semibold"
              >
                + Create Custom Habit
              </button>
            </div>
          )}
        </div>

        {isCustomHabit && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-teal-700">
              Custom habit name
            </Label>
            <Input
              value={customHabitName}
              onChange={(e) => setCustomHabitName(e.target.value)}
              placeholder="Enter your custom habit name"
              className="w-full rounded-lg border-2 border-muted-teal-200 min-h-12 focus:outline-none focus:border-celadon-500 focus:ring-2 focus:ring-celadon-200"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customHabitName.trim()) {
                  handleCreateCustomHabit();
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateCustomHabit}
                disabled={!customHabitName.trim()}
                className="flex-1 min-h-12 bg-celadon-600 hover:bg-celadon-700 text-white"
              >
                Continue
              </Button>
              <Button
                onClick={() => {
                  setIsCustomHabit(false);
                  setCustomHabitName('');
                }}
                variant="outline"
                className="min-h-12"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-teal-600 mb-4">
          Resisting: <span className="font-semibold">{selectedHabitName}</span>
        </p>
        <p className="text-lg text-muted-teal-700">
          Choose how you'd like to resist:
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          onClick={handleStartTimer}
          className="w-full min-h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white"
        >
          Start Timer
        </Button>
        <Button
          onClick={() => setStep('activity-selection')}
          className="w-full min-h-12 text-base font-semibold bg-lime-cream-600 hover:bg-lime-cream-700 text-white"
        >
          Choose Activity
        </Button>
      </div>
    </div>
  );

  const renderActivitySelection = () => {
    const activitiesByCategory = DEFAULT_ACTIVITIES.reduce(
      (acc, activity) => {
        if (!acc[activity.category]) {
          acc[activity.category] = [];
        }
        acc[activity.category].push(activity);
        return acc;
      },
      {} as Record<string, SubstituteActivity[]>
    );

    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-teal-600 mb-2">
            Resisting:{' '}
            <span className="font-semibold">{selectedHabitName}</span>
          </p>
          <p className="text-lg text-muted-teal-700">
            Select an activity to help you resist:
          </p>
        </div>
        <div className="max-h-[60vh] overflow-y-auto space-y-6 px-1">
          {Object.entries(activitiesByCategory).map(
            ([category, activities]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-muted-teal-700 mb-3 uppercase tracking-wide">
                  {category} Activities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activities.map((activity) => {
                    const IconComponent = getIconComponent(activity.icon);
                    return (
                      <motion.button
                        key={activity.id}
                        onClick={() => handleSelectActivity(activity)}
                        className="relative bg-white rounded-xl p-5 border-2 border-transparent hover:border-celadon-400 hover:shadow-md transition-all text-left"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-celadon-100 text-xs text-celadon-700 font-medium whitespace-nowrap">
                          {activity.duration} min
                        </div>
                        <div className="flex items-start gap-4 pr-20">
                          <IconComponent
                            className={`w-10 h-10 flex-shrink-0 ${getCategoryColor(activity.category)}`}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold text-muted-teal-900 mb-2 leading-tight">
                              {activity.name}
                            </h4>
                            <p className="text-sm text-muted-teal-600 leading-relaxed">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>
        <Button
          onClick={() => setStep('choose-method')}
          variant="outline"
          className="w-full min-h-12"
        >
          Back
        </Button>
      </div>
    );
  };

  const renderTimer = () => {
    const progress = TIMER_DURATION - timeRemaining;
    const progressPercent = (progress / TIMER_DURATION) * 100;
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (progressPercent / 100) * circumference;

    return (
      <div className="text-center space-y-6">
        <p className="text-sm text-muted-teal-600">
          Resisting: <span className="font-semibold">{selectedHabitName}</span>
        </p>
        <div className="relative w-48 h-48 mx-auto">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-blue-100"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-blue-600 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={timeRemaining}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-blue-600"
            >
              {formatTime(timeRemaining)}
            </motion.div>
          </div>
        </div>
        <p className="text-lg text-muted-teal-700">
          Stay strong! Focus on something else.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePauseResume}
            variant="outline"
            className="min-h-12 text-base"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            className="min-h-12 text-base"
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const renderActivityTimer = () => {
    if (!selectedActivity) return null;

    const IconComponent = getIconComponent(selectedActivity.icon);
    const progress = selectedActivity.duration * 60 - timeRemaining;
    const progressPercent = (progress / (selectedActivity.duration * 60)) * 100;
    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (progressPercent / 100) * circumference;

    return (
      <div className="text-center space-y-6">
        <p className="text-sm text-muted-teal-600">
          Resisting: <span className="font-semibold">{selectedHabitName}</span>
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-3">
            <IconComponent
              className={`w-8 h-8 ${getCategoryColor(selectedActivity.category)}`}
            />
            <h3 className="text-2xl font-bold text-celadon-700">
              {selectedActivity.name}
            </h3>
          </div>
          <p className="text-md text-muted-teal-600 italic">
            {selectedActivity.description}
          </p>
        </div>

        <div className="relative w-48 h-48 mx-auto">
          <svg className="transform -rotate-90 w-48 h-48">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-celadon-100"
            />
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="text-celadon-600 transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={timeRemaining}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold text-celadon-700"
            >
              {formatTime(timeRemaining)}
            </motion.div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            onClick={handlePauseResume}
            variant="outline"
            className="min-h-12 text-base"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            onClick={handleCompleteActivity}
            className="min-h-12 text-base font-semibold bg-celadon-600 hover:bg-celadon-700 text-white"
          >
            Complete Activity
          </Button>
        </div>
      </div>
    );
  };

  const getDialogTitle = () => {
    if (timerComplete) return 'You Did It! 🎉';
    if (step === 'activity-running') return 'Activity in Progress';
    if (step === 'timer-running') return 'Stay Strong!';
    if (step === 'choose-method' || step === 'activity-selection')
      return 'Choose Resistance Method';
    return "I'm Having an Urge!";
  };

  const getDialogDescription = () => {
    if (timerComplete) return 'You resisted the urge!';
    if (step === 'activity-running')
      return 'Focus on your activity. You can do this!';
    if (step === 'timer-running')
      return 'Focus on something else. You can do this!';
    if (step === 'choose-method') return '';
    if (step === 'activity-selection')
      return 'Pick an activity that feels right for you right now.';
    return "What's the urge about?";
  };

  const getModalWidth = () => {
    if (step === 'activity-selection') return 'sm:max-w-4xl';
    if (step === 'timer-running' || step === 'activity-running')
      return 'sm:max-w-md';
    return 'sm:max-w-md';
  };

  const getModalHeight = () => {
    if (step === 'select-habit') return 'max-h-[85vh] min-h-[500px]';
    return 'max-h-[90vh]';
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="w-full md:w-auto min-h-[80px] px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold text-xl md:text-2xl rounded-lg shadow-lg transition-colors"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        PANIC BUTTON
      </motion.button>

      <Dialog open={isOpen && !showAbandonConfirm} onOpenChange={handleClose}>
        <DialogContent
          className={`${getModalWidth()} ${getModalHeight()} bg-white/95 backdrop-blur-sm rounded-lg shadow-xl max-h-[90vh] overflow-hidden flex flex-col`}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {getDialogTitle()}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {getDialogDescription()}
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {timerComplete ? (
                <motion.div
                  key="complete"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="relative"
                >
                  <Confetti />
                  <div className="text-center space-y-4 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl"
                    >
                      🎉
                    </motion.div>
                    <p className="text-3xl font-bold text-green-600">
                      You resisted the urge!
                    </p>
                  </div>
                </motion.div>
              ) : step === 'select-habit' ? (
                <motion.div
                  key="habit-select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderHabitSelection()}
                </motion.div>
              ) : step === 'choose-method' ? (
                <motion.div
                  key="method-select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderMethodSelection()}
                </motion.div>
              ) : step === 'activity-selection' ? (
                <motion.div
                  key="activity-select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderActivitySelection()}
                </motion.div>
              ) : step === 'timer-running' ? (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTimer()}
                </motion.div>
              ) : step === 'activity-running' ? (
                <motion.div
                  key="activity-timer"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderActivityTimer()}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>

      {/* Abandonment Confirmation Dialog */}
      <Dialog open={showAbandonConfirm} onOpenChange={setShowAbandonConfirm}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Are you sure?
            </DialogTitle>
            <DialogDescription className="text-center">
              This won't be logged. You can continue your timer or activity if
              you'd like.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            <Button
              onClick={handleAbandonConfirm}
              variant="outline"
              className="w-full sm:w-auto min-h-12 text-base"
            >
              Yes, Close
            </Button>
            <Button
              onClick={handleAbandonCancel}
              className="w-full sm:w-auto min-h-12 text-base font-semibold bg-celadon-600 hover:bg-celadon-700 text-white"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PanicButton;
