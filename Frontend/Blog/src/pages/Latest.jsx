import { useState, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";
import CategoryFilter from "../components/CategoryFilter";
import BlogCard from "../components/BlogCard";
import { Clock } from "lucide-react";
import { getlatestPost } from "../endpoint/api";

const Latest = () => {
  const [activeCategory, setActiveCategory] = useState("Discover");
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      try {
        const response = await getlatestPost();
        if (mounted) {
          setAllPosts(response.data);
          setFilteredPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching latest posts:", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPosts();
    return () => (mounted = false);
  }, []);

  // Handle category filtering
  useEffect(() => {
    if (activeCategory === "Discover") {
      setFilteredPosts(allPosts);
      return;
    }

    setFiltering(true);
    const timer = setTimeout(() => {
      const filtered = allPosts.filter(
        (post) => post.category === activeCategory
      );
      setFilteredPosts(filtered);
      setFiltering(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [activeCategory, allPosts]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header Section */}
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
            date with our newest content.
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

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <BeatLoader color="#dc2626" />
          </div>
        ) : filtering ? (
          <div className="flex justify-center py-20">
            <BeatLoader color="#dc2626" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-gray-600">
              No articles found in this category.
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default Latest;
