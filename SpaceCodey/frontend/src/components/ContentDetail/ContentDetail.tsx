import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./ContentDetail.module.css";

interface Content {
  id: number;
  title: string;
  content: string;
  category?: string; // Optional 
  created_at: string;
}

const ContentDetail: React.FC<{ apiEndpoint: string; backLink: string; contentType: string }> = ({
  apiEndpoint,
  backLink,
  contentType,
}) => {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<Content | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_X_API_KEY;
  const API_BASE_URL =
    import.meta.env.VITE_DEBUG_MODE === "development"
      ? import.meta.env.VITE_DEV_API_BASE_URL
      : import.meta.env.VITE_PROD_API_BASE_URL;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}${apiEndpoint}/${id}/`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey || "",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${contentType}.`);
        }

        const data = await response.json();
        setContent(data);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchContent();
  }, [apiEndpoint, id, apiKey, contentType]);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!content) {
    return <p className={styles.loading}>Loading {contentType}...</p>;
  }

  return (
    <div className="container">
    <Link to={backLink} className={`btn btn-secondary btn-back `} id={styles.backButton}>
        ← Back to {contentType === "tip" ? "Tips" : "Articles"}
    </Link>
    <div className="container mycontent">
        <div className={`card ${styles.articleDetailCard} mt-5`}>
            <div className={styles.cardBody}>
                <h1 className={styles.articleTitle}>{content.title}</h1>
                <div className="articleMeta">
                {content.category && (
                <small className={`${styles.samllText}`}>Category: {content.category}</small>)}
                {content.category && <small className={`${styles.samllText}`}> | </small>}
                <small className={`${styles.samllText}`}>Published on: {new Date(content.created_at).toLocaleDateString()}</small>
                </div>

                <div className={`${styles.articleContent} mt-4`} dangerouslySetInnerHTML={{ __html: content.content }}>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
};

export default ContentDetail;
