import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";
import { userService } from "@/services/api/userService";
import { postService } from "@/services/api/postService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Friends from "@/components/pages/Friends";
import PostCard from "@/components/molecules/PostCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.user);
  
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const userId = user?.Id;
  const currentUserId = currentUser?.Id;
  const isOwnProfile = !id || userId === currentUserId;
const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let userData;
      if (id && currentUser?.emailAddress) {
        // Viewing specific user by ID
        userData = await userService.getById(id);
      } else if (currentUser?.emailAddress) {
        // Viewing own profile - fetch by email from authentication
        userData = await userService.getCurrentUserProfile(currentUser.emailAddress);
      } else {
        setError("User not authenticated");
        return;
      }
      
      if (!userData) {
        setError("User not found");
        return;
      }
      
      setUser(userData);
      
      // Fetch user's posts
      setPostsLoading(true);
      try {
        const userPosts = await postService.getByUserId(userData.Id);
        setPosts(userPosts || []);
      } catch (err) {
        console.error("Failed to load user posts:", err);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
    }
  }, [id, currentUser?.emailAddress]);
const handleFriendAction = async (action) => {
    try {
      if (action === "add") {
        // Add friend functionality - to be implemented
        toast.success("Friend request sent!");
      } else if (action === "remove") {
        // Remove friend functionality - to be implemented
        toast.success("Friend removed!");
      }
    } catch (err) {
      toast.error("Failed to update friendship");
    }
  };

  const handleMessage = () => {
    if (userId) {
      navigate(`/messages/1-${userId}`);
    }
  };

  const getFriendshipStatus = () => {
    if (!user) return "none";
    // Simplified for now - friend system to be implemented
    return "none";
  };

  const handleLikePost = async (postId, isLiked) => {
    try {
      if (isLiked) {
// Like functionality - to be implemented with reactions
        toast.success("Post liked!")
      } else {
        toast.success("Post unliked!")
      }
    } catch (err) {
      toast.error("Failed to update like")
      throw err
    }
  }

  if (loading) {
    return <Loading />
  }

if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Error 
          message={error}
          onRetry={fetchUserProfile}
        />
      </div>
    );
  }

  if (!user) {
    return null
  }

  const friendshipStatus = getFriendshipStatus()

  return (
    <div className="min-h-screen bg-background">
      {/* Cover Photo & Profile Section */}
<div className="relative">
        <div className="relative h-48 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-t-lg overflow-hidden">
          {/* Cover Photo */}
          {user.cover_photo_c ? (
            <img
              src={user.cover_photo_c}
              alt="Cover"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ApperIcon name="Camera" className="h-12 w-12 text-white/50" />
            </div>
          )}
          {isOwnProfile && (
            <button className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg text-sm hover:bg-black/70 transition-colors duration-150">
              <ApperIcon name="Camera" className="h-4 w-4 mr-2 inline" />
              Edit Cover
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative -mt-16 mb-4">
<div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar
                  size="2xl"
                  src={user.profile_picture_c || "https://via.placeholder.com/150"}
                  alt={user.username_c || user.Name}
                  fallback={(user.username_c || user.Name)?.[0]?.toUpperCase() || "U"}
                />
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors duration-150">
                    <ApperIcon name="Camera" className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                  {user.username_c || user.Name}
                </h1>
                <p className="text-gray-600 mb-3 max-w-md">
                  {user.bio_c || user.bio || "No bio yet."}
                </p>
                <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-gray-500">
                  <span className="flex items-center">
                    <ApperIcon name="Users" className="h-4 w-4 mr-1" />
                    {user.friends_count_c || 0} friends
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                    {user.location_c || "Location not set"}
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Calendar" className="h-4 w-4 mr-1" />
                    Joined {formatDistanceToNow(new Date(user.CreatedOn), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {isOwnProfile ? (
                  <Button
                    variant="outline"
                    icon="Edit"
                    onClick={() => navigate("/profile/edit")}
                  >
                    Edit Profile
                  </Button>
) : (
                  <>
                    {friendshipStatus === "friends" ? (
                      <Button
                        variant="outline"
                        icon="UserCheck"
                        onClick={() => handleFriendAction("remove")}
                      >
                        Friends
                      </Button>
                    ) : friendshipStatus === "pending" ? (
                      <Button
                        variant="outline"
                        icon="Clock"
                        className="text-accent border-accent"
                      >
                        Pending
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        icon="UserPlus"
                        onClick={() => handleFriendAction("add")}
                      >
                        Add Friend
                      </Button>
                    )}
                    
                    <Button
                      variant="secondary"
                      icon="MessageCircle"
                      onClick={handleMessage}
                    >
                      Message
                    </Button>
                  </>
                )}
                
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150">
                  <ApperIcon name="MoreHorizontal" className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
{ key: "posts", label: "Posts", count: posts.length },
              { key: "photos", label: "Photos", count: posts.filter(p => p.image_url_c).length },
              { key: "friends", label: "Friends", count: user.friends_count_c || 0 }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150 ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {activeTab === "posts" && (
            <div>
              {postsLoading ? (
                <Loading type="posts" />
              ) : posts.length === 0 ? (
                <Empty
                  icon="FileText"
title={isOwnProfile ? "You haven't posted anything yet" : `${user.username_c || user.Name} hasn't posted anything yet`}
                  description={isOwnProfile ? "Share your first post and connect with friends!" : "Check back later for updates!"}
                  actionLabel={isOwnProfile ? "Create First Post" : undefined}
                  onAction={isOwnProfile ? () => navigate("/") : undefined}
                />
              ) : (
                <div className="space-y-6 max-w-2xl mx-auto">
                  {posts.map((post) => (
                    <PostCard
                      key={post.Id}
                      post={post}
                      onLike={handleLikePost}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "photos" && (
<div>
              {posts.filter(p => p.image_url_c).length === 0 ? (
                <Empty
                  icon="Camera"
                  title="No photos yet"
                  description="Photos from posts will appear here"
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {posts
                    .filter(p => p.image_url_c)
                    .map((post) => (
                      <div key={post.Id} className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity duration-150 cursor-pointer">
                        <img
                          src={post.image_url_c}
                          alt="Photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "friends" && (
            <div>
              <Empty
                icon="Users"
                title="Friends list"
                description="Friends will be displayed here"
                actionLabel="Find Friends"
                onAction={() => navigate("/friends")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
);
};

export default Profile;