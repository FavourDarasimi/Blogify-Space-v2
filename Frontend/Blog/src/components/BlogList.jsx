import React from "react";
import { Link } from "react-router-dom";
import BlogPost from "./BlogCard";
import { useContext } from "react";
import { Context } from "../context/Context";

const BlogList = ({ blog }) => {
  const { isAuth } = useContext(Context);

  return (
    <div>
      <div className="">
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-y-5 gap-x-10 sm:gap-x-5">
          {blog.map((post) =>
            isAuth ? (
              <Link key={post.id} to={`/detail/${post.id}`}>
                <BlogPost post={post} />
              </Link>
            ) : (
              <BlogPost key={post.id} post={post} />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogList;
