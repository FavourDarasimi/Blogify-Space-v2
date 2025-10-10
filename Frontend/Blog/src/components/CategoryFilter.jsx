// ...existing code...
import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getCategories } from "../endpoint/api";

const CategoryFilter = ({ activeCategory, onCategoryChange }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await getCategories();
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllCategories();
  }, []);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onCategoryChange("Discover")}
          className={`inline-flex items-center justify-center rounded-full text-sm md:text-base font-medium h-9 md:h-10 px-3 md:px-4 transition-colors duration-150 ease-in-out focus:outline-none ${
            activeCategory == "Discover"
              ? "bg-red-600 text-white shadow-md border border-transparent hover:bg-red-700"
              : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 hover:text-gray-900"
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Discover
        </button>
      </div>
      {data.map((category) => {
        const isActive = activeCategory === category.name;
        return (
          <button
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
            className={`inline-flex items-center justify-center rounded-full text-sm md:text-base font-medium h-9 md:h-10 px-3 md:px-4 transition-colors duration-150 ease-in-out focus:outline-none ${
              isActive
                ? "bg-red-600 text-white shadow-md border border-transparent hover:bg-red-700"
                : "bg-white text-gray-800 border border-gray-200 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
// ...existing code...
