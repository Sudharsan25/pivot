import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Brain,
  XCircle,
  Trophy,
  TrendingUp,
  AlertCircle,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleStartTracking = () => {
    navigate('/register');
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: 'easeOut' },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.25,
        delayChildren: 0.2,
      },
    },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  const scaleInVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={fadeInUp.initial}
            animate={fadeInUp.animate}
            transition={fadeInUp.transition}
            className="space-y-8"
          >
            {/* Hero Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
              className="flex justify-center"
            >
              <Sparkles className="w-24 h-24 md:w-32 md:h-32 text-lime-cream-500" />
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-muted-teal-900 leading-tight">
              Break Bad Habits.
              <br />
              One Urge at a Time.
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-teal-600 max-w-3xl mx-auto leading-relaxed">
              An ADHD-friendly approach to building better habits without the
              pressure of streaks
            </p>

            {/* CTA Button */}
            <motion.button
              onClick={handleStartTracking}
              className="inline-flex items-center gap-3 bg-celadon-600 hover:bg-celadon-700 text-white text-xl font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-h-[56px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              Start Tracking
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* What is an Urge Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <motion.div
          initial={fadeInUp.initial}
          whileInView={fadeInUp.animate}
          viewport={{ once: true, margin: '-100px' }}
          transition={fadeInUp.transition}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-muted-teal-900 mb-8 text-center">
            What is an Urge?
          </h2>

          <div className="bg-white shadow-md rounded-xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <Brain className="w-12 h-12 md:w-16 md:h-16 text-celadon-600" />
              </div>
              <div className="space-y-4">
                <p className="text-lg text-muted-teal-700 leading-relaxed">
                  An urge is that sudden pull toward a habit you're trying to
                  change - like reaching for your phone, craving a cigarette, or
                  opening social media.
                </p>
                <p className="text-lg text-muted-teal-700 leading-relaxed">
                  Instead of ignoring urges or feeling guilty about them, we
                  help you recognize and surf through them.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* How It Helps Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold text-muted-teal-900 mb-12 text-center">
            Why Our Approach Works for ADHD Brains
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: No Streak Pressure */}
            <motion.div
              variants={scaleInVariants}
              className="bg-white rounded-xl p-6 border-l-4 border-celadon-500 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <XCircle className="w-10 h-10 text-celadon-700 mb-4" />
              <h3 className="text-xl font-semibold text-celadon-700 mb-3">
                No Streak Pressure
              </h3>
              <p className="text-muted-teal-700 leading-relaxed">
                We don't count consecutive days. Instead, we celebrate every
                single urge you fight. Slip-ups don't reset your progress -
                they're just data points.
              </p>
            </motion.div>

            {/* Card 2: Focus on Wins */}
            <motion.div
              variants={scaleInVariants}
              className="bg-white rounded-xl p-6 border-l-4 border-lime-cream-500 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <Trophy className="w-10 h-10 text-lime-cream-700 mb-4" />
              <h3 className="text-xl font-semibold text-lime-cream-700 mb-3">
                Focus on Wins
              </h3>
              <p className="text-muted-teal-700 leading-relaxed">
                ADHD brains thrive on immediate rewards. Every resisted urge is
                celebrated. See your victories add up, not your failures.
              </p>
            </motion.div>

            {/* Card 3: Understand Your Patterns */}
            <motion.div
              variants={scaleInVariants}
              className="bg-white rounded-xl p-6 border-l-4 border-dry-sage-500 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <TrendingUp className="w-10 h-10 text-dry-sage-700 mb-4" />
              <h3 className="text-xl font-semibold text-dry-sage-700 mb-3">
                Understand Your Patterns
              </h3>
              <p className="text-muted-teal-700 leading-relaxed">
                Track what triggers your urges. Learn when you're most
                vulnerable. Use this insight to build strategies that actually
                work for you.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <h2 className="text-3xl font-bold text-muted-teal-900 mb-12 text-center">
            How to Use{' '}
            <strong className="text-celadon-600 tracking-wide">PIVOT</strong>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div
              variants={fadeInLeft}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-celadon-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    1
                  </div>
                  <AlertCircle className="w-8 h-8 text-celadon-600" />
                </div>
                <h3 className="text-xl font-semibold text-muted-teal-900 mb-3">
                  Feel an Urge
                </h3>
                <p className="text-muted-teal-700 leading-relaxed">
                  Notice when you feel pulled toward your habit. This awareness
                  is the first step.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeInLeft}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-lime-cream-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    2
                  </div>
                  <Zap className="w-8 h-8 text-lime-cream-600" />
                </div>
                <h3 className="text-xl font-semibold text-muted-teal-900 mb-3">
                  Use the Panic Button or Quick Log
                </h3>
                <p className="text-muted-teal-700 leading-relaxed">
                  Hit the panic button for a 5-minute guided wait, or quickly
                  log whether you resisted or gave in.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeInLeft}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-muted-teal-600 text-white flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    3
                  </div>
                  <TrendingUp className="w-8 h-8 text-muted-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-muted-teal-900 mb-3">
                  Track Your Progress
                </h3>
                <p className="text-muted-teal-700 leading-relaxed">
                  Watch your urges-fought count grow. Review patterns. Celebrate
                  every win, no matter how small.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Final CTA Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16  relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)',
            }}
          />
        </div>

        <motion.div
          initial={scaleIn.initial}
          whileInView={scaleIn.animate}
          viewport={{ once: true, margin: '-100px' }}
          className="relative max-w-4xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join others who are breaking habits the ADHD-friendly way
          </p>
          <motion.button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-3 bg-white text-celadon-700 text-xl font-semibold px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 min-h-[56px] hover:bg-lime-cream-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            Get Started
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
