import React, { useEffect, useState } from "react";
import { Link,useLocation } from "react-router-dom";
import styles from "./ContentList.module.css";

interface ContentItem {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface ContentListProps {
  apiEndpoint: string; // API endpoint to fetch data
  detailRoute: string; // Route for detail page
  title: string; // List title (e.g., "items" or "Articles")
}

const ContentList: React.FC<ContentListProps> = ({ apiEndpoint, detailRoute, title }) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const currentUrl = location.pathname;
  const apiKey = import.meta.env.VITE_X_API_KEY;
  const API_BASE_URL =
    import.meta.env.VITE_DEBUG_MODE === "development"
      ? import.meta.env.VITE_DEV_API_BASE_URL
      : import.meta.env.VITE_PROD_API_BASE_URL;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${apiEndpoint}`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey || "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }

        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchItems();
  }, [apiKey, apiEndpoint]);

  // Utility function to strip HTML tags
  const stripHtmlTags = (html: string) => html.replace(/<[^>]*>/g, "");

  return (
    <div className={`container ${styles.mycontent} ${styles.itemList}`}>
  {error ? (
    <p className={styles.error}>{error}</p>
  ) : (
    items.map((item) => (
      <div key={item.id} className={`mb-4 ${styles.itemCard}`}>
        <div className={styles.cardBody}>
          <h2 className={styles.itemTitle}>
            <Link to={`${currentUrl}/${item.id}`} className={styles.itemTitle}>
              {item.title}
            </Link>
          </h2>
          {/* Strip HTML tags for plain text */}
          <p className={styles.cardText}>
            {stripHtmlTags(item.content).split(" ").slice(0, 20).join(" ")}...
          </p>
          <small style={{ color: "#6c757d" }}>
            Published on: {new Date(item.created_at).toLocaleDateString()}
          </small>
        </div>
      </div>
    ))
  )}
</div>
  );
};

export default ContentList;
