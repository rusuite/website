'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { serversApi, votesApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Globe,
  MessageCircle,
  Download,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface Server {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  gameType: string;
  region: string;
  websiteUrl: string;
  discordUrl: string;
  clientDownloadUrl: string;
  bannerImageUrl: string;
  tags: string[];
  voteCount: number;
  status: string;
  createdAt: string;
}

export default function ServerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [canVote, setCanVote] = useState(false);
  const [timeUntilVote, setTimeUntilVote] = useState<string>('');
  const [voting, setVoting] = useState(false);

  useEffect(() => {
    if (params.slug) {
      fetchServer();
      checkVoteStatus();
    }
  }, [params.slug]);

  const fetchServer = async () => {
    try {
      const response = await serversApi.getBySlug(params.slug as string);
      setServer(response.data);
    } catch (error) {
      console.error('Error fetching server:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkVoteStatus = async () => {
    try {
      const response = await votesApi.canVote(params.slug as string);
      setCanVote(response.data.canVote);
      if (!response.data.canVote && response.data.nextVoteAt) {
        calculateTimeUntilVote(response.data.nextVoteAt);
      }
    } catch (error) {
      console.error('Error checking vote status:', error);
    }
  };

  const calculateTimeUntilVote = (nextVoteAt: string) => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const nextVote = new Date(nextVoteAt).getTime();
      const distance = nextVote - now;

      if (distance < 0) {
        setCanVote(true);
        setTimeUntilVote('');
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeUntilVote(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  };

  const handleVote = async () => {
    if (!canVote || voting || !server) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setVoting(true);
    try {
      await votesApi.vote(server.id);
      setCanVote(false);
      // Refresh server data
      fetchServer();
      checkVoteStatus();
    } catch (error: any) {
      console.error('Error voting:', error);
      alert(error.response?.data?.message || 'Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleLinkClick = async (type: 'WEBSITE' | 'DISCORD' | 'CLIENT', url: string) => {
    if (server) {
      try {
        await serversApi.trackClick(server.id, type);
      } catch (error) {
        console.error('Error tracking click:', error);
      }
    }
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-slate-800 rounded-lg mb-8"></div>
            <div className="h-8 bg-slate-800 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-800 rounded w-2/3 mb-8"></div>
            <div className="h-32 bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Server Not Found</h1>
          <p className="text-slate-400 mb-8">The server you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/servers')}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition"
          >
            Back to Servers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Banner */}
      {server.bannerImageUrl && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={server.bannerImageUrl}
            alt={server.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{server.name}</h1>
            <p className="text-xl text-slate-400 mb-6">{server.shortDescription}</p>

            {/* Tags */}
            {server.tags && server.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {server.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-800 rounded text-amber-500 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Long Description */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <div className="text-slate-300 whitespace-pre-wrap">{server.longDescription}</div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Vote Button */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-amber-500 mb-2">
                  {server.voteCount}
                </div>
                <div className="text-slate-400 text-sm">Total Votes</div>
              </div>
              <button
                onClick={handleVote}
                disabled={!canVote || voting}
                className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  canVote && !voting
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                {voting ? 'Voting...' : canVote ? 'Vote Now' : 'Already Voted'}
              </button>
              {!canVote && timeUntilVote && (
                <div className="mt-3 text-center text-sm text-slate-400">
                  Next vote in: <span className="text-amber-500 font-mono">{timeUntilVote}</span>
                </div>
              )}
            </div>

            {/* Server Info */}
            <div className="bg-slate-800 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Server Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <span className="px-3 py-1 bg-slate-900 rounded text-amber-500">
                    {server.gameType}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <span>{server.region}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <span>Added {new Date(server.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  {server.status === 'APPROVED' ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span>Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-yellow-500" />
                      <span>Pending Approval</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <div className="space-y-3">
                {server.websiteUrl && (
                  <button
                    onClick={() => handleLinkClick('WEBSITE', server.websiteUrl)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition text-left"
                  >
                    <Globe className="w-5 h-5 text-amber-500" />
                    <span>Visit Website</span>
                  </button>
                )}
                {server.discordUrl && (
                  <button
                    onClick={() => handleLinkClick('DISCORD', server.discordUrl)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition text-left"
                  >
                    <MessageCircle className="w-5 h-5 text-amber-500" />
                    <span>Join Discord</span>
                  </button>
                )}
                {server.clientDownloadUrl && (
                  <button
                    onClick={() => handleLinkClick('CLIENT', server.clientDownloadUrl)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 hover:bg-slate-700 rounded-lg transition text-left"
                  >
                    <Download className="w-5 h-5 text-amber-500" />
                    <span>Download Client</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
