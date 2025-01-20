import React from "react";
import ContentDetail from "../../components/ContentDetail/ContentDetail";

const TipDetail: React.FC = () => {
  return (
    <ContentDetail
      apiEndpoint="/content/tips"
      backLink="/tips"
      contentType="tip"
    />
  );
};

export default TipDetail;
