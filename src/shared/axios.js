import axios from "axios";
import { CAR_COMPARISON_TOKEN } from "./types";

export const BASE_URL = "http://159.65.196.85:9091";
export const TOKEN = localStorage.getItem(CAR_COMPARISON_TOKEN);

const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: TOKEN ? `Bearer ${TOKEN}` : "",
  },
});

export default httpClient;
