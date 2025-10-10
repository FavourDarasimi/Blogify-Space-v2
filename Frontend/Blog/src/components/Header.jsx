import React from "react";

const Header = () => {
  return (
    <section className="w-full py-20 md:py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50"></div>

      <div className="container px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-gray-200 px-4 py-1.5 text-sm md:text-base font-medium bg-gray-100/50 backdrop-blur">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            Welcome to the future of blogging
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-8xl xl:text-8xl">
            Discover Stories That
            <span className="bg-gradient-to-r from-red-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              {" "}
              Matter
            </span>
          </h1>

          <p className="mx-auto max-w-[700px] text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
            Explore a world of insights, inspiration, and innovation. From tech
            trends to cultural deep-dives, we bring you stories that spark
            curiosity and fuel your passion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button className="inline-flex items-center text-nowrap justify-center rounded-full text-base md:text-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 h-12 px-8 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Start Reading
            </button>
            <button className="inline-flex items-center text-nowrap justify-center rounded-full text-base md:text-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900 h-12 px-8">
              Browse Categories
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
