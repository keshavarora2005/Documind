import axios from "axios";

const BASE = "https://documind-2-8fz2.onrender.com/api";

export const signupUser      = (name, email, password) =>
  axios.post(`${BASE}/auth/signup/`, { name, email, password });

export const loginUser       = (email, password) =>
  axios.post(`${BASE}/auth/login/`, { email, password });

export const startSession    = (userType) =>
  axios.post(`${BASE}/session/start/`, { user_type: userType });

export const uploadDocuments = (sessionId, files) => {
  const form = new FormData();
  form.append("session_id", sessionId);
  files.forEach(f => form.append("files", f));
  return axios.post(`${BASE}/documents/upload/`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const sendMessage     = (sessionId, question) =>
  axios.post(`${BASE}/chat/`, { session_id: sessionId, question });

export const getSummary      = (sessionId) =>
  axios.post(`${BASE}/summary/`, { session_id: sessionId });

export const getChatHistory  = (sessionId) =>
  axios.get(`${BASE}/chat/history/?session_id=${sessionId}`);

export const clearSession    = (sessionId) =>
  axios.post(`${BASE}/session/clear/`, { session_id: sessionId });