export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold">Trusted by Businesses Worldwide</h2>
        <p className="mt-2 text-gray-600">Hear what our satisfied customers have to say.</p>
        {/* Placeholder for testimonials */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">"SnapBrander revolutionized how we create websites for our clients. It's fast, intuitive, and powerful."</p>
            <p className="mt-4 font-bold">- Jane Doe, CEO of a Web Agency</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">"I launched my online store in a single afternoon. The AI content generator is a game-changer!"</p>
            <p className="mt-4 font-bold">- John Smith, Small Business Owner</p>
          </div>
          <div className="p-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">"The best platform for building Elementor sites, period. The support team is also fantastic."</p>
            <p className="mt-4 font-bold">- Emily White, Freelance Designer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
