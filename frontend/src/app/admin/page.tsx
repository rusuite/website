'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/api';
import {
  Users,
  Server,
  TrendingUp,
  CheckCircle,
  XCircle,
  Trash2,
  ShieldAlert,
  Eye,
} from 'lucide-react';

interface Analytics {
  totalServers: number;
  totalUsers: number;
  totalVotes: number;
  pendingServers: number;
}

interface ServerItem {
  id: string;
  name: string;
  slug: string;
  owner: {
    email: string;
  };
  status: string;
  voteCount: number;
  createdAt: string;
}

interface UserItem {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  _count?: {
    servers: number;
  };
}

export default function AdminPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [servers, setServers] = useState<ServerItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'servers' | 'users'>('overview');

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      } else {
        fetchData();
      }
    }
  }, [user, authLoading, isAdmin, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, serversRes, usersRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getServers({ limit: 50 }),
        adminApi.getUsers({ limit: 50 }),
      ]);

      setAnalytics(analyticsRes.data);
      setServers(Array.isArray(serversRes.data) ? serversRes.data : serversRes.data.servers);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServerStatusUpdate = async (id: string, status: string) => {
    try {
      await adminApi.updateServerStatus(id, status);
      fetchData();
    } catch (error) {
      console.error('Error updating server status:', error);
      alert('Failed to update server status');
    }
  };

  const handleDeleteServer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await adminApi.deleteServer(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting server:', error);
      alert('Failed to delete server');
    }
  };

  const handleUpdateUserRole = async (id: string, role: string) => {
    try {
      await adminApi.updateUserRole(id, role);
      fetchData();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user "${email}"?`)) return;

    try {
      await adminApi.deleteUser(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  if (authLoading || !user || !isAdmin) {
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
        <div className="flex items-center gap-3 mb-8">
          <ShieldAlert className="w-10 h-10 text-amber-500" />
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-slate-400">Manage users, servers, and platform analytics</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'overview'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('servers')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'servers'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Servers
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition ${
              activeTab === 'users'
                ? 'text-amber-500 border-b-2 border-amber-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Users
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && analytics && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Server className="w-8 h-8 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{analytics.totalServers}</div>
                        <div className="text-slate-400 text-sm">Total Servers</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Users className="w-8 h-8 text-purple-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{analytics.totalUsers}</div>
                        <div className="text-slate-400 text-sm">Total Users</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500/20 rounded-lg">
                        <TrendingUp className="w-8 h-8 text-amber-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{analytics.totalVotes}</div>
                        <div className="text-slate-400 text-sm">Total Votes</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-500/20 rounded-lg">
                        <ShieldAlert className="w-8 h-8 text-yellow-500" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">{analytics.pendingServers}</div>
                        <div className="text-slate-400 text-sm">Pending Approval</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h2 className="text-2xl font-bold mb-4">Recent Servers</h2>
                  <div className="space-y-4">
                    {servers.slice(0, 5).map((server) => (
                      <div
                        key={server.id}
                        className="flex items-center justify-between p-4 bg-slate-900 rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold">{server.name}</h3>
                          <p className="text-sm text-slate-400">
                            by {server.owner.email} • {new Date(server.createdAt).toLocaleDateString()}
                          </p>
                        </div>
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
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Servers Tab */}
            {activeTab === 'servers' && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Owner</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Votes</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {servers.map((server) => (
                        <tr key={server.id} className="hover:bg-slate-900/50">
                          <td className="px-6 py-4">
                            <div className="font-semibold">{server.name}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-400 text-sm">
                            {server.owner.email}
                          </td>
                          <td className="px-6 py-4">
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
                          </td>
                          <td className="px-6 py-4">{server.voteCount}</td>
                          <td className="px-6 py-4 text-slate-400 text-sm">
                            {new Date(server.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => router.push(`/servers/${server.slug}`)}
                                className="p-2 bg-slate-700 rounded hover:bg-slate-600 transition"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {server.status === 'PENDING' && (
                                <>
                                  <button
                                    onClick={() => handleServerStatusUpdate(server.id, 'APPROVED')}
                                    className="p-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleServerStatusUpdate(server.id, 'REJECTED')}
                                    className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => handleDeleteServer(server.id, server.name)}
                                className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-900">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Servers</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {users.map((userItem) => (
                        <tr key={userItem.id} className="hover:bg-slate-900/50">
                          <td className="px-6 py-4">
                            <div className="font-semibold">{userItem.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={userItem.role}
                              onChange={(e) => handleUpdateUserRole(userItem.id, e.target.value)}
                              className="px-3 py-1 bg-slate-900 border border-slate-700 rounded text-sm"
                              disabled={userItem.id === user.id}
                            >
                              <option value="USER">User</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">{userItem._count?.servers || 0}</td>
                          <td className="px-6 py-4 text-slate-400 text-sm">
                            {new Date(userItem.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                                disabled={userItem.id === user.id}
                                className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
