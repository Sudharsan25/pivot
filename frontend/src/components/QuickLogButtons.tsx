import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/store/hooks';
import { logUrge, fetchStats } from '@/store/urgesSlice';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

type OutcomeType = 'resisted' | 'gave_in';

interface Props {
  onClose: () => void;
}

const URGE_TYPES = [
  'Food',
  'Shopping',
  'Social Media',
  'Procrastination',
  'Gaming',
  'Sleep',
  'Other',
];

export default function QuickLogButtons({ onClose }: Props) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [selectedUrgeType, setSelectedUrgeType] = useState<string>('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [loading, setLoading] = useState<{
    resisted: boolean;
    gave_in: boolean;
  }>({
    resisted: false,
    gave_in: false,
  });

  const handle = async (outcome: OutcomeType) => {
    if (!selectedUrgeType) {
      toast({
        title: 'Please select an urge type',
        description: 'Choose a type before logging',
        variant: 'destructive',
      });
      return;
    }

    setLoading((s) => ({ ...s, [outcome]: true }));
    try {
      // Call API
      await dispatch(
        logUrge({
          outcome,
          urgeType: selectedUrgeType,
        })
      ).unwrap();

      // Optimistic refresh (update stats)
      dispatch(fetchStats());

      // Toast messages
      if (outcome === 'resisted') {
        toast({
          title: 'Great job! 🌟',
          description: 'Urge logged successfully',
        });
      } else {
        toast({ title: "That's okay! 💪", description: 'Keep trying' });
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

  return (
    <div className="flex flex-col gap-4">
      {/* Urge Type Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowTypeDropdown(!showTypeDropdown)}
          className={`w-full px-4 py-3 rounded-lg font-semibold text-sm flex items-center justify-between border transition-colors ${
            selectedUrgeType
              ? 'bg-celadon-100 text-celadon-900 border-celadon-300'
              : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
          }`}
        >
          <span>{selectedUrgeType || '⚠️ Select urge type (required)'}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showTypeDropdown ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showTypeDropdown && (
          <div className="absolute top-full mt-1 w-full bg-white border border-slate-300 rounded-lg shadow-lg z-50">
            {URGE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedUrgeType(type);
                  setShowTypeDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-700 border-b last:border-b-0"
              >
                {type}
              </button>
            ))}
            {selectedUrgeType && (
              <button
                onClick={() => {
                  setSelectedUrgeType('');
                  setShowTypeDropdown(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-slate-500"
              >
                Clear selection
              </button>
            )}
          </div>
        )}
      </div>

      <motion.button
        onClick={() => handle('resisted')}
        disabled={loading.resisted || loading.gave_in}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full min-h-[56px] rounded-lg text-white font-bold text-lg transition-all duration-150 flex items-center justify-center ${
          loading.resisted ? 'opacity-75' : 'shadow-none'
        } bg-celadon-500 hover:bg-celadon-600 hover:shadow-md`}
      >
        {loading.resisted ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'I FOUGHT AN URGE ✊'
        )}
      </motion.button>

      <motion.button
        onClick={() => handle('gave_in')}
        disabled={loading.resisted || loading.gave_in}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full min-h-[56px] rounded-lg text-white font-semibold text-lg transition-all duration-150 ${
          loading.gave_in ? 'opacity-75' : ''
        } bg-muted-teal-400 hover:bg-muted-teal-500`}
      >
        {loading.gave_in ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          'I Gave In 😔'
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
