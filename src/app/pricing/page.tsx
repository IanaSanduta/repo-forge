import Link from 'next/link';

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}

const pricingTiers: PricingTierProps[] = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for personal projects and getting started with GitHub portfolio creation.',
    features: [
      'Up to 5 public repositories',
      'Basic portfolio templates',
      'GitHub stats integration',
      'Custom domain support',
      'Community support'
    ],
    buttonText: 'Get Started',
    buttonLink: '/github/connect'
  },
  {
    name: 'Pro',
    price: '$9',
    description: 'Ideal for developers and freelancers who want to showcase their work professionally.',
    features: [
      'Unlimited public repositories',
      'All portfolio templates',
      'Custom color schemes',
      'Blog integration',
      'Analytics dashboard',
      'Priority support',
      'Remove RepoForge branding'
    ],
    buttonText: 'Upgrade to Pro',
    buttonLink: '/github/connect',
    highlighted: true
  },
  {
    name: 'Team',
    price: '$29',
    description: 'For teams and organizations that need to showcase multiple projects and developers.',
    features: [
      'Everything in Pro',
      'Team member profiles',
      'Organization repositories',
      'Project collaboration tools',
      'Team analytics',
      'Custom CSS and JavaScript',
      'Dedicated support',
      'API access'
    ],
    buttonText: 'Contact Sales',
    buttonLink: '/contact'
  }
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Choose the perfect plan for your needs. All plans include core features to help you showcase your GitHub repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {pricingTiers.map((tier) => (
          <div 
            key={tier.name}
            className={`rounded-lg overflow-hidden ${
              tier.highlighted 
                ? 'ring-2 ring-black dark:ring-white shadow-lg transform md:-translate-y-4' 
                : 'border border-gray-200 dark:border-gray-700 shadow-md'
            }`}
          >
            <div className="p-8 bg-white dark:bg-gray-800">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  {tier.name !== 'Free' && <span className="ml-1 text-gray-500 dark:text-gray-400">/month</span>}
                </div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.buttonLink}
                className={`block w-full py-3 px-4 rounded-md text-center font-medium ${
                  tier.highlighted
                    ? 'bg-black dark:bg-white dark:text-black text-white hover:bg-gray-800 dark:hover:bg-gray-200'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                } transition-colors`}
              >
                {tier.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 md:p-12">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 md:mb-0">
              We offer custom solutions for enterprises and organizations with specific requirements. Contact our sales team to discuss your needs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-center"
            >
              Contact Sales
            </Link>
            <Link
              href="/enterprise"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-center"
            >
              Learn About Enterprise
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Can I upgrade or downgrade my plan?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be applied to your next billing cycle.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Is there a free trial for paid plans?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, we offer a 14-day free trial for all paid plans. No credit card required to start.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Do you offer discounts for students?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, we offer a 50% discount for students and educational institutions. Contact our support team with your academic email for verification.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">What payment methods do you accept?</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
