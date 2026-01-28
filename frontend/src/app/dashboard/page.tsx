'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { serversApi } from '@/lib/api';
import {
  Plus,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Globe,
  MessageCircle,
  Download,
  Save,
  X,
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
  websiteClicks?: number;
  discordClicks?: number;
  clientClicks?: number;
}

const GAME_TYPES = ['OSRS', 'RS3', 'CUSTOM', 'PRE_EOC', 'RSPS'];
const REGIONS = ['NA', 'EU', 'AS', 'OCE', 'SA'];

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    gameType: 'OSRS',
    region: 'NA',
    websiteUrl: '',
    discordUrl: '',
    clientDownloadUrl: '',
    bannerImageUrl: '',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchMyServers();
    }
  }, [user, authLoading, router]);

  const fetchMyServers = async () => {
    setLoading(true);
    try {
      const response = await serversApi.getMyServers();
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };

      if (editingServer) {
        await serversApi.update(editingServer.id, data);
      } else {
        await serversApi.create(data);
      }

      setShowForm(false);
      setEditingServer(null);
      setFormData({
        name: '',
        shortDescription: '',
        longDescription: '',
        gameType: 'OSRS',
        region: 'NA',
        websiteUrl: '',
        discordUrl: '',
        clientDownloadUrl: '',
        bannerImageUrl: '',
        tags: '',
      });
      fetchMyServers();
    } catch (error: any) {
      console.error('Error saving server:', error);
      alert(error.response?.data?.message || 'Failed to save server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (server: Server) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      shortDescription: server.shortDescription,
      longDescription: server.longDescription,
      gameType: server.gameType,
      region: server.region,
      websiteUrl: server.websiteUrl || '',
      discordUrl: server.discordUrl || '',
      clientDownloadUrl: server.clientDownloadUrl || '',
      bannerImageUrl: server.bannerImageUrl || '',
      tags: server.tags?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await serversApi.delete(id);
      fetchMyServers();
    } catch (error) {
      console.error('Error deleting server:', error);
      alert('Failed to delete server');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
            <p className="text-slate-400">Manage your servers and view statistics</p>
          </div>
          <button
            onClick={() => {
              setEditingServer(null);
              setFormData({
                name: '',
                shortDescription: '',
                longDescription: '',
                gameType: 'OSRS',
                region: 'NA',
                websiteUrl: '',
                discordUrl: '',
                clientDownloadUrl: '',
                bannerImageUrl: '',
                tags: '',
              });
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Server
          </button>
        </div>

        {/* Server Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {editingServer ? 'Edit Server' : 'Add New Server'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Server Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Short Description *</label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      required
                      maxLength={200}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Long Description *</label>
                    <textarea
                      name="longDescription"
                      value={formData.longDescription}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Game Type *</label>
                      <select
                        name="gameType"
                        value={formData.gameType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                      >
                        {GAME_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Region *</label>
                      <select
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                      >
                        {REGIONS.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Website URL</label>
                    <input
                      type="url"
                      name="websiteUrl"
                      value={formData.websiteUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Discord URL</label>
                    <input
                      type="url"
                      name="discordUrl"
                      value={formData.discordUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Client Download URL</label>
                    <input
                      type="url"
                      name="clientDownloadUrl"
                      value={formData.clientDownloadUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Banner Image URL</label>
                    <input
                      type="url"
                      name="bannerImageUrl"
                      value={formData.bannerImageUrl}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="PvP, Eco, Ironman"
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
                    >
                      <Save className="w-5 h-5" />
                      {submitting ? 'Saving...' : editingServer ? 'Update Server' : 'Create Server'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Servers List */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : servers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {servers.map((server) => (
              <div
                key={server.id}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{server.name}</h3>
                      <span
                        className={`px-3 py-1 rounded text-xs font-semibold ${
                          server.status === 'APPROVED'
                            ? 'bg-green-500/20 text-green-500'
                            : server.status === 'REJECTED'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-yellow-500/20 text-yellow-500'
                        }`}
                      >
                        {server.status}
                      </span>
                    </div>
                    <p className="text-slate-400 mb-4">{server.shortDescription}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/servers/${server.slug}`)}
                      className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(server)}
                      className="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(server.id, server.name)}
                      className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    <div>
                      <div className="text-2xl font-bold">{server.voteCount}</div>
                      <div className="text-xs text-slate-400">Votes</div>
                    </div>
                  </div>
                  {server.websiteClicks !== undefined && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">{server.websiteClicks}</div>
                        <div className="text-xs text-slate-400">Website Clicks</div>
                      </div>
                    </div>
                  )}
                  {server.discordClicks !== undefined && (
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="text-2xl font-bold">{server.discordClicks}</div>
                        <div className="text-xs text-slate-400">Discord Clicks</div>
                      </div>
                    </div>
                  )}
                  {server.clientClicks !== undefined && (
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-2xl font-bold">{server.clientClicks}</div>
                        <div className="text-xs text-slate-400">Client Downloads</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-lg mb-4">You haven't added any servers yet</p>
            <button
              onClick={() => {
                setEditingServer(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-500 transition font-semibold"
            >
              <Plus className="w-5 h-5" />
              Add Your First Server
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
