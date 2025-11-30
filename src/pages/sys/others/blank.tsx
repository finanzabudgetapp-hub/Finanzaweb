import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient'; // make sure this points to your Supabase client

// --- UI Components (Tailwind) ---
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
const Select = ({ className = '', children, ...props }) => (
  <select
    className={`p-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${className}`}
    {...props}
  >
    {children}
  </select>
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

// Notification box for feedback
const NotificationBox = ({ message, type, onClose }) => {
  if (!message) return null;
  const color =
    type === 'success'
      ? 'bg-green-100 border-green-400 text-green-700'
      : 'bg-red-100 border-red-400 text-red-700';
  return (
    <div
      className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg max-w-sm ${color}`}
      role="alert"
    >
      <div className="flex justify-between items-start">
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 text-gray-500 hover:text-gray-700 font-bold leading-none">
          &times;
        </button>
      </div>
    </div>
  );
};

// Types
type User = {
  id: string;
  display_name: string;
  email: string;
};
type Notification = {
  id: number;
  user_id: string;
  created_at: string;
  title: string;
  message: string;
  read: boolean;
  type: string;
  target: 'all' | 'selected';
};

// --- MAIN COMPONENT ---
const AdminNotificationPage = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'all' | 'selected'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [uiNotification, setUiNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const displayMessage = (message: string, type: 'success' | 'error') => {
    setUiNotification({ message, type });
    setTimeout(() => setUiNotification(null), 5000);
  };

  /* Fetch users from Supabase */
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('profiles').select('id, display_name, email');
      if (error) console.error('Failed to fetch users:', error);
      else setUsers(data || []);
    };
    fetchUsers();
  }, []);

  /* Fetch notifications from Supabase */
  const loadNotifications = useCallback(async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) console.error('Failed to load notifications:', error);
    else setNotifications(data || []);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  /* Send notification */
  const handleSendNotification = async () => {
    if (!title || !message) return displayMessage('Title and message are required.', 'error');
    if (target === 'selected' && selectedUsers.length === 0)
      return displayMessage('Please select at least one user for selected target.', 'error');

    setLoading(true);
    try {
      const targets = target === 'all' ? users.map((u) => u.id) : selectedUsers;
      if (targets.length === 0) throw new Error('No users to send notification.');

      const inserts = targets.map((user_id) => ({
        user_id,
        title,
        message,
        type: 'admin',
        target,
      }));

      const { error } = await supabase.from('notifications').insert(inserts);
      if (error) throw error;

      displayMessage('Notification sent successfully!', 'success');
      setTitle('');
      setMessage('');
      setSelectedUsers([]);
      loadNotifications();
    } catch (err) {
      console.error(err);
      displayMessage('Failed to send notification.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-inter">
      <NotificationBox message={uiNotification?.message} type={uiNotification?.type} onClose={() => setUiNotification(null)} />

      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <Title className="text-3xl border-b pb-4">Notification Dashboard</Title>

        {/* Notification Form */}
        <Card>
          <CardContent className="flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-gray-700">Send New Message</h2>

            {/* Target Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full sm:w-1/3">
                <Text className="font-semibold mb-1 text-gray-700">Target Audience</Text>
                <Select
                  value={target}
                  onChange={(e) => setTarget(e.target.value as 'all' | 'selected')}
                  className="w-full"
                >
                  <option value="all">All Users ({users.length})</option>
                  <option value="selected" disabled={users.length === 0}>
                    Selected Users
                  </option>
                </Select>
              </div>

              {target === 'selected' && (
                <div className="w-full sm:w-2/3">
                  <Text className="font-semibold mb-1 text-gray-700">Select Users ({selectedUsers.length} selected)</Text>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                    {users.length === 0 ? (
                      <Text className="text-gray-500 italic">No users available.</Text>
                    ) : (
                      users.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center gap-3 py-1 cursor-pointer hover:bg-gray-100 rounded-md px-1"
                        >
                          <input
                            type="checkbox"
                            value={user.id}
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSelectedUsers((prev) =>
                                e.target.checked ? [...prev, value] : prev.filter((id) => id !== value)
                              );
                            }}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 accent-blue-600"
                          />
                          <span className="text-gray-800 text-sm truncate">
                            {user.display_name} ({user.email})
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Title Input */}
            <div>
              <Text className="font-semibold mb-1 text-gray-700">Title</Text>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notification title" />
            </div>

            {/* Message */}
            <div>
              <Text className="font-semibold mb-1 text-gray-700">Message</Text>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your detailed message here"
                className="w-full p-3 border border-gray-300 rounded-lg resize-y h-32 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              />
            </div>

            <Button
              onClick={handleSendNotification}
              disabled={loading || !title || !message || (target === 'selected' && selectedUsers.length === 0)}
              className="mt-2 w-full sm:w-48 self-end"
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </Button>
          </CardContent>
        </Card>

        {/* Notifications Table */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Sent Notifications (Last 50)</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200 text-sm font-medium text-gray-600 uppercase">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Message</th>
                    <th className="py-3 px-4">Recipient ID</th>
                    <th className="py-3 px-4">Created At</th>
                    <th className="py-3 px-4">Target Type</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                        No notifications sent yet.
                      </td>
                    </tr>
                  ) : (
                    notifications.map((n) => (
                      <tr
                        key={n.id}
                        className="border-b border-gray-100 hover:bg-blue-50 transition duration-100 text-sm text-gray-700"
                      >
                        <td className="py-3 px-4 max-w-[150px] truncate font-medium">{n.title}</td>
                        <td className="py-3 px-4 max-w-[250px] truncate">{n.message}</td>
                        <td className="py-3 px-4 font-mono text-xs text-gray-500">{n.user_id}</td>
                        <td className="py-3 px-4 whitespace-nowrap">{new Date(n.created_at).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              n.target === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'
                            }`}
                          >
                            {n.target}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminNotificationPage;
