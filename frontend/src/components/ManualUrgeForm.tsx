import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { logUrge } from '@/store/urgesSlice';
import { useToast } from '@/hooks/use-toast';
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
import { Loader2, Clock } from 'lucide-react';

const urgeOptions = [
  'Social Media',
  'Gaming',
  'Smoking',
  'Junk Food',
  'Procrastination',
  'Custom',
] as const;

const schema = z
  .object({
    urgeType: z.string().min(1, 'Select an urge type'),
    customType: z.string().optional(),
    trigger: z.string().max(255).optional(),
    outcome: z.enum(['resisted', 'gave_in']),
    notes: z.string().max(500).optional(),
  })
  .superRefine((val, ctx) => {
    if (
      val.urgeType === 'Custom' &&
      (!val.customType || val.customType.trim() === '')
    ) {
      ctx.addIssue({
        path: ['customType'],
        message: 'Please enter a custom urge type',
        code: z.ZodIssueCode.custom,
      });
    }
  });

type FormSchema = z.infer<typeof schema>;

export default function ManualUrgeForm() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [shake, setShake] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      urgeType: 'Social Media',
      customType: '',
      trigger: '',
      outcome: 'resisted',
      notes: '',
    },
  });

  const notesValue = watch('notes') || '';
  const urgeType = watch('urgeType');

  const currentTime = format(new Date(), "MMM d, yyyy 'at' h:mm a");

  useEffect(() => {
    // reset shake when errors cleared
    if (shake) {
      const t = setTimeout(() => setShake(false), 400);
      return () => clearTimeout(t);
    }
  }, [shake]);

  const onSubmit = async (data: FormSchema) => {
    try {
      const finalType =
        data.urgeType === 'Custom' ? data.customType : data.urgeType;
      const notesParts = [] as string[];
      notesParts.push(`Type: ${finalType}`);
      if (data.trigger) notesParts.push(`Trigger: ${data.trigger}`);
      if (data.notes) notesParts.push(`Notes: ${data.notes}`);

      await dispatch(
        logUrge({
          outcome: data.outcome,
          trigger: data.trigger || undefined,
          notes: notesParts.join(' | '),
        })
      ).unwrap();

      toast({
        title: 'Urge logged with details! 🎯',
        description: 'Thanks for tracking your progress.',
      });
      reset();
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
          {/* Urge Type */}
          <div>
            <Label className="text-sm font-medium text-muted-teal-700 mb-2">
              What was the urge?
            </Label>
            <select
              {...register('urgeType')}
              className="w-full rounded-lg border-2 border-muted-teal-200 min-h-[48px] px-3 py-2 focus:outline-none focus:border-celadon-500 focus:ring-2 focus:ring-celadon-200"
            >
              <option value="">Select urge type...</option>
              {urgeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {errors.urgeType && (
              <p className="text-sm text-dry-sage-600 mt-2">
                {errors.urgeType.message}
              </p>
            )}
          </div>

          {/* Custom type */}
          {urgeType === 'Custom' && (
            <div>
              <Label className="text-sm font-medium text-muted-teal-700 mb-2">
                Custom urge
              </Label>
              <Input
                {...register('customType')}
                className="w-full rounded-lg border-2 border-muted-teal-200 min-h-[48px] focus:outline-none focus:border-celadon-500 focus:ring-2 focus:ring-celadon-200"
              />
              {errors.customType && (
                <p className="text-sm text-dry-sage-600 mt-2">
                  {errors.customType.message}
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
              Did you resist or give in?
            </Label>
            <div className="flex flex-col md:flex-row gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="resisted"
                  {...register('outcome')}
                  defaultChecked
                />
                <span className="ml-2">Resisted ✊</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="gave_in" {...register('outcome')} />
                <span className="ml-2">Gave In 😔</span>
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
              disabled={isSubmitting}
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
