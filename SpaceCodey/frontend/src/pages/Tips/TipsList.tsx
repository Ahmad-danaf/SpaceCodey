import React from "react";
import ContentList from "../../components/ContentList/ContentList";

const TipsList: React.FC = () => {
  return (
    <ContentList
      apiEndpoint="/content/tips/"
      detailRoute="/content/tips"
      title="Tips"
    />
  );
};

export default TipsList;
