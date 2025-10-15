// BlogDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart as HeartIcon,
  MessageCircle,
  Share2,
  Clock,
} from "lucide-react";
import { FaPlus, FaCheck } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { BeatLoader } from "react-spinners";
import Comments from "../components/Comments";
import { Context } from "../context/Context";
import {
  getPostDetail,
  likePost,
  getRelatedPost,
  savePost,
} from "../endpoint/api";
import "react-toastify/dist/ReactToastify.css";
// import DOMPurify from "dompurify"; // optional for sanitizing HTML

const BlogDetail = ({ setShowLogin }) => {
  const { isAuth } = useContext(Context);
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [showComments, setShowComments] = useState(null);
  const [commentChange, setCommentChange] = useState(0);
  const [loading, setLoading] = useState(true);

  /** Fetch post details */
  const fetchDetailPost = async () => {
    try {
      const res = await getPostDetail(postId);
      setPost(res.data);
    } catch (err) {
      toast.error("Failed to load post details");
    } finally {
      setLoading(false);
    }
  };

  /** Fetch related posts */
  const fetchRelatedPosts = async () => {
    try {
      const res = await getRelatedPost(postId);
      setRelatedPosts(res.data.slice(0, 3) || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDetailPost();
    fetchRelatedPosts();
  }, [postId, commentChange]);

  /** Helper: Require Auth wrapper */
  const requireAuth = (callback) => {
    if (!isAuth) setShowLogin(true);
    else callback();
  };

  /** Like / Unlike Post */
  const handleLike = async () => {
    try {
      const res = await likePost(post.id);
      setPost((prev) => ({
        ...prev,
        user_liked: !prev.user_liked,
        likes_count: prev.user_liked
          ? prev.likes_count - 1
          : prev.likes_count + 1,
      }));
      toast.success(!post.user_liked ? "Post Liked" : "Post Unliked");
    } catch {
      toast.error("Failed to update like");
    }
  };

  /** Save / Unsave Post */
  const handleSavePost = async () => {
    try {
      const res = await savePost(post.id);
      setPost((prev) => ({ ...prev, user_saved: !prev.user_saved }));
      toast.success(!post.user_saved ? "Post Saved" : "Post Unsaved");
    } catch {
      toast.error("Failed to save post");
    }
  };

  /** Share Post */
  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Unable to share");
    }
  };

  /** Set Page Title */
  useEffect(() => {
    if (post) document.title = `${post.title} - Blogify Space`;
  }, [post]);

  /** Loading State */
  if (loading || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BeatLoader color="#dc2626" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center mb-6 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <span className="inline-flex items-center rounded-full bg-red-100 text-red-600 px-3 py-1 text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4">
              {post.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-gray-600 text-sm md:text-base">
              <span className="font-medium text-gray-800">
                By {post.user?.username || post.author}
              </span>
              <span className="flex items-center gap-2 mt-2 sm:mt-0">
                <Clock className="w-4 h-4 text-gray-500" />
                {post.time_since_created}
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
                className="w-full aspect-[16/9] object-cover hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pb-6 border-b mb-8 flex-wrap">
            {/* Like */}
            <button
              onClick={() => requireAuth(handleLike)}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition-all duration-300 ${
                post.user_liked
                  ? "bg-red-600 text-white border-transparent hover:bg-red-700"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <HeartIcon
                className={`w-4 h-4 ${
                  post.user_liked ? "text-white" : "text-gray-700"
                }`}
              />
              {post.likes_count}
            </button>

            {/* Comments */}
            <button
              onClick={() =>
                requireAuth(() =>
                  setShowComments((s) => (s === post.id ? null : post.id))
                )
              }
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium bg-white text-gray-800 border-gray-300 hover:bg-gray-50 transition"
            >
              <MessageCircle className="w-4 h-4 text-gray-700" />
              {post.comments_count}
            </button>

            {/* Share */}
            <button
              onClick={() => requireAuth(handleShare)}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium bg-white text-gray-800 border-gray-300 hover:bg-gray-50 transition"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
              Share
            </button>

            {/* Save */}
            <button
              onClick={() => requireAuth(handleSavePost)}
              className={`ml-auto inline-flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium transition ${
                post.user_saved
                  ? "bg-green-100 text-green-700 border-green-300 hover:bg-green-200"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {post.user_saved ? (
                <FaCheck className="w-4 h-4" />
              ) : (
                <FaPlus className="w-4 h-4" />
              )}
              {post.user_saved ? "Saved" : "Save"}
            </button>
          </div>

          {/* Body */}
          <div
            className="prose prose-lg max-w-none mb-12 text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.body }}
            // Optionally sanitize:
            // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.body) }}
          />

          {/* Comments Section */}
          {showComments === post.id ? (
            <Comments
              post={post.id}
              setShowComments={setShowComments}
              setCommentChange={setCommentChange}
              commentChange={commentChange}
            />
          ) : (
            <div className="border-t pt-4 flex justify-end">
              <button
                onClick={() => requireAuth(() => setShowComments(post.id))}
                className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                <MessageCircle className="h-4 w-4" />
                View Comments ({post.comments_count})
              </button>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="border-t pt-12 mt-12">
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((rp) => (
                  <Link key={rp.id} to={`/detail/${rp.id}`}>
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm p-4 hover:shadow-md transition border border-gray-200 hover:-translate-y-1 duration-300">
                      <p className="text-xs inline-block bg-red-100 text-red-600 px-2 py-1 rounded-full mb-3">
                        {rp.category}
                      </p>
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-red-600">
                        {rp.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        {rp.user?.profile?.image ? (
                          <img
                            src={rp.user.profile.image}
                            alt={rp.user.username}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <FaUserCircle className="w-8 h-8 text-gray-400" />
                        )}
                        <div className="text-sm text-gray-600">
                          {rp.user?.username}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;
