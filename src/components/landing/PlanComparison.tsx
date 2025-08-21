import Link from 'next/link';

export default function PlanComparison() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">Find the Perfect Plan</h2>
        <p className="mt-2 text-gray-600">Choose the plan that's right for you. All plans come with a 30-day money-back guarantee.</p>
        {/* Placeholder for plan comparison table */}
        <div className="mt-8 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">[Plan Comparison Table Placeholder]</p>
        </div>
        <div className="mt-8">
            <Link
                href="/pricing"
                className="text-blue-600 font-semibold hover:underline"
            >
                Compare all features &rarr;
            </Link>
        </div>
      </div>
    </section>
  );
}
