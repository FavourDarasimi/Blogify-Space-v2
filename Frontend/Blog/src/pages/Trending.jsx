import { useEffect, useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import BlogCard from "../components/BlogCard";
import { TrendingUp } from "lucide-react";
import { getTopPost } from "../endpoint/api";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

const Trending = () => {
  const [activeCategory, setActiveCategory] = useState("Discover");
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch all trending posts once
  useEffect(() => {
    const fetchTrendingPosts = async () => {
      setLoading(true);
      try {
        const response = await getTopPost();
        const trendingPosts = response?.data || [];
        setAllPosts(trendingPosts);
      } catch (error) {
        console.error("Failed to load trending posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingPosts();
  }, []);

  // 🔹 Filter posts locally when category changes
  useEffect(() => {
    const filtered =
      activeCategory === "Discover"
        ? allPosts
        : allPosts.filter((post) => post.category === activeCategory);
    setFilteredPosts(filtered);
  }, [activeCategory, allPosts]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50" />

        <div className="container px-4 md:px-6 relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif">
              Trending Stories
            </h1>
          </div>

          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Discover the most popular articles and stories that everyone is
            talking about right now
          </p>
        </div>
      </section>

      {/* Main Section */}
      <main className="container py-12 md:py-16">
        {/* Filter Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif">
              Filter by Category
            </h2>
            <p className="text-gray-600">
              {filteredPosts.length}{" "}
              {filteredPosts.length === 1 ? "article" : "articles"} found
            </p>
          </div>
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <BeatLoader color="#dc2626" />
          </div>
        ) : filteredPosts.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.ul
              key={activeCategory}
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPosts.map((post, idx) => (
                  <BlogCard key={post.id ?? idx} post={post} />
                ))}
              </div>
            </motion.ul>
          </AnimatePresence>
        ) : (
          <div className="text-center py-20">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
            <p className="text-lg text-gray-600">
              No articles found in this category
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Trending;
