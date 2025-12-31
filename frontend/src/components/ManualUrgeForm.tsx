import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { logUrge } from '@/store/urgesSlice';
import { useToast } from '@/hooks/use-toast';
import { habitsAPI } from '@/lib/api';
import type { Habit } from '@/types/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, ChevronDown } from 'lucide-react';

const schema = z
  .object({
    habitId: z.string().optional(),
    isCustom: z.boolean(),
    customHabitName: z.string().optional(),
    trigger: z.string().max(255).optional(),
    outcome: z.enum(['resisted', 'gave_in', 'delayed']),
    notes: z.string().max(500).optional(),
  })
  .superRefine((val, ctx) => {
    if (
      val.isCustom &&
      (!val.customHabitName || val.customHabitName.trim() === '')
    ) {
      ctx.addIssue({
        path: ['customHabitName'],
        message: 'Please enter a custom habit name',
        code: z.ZodIssueCode.custom,
      });
    }
    if (!val.isCustom && !val.habitId) {
      ctx.addIssue({
        path: ['habitId'],
        message: 'Please select a habit',
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormSchema = z.infer<typeof schema>;

export default function ManualUrgeForm() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [shake, setShake] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loadingHabits, setLoadingHabits] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      habitId: '',
      isCustom: false,
      customHabitName: '',
      trigger: '',
      outcome: 'resisted',
      notes: '',
    },
  });

  const notesValue = watch('notes') || '';
  const habitId = watch('habitId');
  const isCustom = watch('isCustom');
  const [showHabitDropdown, setShowHabitDropdown] = useState(false);

  const currentTime = format(new Date(), "MMM d, yyyy 'at' h:mm a");

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
      } finally {
        setLoadingHabits(false);
      }
    };
    loadHabits();
  }, [toast]);

  useEffect(() => {
    // reset shake when errors cleared
    if (shake) {
      const t = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(t);
    }
  }, [shake]);

  const onSubmit = async (data: FormSchema) => {
    try {
      let finalHabitId = data.habitId;

      // If custom, create the habit first
      if (data.isCustom && data.customHabitName?.trim()) {
        const newHabit = await habitsAPI.createHabit({
          name: data.customHabitName.trim(),
          type: 'custom',
        });
        finalHabitId = newHabit.id;
        // Add to local habits list
        setHabits([...habits, newHabit]);
      }

      if (!finalHabitId) {
        throw new Error('No habit selected');
      }

      const notesParts = [] as string[];
      if (data.trigger) notesParts.push(`Trigger: ${data.trigger}`);
      if (data.notes) notesParts.push(`Notes: ${data.notes}`);

      await dispatch(
        logUrge({
          outcome: data.outcome,
          habitId: finalHabitId,
          trigger: data.trigger || undefined,
          notes: notesParts.length > 0 ? notesParts.join(' | ') : undefined,
        })
      ).unwrap();

      toast({
        title: 'Urge logged with details!',
        description: 'Thanks for tracking your progress.',
      });
      reset();
      setValue('isCustom', false);
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to log urge',
        variant: 'destructive',
      });
    }
  };

  const onError = () => {
    setShake(true);
  };

  return (
    <Card className="bg-white shadow-md rounded-xl p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-muted-teal-800 mb-6">
          Log Urge Details
        </CardTitle>
        <CardDescription />
      </CardHeader>

      <CardContent>
        <motion.form
          onSubmit={handleSubmit(onSubmit, onError)}
          className="space-y-4"
          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Habit Selection */}
          <div>
            <Label className="text-sm font-medium text-muted-teal-700 mb-2">
              What was the habit?
            </Label>
            {loadingHabits ? (
              <div className="w-full rounded-lg border-2 border-muted-teal-200 min-h-[48px] px-3 py-2 flex items-center">
                <Loader2 className="h-5 w-5 animate-spin text-muted-teal-600" />
                <span className="ml-2 text-sm text-muted-teal-600">
                  Loading habits...
                </span>
              </div>
            ) : (
              <>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      !isCustom && setShowHabitDropdown(!showHabitDropdown)
                    }
                    disabled={isCustom}
                    className={`w-full rounded-lg border-2 border-muted-teal-200 min-h-[48px] px-3 py-2 flex items-center justify-between focus:outline-none focus:border-celadon-500 focus:ring-2 focus:ring-celadon-200 disabled:bg-slate-100 ${
                      habitId ? 'text-slate-900' : 'text-slate-500'
                    }`}
                  >
                    <span>
                      {habits.find((h) => h.id === habitId)?.name ||
                        'Select habit...'}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showHabitDropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <input type="hidden" {...register('habitId')} />
                  {showHabitDropdown && !isCustom && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                      {habits.map((habit) => (
                        <button
                          key={habit.id}
                          type="button"
                          onClick={() => {
                            setValue('habitId', habit.id);
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
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register('isCustom')}
                      onChange={(e) => {
                        setValue('isCustom', e.target.checked);
                        setShowHabitDropdown(false);
                        if (e.target.checked) {
                          setValue('habitId', '');
                        }
                      }}
                    />
                    <span className="text-sm text-muted-teal-700">
                      Create a new custom habit
                    </span>
                  </label>
                </div>
                {errors.habitId && !isCustom && (
                  <p className="text-sm text-dry-sage-600 mt-2">
                    {errors.habitId.message}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Custom Habit Name Input */}
          {isCustom && (
            <div>
              <Label className="text-sm font-medium text-muted-teal-700 mb-2">
                Custom habit name
              </Label>
              <Input
                {...register('customHabitName')}
                className="w-full rounded-lg border-2 border-muted-teal-200 min-h-[48px] focus:outline-none focus:border-celadon-500 focus:ring-2 focus:ring-celadon-200"
                placeholder="Enter your custom habit name"
              />
              {errors.customHabitName && (
                <p className="text-sm text-dry-sage-600 mt-2">
                  {errors.customHabitName.message}
                </p>
              )}
            </div>
          )}

          {/* Trigger */}
          <div>
            <Label className="text-sm font-medium text-muted-teal-700 mb-2">
              What triggered it? (optional)
            </Label>
            <Input
              {...register('trigger')}
              placeholder="e.g., Stress, Boredom, Seeing a notification..."
              className="w-full rounded-lg border-2 border-muted-teal-200 min-h-[48px] focus:outline-none focus:border-celadon-500 focus:ring-2 focus:ring-celadon-200"
            />
            {errors.trigger && (
              <p className="text-sm text-dry-sage-600 mt-2">
                {errors.trigger.message}
              </p>
            )}
          </div>

          {/* Time */}
          <div>
            <Label className="text-sm font-medium text-muted-teal-700 mb-2">
              When?
            </Label>
            <div className="flex items-center gap-2 bg-muted-teal-50 rounded-lg px-3 py-2 min-h-[48px]">
              <Clock className="h-5 w-5 text-muted-teal-600" />
              <input
                value={currentTime}
                disabled
                className="bg-transparent outline-none text-sm text-muted-teal-700"
              />
            </div>
          </div>

          {/* Outcome radio */}
          <div>
            <Label className="text-sm font-medium text-muted-teal-700 mb-2">
              Did you resist, give in, or delay?
            </Label>
            <div className="flex flex-col md:flex-row gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="resisted"
                  {...register('outcome')}
                  defaultChecked
                />
                <span className="ml-2">Resisted</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="gave_in" {...register('outcome')} />
                <span className="ml-2">Gave In</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="delayed" {...register('outcome')} />
                <span className="ml-2">Delayed</span>
              </label>
            </div>
            {errors.outcome && (
              <p className="text-sm text-dry-sage-600 mt-2">
                {errors.outcome.message}
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <Label className="text-sm font-medium text-muted-teal-700 mb-2">
              Any additional notes? (optional)
            </Label>
            <textarea
              {...register('notes')}
              rows={4}
              maxLength={500}
              className="w-full rounded-lg border-2 border-muted-teal-200 px-3 py-2 focus:outline-none focus:border-celadon-500 focus:ring-2 focus:ring-celadon-200 resize-none"
              placeholder="What were you feeling? What helped you resist?"
            />
            <div className="flex justify-end text-sm text-muted-teal-600 mt-1">
              {notesValue.length}/500
            </div>
            {errors.notes && (
              <p className="text-sm text-dry-sage-600 mt-2">
                {errors.notes.message}
              </p>
            )}
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full min-h-[48px] bg-celadon-600 hover:bg-celadon-700 shadow-md"
              disabled={isSubmitting || loadingHabits}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                'Log Urge'
              )}
            </Button>
          </div>
        </motion.form>
      </CardContent>
    </Card>
  );
}
