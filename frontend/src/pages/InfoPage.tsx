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

// --- Data Structure ---
const PAGES_DATA = [
  {
    title: 'Rejection Sensitive Dysphoria (RSD)',
    subtitle: '',
    intro: (
      <>
        <p className="text-slate-700 mb-4">
          <strong className="font-semibold text-slate-800 mt-2">
            The "Broken Thermostat" of Emotion
          </strong>
          : When things go wrong, most people can tell themselves "it's okay,
          I'll try again tomorrow" and feel better. People with ADHD often can't
          do this—their brain doesn't have that off switch. Instead, a small
          setback like a broken habit streak can hit them with overwhelming
          shame that feels as real and painful as a physical injury.
        </p>

        <p className="text-slate-700 mb-6">
          <strong className="font-semibold text-slate-800">
            The "Internalized Critic"
          </strong>
          : When people with ADHD make a mistake, they often can't hold two
          truths at once—like "I'm capable" and "I forgot today." Instead, the
          mistake becomes their entire identity in that moment. A broken habit
          streak in an app becomes a painful record of failure, and to escape
          that overwhelming shame, they delete the app entirely.
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
          'Removes the moment of rejection that triggers RSD',
          'A single lapse does not invalidate past effort',
          'The user never sees a “you failed” state',
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
          : People with ADHD experience time in two zones: "Now" (the immediate
          present) and "Not Now" (everything else). Because they struggle to
          connect these zones, they can't easily visualize future rewards—a
          30-day goal feels abstract and unreal, while the immediate urge to
          stop feels concrete. Long-term consistency becomes like chasing a
          mirage that keeps receding.
        </p>

        <p className="text-slate-700 mb-6">
          <strong className="font-semibold text-slate-800">
            The Lack of "Goal Permanence"
          </strong>
          : People with ADHD struggle with "goal permanence"—when a visible
          streak breaks and resets, the goal disappears from their mind along
          with it. They can't easily access the feeling of those 20 successful
          days, so it doesn't feel like they're 20 steps ahead; it feels like
          those days belonged to a different person and no longer count.
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
          'Keeps the task inside the user’s “Now” horizon',
          'Avoids abstract future promises',
          'Aligns with how ADHD users actually experience time',
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
          : People with ADHD have a lower baseline of dopamine, creating a
          constant, physically painful sense of boredom. Their brain hunts for
          high-excitement rewards—novelty, urgency, anything stimulating. A
          simple habit tracker offering a small "+1" counter feels like low
          reward for high effort, so the brain ignores it in favor of anything
          more immediately exciting.
        </p>

        <p className="text-slate-700 mb-6">
          <strong className="font-semibold text-slate-800">
            The "Wall of Awful"
          </strong>
          : The "Wall of Awful" is an emotional barrier that builds with each
          failure, missed deadline, or moment of shame. When someone with ADHD
          looks at their habit tracker, they're not just seeing tasks—they're
          seeing this wall of accumulated guilt and fear. The emotional
          intensity triggers a fight-or-flight response, causing them to freeze
          or avoid the app entirely.
        </p>
      </>
    ),
    features: [
      {
        id: 'dd-1',
        name: 'One-Tap Action When Urgres Peak',
        icon: <Zap className="w-5 h-5 text-purple-500" />,
        whatDoes: [
          'Single, decisive button press',
          'Minimal friction during emotional peaks',
        ],
        whyHelps: [
          'Reduces “wall of awful” activation cost',
          'Converts urge energy into action instead of avoidance',
          'Makes engagement easier than disengagement',
        ],
      },
      {
        id: 'dd-2',
        name: 'Immediate Feedback Loop', // Renamed duplicate for clarity
        icon: <CheckCircle2 className="w-5 h-5 text-indigo-500" />,
        whatDoes: [
          'Single, decisive button press',
          'Minimal friction during emotional peaks',
        ],
        whyHelps: [
          'Reduces “wall of awful” activation cost',
          'Converts urge energy into action instead of avoidance',
          'Makes engagement easier than disengagement',
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
              on insights aggregated from publicly available research, and
              articles, and does not replace guidance from qualified medical or
              mental health professionals.
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
            <h2 className="text-2xl font-bold text-slate-800">
              Understanding the design choices behind{' '}
              <strong className="text-celadon-600 tracking-wide">PIVOT</strong>
            </h2>
          </div>
          <div className="text-sm font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            {index + 1} / {PAGES_DATA.length}
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
        </div>
      </div>
    </div>
  );
}
