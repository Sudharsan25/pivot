import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { logUrge } from '@/store/urgesSlice';
import { habitsAPI } from '@/lib/api';
import type { Habit } from '@/types/api';
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
import { ChevronDown } from 'lucide-react';

const TIMER_DURATION = 3 * 60; // 5 minutes in seconds

function PanicButton() {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isPaused, setIsPaused] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabitId, setSelectedHabitId] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [customHabitName, setCustomHabitName] = useState<string>('');
  const [showHabitDropdown, setShowHabitDropdown] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch habits on mount
  useEffect(() => {
    const loadHabits = async () => {
      try {
        const userHabits = await habitsAPI.getHabits();
        setHabits(userHabits);
      } catch (error) {
        console.error('Failed to load habits:', error);
      }
    };
    loadHabits();
  }, []);

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
      // Log as resisted with habitId
      dispatch(
        logUrge({
          outcome: 'resisted',
          habitId: selectedHabitId,
          notes: 'Resisted after 5-minute timer',
        })
      );

      // Close modal after 3 seconds
      const timer = setTimeout(() => {
        resetModal();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [timerComplete, dispatch, selectedHabitId]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = async () => {
    if (!selectedHabitId && !isCustom) {
      return;
    }
    // If custom, create the habit first
    if (isCustom && customHabitName.trim()) {
      try {
        const newHabit = await habitsAPI.createHabit({
          name: customHabitName.trim(),
          type: 'custom',
        });
        setSelectedHabitId(newHabit.id);
        setHabits([...habits, newHabit]);
        setIsCustom(false);
        setCustomHabitName('');
      } catch (error) {
        console.error('Failed to create habit:', error);
        return;
      }
    }
    if (!selectedHabitId) {
      return;
    }
    setTimerStarted(true);
    setIsPaused(false);
    setTimerStartTime(Date.now());
  };

  const handlePauseResume = () => {
    setIsPaused((prev) => !prev);
  };

  const handleClose = () => {
    if (timerStarted && !timerComplete) {
      setShowConfirmation(true);
    } else {
      resetModal();
    }
  };

  const resetModal = () => {
    setIsOpen(false);
    setTimerStarted(false);
    setTimeRemaining(TIMER_DURATION);
    setIsPaused(false);
    setTimerComplete(false);
    setShowConfirmation(false);
    setSelectedHabitId('');
    setIsCustom(false);
    setCustomHabitName('');
    setShowHabitDropdown(false);
    setTimerStartTime(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getOutcomeBasedOnTimer = (): 'resisted' | 'gave_in' | 'delayed' => {
    if (timerStartTime) {
      const elapsedSeconds = (Date.now() - timerStartTime) / 1000;
      // If timer ran for more than 10 seconds, auto-set to delayed
      if (elapsedSeconds >= 10) {
        return 'delayed';
      }
    }
    // Default behavior: user chooses manually
    return 'resisted';
  };

  const handleResisted = async () => {
    let finalHabitId = selectedHabitId;
    // If custom, create the habit first
    if (isCustom && customHabitName.trim()) {
      try {
        const newHabit = await habitsAPI.createHabit({
          name: customHabitName.trim(),
          type: 'custom',
        });
        finalHabitId = newHabit.id;
        setHabits([...habits, newHabit]);
      } catch (error) {
        console.error('Failed to create habit:', error);
        return;
      }
    }
    if (!finalHabitId) return;
    const outcome = getOutcomeBasedOnTimer();
    dispatch(
      logUrge({
        outcome,
        habitId: finalHabitId,
        notes:
          outcome === 'delayed'
            ? 'Delayed (timer ran > 10 seconds)'
            : 'Resisted (closed timer early)',
      })
    );
    resetModal();
  };

  const handleGaveIn = async () => {
    let finalHabitId = selectedHabitId;
    // If custom, create the habit first
    if (isCustom && customHabitName.trim()) {
      try {
        const newHabit = await habitsAPI.createHabit({
          name: customHabitName.trim(),
          type: 'custom',
        });
        finalHabitId = newHabit.id;
        setHabits([...habits, newHabit]);
      } catch (error) {
        console.error('Failed to create habit:', error);
        return;
      }
    }
    if (!finalHabitId) return;
    const outcome = getOutcomeBasedOnTimer();
    dispatch(
      logUrge({
        outcome,
        habitId: finalHabitId,
        notes:
          outcome === 'delayed'
            ? 'Delayed (timer ran > 10 seconds)'
            : 'Gave in (closed timer early)',
      })
    );
    resetModal();
  };

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

  return (
    <>
      {/* Panic Button */}
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

      {/* Main Timer Dialog */}
      <Dialog open={isOpen && !showConfirmation} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              {timerComplete ? 'You Did It! 🎉' : 'Take a Moment'}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {timerComplete
                ? 'You resisted the urge!'
                : timerStarted
                  ? 'Focus on something else. You can do this!'
                  : 'Start the timer and wait 3 minutes. You can do this!'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-8">
            {timerComplete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
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
            ) : timerStarted ? (
              <div className="text-center space-y-6">
                <motion.div
                  key={timeRemaining}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-bold text-blue-600"
                >
                  {formatTime(timeRemaining)}
                </motion.div>
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
            ) : (
              <div className="text-center space-y-6">
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
                    <span>
                      {isCustom
                        ? 'Custom'
                        : habits.find((h) => h.id === selectedHabitId)?.name ||
                          'Select habit (required)'}
                    </span>
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

                <p className="text-lg text-slate-600">
                  When you're ready, start the timer. Focus on something else
                  during this time. Your favourite song, some quick pushups, a
                  short walk, etc.
                </p>
                <div className="mt-2 text-sm text-blue-600">
                  <Link
                    to="/dashboard/info?page=2"
                    className="hover:no-underline"
                  >
                    Why this works?
                  </Link>
                </div>
                <Button
                  onClick={handleStartTimer}
                  disabled={
                    (!selectedHabitId && !isCustom) ||
                    (isCustom && !customHabitName.trim())
                  }
                  className="w-full min-h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  START TIMER
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}

      {/* The confirmation dialog should show buttons and text based on the timer duration. */}

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {timerStartTime && timerStartTime > Date.now() - 10000
                ? 'You Delayed the Urge!!'
                : 'You Resisted the Urge!'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {timerStartTime && timerStartTime > Date.now() - 10000
                ? 'You delayed the urge for more than 10 seconds. Good job!'
                : 'You resisted the urge. Good job!'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-0">
            <Button
              onClick={handleResisted}
              className="w-full sm:w-auto min-h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white"
            >
              I Resisted
            </Button>
            <Button
              onClick={handleGaveIn}
              variant="outline"
              className="w-full sm:w-auto min-h-12 text-base"
            >
              I Gave In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PanicButton;
