

import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:4000"; // ✅ Updated Base URL

const App = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCode, setQrCode] = useState(""); // Store QR Code
  const [loading, setLoading] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault()
    if (!originalUrl) {
      toast.error("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/url/shorten`, { originalUrl });
      console.log(data);

      const shortCode = data.data.shortUrl.split("/").pop(); // ✅ Extract the last part
      setShortUrl(shortCode);
      setQrCode(data.data.qrCode);
      toast.success("Short URL created successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-gray-800">🔗 URL Shortener</h1>
        <p className="text-gray-500 text-sm">Shorten your long URLs easily</p>

        <input
          type="text"
          placeholder="Enter a long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleShorten}
          disabled={loading}
          className={`w-full mt-4 px-4 py-2 rounded-lg text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {loading ? "Shortening..." : "Shorten URL"}
        </button>

        {shortUrl && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-gray-700">
              Short URL:{" "}
              <a
                href={`${BASE_URL}/${shortUrl}`}  // ✅ Correctly links to backend route
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-semibold"
              >
                {`${BASE_URL}/${shortUrl}`}
              </a>

            </p>
            {qrCode && <img src={qrCode} alt="QR Code" className="mt-2 w-24 h-24" />}
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = qrCode;
                link.download = "qrcode.png"; // Set file name
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
