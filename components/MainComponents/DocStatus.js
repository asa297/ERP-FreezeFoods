import { Tag } from "antd";
import styled from "styled-components";

const DocStatus = ({ status, nomargin = false }) => {
  if (status === 0) return null;
  return (
    <div>
      {status === 1 ? (
        <Status color="blue" nomargin={nomargin.toString()}>
          เอกสารถูกบันทึก
        </Status>
      ) : (
        <Status color="red" nomargin={nomargin.toString()}>
          เอกสารถูกปิด
        </Status>
      )}
    </div>
  );
};

export default DocStatus;

const Status = styled(Tag)`
  margin: ${props => (props.nomargin === "true" ? "0px" : "0px 5px;")};
`;
