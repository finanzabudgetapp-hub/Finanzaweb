import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/supabaseClient";

/* --------------------------------------------
   UI COMPONENTS
-------------------------------------------- */
// Title
const Title: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <h1 className={`text-3xl font-bold text-gray-800 ${className}`}>{children}</h1>;

const Text: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <p className={`text-sm text-gray-700 ${className}`}>{children}</p>;

// Input
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { className?: string }> = ({
  className = "",
  ...props
}) => (
  <input
    className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition ${className}`}
    {...props}
  />
);


// Button
const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string; disabled?: boolean }
> = ({ children, className = "", disabled, ...props }) => (
  <button
    className={`px-5 py-2 rounded-lg font-semibold shadow-sm transition ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
    } ${className}`}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);


// Card
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`bg-white shadow-lg rounded-xl ${className}`}>{children}</div>;

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`p-6 ${className}`}>{children}</div>;


// Modal
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode }> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 font-bold text-lg text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};


/* -------------- TYPES -------------- */
type User = {
  id: string;
  display_name: string | null;
  email: string;
  created_at?: string | null;
  updated_at?: string | null;
  role?: string | null;
};

/* Utility to handle broken or null dates */
const formatDate = (dateString?: string | null) => {
  if (!dateString) return "N/A";

  const parsed = Date.parse(dateString);
  if (isNaN(parsed)) return "N/A";

  return new Date(parsed).toLocaleString();
};

/* --------------------------------------------
   MAIN COMPONENT
-------------------------------------------- */
const AdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /* Fetch users */
  const loadUsers = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error loading users:", error);
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /* Filtered Search */
  const filteredUsers = users.filter((u) => {
    const name = u.display_name?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const q = searchQuery.toLowerCase();

    return name.includes(q) || email.includes(q);
  });

  /* --------------------------------------------
     RENDER
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-6 font-inter">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <Title>User Management</Title>

        {/* Search Row */}
        <div className="flex flex-wrap gap-4 items-center">
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />

          <Button onClick={loadUsers} disabled={loading}>
            {loading ? "Loading..." : "Refresh"}
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm uppercase border-b">
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
                      <td
                        className="py-6 text-center text-gray-500 italic"
                        colSpan={5}
                      >
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-blue-50 text-sm"
                      >
                        <td className="py-3 px-4 font-medium">
                          {user.display_name || "No name"}
                        </td>

                        <td className="py-3 px-4 font-mono text-xs">
                          {user.email}
                        </td>

                        <td className="py-3 px-4">
                          {user.role || "User"}
                        </td>

                        <td className="py-3 px-4">
                          {formatDate(user.created_at || user.updated_at)}
                        </td>

                        <td className="py-3 px-4">
                          <Button
                            className="px-3 py-1 text-sm"
                            onClick={() => setSelectedUser(user)}
                          >
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

        {/* Modal */}
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        >
          {selectedUser && (
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">User Details</h2>

              <Text>
                <strong>Name:</strong> {selectedUser.display_name || "N/A"}
              </Text>

              <Text>
                <strong>Email:</strong> {selectedUser.email}
              </Text>

              <Text>
                <strong>Role:</strong> {selectedUser.role || "User"}
              </Text>

              <Text>
                <strong>Created At:</strong>{" "}
                {formatDate(selectedUser.created_at || selectedUser.updated_at)}
              </Text>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default AdminUsersPage;
