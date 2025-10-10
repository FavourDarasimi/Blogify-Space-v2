import React, { useEffect, useState } from "react";
import axios from "axios";
import cancel from "../assets/icons8-cross-24.png";
import { FaUserCircle } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Comments = ({ post, setShowComments }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

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
    <div className="fixed z-1 inset-0  bg-black w-100%   bg-opacity-50 grid place-items-center">
      <div className="bg-white lg:w-30% md:w-60% sm:w-90%  rounded-xmd  h-fit max-h-50%  overflow-y-auto relative flex flex-col">
        <div className="flex justify-end pr-3 pt-2">
          <img
            src={cancel}
            alt=""
            onClick={() => setShowComments(0)}
            className="w-6 h-6 cursor-pointer "
          />
        </div>
        <h1 className="text-3xl text-center font-semibold text-red-600">Comments</h1>
        <div className="px-5">
          <form onSubmit={(e) => handleSubmit(e)} className="flex items-center justify-center pt-5">
            <input
              value={comment}
              type="text"
              placeholder="Add Coment"
              className="border-b-1 border-myGrey outline-none w-80% mb-3"
              onChange={(e) => setComment(e.target.value)}
            />
            {comment ? (
              <button onClick={() => handleSubmit()}>
                <IoSend className="w-6 h-6 ml-3 text-red-600" type="submit" />
              </button>
            ) : (
              ""
            )}
          </form>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-x-3 py-3 ">
                {comment.user.profile ? (
                  comment.user.profile.image ? (
                    <img
                      src={`${comment.user.profile.image}`}
                      alt=""
                      className="w-12 h-12 rounded-full border-grey border-2"
                    />
                  ) : (
                    <FaUserCircle className="w-12 h-12 " />
                  )
                ) : (
                  <FaUserCircle className="w-12 h-12 " />
                )}

                <div>
                  <div className="flex gap-x-1 items-center">
                    <p className="text-xs text-myGrey">{comment.user.username}</p>
                    <div className="bg-myGrey h-1 w-1 rounded-full "></div>
                    <p className="text-xs text-myGrey">{comment.time_since_created} </p>
                  </div>
                  <p className="font-semibold ">{comment.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-18 font-semibold py-5">No Comments Yet......</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
