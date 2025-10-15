import { useState, useEffect } from "react";
import BlogCard from "../components/BlogCard";
import CategoryFilter from "../components/CategoryFilter";
import { getSavedPost } from "../endpoint/api";
import { Bookmark, ArrowLeft } from "lucide-react";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

const SavedPosts = () => {
  const [activeCategory, setActiveCategory] = useState("Discover");
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  // 🔹 Fetch saved posts only once
  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const response = await getSavedPost();
        setAllPosts(response || []);
      } catch (error) {
        console.error("Failed to load saved posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedPosts();
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-20 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50"></div>

        <div className="container px-4 md:px-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50">
              <Bookmark className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif">
              Saved Posts
            </h1>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl">
            Your collection of bookmarked articles to read later
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12 md:py-16">
        <div className="container  mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 font-serif">
                Filter by Category
              </h2>
              <p className="text-gray-600">
                {filteredPosts.length}{" "}
                {filteredPosts.length === 1 ? "article" : "articles"} saved
              </p>
            </div>
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>

          {/* 🔹 Loading State */}
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
                <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              </motion.ul>
            </AnimatePresence>
          ) : (
            <div className="text-center py-20">
              <Bookmark className="h-16 w-16 text-gray-400 mx-auto mb-4 opacity-50" />
              <p className="text-gray-600 text-lg mb-4">
                No saved articles in this category
              </p>
              <a
                href="/latest"
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition"
              >
                <ArrowLeft className="w-4 h-4" /> Browse Latest Articles
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedPosts;
