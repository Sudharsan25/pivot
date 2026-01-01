import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, LogsIcon, Zap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FeedbackForm } from '@/components/FeedbackForm';

// --- Data Structure ---
const PAGES_DATA = [
  {
    title: 'Rejection Sensitivity',
    subtitle: '',
    intro: (
      <>
        <p className="text-slate-700 mb-4">
          <strong className="font-semibold text-slate-800 mt-2">
            The "Broken Thermostat" of Emotion
          </strong>
          : Many people with ADHD describe moments where emotional reactions
          feel difficult to regulate after setbacks. While others may be able to
          say “it’s okay, I’ll try again tomorrow,” some report that even small
          slips , like breaking a habit, can trigger a surge of shame or
          emotional pain that feels overwhelming and hard to shake.
        </p>

        <p className="text-slate-700 mb-6">
          <strong className="font-semibold text-slate-800">
            The "Internalized Critic"
          </strong>
          : In shared experiences, people often describe struggling to hold
          nuance during mistakes, it becomes hard to think “I’m capable” and “I
          slipped” at the same time. Instead, the mistake can temporarily feel
          like a judgment on their entire identity. In habit-tracking apps, this
          often shows up as abandoning the tool entirely after a single lapse.
        </p>
      </>
    ),
    features: [
      {
        id: 'rsd-1',
        name: 'No Streaks, Only Cumulative Records',
        icon: <Zap className="w-5 h-5 text-amber-500" />,
        whatDoes: [
          'No “zeroing out”',
          'No daily streak counters',
          'Progress is additive and permanent',
        ],
        whyHelps: [
          'Reduces moments that can feel like rejection or failure',
          'A single lapse does not invalidate past effort',
          'Avoids presenting a visible “you failed” state',
        ],
      },
      {
        id: 'rsd-2',
        name: 'Language That Frames Awareness as Success',
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        whatDoes: [
          'Logging an urge is itself considered progress',
          'Copy reinforces noticing, not winning',
        ],
        whyHelps: [
          'Shifts success from “perfect control” → “self-awareness”',
          'Gives the user a win even on hard days',
          'Reduces shame-driven abandonment',
        ],
      },
    ],
  },
  {
    title: 'Time Blindness',
    subtitle: '',
    intro: (
      <>
        <p className="text-slate-700 mb-4">
          <strong className="font-semibold text-slate-800 mt-2">
            The "Now" vs. "Not Now" Horizon
          </strong>
          : Many people with ADHD describe experiencing time in two distinct
          modes: the immediate present (“Now”) and everything else (“Not Now”).
          Because of this, long-term goals like a 30-day streak can feel
          abstract or emotionally distant, while an urge in the moment feels
          concrete and urgent.
        </p>

        <p className="text-slate-700 mb-6">
          <strong className="font-semibold text-slate-800">
            The Lack of "Goal Permanence"
          </strong>
          : A commonly reported experience is that progress can feel fragile or
          invisible once tracking stops. When a streak resets, past effort can
          be hard to mentally access, it may no longer feel like “20 days of
          progress,” but like something that doesn’t count anymore.
        </p>
      </>
    ),
    features: [
      {
        id: 'tb-1',
        name: 'Quick Log & Immediate Interaction',
        icon: <LogsIcon className="w-5 h-5 text-green-500" />,
        whatDoes: [
          'Logging happens in the moment of the urge',
          'No planning, no future framing required',
        ],
        whyHelps: [
          'Acts as an external reminder of past effort',
          'Preserves progress even after gaps',
          'Reduces “it all disappeared” thinking',
        ],
      },
      {
        id: 'tb-2',
        name: 'Always-Visible Lifetime Stats',
        icon: <Zap className="w-5 h-5 text-blue-500" />,
        whatDoes: [
          'Shows total urges handled across all time',
          'Progress never resets or disappears',
        ],
        whyHelps: [
          'Acts as external memory for past success',
          'Preserves progress even after gaps',
          'Prevents “it all disappeared” thinking',
        ],
      },
    ],
  },
  {
    title: 'Dopamine Deficit',
    subtitle: '',
    intro: (
      <>
        <p className="text-slate-700 mb-3">
          <strong className="font-semibold text-slate-800 mt-2">
            The "Dopamine Hunger"
          </strong>
          : Many people with ADHD describe a persistent sense of restlessness or
          understimulation. Activities that offer novelty, urgency, or strong
          emotional feedback can feel far more compelling than slow, repetitive
          tasks. In contrast, habit trackers that rely on delayed rewards or
          subtle progress indicators often struggle to hold attention.
        </p>

        <p className="text-slate-700 mb-6">
          <strong className="font-semibold text-slate-800">
            The "Wall of Awful"
          </strong>
          : This term is often used to describe the emotional weight that builds
          up around tasks after repeated frustration, missed goals, or shame.
          Over time, even opening a habit tracker can trigger avoidance, not
          because of laziness, but because the emotional load feels too heavy to
          approach.
        </p>
      </>
    ),
    features: [
      {
        id: 'dd-1',
        name: 'One-Tap Action During Urges',
        icon: <Zap className="w-5 h-5 text-purple-500" />,
        whatDoes: [
          'Single, low-effort action at the peak of an urge',
          'No planning or multi-step decisions required',
        ],
        whyHelps: [
          'Lowers the emotional cost of engaging',
          'Turns urge energy into interaction instead of avoidance',
          'Makes taking action feel easier than doing nothing',
        ],
      },
      {
        id: 'dd-2',
        name: 'Immediate Feedback & Acknowledgment',
        icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" />,
        whatDoes: [
          'Instant visual confirmation after logging',
          'Clear acknowledgment of effort',
        ],
        whyHelps: [
          'Provides immediate reinforcement',
          'Creates a sense of completion in the moment',
          'Encourages continued engagement without relying on delayed rewards',
        ],
      },
    ],
  },
];

