import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Breadcrumbs from "../components/Breadcrumbs";
import { CheckCircle2, Edit2, X, Save } from "lucide-react";
import { toast } from "react-toastify";
// import api from "../utils/api"; // Uncomment when backend is ready

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Update form data when user changes
  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and Email are required!");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - replace with actual API call when backend is ready
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, use mock data and localStorage
      // When backend is ready, uncomment the API call below:
      /*
      const response = await api.put("/users/profile", {
        name: formData.name,
        email: formData.email,
      });
      */

      // Update user in context and localStorage
      const updatedUser = {
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim(),
      };
      
      setUser(updatedUser);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      // Only show error if it's a real API error (not network error in mock mode)
      if (error.response) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile. Please try again.";
        toast.error(errorMessage);
      } else {
        // For network errors in development, still update locally
        const updatedUser = {
          ...user,
          name: formData.name.trim(),
          email: formData.email.trim(),
        };
        setUser(updatedUser);
        toast.success("Profile updated successfully! (Local update - backend not connected)");
        setIsEditing(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs />
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="w-28 h-28 rounded-full bg-white text-blue-600 flex items-center justify-center text-4xl font-bold shadow-2xl ring-4 ring-white/20">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {user?.name || "User"}
                </h2>
                <p className="text-blue-100 text-base font-medium mb-3">
                  {user?.email || "No email"}
                </p>
                <div className="inline-flex items-center px-3 py-1.5 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-300/30">
                  <CheckCircle2 className="w-4 h-4 text-green-300 mr-2" />
                  <span className="text-sm text-green-100 font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-gray-900">
                Account Information
              </h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your name"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your email"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={isLoading}
                    className="inline-flex items-center px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="btn-secondary inline-flex items-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Name
                  </label>
                  <p className="text-base text-gray-900 font-bold">
                    {user?.name || "N/A"}
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Email
                  </label>
                  <p className="text-base text-gray-900 font-bold">
                    {user?.email || "N/A"}
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Login ID
                  </label>
                  <p className="text-base text-gray-900 font-bold">
                    {user?.loginId || "N/A"}
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Account Status
                  </label>
                  <div className="flex items-center">
                    <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" />
                    <p className="text-lg text-green-700 font-bold">Active</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
