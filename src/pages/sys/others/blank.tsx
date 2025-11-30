import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/supabaseClient';

// ---- UI Components ----
const Title = ({ children, className = '' }) => (
  <h1 className={`text-3xl font-bold text-gray-800 ${className}`}>{children}</h1>
);
const Text = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);
const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  />
);
const Select = ({ className = '', children, ...props }) => (
  <select
    className={`p-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 ${className}`}
    {...props}
  >
    {children}
  </select>
);
const Button = ({ children, className = '', disabled, ...props }) => (
  <button
    className={`px-6 py-2 rounded-lg font-semibold shadow-md 
    ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
    ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-xl rounded-xl overflow-hidden ${className}`}>{children}</div>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

// Notification popup
const NotificationBox = ({ message, type, onClose }) => {
  if (!message) return null;
  const color =
    type === 'success'
      ? 'bg-green-100 border-green-400 text-green-700'
      : 'bg-red-100 border-red-400 text-red-700';
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 border rounded-lg shadow-lg max-w-sm ${color}`}>
      <div className="flex justify-between">
        <p className="font-medium">{message}</p>
        <button onClick={onClose} className="ml-4 font-bold">&times;</button>
      </div>
    </div>
  );
};

// ---- TYPES ----
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
  target: 'all' | 'selected';
};

// Safe date formatter
const formatDate = (d: string) => {
  const date = new Date(d);
  return isNaN(date.getTime()) ? "Invalid date" : date.toLocaleString();
};

// ---- MAIN COMPONENT ----
export default function AdminNotificationPage() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<'all' | 'selected'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [uiNotification, setUiNotification] = useState(null);

  const showMsg = (message: string, type: 'success' | 'error') => {
    setUiNotification({ message, type });
    setTimeout(() => setUiNotification(null), 4000);
  };

  // Load users
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .order('created_at', { ascending: false });
      setUsers(data || []);
    };
    load();
  }, []);

  // Load notifications
  const loadNotifications = useCallback(async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications(data || []);
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Send notification
  const sendNotification = async () => {
    if (!title || !message) return showMsg('Title and message required.', 'error');

    const recipients =
      target === 'all' ? users.map((u) => u.id) : selectedUsers;

    if (recipients.length === 0) return showMsg('No users selected.', 'error');

    setLoading(true);

    const rows = recipients.map((uid) => ({
      user_id: uid,
      title,
      message,
      target,
      type: "admin"
    }));

    const { error } = await supabase.from('notifications').insert(rows);

    if (error) {
      console.error(error);
      showMsg("Failed to send notification.", "error");
    } else {
      showMsg("Notification sent!", "success");
      setTitle('');
      setMessage('');
      setSelectedUsers([]);
      loadNotifications();
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <NotificationBox
        message={uiNotification?.message}
        type={uiNotification?.type}
        onClose={() => setUiNotification(null)}
      />

      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        <Title>Admin Notifications</Title>

        {/* SEND FORM */}
        <Card>
          <CardContent className="space-y-6">
            <h2 className="text-lg font-semibold">Send Notification</h2>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <Text>Target</Text>
                <Select value={target} onChange={(e) => setTarget(e.target.value as any)}>
                  <option value="all">All Users</option>
                  <option value="selected">Selected Users</option>
                </Select>
              </div>

              {target === "selected" && (
                <div>
                  <Text>
                    Select Users ({selectedUsers.length})
                  </Text>
                  <div className="max-h-40 overflow-y-auto border p-2 rounded">
                    {users.map((u) => (
                      <label key={u.id} className="flex items-center gap-2 py-1">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(u.id)}
                          onChange={(e) => {
                            const value = u.id;
                            setSelectedUsers((prev) =>
                              e.target.checked
                                ? [...prev, value]
                                : prev.filter((id) => id !== value)
                            );
                          }}
                        />
                        <span>{u.display_name} ({u.email})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <Text>Title</Text>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
              <Text>Message</Text>
              <textarea
                className="w-full p-3 border rounded-lg"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              disabled={loading}
              onClick={sendNotification}
              className="w-full sm:w-48"
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </CardContent>
        </Card>

        {/* TABLE */}
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-4">Latest Notifications</h2>

            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Target</th>
                </tr>
              </thead>

              <tbody>
                {notifications.map((n) => (
                  <tr key={n.id} className="border-b">
                    <td className="p-3">{n.title}</td>
                    <td className="p-3">{n.message}</td>
                    <td className="p-3 text-xs">{n.user_id}</td>
                    <td className="p-3">{formatDate(n.created_at)}</td>
                    <td className="p-3">{n.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
