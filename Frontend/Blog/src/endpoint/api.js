import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // or your API URL
  withCredentials: true, // CRITICAL: This sends cookies with requests
});

// === REQUEST INTERCEPTOR ===
// No longer needed for auth token - cookies are sent automatically
api.interceptors.request.use(
  async (config) => {
    // You can add other headers here if needed
    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR ===
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get 401 and haven't retried yet, try to refresh the token
    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        // Call your refresh endpoint - it will read refresh token from cookie
        await api.post("/account/refresh/");

        // If refresh succeeds, retry the original request
        // The new access token is now in the cookie
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

/* Helper to normalize error throwing */
const throwErr = (error) => {
  throw error?.response?.data ?? error;
};

/* ---- API calls: use `api` instance (so interceptors apply) ---- */

export const getCategories = async () => {
  try {
    const response = await api.get("/blog/categories");
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getCategoryPost = async (id) => {
  try {
    const response = await api.get(`/blog/category/${id}/post`);
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const addPost = async (category, title, body, image) => {
  try {
    const form = new FormData();
    form.append("category", category);
    form.append("title", title);
    form.append("body", body);
    if (image) form.append("image", image);

    const response = await api.post("/blog/post/create", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getPostDetail = async (id) => {
  try {
    const response = await api.get(`/blog/post/${id}`);
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const login = async (email, password) => {
  try {
    // Use the api instance to get cookies set automatically
    const response = await api.post("/account/login/", {
      username: email,
      password: password,
    });
    // No need to manually store tokens - they're in HttpOnly cookies now!
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/account/logout/");
    // Cookies are cleared by the backend
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const signup = async (
  username,
  first_name,
  last_name,
  email,
  password
) => {
  try {
    const response = await api.post("/account/signup/", {
      username,
      first_name,
      last_name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getTopPost = async (timeframe) => {
  try {
    const response = await api.get(
      `/blog/trending/posts/?timeframe=${timeframe}`
    );
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getFeaturedPost = async () => {
  try {
    const response = await api.get("/blog/featured/posts");
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getAllPost = async () => {
  try {
    const response = await api.get("/blog/post");
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getlatestPost = async () => {
  try {
    const response = await api.get("/blog/latest/posts");
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const addComment = async (comment, post) => {
  try {
    const response = await api.post(`/blog/comment/create/${post}`, {
      comment,
    });
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getComments = async (id) => {
  try {
    const response = await api.get(`/blog/comments/${id}`);
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const likePost = async (id) => {
  try {
    const response = await api.put(`/blog/likepost/${id}`, {});
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getUser = async () => {
  try {
    const response = await api.get("/account/get_user/");
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const createProfile = async (phoneNumber, location, bio, image) => {
  try {
    const form = new FormData();
    form.append("phone_number", phoneNumber);
    form.append("location", location);
    form.append("bio", bio);
    if (image) form.append("image", image);

    const response = await api.post("/account/profile/create", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getProfile = async () => {
  try {
    const response = await api.get("/account/profile");
    return response.data;
  } catch (error) {
    return false;
  }
};

export const editProfile = async (updatedProfile) => {
  try {
    const response = await api.put("/account/profile/edit", updatedProfile, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const editPost = async (id, updatedPost) => {
  try {
    const response = await api.put(`/blog/post/edit/${id}`, updatedPost, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const getRelatedPost = async (id) => {
  try {
    const response = await api.get(`/blog/post/related/${id}`);
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const savePost = async (id) => {
  try {
    const response = await api.put(`/blog/savepost/${id}`, {});
    return response.data;
  } catch (error) {
    return false;
  }
};

export const getSavedPost = async () => {
  try {
    const response = await api.get("/blog/saved/post");
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};
