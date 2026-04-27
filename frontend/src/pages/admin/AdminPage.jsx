import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import { userAPI } from '../../api/services';

const ROLE_OPTIONS = ['admin', 'editor', 'user'];

const AdminPage = () => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: adminStats, isLoading: statsLoading } = useQuery(['admin-stats'], userAPI.getAdminStats);
  const { data: usersResponse, isLoading: usersLoading } = useQuery(
    ['admin-users', page, roleFilter, search],
    async () => {
      const { data } = await userAPI.getAll({
        page,
        limit: 12,
        role: roleFilter || undefined,
        search: search || undefined,
      });
      return data;
    },
    { keepPreviousData: true }
  );

  const updateRoleMutation = useMutation(({ id, role }) => userAPI.updateRole(id, role), {
    onSuccess: () => {
      toast.success('User role updated');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Unable to update role');
    },
  });

  const toggleStatusMutation = useMutation((id) => userAPI.toggleStatus(id), {
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Unable to update status');
    },
  });

  const deleteUserMutation = useMutation((id) => userAPI.delete(id), {
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries(['admin-users']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Unable to delete user');
    },
  });

  const stats = adminStats?.data?.stats || {};
  const users = usersResponse?.data?.users || [];
  const meta = usersResponse?.meta || {};

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 p-6 shadow-sm">
            <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Total Users</p>
            <p className="mt-4 text-4xl font-bold text-ink-900 dark:text-ink-50">{stats.totalUsers ?? '—'}</p>
          </div>
          <div className="rounded-3xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 p-6 shadow-sm">
            <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Total Articles</p>
            <p className="mt-4 text-4xl font-bold text-ink-900 dark:text-ink-50">{stats.totalBlogs ?? '—'}</p>
          </div>
          <div className="rounded-3xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 p-6 shadow-sm">
            <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Published</p>
            <p className="mt-4 text-4xl font-bold text-ink-900 dark:text-ink-50">{stats.publishedBlogs ?? '—'}</p>
          </div>
          <div className="rounded-3xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 p-6 shadow-sm">
            <p className="text-sm font-medium text-ink-500 dark:text-ink-400">Drafts</p>
            <p className="mt-4 text-4xl font-bold text-ink-900 dark:text-ink-50">{stats.draftBlogs ?? '—'}</p>
          </div>
        </div>

        <div className="rounded-3xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-ink-900 dark:text-ink-50">Admin Dashboard</h1>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">
                Monitor users and manage roles, status, and account access.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full sm:w-64 rounded-2xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 px-4 py-2 text-sm text-ink-900 dark:text-ink-100 focus:outline-none focus:border-crimson-500"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-48 rounded-2xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 px-4 py-2 text-sm text-ink-900 dark:text-ink-100 focus:outline-none"
              >
                <option value="">All roles</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-950 p-6 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-ink-600 dark:text-ink-300">
              <thead className="border-b border-ink-200 dark:border-ink-800 bg-ink-50 dark:bg-ink-900">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100 dark:divide-ink-800">
                {usersLoading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-500 dark:text-ink-400">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-ink-500 dark:text-ink-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isCurrent = currentUser?._id === user._id;
                    return (
                      <tr key={user._id} className="hover:bg-ink-50 dark:hover:bg-ink-900/80 transition-colors">
                        <td className="px-4 py-4">
                          <div className="font-medium text-ink-900 dark:text-ink-100">{user.username}</div>
                          <div className="text-xs text-ink-500 dark:text-ink-400">{user._id}</div>
                        </td>
                        <td className="px-4 py-4">{user.email}</td>
                        <td className="px-4 py-4">
                          <select
                            value={user.role}
                            disabled={isCurrent || updateRoleMutation.isLoading}
                            onChange={(e) => updateRoleMutation.mutate({ id: user._id, role: e.target.value })}
                            className="w-full rounded-xl border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 px-3 py-2 text-sm text-ink-900 dark:text-ink-100"
                          >
                            {ROLE_OPTIONS.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'}`}>
                            {user.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-4 py-4">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</td>
                        <td className="px-4 py-4 text-right space-x-2">
                          <button
                            disabled={isCurrent || toggleStatusMutation.isLoading}
                            onClick={() => toggleStatusMutation.mutate(user._id)}
                            className="rounded-full border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-3 py-1 text-xs font-semibold text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            disabled={isCurrent || deleteUserMutation.isLoading}
                            onClick={() => {
                              if (window.confirm(`Delete ${user.username}? This cannot be undone.`)) {
                                deleteUserMutation.mutate(user._id);
                              }
                            }}
                            className="rounded-full border border-crimson-200 bg-crimson-50 px-3 py-1 text-xs font-semibold text-crimson-700 hover:bg-crimson-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {meta.totalPages > 1 && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-500 dark:text-ink-400">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="rounded-full border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 px-4 py-2 text-sm text-ink-700 dark:text-ink-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page === meta.totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, meta.totalPages))}
                  className="rounded-full border border-ink-200 dark:border-ink-700 bg-ink-50 dark:bg-ink-900 px-4 py-2 text-sm text-ink-700 dark:text-ink-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
