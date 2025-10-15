import React, { useEffect, useState } from "react";
import BlogCard from "./BlogCard";
import { getTopPost, getlatestPost, getFeaturedPost } from "../endpoint/api";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const Blogs = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [timeframe, setTimeframe] = useState("weekly");
  const [index, setIndex] = useState(0);

  const [loading, setLoading] = useState(true); // initial load
  const [trendingLoading, setTrendingLoading] = useState(false); // for timeframe change
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (trendingPosts.length > 0) setTrendingLoading(true); // show only after first load
        setError(null);

        const [trendingRes, latestRes, featuredRes] = await Promise.all([
          getTopPost(timeframe),
          getlatestPost(),
          getFeaturedPost(),
        ]);

        const featured = featuredRes?.data?.slice(0, 5) || [];
        setFeaturedPosts(featured);

        // Restore saved featured index if valid
        const savedIndex = parseInt(localStorage.getItem("featuredIndex"), 10);
        if (!isNaN(savedIndex) && savedIndex < featured.length) {
          setIndex(savedIndex);
        }

        // Filter out featured from trending + latest
        const filteredTrending =
          trendingRes?.data?.filter(
            (post) => !featured.some((f) => f.id === post.id)
          ) || [];
        setTrendingPosts(filteredTrending.slice(0, 5));

        const filteredLatest =
          latestRes?.data?.filter(
            (post) => !featured.some((f) => f.id === post.id)
          ) || [];
        setLatestPosts(filteredLatest);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
        setTrendingLoading(false);
      }
    };

    fetchPosts();
  }, [timeframe]);

  // 🌀 Auto-rotate featured every 60 seconds
  useEffect(() => {
    if (featuredPosts.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % featuredPosts.length;
        localStorage.setItem("featuredIndex", next);
        return next;
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [featuredPosts]);

  const featured = featuredPosts[index];
  const other = featuredPosts.filter((_, i) => i !== index);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <BeatLoader color="#dc2626" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl gap-y-4">
      {/* 🌟 FEATURED SECTION */}
      <section className="mb-20">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-2 font-serif">
            Featured Stories
          </h2>
          <p className="text-lg md:text-xl text-gray-500">
            Handpicked articles you don't want to miss
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured && <BlogCard post={featured} featuredPage={true} />}
          {other.map((post) => (
            <BlogCard key={post.id} post={post} featuredPage={false} />
          ))}
        </div>
      </section>

      {/* 🔥 TRENDING SECTION */}
      <div className="mb-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif">
              Trending Now
            </h3>
            <p className="text-gray-500">
              {trendingPosts.length}{" "}
              {trendingPosts.length === 1 ? "article" : "articles"}{" "}
              {timeframe == "alltime" ? "" : "this "}
              {timeframe == "weekly"
                ? "week"
                : timeframe === "monthly"
                ? "month"
                : "all time"}
            </p>
          </div>

          {/* 🕒 Timeframe Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1 w-fit">
            {["weekly", "monthly", "alltime"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                  timeframe === t
                    ? "bg-red-600 text-white shadow"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t === "alltime" ? "All Time" : t}
              </button>
            ))}
          </div>

          <Link
            to="/trending"
            className="inline-flex items-center text-red-500 text-sm font-medium hover:text-red-600 transition-colors gap-2 group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[200px]">
          {trendingLoading ? (
            <div className="col-span-full flex justify-center items-center h-48">
              <BeatLoader color="#dc2626" />
            </div>
          ) : trendingPosts.length > 0 ? (
            trendingPosts.map((post) => (
              <BlogCard key={post.id} post={post} featuredPage={false} />
            ))
          ) : (
            <p>No trending posts yet...</p>
          )}
        </div>
      </div>

      {/* 📰 LATEST SECTION */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif">
            Latest Articles
          </h3>
          <Link
            to="/latest"
            className="inline-flex items-center text-red-500 text-sm font-medium hover:text-red-600 transition-colors gap-2 group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestPosts.length > 0 ? (
            latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} featured={false} />
            ))
          ) : (
            <p>No latest posts yet...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
