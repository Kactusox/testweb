import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "./axios";

export const getCorrectTransmissionType = (type) => {
  switch (type) {
    case "AUTOMATIC":
      return "Automatic";
    case "MANUAL":
      return "Manual";
    case "CVT":
      return "CVT";
    default:
      return "-";
  }
};

export const getCorrectFuelType = (type) => {
  switch (type) {
    case "PETROL":
      return "Petrol";
    case "ELECTRIC":
      return "Electric";
    case "HYBRID":
      return "Hybrid";
    case "DIESEL":
      return "Diesel";
    default:
      return "-";
  }
};

export const getTypeValue = (type) => {
  switch (type) {
    case "PETROL":
      return 1;
    case "ELECTRIC":
      return 2;
    case "HYBRID":
      return 3;
    case "DIESEL":
      return 4;
    case "AUTOMATIC":
      return 1;
    case "MANUAL":
      return 2;
    case "CVT":
      return 3;

    default:
      return 0;
  }
};

export const numberFormat = (x) => {
  return `${x.toLocaleString()}`;
};

export const sendFeedback = async (formData) => {
  try {
    await axios.post(`${BASE_URL}/public/inbox`, {
      fullName: formData.fullName,
      email: formData.email,
      description: formData.message,
    });
    toast.success("Form was successfully submitted.");
  } catch (err) {
    if (err.response.data.message) {
      toast.error(err.response.data.message);
    } else {
      toast.error("Internal server error");
    }
  }
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  return formattedDate;
};

export const getTrimmedDescription = (description) => {
  if (!description) return "";
  return description.length > 200
    ? `${description.slice(0, 200)}...`
    : description;
};

export const handleApiError = (error) => {
  const message = error.response?.data?.message || "Internal server error";
  toast.error(message);
};
