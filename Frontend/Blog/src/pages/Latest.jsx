import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import CategoryFilter from "../components/CategoryFilter";
import BlogCard from "../components/BlogCard";
import { Clock, ArrowLeft } from "lucide-react";
import { getlatestPost } from "../endpoint/api";

const Latest = () => {
  const [activeCategory, setActiveCategory] = useState("Discover");
  const [posts, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTrendingPost = async () => {
      try {
        const response = await getlatestPost();
        const trendingPosts = response.data;
        const filteredPosts =
          activeCategory === "Discover"
            ? trendingPosts
            : trendingPosts.filter((post) => post.category === activeCategory);
        setPost(filteredPosts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getTrendingPost();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <section className="w-full py-12 md:py-20 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50"></div>

        <div className="container px-4 md:px-6 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif">
              Latest Articles
            </h1>
          </div>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Fresh perspectives and new stories published recently. Stay up to
            date with our newest content
          </p>
        </div>
      </section>

      <main className="container py-12 md:py-16">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif">
              Filter by Category
            </h2>
            <p className="text-gray-600">
              {posts.length} {posts.length === 1 ? "article" : "articles"} found
            </p>
          </div>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center">
            <BeatLoader color="#dc2626" />
          </div>
        ) : (
          <AnimatePresence>
            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {posts.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="text-lg text-gray-600">
                      No articles found in this category
                    </p>
                  </div>
                ) : (
                  posts.map((post) => <BlogCard post={post} />)
                )}
              </div>{" "}
            </motion.ul>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default Latest;
