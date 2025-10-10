import React, { useState } from "react";
import CategoryBlogList from "../components/CategoryBlogList";
import { useContext } from "react";
import { Context } from "../context/Context";
import CreateBlog from "./CreateBlog";

const CategoryBlogs = () => {
  const { showCreatePost } = useContext(Context);
  return (
    <div className="">
      <div className="pt-10">
        {showCreatePost ? <CreateBlog /> : ""}
        <CategoryBlogList />
      </div>
    </div>
  );
};

export default CategoryBlogs;
