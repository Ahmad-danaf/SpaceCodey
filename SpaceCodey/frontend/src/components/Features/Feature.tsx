import React from "react";
import styles from "./Features.module.css";

interface FeatureProps {
  title: string;
  description: string;
  link: string;
}

const Feature: React.FC<FeatureProps> = ({ title, description, link }) => {
  return (
    <a href={link} className={styles.feature}>
      <h2>{title}</h2>
      <p>{description}</p>
    </a>
  );
};

export default Feature;
