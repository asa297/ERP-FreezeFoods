import { Pagination } from "antd";
import styled from "styled-components";

function itemRender(current, type, originalElement) {
  if (type === "prev") {
    return <a>Previous</a>;
  }
  if (type === "next") {
    return <a>Next</a>;
  }
  return originalElement;
}

const PaginationList = ({ ...props }) => {
  return <PaginationWrapper {...props} />;
};

export default PaginationList;

const PaginationWrapper = styled(Pagination)`
  .ant-pagination-item,
  .ant-pagination-jump-prev,
  .ant-pagination-jump-next {
    margin-right: 0px;
  }

  .ant-pagination-next {
    margin-left: 8px;
  }
`;