export default function InfoPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Safe index logic
  const pageFromUrl = Number(searchParams.get('page') ?? '0');
  const safeInitialIndex =
    Number.isFinite(pageFromUrl) &&
    pageFromUrl >= 0 &&
    pageFromUrl < PAGES_DATA.length
      ? pageFromUrl
      : 0;

  const [index, setIndex] = useState(safeInitialIndex);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Sync state from URL
  useEffect(() => {
    setIndex(safeInitialIndex);
  }, [safeInitialIndex]);

  // Sync URL from state
  useEffect(() => {
    setSearchParams({ page: String(index) }, { replace: true });
  }, [index, setSearchParams]);

  const currentPage = PAGES_DATA[index];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 ">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 sm:p-8">
        {/* Medical Disclaimer */}
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <h4 className="font-semibold text-amber-900 text-sm mb-2">
              Disclaimer
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              This app is designed as a self-help and reflection tool to support
              awareness and personal growth. It is{' '}
              <strong>
                not a substitute for professional medical or psychological
                advice, diagnosis, or treatment.
              </strong>
              <br />
              <br />
              The information shared in this app, including explanations of
              concepts such as ADHD, RSD, time blindness, and dopamine
              regulation, is intended for general educational and
              self-reflection purposes only. It is not medical advice and should
              not be interpreted as diagnosis or treatment. The content is based
              on insights aggregated from commonly reported experiences,
              publicly available research, and articles, and does not replace
              guidance from qualified medical or mental health professionals.
              <br />
              <br />
              If any of these topics resonate deeply or feel distressing,
              seeking professional support is always encouraged.
            </p>
          </div>
        </div>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h4 className="text-2xl font-bold text-slate-800">
              Understanding the design choices behind{' '}
              <strong className="text-celadon-600 tracking-wide">PIVOT</strong>
              <br />
              <span className="text-base font-normal text-slate-600 mt-2 block">
                This app is inspired by commonly reported ADHD experiences like
                rejection sensitivity, time blindness, and dopamine regulation
                challenges.
              </span>
            </h4>
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {currentPage.title}
            </h3>
            {currentPage.subtitle && (
              <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">
                {currentPage.subtitle}
              </h4>
            )}
            <div className="prose prose-slate max-w-none mt-4 text-sm sm:text-base">
              {currentPage.intro}
            </div>
          </div>

          {/* Collapsible Features Section */}
          <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-slate-800 fill-slate-800" />
              How PIVOT Addresses This
            </h3>

            <Accordion type="single" collapsible className="w-full space-y-3">
              {currentPage.features.map((feature) => (
                <AccordionItem
                  key={feature.id}
                  value={feature.id}
                  className="bg-white border border-slate-200 rounded-lg shadow-sm px-4 data-[state=open]:border-blue-200 transition-all"
                >
                  <AccordionTrigger className="no-scale hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <div className="mt-0.5">{feature.icon}</div>
                      <span className="font-semibold text-slate-700 text-sm sm:text-base">
                        {feature.name}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {/* Left Column: What it does */}
                      <div className="bg-blue-50/50 p-3 rounded-md">
                        <h5 className="font-semibold text-blue-900 mb-2 text-xs uppercase tracking-wider">
                          What the app does
                        </h5>
                        <ul className="space-y-1.5">
                          {feature.whatDoes.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-slate-700"
                            >
                              <span className="text-blue-400 mt-1.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right Column: Why it helps */}
                      <div className="bg-green-50/50 p-3 rounded-md">
                        <h5 className="font-semibold text-green-900 mb-2 text-xs uppercase tracking-wider">
                          Why this helps
                        </h5>
                        <ul className="space-y-1.5">
                          {feature.whyHelps.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-slate-700"
                            >
                              <span className="text-green-400 mt-1.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={index === 0}
              onClick={() => setIndex((i) => i - 1)}
            >
              Previous
            </Button>
            <Button
              disabled={index === PAGES_DATA.length - 1}
              onClick={() => setIndex((i) => i + 1)}
              className="bg-slate-800 hover:bg-slate-700 text-white"
            >
              Next
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setFeedbackOpen(true)}
            className="text-slate-700 hover:text-slate-900"
          >
            Leave your feedback
          </Button>
        </div>
      </div>

      <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </div>
  );
}
