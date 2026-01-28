'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { serversApi } from '@/lib/api';
import { ArrowRight, TrendingUp, Clock } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  gameType: string;
  region: string;
  voteCount: number;
}

export default function Home() {
  const [topServers, setTopServers] = useState<Server[]>([]);
  const [recentServers, setRecentServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const [topResponse, recentResponse] = await Promise.all([
          serversApi.getAll({ sortBy: 'votes', limit: 5 }),
          serversApi.getAll({ sortBy: 'newest', limit: 5 }),
        ]);

        setTopServers(topResponse.data.servers);
        setRecentServers(recentResponse.data.servers);
      } catch (error) {
        console.error('Error fetching servers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
            Welcome to RuSuite
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Discover and vote for the best RuneScape private servers. Join thousands of players
            finding their next adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/servers"
              className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition flex items-center justify-center gap-2 font-semibold"
            >
              Browse Servers <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition font-semibold"
            >
              Add Your Server
            </Link>
          </div>
        </div>
      </section>

      {/* Top Voted Servers */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp className="w-8 h-8 text-amber-500" />
            <h2 className="text-3xl font-bold">Top Voted Servers</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topServers.map((server, index) => (
                <Link
                  key={server.id}
                  href={`/servers/${server.slug}`}
                  className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition border border-slate-700 hover:border-amber-500"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold">{server.name}</h3>
                    <span className="text-2xl font-bold text-amber-500">#{index + 1}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {server.shortDescription}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="px-3 py-1 bg-slate-900 rounded text-amber-500">
                      {server.gameType}
                    </span>
                    <span className="text-slate-400">{server.voteCount} votes</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/servers?sortBy=votes"
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition"
            >
              View All Top Servers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-8 h-8 text-amber-500" />
            <h2 className="text-3xl font-bold">Recently Added</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-slate-700 rounded mb-4"></div>
                  <div className="h-4 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentServers.map((server) => (
                <Link
                  key={server.id}
                  href={`/servers/${server.slug}`}
                  className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition border border-slate-700 hover:border-amber-500"
                >
                  <h3 className="text-xl font-bold mb-3">{server.name}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {server.shortDescription}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="px-3 py-1 bg-slate-900 rounded text-amber-500">
                      {server.gameType}
                    </span>
                    <span className="text-slate-400">{server.region}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/servers?sortBy=newest"
              className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 transition"
            >
              View All New Servers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-900/20 to-orange-900/20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to List Your Server?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join RuSuite today and reach thousands of potential players looking for their next
            RuneScape adventure.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition font-semibold"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
