/**
 * ADHD-Friendly Design System Example Component
 *
 * This component demonstrates how to use the global color palette,
 * typography, spacing, and styling conventions throughout the application.
 *
 * Design Principles:
 * - Calming, nature-inspired palette (greens, sage, cream)
 * - Generous white space for reduced cognitive load
 * - Soft shadows and gentle depth (not flat, not excessive)
 * - Smooth, predictable animations
 * - High contrast for readability (WCAG AA+)
 * - Touch-friendly sizing (44px+ minimum tap targets)
 * - Reward-focused design celebrating wins
 */

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function ADHDDesignExample() {
  return (
    <div className="min-h-screen bg-lime-cream-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-12"
      >
        {/* ===== Typography Example ===== */}
        <section className="space-y-6">
          <h1 className="text-4xl font-bold text-celadon-700">
            ADHD-Friendly Design System
          </h1>
          <p className="text-lg text-muted-teal-700 leading-relaxed">
            This design system is built specifically for users with ADHD,
            prioritizing clarity, reduced cognitive load, and gentle,
            encouraging feedback.
          </p>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-celadon-600">
              Color Palette & Usage
            </h2>
            <p className="text-muted-teal-700">
              Learn how to apply semantic colors throughout your components.
            </p>
          </div>
        </section>

        {/* ===== Color Palette Showcase ===== */}
        <section className="space-y-8">
          {/* Primary Color Family */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-bold text-celadon-600 mb-6">
              Primary Action Color: Celadon
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="space-y-2">
                    <div
                      className="w-full h-20 rounded-lg shadow-sm"
                      style={{
                        backgroundColor: `hsl(var(--celadon-${shade}))`,
                      }}
                    />
                    <p className="text-xs text-muted-teal-700 text-center">
                      {shade}
                    </p>
                  </div>
                )
              )}
            </div>
            <p className="text-muted-teal-700">
              <strong>Usage:</strong> Primary buttons, success states, important
              CTAs. Use celadon-600 for main actions, celadon-500 for success
              feedback.
            </p>
            <div className="mt-6 flex gap-4">
              <Button className="bg-celadon-600 hover:bg-celadon-700 text-white">
                Primary Action
              </Button>
              <Button
                variant="outline"
                className="border-celadon-300 text-celadon-700"
              >
                Secondary Action
              </Button>
            </div>
          </motion.div>

          {/* Lime Cream - Accent */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-bold text-lime-cream-600 mb-6">
              Accent Color: Lime Cream
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="space-y-2">
                    <div
                      className="w-full h-20 rounded-lg shadow-sm"
                      style={{
                        backgroundColor: `hsl(var(--lime-cream-${shade}))`,
                      }}
                    />
                    <p className="text-xs text-muted-teal-700 text-center">
                      {shade}
                    </p>
                  </div>
                )
              )}
            </div>
            <p className="text-muted-teal-700">
              <strong>Usage:</strong> Highlights, badges, attention-grabbing
              elements. Use lime-cream-500 for emphasis without overwhelming.
              Pair with dark text.
            </p>
            <div className="mt-4 bg-lime-cream-100 border-2 border-lime-cream-300 rounded-lg p-4">
              <p className="text-lime-cream-950 font-semibold">
                ⭐ This is a highlighted/important notification area
              </p>
            </div>
          </motion.div>

          {/* Muted Teal - Neutral */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-bold text-muted-teal-600 mb-6">
              Neutral Color: Muted Teal
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="space-y-2">
                    <div
                      className="w-full h-20 rounded-lg shadow-sm"
                      style={{
                        backgroundColor: `hsl(var(--muted-teal-${shade}))`,
                      }}
                    />
                    <p className="text-xs text-muted-teal-700 text-center">
                      {shade}
                    </p>
                  </div>
                )
              )}
            </div>
            <p className="text-muted-teal-700">
              <strong>Usage:</strong> Body text, borders, shadows, calming
              backgrounds. Provides a stable, non-overwhelming foundation for
              content.
            </p>
          </motion.div>

          {/* Dry Sage - Secondary */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-bold text-dry-sage-600 mb-6">
              Secondary Color: Dry Sage
            </h3>
            <div className="grid grid-cols-5 gap-4 mb-6">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="space-y-2">
                    <div
                      className="w-full h-20 rounded-lg shadow-sm"
                      style={{
                        backgroundColor: `hsl(var(--dry-sage-${shade}))`,
                      }}
                    />
                    <p className="text-xs text-muted-teal-700 text-center">
                      {shade}
                    </p>
                  </div>
                )
              )}
            </div>
            <p className="text-muted-teal-700">
              <strong>Usage:</strong> Secondary buttons, metadata, tertiary
              actions. Earthier feel for supporting information and alternative
              options.
            </p>
          </motion.div>
        </section>

        {/* ===== Component Examples ===== */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-celadon-600">
            Component Examples
          </h2>

          {/* Card Example */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-bold text-celadon-600 mb-4">
              Card Component
            </h3>
            <p className="text-muted-teal-700 mb-6">
              Cards use soft shadows, generous padding, and subtle hover
              animations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-celadon-50 border-2 border-celadon-200 rounded-lg p-6">
                <h4 className="font-bold text-celadon-700 mb-2">
                  Success Card
                </h4>
                <p className="text-muted-teal-700">
                  Great job! You've completed your daily goal. Keep it up! 🌟
                </p>
              </div>
              <div className="bg-lime-cream-50 border-2 border-lime-cream-300 rounded-lg p-6">
                <h4 className="font-bold text-lime-cream-700 mb-2">
                  Highlight Card
                </h4>
                <p className="text-muted-teal-700">
                  Important: Remember to log your progress daily.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Input Example */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-all"
          >
            <h3 className="text-2xl font-bold text-celadon-600 mb-4">
              Form Inputs
            </h3>
            <p className="text-muted-teal-700 mb-6">
              Inputs have large touch targets (48px), clear borders, and focus
              states.
            </p>
            <form className="space-y-4 max-w-sm">
              <div>
                <label className="block text-muted-teal-700 font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border-2 border-muted-teal-200 rounded-lg text-muted-teal-900 placeholder-muted-teal-400 focus:border-celadon-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-muted-teal-700 font-semibold mb-2">
                  Notes
                </label>
                <textarea
                  placeholder="How are you feeling today?"
                  className="w-full px-4 py-3 border-2 border-muted-teal-200 rounded-lg text-muted-teal-900 placeholder-muted-teal-400 focus:border-celadon-500 focus:outline-none transition-colors resize-none"
                  rows={4}
                />
              </div>
            </form>
          </motion.div>
        </section>

        {/* ===== Design Principles ===== */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold text-celadon-600 mb-6">
            Design Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Generous Spacing',
                description:
                  'Large padding and margins reduce cognitive load and prevent overwhelm.',
                emoji: '📦',
              },
              {
                title: 'Soft Shadows',
                description:
                  'Subtle, layered shadows create depth without harsh visual breaks.',
                emoji: '🌫️',
              },
              {
                title: 'Clear Focus States',
                description:
                  '3px celadon outline ensures keyboard navigation is always visible.',
                emoji: '👁️',
              },
              {
                title: 'Smooth Animations',
                description:
                  '150-200ms transitions feel responsive without being jarring.',
                emoji: '✨',
              },
              {
                title: 'High Contrast Text',
                description:
                  'WCAG AA+ contrast ratios ensure readability for all users.',
                emoji: '🔤',
              },
              {
                title: 'Touch-Friendly Targets',
                description:
                  '44px+ minimum tap targets make interaction accessible.',
                emoji: '👆',
              },
            ].map((principle, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-celadon-50 border-2 border-celadon-200 rounded-lg p-6"
              >
                <div className="text-3xl mb-3">{principle.emoji}</div>
                <h4 className="font-bold text-celadon-700 mb-2">
                  {principle.title}
                </h4>
                <p className="text-muted-teal-700">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ===== Usage Tips ===== */}
        <section className="bg-lime-cream-50 border-2 border-lime-cream-300 rounded-xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-lime-cream-700">
            💡 Usage Tips
          </h2>
          <ul className="space-y-3 text-muted-teal-700">
            <li>
              <strong>Colors:</strong> Always use semantic color names (primary,
              success, accent) instead of hardcoding hex values.
            </li>
            <li>
              <strong>Spacing:</strong> Use Tailwind spacing classes (p-6, m-4,
              gap-6) for consistent ADHD-friendly breathing room.
            </li>
            <li>
              <strong>Shadows:</strong> Apply shadow-sm for cards, shadow-md on
              hover, shadow-lg for modals/overlays.
            </li>
            <li>
              <strong>Focus:</strong> All interactive elements get
              :focus-visible styles automatically from base CSS.
            </li>
            <li>
              <strong>Animations:</strong> Keep animations under 300ms, use
              ease-out for entrance, ease-in for exit.
            </li>
            <li>
              <strong>Dark Mode:</strong> CSS variables automatically update in
              .dark class. Test with: &lt;html className=&quot;dark&quot;&gt;
            </li>
          </ul>
        </section>
      </motion.div>
    </div>
  );
}
