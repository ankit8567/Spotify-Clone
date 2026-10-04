import React, { useState } from 'react';
import { useMusic } from '../../context/MusicContext';
import { PREMIUM_PLANS } from '../../data/mockData';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  ArrowRight
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    closeCheckoutModal,
    selectedPlanToBuy,
    upgradePlan
  } = useMusic();

  const [chosenPlanId, setChosenPlanId] = useState<'individual' | 'duo' | 'family' | 'student'>(
    selectedPlanToBuy || 'individual'
  );
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay'>('card');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isCheckoutModalOpen) return null;

  const currentPlan = PREMIUM_PLANS.find(p => p.id === chosenPlanId) || PREMIUM_PLANS[0];

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'SPOTIFY3MONTHS' || promoCode.trim().toUpperCase() === 'PREMIUM2026' || promoCode.trim().length > 3) {
      setDiscountApplied(true);
    }
  };

  const handleCompletePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      upgradePlan(chosenPlanId);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#202020] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6 md:p-8 space-y-6 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-xl font-bold">Upgrade to Spotify Premium</h2>
          </div>
          <button
            onClick={closeCheckoutModal}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="py-8 text-center space-y-5 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-[#1DB954]/20 border border-[#1DB954] flex items-center justify-center mx-auto text-[#1DB954]">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-white">
                Welcome to Spotify Premium!
              </h3>
              <p className="text-sm text-neutral-300 max-w-sm mx-auto">
                Your account is now activated with <strong>{currentPlan.name}</strong>. Ad-free music, offline downloads, and Hi-Fi Lossless streaming are unlocked!
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-left max-w-xs mx-auto space-y-2 font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Plan:</span>
                <span className="text-white font-bold">{currentPlan.name}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Audio Stream:</span>
                <span className="text-[#1DB954] font-bold">24-bit Lossless FLAC</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Status:</span>
                <span className="text-emerald-400">Active · Cross-Device Synced</span>
              </div>
            </div>

            <button
              onClick={closeCheckoutModal}
              className="px-8 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-sm transition-transform hover:scale-105"
            >
              Start Streaming
            </button>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleCompletePurchase} className="space-y-6">
            {/* 1. Plan Switcher Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 block">
                Choose Subscription Plan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PREMIUM_PLANS.map(plan => {
                  const isSelected = chosenPlanId === plan.id;
                  return (
                    <button
                      type="button"
                      key={plan.id}
                      onClick={() => setChosenPlanId(plan.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-[#1DB954]/15 border-[#1DB954] text-white shadow-md'
                          : 'bg-white/5 border-white/5 hover:border-white/10 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold truncate">{plan.name}</span>
                        {plan.popular && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#1DB954] text-black">
                            POPULAR
                          </span>
                        )}
                      </div>
                      <div className="text-sm font-black text-white">
                        {plan.price}
                        <span className="text-[10px] font-normal text-neutral-400">/{plan.billingPeriod}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Promo Code Input */}
            <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-300">Have a promo code? (Try: SPOTIFY3MONTHS)</span>
                {discountApplied && (
                  <span className="text-[#1DB954] font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 3 Months Free Applied!
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#1DB954]"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* 3. Payment Method Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 block">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Credit Card', icon: CreditCard },
                  { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                  { id: 'apple_pay', label: 'Apple / Google Pay', icon: Zap }
                ].map(m => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 px-3 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === m.id
                        ? 'bg-white/15 border-white text-white'
                        : 'bg-white/5 border-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <m.icon className="w-4 h-4" />
                    <span className="text-[11px] font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Mock Card Details */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-[#181818] p-4 rounded-xl border border-white/5">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#1DB954]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">Expires</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#1DB954]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="border-t border-white/10 pt-4 flex items-center justify-between text-sm">
              <div>
                <div className="font-bold text-white">Total Due Today:</div>
                <div className="text-[11px] text-neutral-400">
                  {discountApplied ? '3 Months Free trial, then ' + currentPlan.price + '/mo' : currentPlan.price + ' billed monthly'}
                </div>
              </div>
              <div className="text-xl font-extrabold text-[#1DB954]">
                {discountApplied ? '$0.00' : currentPlan.price}
              </div>
            </div>

            {/* Complete Purchase Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold text-sm transition-all hover:scale-[1.02] active:scale-98 shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? 'Verifying & Activating...' : 'Confirm & Activate Premium'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-bit encrypted checkout · Cancel anytime in your account</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
