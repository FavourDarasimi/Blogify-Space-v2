import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../context/Context";
import { getCategories, getCategoryPost } from "../endpoint/api";

const Categories = ({ show, setShow }) => {
  const { setCategoryPosts, isActive, setIsActive, isHomePage } = useContext(Context);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cat = await getCategories();

        setCategories(cat);
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
    <div className="">
      <div
        className={`lg:flex md:flex gap-3 items-center ${
          !isHomePage ? "sm:flex sm:overflow-y-auto" : ""
        }`}
      >
        {categories.map((category) =>
          isHomePage ? (
            <div
              key={category.id}
              className={`lg:block md:block ${show ? "sm:block" : "sm:hidden"}`}
            >
              <Link to={"/categories"}>
                <p
                  className="lg:text-15 md:text-14 sm:text-17 sm:pb-2 hover:text-myGrey cursor-pointer"
                  onClick={() => handleClick(category.id)}
                >
                  {category.name}
                </p>
              </Link>
            </div>
          ) : (
            <div className="w-80%">
              <p
                key={category.id}
                className={`   cursor-pointer lg:text-17 md:text-15 sm:text-13 font-semibold mb-5 ${
                  isActive == category.id ? "border-1 bg-red-600 text-white p-2 rounded-lg" : ""
                }`}
                onClick={() => handleClick(category.id)}
              >
                {category.name}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Categories;
