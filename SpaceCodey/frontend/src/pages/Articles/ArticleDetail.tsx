import React from "react";
import ContentDetail from "../../components/ContentDetail/ContentDetail";

const ArticleDetail: React.FC = () => {
  return (
    <ContentDetail
      apiEndpoint="/content/articles"
      backLink="/articles"
      contentType="article"
    />
  );
};

export default ArticleDetail;
