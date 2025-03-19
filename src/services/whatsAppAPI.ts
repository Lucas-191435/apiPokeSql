import axios from "axios";

const whatsApiClient = axios.create({
  baseURL: process.env.WHATSAPP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.WHATSAPP_API_TOKEN,
  },
});

export { whatsApiClient };
