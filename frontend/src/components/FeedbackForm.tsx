import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const FEEDBACK_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

interface FeedbackFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FeedbackForm({ open, onOpenChange }: FeedbackFormProps) {
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState<number>(0);
  const { toast } = useToast();

  // Check cooldown when dialog opens
  useEffect(() => {
    if (open) {
      const lastSubmitted = localStorage.getItem('feedback_last_submitted');
      if (lastSubmitted) {
        const timeSinceLastSubmission = Date.now() - Number(lastSubmitted);
        if (timeSinceLastSubmission < FEEDBACK_COOLDOWN_MS) {
          setIsOnCooldown(true);
          setCooldownTimeRemaining(FEEDBACK_COOLDOWN_MS - timeSinceLastSubmission);
        } else {
          setIsOnCooldown(false);
        }
      } else {
        setIsOnCooldown(false);
      }
    }
  }, [open]);

  // Update cooldown timer
  useEffect(() => {
    if (!isOnCooldown || !open) return;

    const interval = setInterval(() => {
      const lastSubmitted = localStorage.getItem('feedback_last_submitted');
      if (lastSubmitted) {
        const timeSinceLastSubmission = Date.now() - Number(lastSubmitted);
        const remaining = FEEDBACK_COOLDOWN_MS - timeSinceLastSubmission;
        
        if (remaining <= 0) {
          setIsOnCooldown(false);
          setCooldownTimeRemaining(0);
        } else {
          setCooldownTimeRemaining(remaining);
        }
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isOnCooldown, open]);

  const formatTimeRemaining = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check cooldown before submission
    const lastSubmitted = localStorage.getItem('feedback_last_submitted');
    if (lastSubmitted && Date.now() - Number(lastSubmitted) < FEEDBACK_COOLDOWN_MS) {
      const timeRemaining = FEEDBACK_COOLDOWN_MS - (Date.now() - Number(lastSubmitted));
      toast({
        title: 'Please wait',
        description: `You can submit feedback again in ${formatTimeRemaining(timeRemaining)}.`,
        variant: 'destructive',
      });
      return;
    }

    if (!name.trim() || !feedback.trim()) {
      toast({
        title: 'Please fill in all fields',
        description: 'Both name and feedback are required.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '';
      
      if (!accessKey) {
        throw new Error('Web3Forms access key is not configured');
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: name.trim(),
          message: feedback.trim(),
          subject: 'Feedback from PIVOT App',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store submission timestamp
        localStorage.setItem('feedback_last_submitted', Date.now().toString());
        setIsOnCooldown(true);
        setCooldownTimeRemaining(FEEDBACK_COOLDOWN_MS);
        
        toast({
          title: 'Thank you!',
          description: 'Your feedback has been sent successfully.',
        });
        setName('');
        setFeedback('');
        onOpenChange(false);
      } else {
        throw new Error(data.message || 'Failed to send feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to send feedback. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Your Feedback</DialogTitle>
          <DialogDescription>
            {isOnCooldown
              ? `You can submit feedback again in ${formatTimeRemaining(cooldownTimeRemaining)}.`
              : "We'd love to hear your thoughts and suggestions!"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your thoughts, suggestions, or report any issues..."
                disabled={isSubmitting}
                required
                rows={6}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isOnCooldown}>
              {isSubmitting ? 'Sending...' : isOnCooldown ? 'On Cooldown' : 'Send Feedback'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

