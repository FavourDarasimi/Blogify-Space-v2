// ...existing code...
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { IoIosMail, IoIosCall } from "react-icons/io";
import { FaLocationDot, FaPlus, FaCheck } from "react-icons/fa6";
import Comments from "../components/Comments";
import { Context } from "../context/Context";
import CreateBlog from "./CreateBlog";
import {
  ArrowLeft,
  Heart as HeartIcon,
  MessageCircle,
  Share2,
  Clock,
} from "lucide-react";
import {
  getPostDetail,
  likePost,
  getRelatedPost,
  savePost,
  getUser,
} from "../endpoint/api";
import axios from "axios";
import redheart from "../assets/red-heart-icon.svg";
import heart from "../assets/heart-thin-icon.svg";
import EditPost from "../components/EditPost";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogDetail = () => {
  const { showCreatePost } = useContext(Context);
  const [showComments, setShowComments] = useState(null);
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [userLiked, setUserLiked] = useState();
  const [commentChange, setCommentChange] = useState([]);
  const [like, setLike] = useState("");
  const [savedPost, setSavedPost] = useState("");
  const [userSaved, setUserSaved] = useState(false);
  const [show, setShow] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const navigate = useNavigate();

  const fetchDetailPost = async () => {
    const posts = await getPostDetail(postId);
    setPost(posts.data);
    setUserLiked(posts.user_liked);
    setUserSaved(posts.user_saved);
  };
  const fetchRelatedPosts = async () => {
    const relatedPost = await getRelatedPost(postId);
    setRelatedPosts(relatedPost.data.slice(0, 5) || []);
  };

  useEffect(() => {
    fetchDetailPost();
  }, [show, like, postId, savedPost, commentChange]);

  useEffect(() => {
    fetchRelatedPosts();
  }, [postId]);

  const isUsepostost = (usepostost, users) => {
    return usepostost == users;
  };

  const handleLike = async (post) => {
    try {
      const likeResp = await likePost(post.id);
      setLike(post.likes);
      // Toggle local like state for immediate UI feedback
      setUserLiked((v) => !v);
      if (likeResp.status === 200) {
        toast.success(userLiked ? "Post Unliked" : "Post Liked");
      }
    } catch (error) {
      for (var i = 0; i < JSON.stringify(error).length; i++) {
        var err = JSON.stringify(Object.values(error)[i])
          .replace(/[\[\]]/g, "")
          .replace(/"/g, "");
        toast.error(err.charAt(0).toUpperCase() + err.slice(1));
      }
    }
  };
  const handleSavePost = async (post) => {
    try {
      const save = await savePost(post.id);
      setSavedPost(post.saved);
      setUserSaved((v) => !v);
      if (save.status === 200) {
        toast.success(!userSaved ? "Post Saved" : "Post Unsaved");
      }
    } catch (error) {
      for (var i = 0; i < JSON.stringify(error).length; i++) {
        var err = JSON.stringify(Object.values(error)[i])
          .replace(/[\[\]]/g, "")
          .replace(/"/g, "");
        toast.error(err.charAt(0).toUpperCase() + err.slice(1));
      }
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post?.title,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch (err) {
      toast.error("Unable to share");
    }
  };

  const name = (username) => {
    var newName = username.replace(/ /g, "").toLowerCase();
    return newName;
  };

  if (!post) {
    return <div className="pt-20 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container py-8 md:py-12">
        <div
          onClick={() => navigate(-1)}
          className="inline-flex cursor-pointer items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </div>

        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-red-100 text-red-600 px-3 py-1 text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif mb-4">
              {post.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-gray-600 text-sm md:text-base">
              <span className="font-medium text-gray-800">
                By {post.user?.username || post.author}
              </span>
              <span className="flex items-center gap-2 mt-2 sm:mt-0">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {post.time_since_created || post.timeAgo}
                </span>
              </span>
            </div>
          </div>

          {/* Featured Image */}
          {post.image && (
            <div className="overflow-hidden rounded-lg mb-8 bg-gray-100">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                className="w-full h-80 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-3 pb-6 border-b mb-8">
            <button
              onClick={() => handleLike(post)}
              className={`inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm font-medium transition ${
                post.user_liked
                  ? "bg-red-600 text-white border-transparent"
                  : "bg-white text-gray-800 border-gray-200"
              }`}
            >
              <HeartIcon
                className={`w-4 h-4 ${
                  post.user_liked ? "text-white" : "text-gray-700"
                }`}
              />
              <span>{post.likes_count ?? 0}</span>
            </button>

            <button
              onClick={() =>
                setShowComments((s) => (s === post.id ? null : post.id))
              }
              className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm font-medium bg-white text-gray-800 border-gray-200"
            >
              <MessageCircle className="w-4 h-4 text-gray-700" />
              <span>{post.comments_count ?? 0}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm font-medium bg-white text-gray-800 border-gray-200"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
              <span>Share</span>
            </button>

            <button
              onClick={() => handleSavePost(post)}
              className="inline-flex items-center gap-2 px-3 py-1 border rounded-full text-sm font-medium bg-white text-gray-800 border-gray-200 ml-auto"
            >
              {post.user_saved ? (
                <FaCheck className="w-4 h-4" />
              ) : (
                <FaPlus className="w-4 h-4" />
              )}
              <span>{post.user_saved ? "Saved" : "Save"}</span>
            </button>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p
              dangerouslySetInnerHTML={{ __html: post.body }}
              className="text-lg text-gray-700 leading-relaxed mb-6"
            />
          </div>

          {/* Comments Toggle / Component */}
          <div className="mb-12">
            {showComments === post.id ? (
              <Comments
                post={post.id}
                setShowComments={setShowComments}
                setCommentChange={setCommentChange}
              />
            ) : (
              <div className="border-t px-4 py-3 flex justify-end">
                <button
                  onClick={() => setShowComments(post.id)}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  <MessageCircle className="h-4 w-4" />
                  View Comments ({post.comments_count ?? 0})
                </button>
              </div>
            )}
          </div>

          {/* Related Posts */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="border-t pt-12">
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
                  <Link key={post.id} to={`/detail/${post.id}`}>
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm p-4 hover:shadow-md transition border-[1px] border-gray-300">
                      <p className="text-xs inline-block bg-red-100 text-red-600 px-2 py-1 rounded-full mb-3">
                        {post.category}
                      </p>
                      <h3 className="text-lg line-clamp-2 md:text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-600">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        {post.user?.profile?.image ? (
                          <img
                            src={post.user.profile.image}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="w-8 h-8 text-gray-400" />
                        )}
                        <div className="text-sm text-gray-600">
                          {post.user?.username}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;
// ...existing code...
