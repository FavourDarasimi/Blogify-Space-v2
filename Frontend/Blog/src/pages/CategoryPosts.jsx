import React, { useEffect, useState } from "react";
import { getCategoryPost } from "../endpoint/api";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BlogCard from "../components/BlogCard";
import { motion, AnimatePresence } from "framer-motion";
import { BeatLoader } from "react-spinners";

const CategoryPosts = () => {
  const [categoryPosts, setCategoryPosts] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchCategoryPost = async () => {
      setLoading(true);
      try {
        const response = await getCategoryPost(categoryId);
        setCategoryPosts(response.data || []);
        setCategoryData(response.category_data || null);
      } catch (err) {
        console.error("Error fetching category posts:", err);
        setError("Failed to load category posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryPost();
  }, [categoryId]);

  // Loading UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <BeatLoader color="#dc2626" />
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-gray-600">
        <p className="text-lg">{error}</p>
        <Link
          to="/categories"
          className="mt-4 inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Link>
      </div>
    );
  }

  // No data
  if (!categoryData) {
    return (
      <div className="text-center py-16 text-gray-500">Category not found.</div>
    );
  }

  return (
    <div>
      {/* Hero / Header Section */}
      <section className="w-full py-6 md:py-10 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50"></div>

        <div className="relative px-4 md:px-6 container">
          {/* Back Button */}
          <Link
            to="/categories"
            className="inline-flex items-center mb-2 px-4 py-2 rounded-lg text-gray-700 hover:text-white hover:bg-red-600 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Categories
          </Link>

          {/* Category Info */}
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif mb-4">
              {categoryData.name}
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-3">
              {categoryData.description}
            </p>
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
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {categoryPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>
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
};

export default CategoryPosts;
