// ...existing code...
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/Context";
import { getCategories, getCategoryPost } from "../endpoint/api";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Categories = () => {
  const { setCategoryPosts, isActive, setIsActive } = useContext(Context);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const handleClick = (id) => {
    const fetchCategoryPost = async () => {
      try {
        const post = await getCategoryPost(id);
        if (post.length > 0) {
          setCategoryPosts(post);
        } else {
          setCategoryPosts(null);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategoryPost();
    setIsActive(id);
  };

  return (
    <div>
      <section className="w-full py-12 md:py-20 relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50"></div>

        <div className="container px-4 md:px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight font-serif mb-4">
              Explore All Categories
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Browse through our diverse collection of topics and find stories
              that match your interests
            </p>
          </div>
        </div>
      </section>

      <div className="container px-4 md:px-6 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link to={`/category/${category.id}`}>
              <div
                key={category.id}
                onClick={() => handleClick(category.id)}
                className="group text-left border-[1px] border-gray-300 cursor-pointer overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4">
                  <h2
                    className={`text-xl md:text-2xl font-semibold text-gray-900 transition-colors group-hover:text-red-600`}
                  >
                    {category.name}
                  </h2>
                  <p className="mt-2 text-sm md:text-base text-gray-600">
                    {category.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {category.num_of_posts} posts
                  </p>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
// ...existing code...
