import React, { useEffect, useState } from "react";
import { getSavedPost } from "../endpoint/api";
import BlogList from "../components/BlogList";
const SavedPost = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const getSavedPosts = async () => {
      try {
        const response = await getSavedPost();
        setPosts(response);
      } catch (error) {
        console.log(error);
      }
    };
    getSavedPosts();
  }, []);
  return (
    <div className="lg:w-60% md:w-90% sm:w-90% mx-auto">
      <h1 className="text-center font-semibold pb-5 sm:text-xl md:text-3xl lg:text-4xl text-red-600">
        Saved Post
      </h1>
      <BlogList blog={posts} />
    </div>
  );
};

export default SavedPost;
