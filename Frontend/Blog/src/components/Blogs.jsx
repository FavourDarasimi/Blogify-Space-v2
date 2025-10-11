// ...existing code...
import React, { useEffect, useState } from "react";
import BlogList from "./BlogList";
import BlogCard from "./BlogCard";
import { getTopPost, getlatestPost, getAllPost } from "../endpoint/api";
import { IoMenuOutline } from "react-icons/io5";
import cancel from "../assets/icons8-cross-24.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [show, setShow] = useState(false);
  const [featured, setFeatured] = useState();
  const [other, setOther] = useState([]);
  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        const posts = await getTopPost();
        const all = await getAllPost();
        const post = await getlatestPost();

        const [feature, ...others] = all.data.slice(0, 5);
        setFeatured(feature);
        setOther(others);

        const filteredTrendingPosts = posts.data.filter(
          (post) =>
            post.id !== feature.id &&
            !other.some((otherPost) => otherPost.id === post.id)
        );
        setTrendingPosts(filteredTrendingPosts.slice(0, 5));

        const filteredLatestPosts = post.data.filter(
          (post) => post.id !== feature.id
        );
        setLatestPosts(filteredLatestPosts);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrendingPosts();

    const fetchlatestPosts = async () => {
      try {
        const post = await getlatestPost();
        const newPost = post.data.filter((post) => post.id !== featured.id);
        console.log(newPost);
        setLatestPosts(newPost);
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  return (
    <div className="rounded-xl gap-y-4">
      <section className="mb-20 ">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold mb-2 font-serif">
            Featured Stories
          </h2>
          <p className="text-lg md:text-xl text-gray-500">
            Handpicked articles you don't want to miss
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Featured post */}
          {featured && <BlogCard post={featured} featuredPage={true} />}

          {/* Other posts */}
          {other &&
            other.map((post) => (
              <BlogCard key={post.id} post={post} featuredPage={false} />
            ))}
        </div>
      </section>

      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif">
            Trending Now
          </h3>
          <Link
            to="/trending"
            className="inline-flex text-red-500 items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors gap-2 group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-6">
          {trendingPosts.map((post) => (
            <BlogCard key={post.id} post={post} featuredPage={false} />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold font-serif">
            Latest Articles
          </h3>
          <Link
            to="/latest"
            className="inline-flex text-red-500 items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors gap-2 group"
          >
            View All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4   gap-6">
          {latestPosts.map((post) => (
            <BlogCard key={post.id} post={post} featured={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;
// ...existing code...
