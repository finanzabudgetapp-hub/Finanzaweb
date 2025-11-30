import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient';

// --- UI Components ---
const Title = ({ children, className = '' }) => (
  <h1 className={`text-3xl font-bold text-gray-800 ${className}`}>{children}</h1>
);
const Text = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);
const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${className}`}
    {...props}
  />
);
const Button = ({ children, className = '', disabled, ...props }) => (
  <button
    className={`px-6 py-2 rounded-lg font-semibold transition duration-200 shadow-md ${
      disabled
        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
        : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
    } ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-xl rounded-xl overflow-hidden ${className}`}>{children}</div>
);
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;

// Modal for user details
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// Types
type User = {
  id: string;
  display_name: string;
  email: string;
  updated_at: string;
 
};

// --- MAIN COMPONENT ---
const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users
  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').order('updated_at', { ascending: false });
    if (error) console.error('Failed to load users:', error);
    else setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Filtered users
  const filteredUsers = users.filter(
    (u) =>
      u.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-inter">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <Title className="border-b pb-4">User Management</Title>

        {/* Search */}
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md"
          />
          <Button onClick={loadUsers} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600 uppercase">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-gray-100 hover:bg-blue-50 transition duration-100 text-sm text-gray-700"
                      >
                        <td className="py-3 px-4 font-medium">{user.display_name}</td>
                        <td className="py-3 px-4 font-mono text-xs">{user.email}</td>
                        <td className="py-3 px-4">{user.role || 'User'}</td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {user.created_at
  ? new Date(Date.parse(user.created_at)).toLocaleString()
  : 'N/A'}

                        </td>
                        <td className="py-3 px-4">
                          <Button onClick={() => setSelectedUser(user)} className="px-3 py-1 text-sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* User Detail Modal */}
        <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)}>
          {selectedUser && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-gray-700">User Details</h2>
              <Text>
                <strong>Name:</strong> {selectedUser.display_name}
              </Text>
              <Text>
                <strong>Email:</strong> {selectedUser.email}
              </Text>
              <Text>
                <strong>Role:</strong> 'User'
              </Text>
              <Text>
                <strong>Created At:</strong> {new Date(selectedUser.created_at).toLocaleString()}
              </Text>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminUsersPage;
