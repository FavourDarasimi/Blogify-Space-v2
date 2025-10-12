import React, { useEffect, useState } from "react";
import { getCategoryPost } from "../endpoint/api";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BlogCard from "../components/BlogCard";
import { motion, AnimatePresence } from "framer-motion";

const CategoryPosts = () => {
  const [categoryPosts, setCategoryPosts] = useState();
  const [categoryData, setcategoryData] = useState();
  const { categoryId } = useParams();
  useEffect(() => {
    const fetchCategoryPost = async () => {
      try {
        const response = await getCategoryPost(categoryId);
        setCategoryPosts(response.data);
        setcategoryData(response.category_data);
        console.log(response.category_data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryPost();
  }, []);
  if (categoryData && categoryPosts) {
    return (
      <div>
        <section className="w-full py-5 md:py-6 relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50"></div>
          {/* Back Button */}

          {/* Category Header */}
          <div className="relative px-4 md:px-6 container">
            <Link
              to="/categories"
              className="inline-flex items-center mb-2 px-4 py-2 rounded-lg text-gray-700 hover:text-white hover:bg-red-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
            <div className="max-w-3xl">
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif mb-4">
                  {categoryData.name}
                </h1>
                <p className="text-base md:text-lg text-gray-600">
                  {categoryData.description}
                </p>
              </div>
            </div>

            <p className="text-gray-500">
              {categoryPosts.length} article
              {categoryPosts.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <div className="container px-4 md:px-6 py-10">
          {categoryPosts.length > 0 ? (
            <AnimatePresence>
              <motion.ul
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  {categoryPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </motion.ul>
            </AnimatePresence>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                No posts found in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default CategoryPosts;
