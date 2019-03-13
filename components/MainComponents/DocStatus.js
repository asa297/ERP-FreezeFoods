import { Tag } from "antd";
import styled from "styled-components";

const DocStatus = ({ status, nomargin = false }) => {
  if (status === 0) return null;
  return (
    <div>
      {status === 1 ? (
        <Au color="blue" nomargin={nomargin}>
          Save
        </Au>
      ) : (
        <Au color="red" nomargin={nomargin}>
          Close
        </Au>
      )}
    </div>
  );
};

export default DocStatus;

const Au = styled(Tag)`
  margin: ${props => (!props.nomargin ? "0px 5px;" : "0px")};
`;
