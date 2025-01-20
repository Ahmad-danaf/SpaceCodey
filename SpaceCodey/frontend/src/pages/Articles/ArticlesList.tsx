import React from "react";
import ContentList from "../../components/ContentList/ContentList";

const ArticlesList: React.FC = () => {
  return (
    <ContentList
      apiEndpoint="/content/articles/"
      detailRoute="/content/articles"
      title="Articles"
    />
  );
};

export default ArticlesList;
