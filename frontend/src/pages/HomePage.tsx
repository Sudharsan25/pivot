import { useState } from 'react';
import { motion } from 'framer-motion';
import PanicButton from '@/components/PanicButton';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import QuickLogButtons from '@/components/QuickLogButtons';
import ManualUrgeForm from '@/components/ManualUrgeForm';

interface QuickLogPopoverProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function QuickLogPopover({ isOpen, onOpenChange }: QuickLogPopoverProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4">
        <DialogHeader>
          <DialogTitle>Quick Log</DialogTitle>
          <DialogDescription>How did this urge play out?</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <QuickLogButtons onClose={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function HomePage() {
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Two-column grid: Panic + Quick Log */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Panic Button (uses PanicButton component) */}
        <div className="flex items-center justify-center">
          <PanicButton />
        </div>

        {/* Right Column - Quick Log Button */}
        <div className="flex items-center justify-center">
          <motion.button
            onClick={() => setQuickLogOpen(true)}
            className="w-[160px] h-[160px] md:w-[220px] md:h-[220px] rounded-full flex flex-col items-center justify-center gap-3 bg-lime-cream-500 hover:bg-lime-cream-600 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-shadow duration-150"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-2xl md:text-3xl">⚡</span>
            <span className="text-xs md:text-sm text-center leading-tight">
              QUICK LOG
            </span>
          </motion.button>
        </div>
      </div>

      <QuickLogPopover isOpen={quickLogOpen} onOpenChange={setQuickLogOpen} />

      {/* Manual Logging Form */}
      <ManualUrgeForm />
    </div>
  );
}
