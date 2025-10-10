import axios from "axios";

// import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // or your API URL
});

// === REQUEST INTERCEPTOR ===
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");
    if (token) {
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

    // Handle refresh only once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        // No refresh token — redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          "http://localhost:8000/account/token/refresh/",
          { refresh }
        );

        if (data.access) {
          localStorage.setItem("token", data.access);
          api.defaults.headers.Authorization = `Bearer ${data.access}`;
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest); // retry with new token
        }
      } catch (refreshError) {
        // Refresh failed — clear and redirect
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

export const getCategories = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/blog/categories");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getCategoryPost = async (id) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/blog/category/${id}/post`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addPost = async (category, title, body, image) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/blog/post/create",
      {
        category: category,
        title: title,
        body: body,
        image: image,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getPostDetail = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/blog/post/${id}`,

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/account/login/", {
      username: email,
      password: password,
    });
    if (response.data) {
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
    }
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:8000/account/logout/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
  } catch (error) {
    throw error;
  }
};

export const signup = async (username, gender, email, password) => {
  try {
    const response = await axios.post("http://127.0.0.1:8000/account/signup/", {
      username: username,
      gender: gender,
      email: email,
      password: password,
    });
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getTopPost = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/blog/top/post");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
export const getAllPost = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/blog/post");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getlatestPost = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/blog/latest/post");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addComment = async (comment, post) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `http://127.0.0.1:8000/blog/comment/create/${post}`,
      { comment: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getComments = async (id) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/blog/comments/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const likePost = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://127.0.0.1:8000/blog/likepost/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUser = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/account/get_user/",
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createProfile = async (phoneNumber, location, bio, image) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/account/profile/create",
      { phone_number: phoneNumber, location: location, bio: bio, image: image },
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      "http://127.0.0.1:8000/account/profile",

      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    return false;
  }
};

export const editProfile = async (updatedProfile) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      "http://127.0.0.1:8000/account/profile/edit",
      updatedProfile,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const editPost = async (id, updatedPost) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://127.0.0.1:8000/blog/post/edit/${id}`,
      updatedPost,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    throw error.response.data;
  }
};

export const getRelatedPost = async (id) => {
  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/blog/post/related/${id}`
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const savePost = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/blog/savepost/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response;
  } catch (error) {
    return false;
  }
};

export const getSavedPost = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://127.0.0.1:8000/blog/saved/post", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
