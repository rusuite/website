'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { serversApi } from '@/lib/api';
import { Search, Filter, TrendingUp, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  gameType: string;
  region: string;
  voteCount: number;
  tags: string[];
}

const GAME_TYPES = ['OSRS', 'RS3', 'CUSTOM', 'PRE_EOC', 'RSPS'];
const SORT_OPTIONS = [
  { value: 'votes', label: 'Most Votes' },
  { value: 'newest', label: 'Newest First' },
];

export default function ServersPage() {
  const searchParams = useSearchParams();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGameType, setSelectedGameType] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState('votes');
  const limit = 12;

  useEffect(() => {
    const sortParam = searchParams.get('sortBy');
    if (sortParam) {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchServers();
  }, [page, searchTerm, selectedGameType, selectedTag, sortBy]);

  const fetchServers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit,
        sortBy,
      };

      if (searchTerm) params.search = searchTerm;
      if (selectedGameType) params.gameType = selectedGameType;
      if (selectedTag) params.tag = selectedTag;

      const response = await serversApi.getAll(params);
      setServers(response.data.servers);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchServers();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Servers</h1>
          <p className="text-slate-400">
            Discover {total} RuneScape private servers and find your next adventure
          </p>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="col-span-1 md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search servers..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500 text-white"
                />
              </div>
            </form>

            {/* Game Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <select
                value={selectedGameType}
                onChange={(e) => {
                  setSelectedGameType(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500 text-white appearance-none cursor-pointer"
              >
                <option value="">All Game Types</option>
                {GAME_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500 text-white appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Server Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-700 rounded w-20"></div>
                  <div className="h-6 bg-slate-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : servers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {servers.map((server) => (
                <Link
                  key={server.id}
                  href={`/servers/${server.slug}`}
                  className="bg-slate-800 rounded-lg p-6 hover:bg-slate-700 transition border border-slate-700 hover:border-amber-500 group"
                >
                  <h3 className="text-xl font-bold mb-2 group-hover:text-amber-500 transition">
                    {server.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {server.shortDescription}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-slate-900 rounded text-amber-500 text-sm">
                      {server.gameType}
                    </span>
                    <span className="px-3 py-1 bg-slate-900 rounded text-slate-400 text-sm">
                      {server.region}
                    </span>
                  </div>
                  {server.tags && server.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {server.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-slate-900/50 rounded text-slate-400 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm pt-4 border-t border-slate-700">
                    <span className="text-slate-400 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {server.voteCount} votes
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition ${
                            page === pageNum
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-800 hover:bg-slate-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="px-2 py-2">...</span>;
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg mb-4">No servers found</p>
            <p className="text-slate-500">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
