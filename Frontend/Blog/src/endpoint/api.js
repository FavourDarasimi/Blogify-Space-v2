import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // or your API URL
});

// === REQUEST INTERCEPTOR ===
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR ===
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Use plain axios here to avoid re-triggering the same interceptor loop.
        const { data } = await axios.post(
          "http://localhost:8000/account/token/refresh/",
          { refresh }
        );

        if (data.access) {
          localStorage.setItem("token", data.access);
          api.defaults.headers = api.defaults.headers || {};
          api.defaults.headers.Authorization = `Bearer ${data.access}`;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest); // retry with new token
        }
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        window.location.href = "/login";
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
    const response = await axios.post("http://localhost:8000/account/login/", {
      username: email,
      password: password,
    });
    if (response.data) {
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
    }
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/account/logout/");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    return response.data;
  } catch (error) {
    throwErr(error);
  }
};

export const signup = async (username, gender, email, password) => {
  try {
    const response = await api.post("/account/signup/", {
      username,
      gender,
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
