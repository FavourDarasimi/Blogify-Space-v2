import React, { useContext } from "react";
import Categories from "./Categories";
import { Context } from "../context/Context";
import { Link } from "react-router-dom";
import BlogPost from "./BlogCard";

const CategoryBlogList = () => {
  const { categoryPosts, isHomePage } = useContext(Context);

  return (
    <div className="lg:mx-auto flex flex-col  w-70% md:mx-5  sm:mx-5  rounded-xl gap-y-4">
      <div className="flex justify-start gap-3  ">
        <Categories />
      </div>
      {categoryPosts ? (
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-y-5 lg:gap-x-10 md:gap-x-10 sm:gap-x-5">
          {!isHomePage
            ? categoryPosts.map((post) => (
                <Link key={post.id} to={`/detail/${post.id}`}>
                  <BlogPost post={post} />
                </Link>
              ))
            : ""}
        </div>
      ) : (
        <p className="font-semibold text-2xl ">No Posts in this Category</p>
      )}
    </div>
  );
};

export default CategoryBlogList;
