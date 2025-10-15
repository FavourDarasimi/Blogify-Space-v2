// Categories.jsx
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { getCategories, getCategoryPost } from "../endpoint/api";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

const Categories = () => {
  const { setCategoryPosts, isActive, setIsActive } = useContext(Context);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetch all categories */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  /** Fetch posts for a category */
  const handleClick = (id) => {
    const fetchCategoryPost = async () => {
      try {
        const post = await getCategoryPost(id);
        setCategoryPosts(post.length > 0 ? post : null);
      } catch (error) {
        console.error("Error fetching category posts:", error);
      }
    };
    fetchCategoryPost();
    setIsActive(id);
  };

  return (
    <div>
      {/* Hero / Header Section */}
      <section className="w-full py-12 md:py-20 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50"></div>

        <div className="container px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif mb-4">
              Explore All Categories
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Browse through our diverse collection of topics and find stories
              that match your interests.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <div className="container px-4 md:px-6 py-10">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <BeatLoader color="#dc2626" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No categories found.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                onClick={() => handleClick(category.id)}
              >
                <div
                  className={`group text-left border-[1px] border-gray-300 cursor-pointer overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isActive === category.id ? "border-red-500" : ""
                  }`}
                >
                  <div className="mb-4">
                    <h2
                      className={`text-xl md:text-2xl font-semibold transition-colors ${
                        isActive === category.id
                          ? "text-red-600"
                          : "text-gray-900 group-hover:text-red-600"
                      }`}
                    >
                      {category.name}
                    </h2>
                    <p className="mt-2 text-sm md:text-base text-gray-600">
                      {category.description || "No description available."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {category.num_of_posts} posts
                    </p>
                    <ArrowRight
                      className={`w-4 h-4 transition-colors ${
                        isActive === category.id
                          ? "text-red-600"
                          : "text-gray-400 group-hover:text-red-600"
                      }`}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;
