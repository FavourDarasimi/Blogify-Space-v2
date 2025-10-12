import React from "react";
import { TrendingUp, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const BlogCard = ({ featuredPage, post }) => {
  if (post.featured) {
    return (
      <div
        className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
          featuredPage ? "md:col-span-2 md:row-span-2" : ""
        }`}
      >
        {" "}
        <Link key={post.id} to={`/detail/${post.id}`}>
          <div
            className={`aspect-[3/2] ${
              featuredPage ? "md:aspect-[21/9]" : "md:aspect-[4/3]"
            } overflow-hidden`}
          >
            <img
              src={`${post.image}`}
              alt={post.title}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
            />
          </div>

          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end ${
              featuredPage ? "p-6 md:p-8 lg:p-10" : "lg:p-6 md:p-4 p-2"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 shadow-lg transition-colors">
                {post.category}
              </span>
              {post.trending && (
                <span className="inline-flex items-center rounded-md bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-gray-900">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </span>
              )}
            </div>

            <div className="text-white space-y-3">
              <h3
                className={`line-clamp-2 ${
                  featuredPage ? "text-xl md:text-3xl lg:text-4xl" : "text-xl"
                }  font-bold leading-tight font-serif`}
              >
                {post.title}
              </h3>
              <div className="flex items-center lg:gap-4  gap-1 text-sm text-white/80">
                <span className="font-medium">
                  {post && post.user.username}
                </span>
                <span>•</span>

                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {post.time_since_created}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
      //
      // {/* </div> */}
    );
  }
  return (
    <Link key={post.id} to={`/detail/${post.id}`}>
      <article className="group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="aspect-[3/2] md:aspect-[4/3] overflow-hidden bg-gray-200">
          <img
            src={`${post.image}`}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <div className="absolute inset-0 flex flex-col justify-end lg:p-6 md:p-4 p-2 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-block  px-3 py-1 text-xs font-medium w-fit text-white bg-red-500 rounded-md shadow-md">
              {post.category}
            </span>
            {post.trending && (
              <span className="inline-flex items-center rounded-md bg-white/90 backdrop-blur px-3 py-1 text-xs font-medium text-gray-900">
                <TrendingUp className="w-3 h-3 mr-1" />
                Trending
              </span>
            )}
          </div>

          <div className="text-white space-y-2">
            <h3 className="line-clamp-2  text-xl font-bold leading-snug font-serif group-hover:text-white/90 transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center lg:gap-3  gap-1 text-xs text-white/70">
              <span className="font-medium">{post && post.user.username}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {post.time_since_created}
              </span>{" "}
            </div>
          </div>
        </div>
      </article>{" "}
    </Link>
  );
};

export default BlogCard;
