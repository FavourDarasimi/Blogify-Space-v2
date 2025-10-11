import React, { useEffect } from "react";
import Header from "../components/Header";
import Blogs from "../components/Blogs";

const Home = () => {
  return (
    <div>
      <Header />
      <main className="container py-16 md:py-20 space-y-20 ">
        <Blogs data-aos="zoom-in" />
      </main>
    </div>
  );
};

export default Home;
