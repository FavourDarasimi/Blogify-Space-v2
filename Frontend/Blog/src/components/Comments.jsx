// ...existing code...
import React, { useEffect, useState } from "react";
import axios from "axios";
import cancel from "../assets/icons8-cross-24.png";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RxCross1 } from "react-icons/rx";

const Comments = ({ post, setShowComments, setCommentChange }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/blog/comments/${post}`)
      .then((response) => setComments(response.data))
      .catch((error) => alert(error.message));
  }, [comment]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://127.0.0.1:8000/blog/comment/create/${post}`,
        { comment: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment("");
      setCommentChange(post.comments_count + 1);
      if (response.status === 201) {
        toast.success("Comment Created Successful");
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

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 grid place-items-center">
      <div className="bg-white p-3 w-full max-w-[600px] rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[80vh] relative">
        {/* Close button */}
        <div className="flex justify-between p-3">
          <div className="px-6 pb-2">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 text-center">
              Comments
            </h1>
          </div>
          <RxCross1
            onClick={() => setShowComments(false)}
            className="w-5 h-5 cursor-pointer hover:opacity-70 transition"
          />
        </div>

        {/* Header */}

        {/* Comments list */}
        <div className="overflow-y-auto px-6 pb-4 space-y-4 flex-1">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8 text-sm md:text-base">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((commentItem) => (
              <div
                key={commentItem.id}
                className="flex gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                {/* Avatar */}
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {commentItem.user.profile?.image ? (
                    <img
                      src={commentItem.user.profile.image}
                      alt={commentItem.user.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-700">
                      {commentItem.user.username.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Comment content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm md:text-base text-gray-900">
                      {commentItem.user.username}
                    </span>
                    <span className="text-xs md:text-sm text-gray-500">
                      {commentItem.time_since_created}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                    {commentItem.comment}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="border-t px-6 py-4 space-y-3 bg-gray-50"
        >
          <div className="space-y-2">
            <textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError("");
              }}
              className="w-full min-h-[80px] resize-none border border-gray-300 rounded-md p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-red-500"
              maxLength={500}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs md:text-sm text-gray-500">
                {comment.length}/500 characters
              </span>
              <button
                type="submit"
                disabled={!comment.trim()}
                className="bg-red-600 text-white text-sm md:text-base px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Post Comment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comments;
// ...existing code...
