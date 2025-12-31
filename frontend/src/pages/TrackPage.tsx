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
import { ZapIcon } from 'lucide-react';

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

export default function TrackPage() {
  const [quickLogOpen, setQuickLogOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-muted-teal-900 mb-8">
          Track Your Urges
        </h1>
        <p className="text-lg text-muted-teal-600 mb-12">
          Use the panic button for immediate help, or log your progress
        </p>
      </div>

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
            className="w-full h-[85px] md:w-[360px] md:h-[85px] flex items-center justify-center gap-3 bg-lime-cream-500 hover:bg-lime-cream-600 text-slate-900 font-bold shadow-lg hover:shadow-xl transition-shadow duration-150"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ZapIcon className="w-8 h-8 text-white " />
            <span className="text-md md:text-xl text-center font-bold md:font-extrabold text-white leading-tight">
              QUICK LOG
            </span>
          </motion.button>
        </div>
      </div>

      <QuickLogPopover isOpen={quickLogOpen} onOpenChange={setQuickLogOpen} />

      {/* Manual Logging Form */}
      <ManualUrgeForm />
    </motion.div>
  );
}
