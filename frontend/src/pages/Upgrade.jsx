const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      color: "border-gray-700",
      btn: "Current Plan",
      disabled: true,
      features: ["3 prompts per session", "Max 40 pages per PDF", "All professions", "Basic Q&A"],
    },
    {
      name: "Pro",
      price: "₹499",
      period: "per month",
      color: "border-blue-500",
      btn: "Coming Soon",
      disabled: true,
      badge: "🔥 Most Popular",
      features: ["Unlimited prompts", "Max 200 pages per PDF", "All professions", "Chat history saved", "Priority support"],
    },
    {
      name: "Business",
      price: "₹1499",
      period: "per month",
      color: "border-purple-500",
      btn: "Coming Soon",
      disabled: true,
      features: ["Everything in Pro", "Multiple users", "API access", "Custom AI training", "Dedicated support"],
    },
  ];
  
  export default function Upgrade({ onBack }) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 gap-10">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white">
            You've used your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              3 free prompts
            </span>
          </h1>
          <p className="text-gray-400 mt-3">Upgrade to keep going — plans starting at ₹499/month</p>
        </div>
  
        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          {plans.map((p) => (
            <div key={p.name} className={`bg-gray-900 border-2 ${p.color} rounded-3xl p-6 flex flex-col gap-4 relative`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-xs font-bold px-3 py-1 rounded-full">
                  {p.badge}
                </span>
              )}
              <div>
                <p className="text-gray-400 text-sm">{p.name}</p>
                <p className="text-3xl font-extrabold text-white mt-1">{p.price}</p>
                <p className="text-gray-500 text-xs">{p.period}</p>
              </div>
              <ul className="flex flex-col gap-2 flex-1">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                disabled={p.disabled}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition
                  ${p.name === "Pro"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 opacity-60 cursor-not-allowed"
                    : "bg-gray-800 text-gray-400 cursor-not-allowed"}`}
              >
                {p.btn}
              </button>
            </div>
          ))}
        </div>
  
        <button onClick={onBack} className="text-gray-500 text-sm hover:text-gray-300 transition">
          ← Go back
        </button>
      </div>
    );
  }