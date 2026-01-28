import { Info, Users, Target, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            About RuSuite
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            The premier platform for discovering and promoting RuneScape private servers
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold">Our Mission</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              RuSuite was created to connect players with the best RuneScape private servers. We
              provide a transparent, user-driven platform where servers are ranked by community
              votes, ensuring quality and player satisfaction.
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-bold">Our Values</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              We believe in fairness, transparency, and community. Every server on RuSuite is
              verified and monitored to ensure a safe experience for players. Our voting system is
              designed to prevent abuse and showcase truly outstanding servers.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <Info className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold">Server Discovery</h3>
              </div>
              <p className="text-slate-400">
                Browse hundreds of RuneScape private servers with detailed information, filtering
                by game type, region, and features.
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold">Community Voting</h3>
              </div>
              <p className="text-slate-400">
                Vote for your favorite servers and help others discover quality communities. Fair
                voting system with anti-abuse measures.
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-amber-500" />
                <h3 className="text-xl font-bold">Server Promotion</h3>
              </div>
              <p className="text-slate-400">
                Server owners can list their servers, track statistics, and reach thousands of
                potential players looking for new adventures.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700 mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="prose prose-invert max-w-none text-slate-300 space-y-4">
            <p>
              RuSuite was born from a passion for RuneScape and the vibrant private server
              community. We recognized the need for a modern, user-friendly platform that could
              help players discover quality servers while providing owners with the tools to
              promote their communities.
            </p>
            <p>
              Since our launch, we've helped thousands of players find their ideal RuneScape
              experience. From Old School RuneScape servers to custom content-rich private servers,
              RuSuite is the go-to destination for the RSPS community.
            </p>
            <p>
              We're constantly improving our platform based on community feedback. Whether you're a
              player looking for a new server or an owner wanting to grow your community, RuSuite
              is here to help you succeed.
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="text-center bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Have questions, suggestions, or need support? We'd love to hear from you.
          </p>
          <p className="text-amber-500 font-semibold">
            Contact us at: support@rusuite.com
          </p>
        </div>
      </div>
    </div>
  );
}
