import React from 'react';

const SubscriptionPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$9.99/month',
      features: [
        'Access to 10 courses',
        'Basic quizzes',
        'Community discussions',
        'Email support'
      ],
      buttonText: 'Get Basic',
      gradient: 'from-blue-500 to-cyan-500',
      hover: 'hover:from-blue-600 hover:to-cyan-600'
    },
    {
      name: 'Pro',
      price: '$19.99/month',
      features: [
        'Access to all courses',
        'Advanced quizzes with AI feedback',
        'Priority discussions',
        '24/7 support',
        'Progress tracking'
      ],
      buttonText: 'Get Pro',
      gradient: 'from-purple-500 to-pink-500',
      hover: 'hover:from-purple-600 hover:to-pink-600',
      popular: true
    },
    {
      name: 'Premium',
      price: '$29.99/month',
      features: [
        'Everything in Pro',
        'Personalized AI tutor',
        'Exclusive webinars',
        'Certificate downloads',
        'Custom study plans'
      ],
      buttonText: 'Get Premium',
      gradient: 'from-green-500 to-teal-500',
      hover: 'hover:from-green-600 hover:to-teal-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Unlock your potential with our AI-driven learning platform. Select the plan that fits your journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/25 ${
                plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">{plan.name}</h2>
                <p className={`text-4xl font-extrabold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                  {plan.price}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-slate-300">
                    <span className="text-green-400 mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 bg-gradient-to-r ${plan.gradient} ${plan.hover} text-white font-bold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-slate-400 text-lg">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
