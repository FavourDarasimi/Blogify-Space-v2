import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaRegComment, FaUserCircle } from "react-icons/fa";
import { IoIosMail, IoIosCall } from "react-icons/io";
import { FaLocationDot, FaPlus, FaCheck } from "react-icons/fa6";
import Comments from "../components/Comments";
import { useContext } from "react";
import { Context } from "../context/Context";
import CreateBlog from "./CreateBlog";
import { ArrowLeft, Heart, MessageCircle, Share2, Clock } from "lucide-react";
import {
  getPostDetail,
  likePost,
  getRelatedPost,
  savePost,
} from "../endpoint/api";
import axios from "axios";
import redheart from "../assets/red-heart-icon.svg";
import heart from "../assets/heart-thin-icon.svg";
import EditPost from "../components/EditPost";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BlogDetail = () => {
  const { showCreatePost } = useContext(Context);
  const [showComments, setShowComments] = useState();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [userLiked, setUserLiked] = useState(false);
  const [user, setUser] = useState([]);
  const [like, setLike] = useState("");
  const [savedPost, setSavedPost] = useState("");
  const [userSaved, setUserSaved] = useState(false);
  const [show, setShow] = useState(false);
  const [relatedPosts, setRelatedPosts] = useState(null);

  const fetchDetailPost = async () => {
    const posts = await getPostDetail(postId);
    setPost(posts);
    setUserLiked(posts.user_liked);
    setUserSaved(posts.user_saved);
  };
  const fetchRelatedPosts = async () => {
    const relatedPost = await getRelatedPost(postId);
    setRelatedPosts(relatedPost);
  };
  useEffect(() => {
    fetchDetailPost();
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://127.0.0.1:8000/account/get_user/",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((response) => setUser(response.data));
  }, [show, like, postId, savedPost]);

  useEffect(() => {
    fetchRelatedPosts();
  }, [postId]);

  const isUserPost = (userPost, users) => {
    return userPost == users;
  };

  const handleLike = async (post) => {
    try {
      const like = await likePost(post.id);
      setLike(post.likes);
      if (like.status === 200 && !userLiked) {
        toast.success("Post Liked");
      } else if (like.status === 200 && userLiked) {
        toast.success("Post Unliked");
      }
    } catch (error) {
      for (var i = 0; i < JSON.stringify(error).length; i++) {
        var err = JSON.stringify(Object.values(error)[i])
          .replace(/[\[\]]/g, "")
          .replace(/"/g, "");
        toast.error(err.charAt(0).toUpperCase() + err.slice(1));
      }
    }
  };
  const handleSavePost = async (post) => {
    try {
      const save = await savePost(post.id);
      setSavedPost(post.saved);
      if (save.status === 200 && !userSaved) {
        toast.success("Post Saved");
      } else if (save.status === 200 && userSaved) {
        toast.success("Post Unsaved");
      }
    } catch (error) {
      for (var i = 0; i < JSON.stringify(error).length; i++) {
        var err = JSON.stringify(Object.values(error)[i])
          .replace(/[\[\]]/g, "")
          .replace(/"/g, "");
        toast.error(err.charAt(0).toUpperCase() + err.slice(1));
      }
    }
  };

  const name = (username) => {
    var newName = username.replace(/ /g, "").toLowerCase();
    return newName;
  };

  if (!post) {
    return <div className="pt-20">Loading...</div>;
  }

  return (
    // <div className="lg:pt-10 md:pt-10 sm:pt-5  lg:flex lg:flex-row md:flex md:flex-col lg:w-90% md:w-60% sm:w-90% sm:mx-auto md:mx-auto">
    //   {showCreatePost ? <CreateBlog /> : ""}
    //   {show ? <EditPost postId={postId} setShow={setShow} show={show} /> : ""}
    //   <div className="w-30% lg:block md:hidden sm:hidden flex flex-col items-center mt-10 ">
    //     <div className=" bg-dark-white w-70% h-fit p-10 rounded-xl gap-y-3">
    //       <div className="flex items-center gap-3">
    //         {post.user.profile ? (
    //           post.user.profile.image ? (
    //             <img
    //               src={`${post.user.profile.image}`}
    //               alt={post.user}
    //               className="w-32 h-32 rounded-full ml-3"
    //             />
    //           ) : (
    //             <FaUserCircle className="w-20 h-20 ml-3" />
    //           )
    //         ) : (
    //           <FaUserCircle className="w-20 h-20 ml-3" />
    //         )}
    //         <div className="flex flex-col gap-2">
    //           <p className="text-3xl font-semibold">{post.user.username}</p>
    //           <p className="text-neutral-400">@{name(post.user.username)}</p>
    //         </div>
    //       </div>
    //       {post.user.profile ? (
    //         post.user.profile.bio ? (
    //           <div className="">
    //             <p className="text-2xl font-semibold pt-5 w-fit">About Me</p>
    //             <p>{post.user.profile.bio}</p>
    //           </div>
    //         ) : (
    //           ""
    //         )
    //       ) : (
    //         ""
    //       )}

    //       <div>
    //         <p className="text-2xl font-semibold pt-5 ">Contact Information</p>
    //         <div className=" flex flex-col gap-y-4 pt-3">
    //           <div className="flex gap-x-3 ">
    //             <IoIosMail className="w-7 h-7" />
    //             <p>{post.user.email}</p>
    //           </div>
    //           <div className="flex gap-x-3">
    //             <IoIosCall className="w-7 h-7" />
    //             <p>07040275467</p>
    //           </div>
    //           <div className="flex gap-x-3">
    //             <FaLocationDot className="w-7 h-7" />
    //             <p>Nigeria</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="lg:w-40% md:w-100%">
    //     <h1 className="lg:text-4xl md:text-4xl sm:text-2xl  font-bold text-center">{post.title}</h1>
    //     <div className="flex justify-between lg:pt-4 md:pt-4 sm:pt-2 text-myGrey text-14">
    //       <div className="flex justify-between w-full">
    //         <div className="flex gap-1 items-center ">
    //           <p className="lg:text-16 md:text-14 sm:text-12">Post by {post.user.username}</p>
    //           <div className="bg-black h-1 w-1 rounded-full "></div>
    //           <p className="text-16">{post.time_since_created}</p>
    //         </div>
    //         {isUserPost(post.user.id, user.id) ? (
    //           <button
    //             onClick={() => setShow(true)}
    //             className="flex items-center gap-1 bg-blue-600 border-bordercol border-1 p-2 rounded-md text-white"
    //           >
    //             <CiEdit className="w-5 h-5" />
    //             Edit Profile
    //           </button>
    //         ) : (
    //           ""
    //         )}
    //       </div>
    //     </div>
    //     <img
    //       src={`${post.image}`}
    //       className="lg:mt-7 md:mt-7 sm:mt-4 rounded-lg w-full lg:h-96 md:h-96 sm:h-64"
    //     />
    //     <p className="lg:text-18 md:text-17 sm:text-15 pt-3 w-fit">{post.body}</p>
    //     <div className="flex justify-center">
    //       <div className="w-fit h-fit rounded-xmd  p-3 bg-white flex  gap-5 lg:mt-5 md:pt-5 sm:pt-3">
    //         {userLiked ? (
    //           <div className="relative">
    //             <img
    //               src={redheart}
    //               className="w-8 h-8 cursor-pointer"
    //               onClick={() => handleLike(post)}
    //             />
    //             <p className="absolute -top-3 -right-1 font-bold text-18">{post.likes_count}</p>
    //           </div>
    //         ) : (
    //           <div className="relative">
    //             <img
    //               src={heart}
    //               className="w-8 h-8 cursor-pointer"
    //               onClick={() => handleLike(post)}
    //             />
    //             <p className="absolute -top-3 -right-1 font-bold text-18">{post.likes_count}</p>
    //           </div>
    //         )}
    //         <div className="relative">
    //           <FaRegComment
    //             className="w-8 h-8 cursor-pointer"
    //             onClick={() => setShowComments(post.id)}
    //           />
    //           <p className="absolute -top-3 -right-1 font-bold text-18">{post.comments_count}</p>
    //         </div>
    //         {showComments == post.id ? (
    //           <Comments post={post.id} setShowComments={setShowComments} />
    //         ) : (
    //           ""
    //         )}
    //         {userSaved ? (
    //           <FaCheck
    //             className="cursor-pointer w-8 h-8 text-black"
    //             onClick={() => handleSavePost(post)}
    //           />
    //         ) : (
    //           <FaPlus
    //             className="cursor-pointer w-8 h-8 text-black"
    //             onClick={() => handleSavePost(post)}
    //           />
    //         )}
    //       </div>
    //     </div>
    //   </div>
    //   <div className="lg:w-30% md:w-100% sm:w-100% sm:pt-7 mx-auto lg:pl-10 md:pt-10">
    //     <div className=" px-8  rounded-3xl mb-2">
    //       <h1 className="text-3xl text-red-600 text-center font-semibold">Related Posts</h1>
    //       {relatedPosts
    //         ? relatedPosts.map((post) => (
    //             <Link key={post.id} to={`/detail/${post.id}`}>
    //               <div className="border-b-1 border-textcol w-full py-3 flex justify-between">
    //                 <div>
    //                   <p className="border-l-4 border-red-600 px-2 py-1 rounded-md mt-3 lg:text-17 md:text-16 sm:text-13  text-red-600 w-fit">
    //                     {post.category}
    //                   </p>
    //                   <p className="pt-2 font-semibold lg:text-18 md:text-17 sm:text-14">
    //                     {post.title}
    //                   </p>
    //                   <div className="lg:pt-3 md:pt-2 sm:pt-1 flex gap-x-2 items-center">
    //                     {post.user.profile.image ? (
    //                       <img
    //                         src={post.user.profile.image}
    //                         alt=""
    //                         className="lg:w-8 lg:h-8 md:w-7 md:h-7  sm:w-6 sm:h-6 rounded-full"
    //                       />
    //                     ) : (
    //                       <FaUserCircle className="lg:w-8 lg:h-8 md:w-7 md:h-7 sm:w-6 sm:h-6 rou" />
    //                     )}

    //                     <p className="text-myGrey lg:text-15 md:text-14 sm:text-xs">
    //                       {post.user.username}
    //                     </p>
    //                   </div>
    //                 </div>
    //                 <div className="flex items-center">
    //                   <img
    //                     src={`${post.image}`}
    //                     alt={post.user}
    //                     className="lg:w-44 lg:h-32 md:w-40 md:h-28 sm:w-32 sm:h-24 rounded-lg "
    //                   />
    //                 </div>
    //               </div>
    //             </Link>
    //           ))
    //         : ""}
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen bg-background">
      <main className="container py-8 md:py-12">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Post Header */}
          <div className="mb-8">
            <span className="inline-flex items-center rounded-md bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold mb-4">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight font-serif mb-6">
              {post.title}
            </h1>
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="font-medium text-foreground">{post.author}</span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.timeAgo}
              </span>
            </div>
          </div>

          {/* Featured Image */}
          <div className="aspect-[21/9] overflow-hidden rounded-2xl mb-8 bg-muted">
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Post Actions */}
          <div className="flex items-center gap-4 pb-6 border-b mb-8">
            <Button
              variant={liked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className="gap-2"
            >
              <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
              {likes}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              {comments.length}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <h2 className="text-2xl font-bold font-serif mt-8 mb-4">
              Key Highlights
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt.
            </p>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-8 mb-12">
            <h2 className="text-2xl font-bold font-serif mb-6">
              Comments ({comments.length})
            </h2>

            {/* Add Comment */}
            <div className="mb-8">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-3"
                rows={3}
              />
              <Button onClick={handleComment} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-sm text-muted-foreground">
                      {comment.timeAgo}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{comment.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t pt-12">
              <h2 className="text-2xl md:text-3xl font-bold font-serif mb-8">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard
                    key={relatedPost.id}
                    id={relatedPost.id}
                    image={relatedPost.image}
                    category={relatedPost.category}
                    title={relatedPost.title}
                    author={relatedPost.author}
                    timeAgo={relatedPost.timeAgo}
                  />
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;
