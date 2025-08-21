import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
          Build Your Professional Website in Minutes
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Leverage the power of AI to create stunning, fully functional WordPress websites with Elementor. No coding required.
        </p>
        <div className="mt-8">
          <Link
            href="/pricing"
            className="bg-blue-600 text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-blue-700"
          >
            Start Your Site Now
          </Link>
        </div>
      </div>
    </section>
  );
}
