import React from 'react';
import { useMusic } from '../../context/MusicContext';
import { PREMIUM_PLANS } from '../../data/mockData';
import { Check, Sparkles, Crown, Download, ShieldCheck, Zap } from 'lucide-react';

export const PremiumView: React.FC = () => {
  const { user, openCheckoutModal } = useMusic();

  const comparisonFeatures = [
    { name: 'Ad-free music listening', free: false, premium: true },
    { name: 'Download songs to listen offline', free: false, premium: true },
    { name: '24-bit / 96kHz Hi-Fi Lossless FLAC', free: false, premium: true },
    { name: 'Play any song on-demand', free: false, premium: true },
    { name: 'Unlimited song skips', free: false, premium: true },
    { name: 'Cross-platform device sync & Spotify Connect', free: true, premium: true },
    { name: 'Synchronized real-time lyrics', free: true, premium: true },
    { name: 'Group Jam listening sessions', free: false, premium: true }
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-16 pb-32">
      {/* 1. Hero Banner */}
      <section className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Special Offer: 3 Months Free for new users</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          All your music. Offline, ad-free, and in studio Lossless.
        </h1>

        <p className="text-neutral-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Choose a Premium plan and listen to millions of songs with crystal-clear 24-bit audio, zero ads, and download unlimited tracks to your phone, computer, or tablet.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => openCheckoutModal('individual')}
            className="px-8 py-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-sm transition-transform hover:scale-105 shadow-xl"
          >
            Get 3 Months Free
          </button>
          <a
            href="#plans"
            className="px-6 py-3.5 rounded-full bg-transparent hover:bg-white/10 text-white font-bold text-sm border border-white/20 transition-colors"
          >
            View all plans
          </a>
        </div>
      </section>

      {/* 2. Feature Comparison Matrix */}
      <section className="bg-[#181818] rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Why go Premium?
          </h2>
          <p className="text-xs text-neutral-400 mt-1">See how Premium elevates your daily audio experience.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-xs uppercase font-medium">
                <th className="py-3 px-4">What you get</th>
                <th className="py-3 px-4 text-center w-32">Spotify Free</th>
                <th className="py-3 px-4 text-center w-40 text-[#1DB954] font-bold">Spotify Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisonFeatures.map((feat, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 text-neutral-200 font-medium text-xs sm:text-sm">
                    {feat.name}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {feat.free ? (
                      <Check className="w-4 h-4 text-neutral-400 mx-auto" />
                    ) : (
                      <span className="text-neutral-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {feat.premium ? (
                      <Check className="w-5 h-5 text-[#1DB954] mx-auto stroke-[2.5]" />
                    ) : (
                      <span className="text-neutral-600 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Pricing Tier Cards */}
      <section id="plans" className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Pick your plan</h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Listen without limits on your phone, speaker, and other devices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PREMIUM_PLANS.map(plan => {
            const isCurrentPlan = user.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative bg-[#181818] rounded-2xl p-6 border flex flex-col justify-between transition-all duration-200 hover:border-neutral-500 shadow-xl ${
                  plan.popular ? 'border-[#1DB954] ring-1 ring-[#1DB954]' : 'border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1DB954] text-black font-extrabold text-[10px] tracking-wider uppercase px-3 py-0.5 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-neutral-400 font-bold">{plan.accounts}</span>
                    {isCurrentPlan && (
                      <span className="text-[10px] font-bold text-[#1DB954] bg-[#1DB954]/20 px-2 py-0.5 rounded">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

                  <div className="mb-4">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-xs text-neutral-400"> / {plan.billingPeriod}</span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="border-t border-white/10 pt-4 mb-6 space-y-2.5">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200">
                        <Check className="w-3.5 h-3.5 text-[#1DB954] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => openCheckoutModal(plan.id)}
                  className={`w-full py-3 rounded-full font-bold text-xs transition-transform hover:scale-105 shadow-md ${
                    plan.popular
                      ? 'bg-[#1DB954] hover:bg-[#1ed760] text-black'
                      : 'bg-white hover:bg-neutral-200 text-black'
                  }`}
                >
                  {isCurrentPlan ? 'Manage Plan' : 'Get Started'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Trust & Security Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center pt-6">
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
          <Download className="w-6 h-6 text-[#1DB954] mx-auto" />
          <h4 className="text-sm font-bold text-white">Offline on 5 Devices</h4>
          <p className="text-xs text-neutral-400">Download up to 10,000 songs each on 5 different devices.</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
          <ShieldCheck className="w-6 h-6 text-[#1DB954] mx-auto" />
          <h4 className="text-sm font-bold text-white">Cancel Anytime</h4>
          <p className="text-xs text-neutral-400">Online cancellation anytime in just 1-click from your account.</p>
        </div>
        <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
          <Zap className="w-6 h-6 text-[#1DB954] mx-auto" />
          <h4 className="text-sm font-bold text-white">Hi-Fi Studio Quality</h4>
          <p className="text-xs text-neutral-400">Bit-perfect 24-bit 96kHz FLAC lossless streaming.</p>
        </div>
      </section>
    </div>
  );
};
