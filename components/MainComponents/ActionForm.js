import { Button } from "antd";
import styled from "styled-components";

const ActionForm = ({ formId, loading = false, OnDelete }) => {
  return (
    <div>
      {formId ? (
        <div>
          <ButtonSave
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Save
          </ButtonSave>

          <ButtonDelete
            type="primary"
            loading={loading}
            disabled={loading}
            onClick={() => OnDelete()}
          >
            Delete
          </ButtonDelete>
        </div>
      ) : (
        <ButtonSave
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={loading}
        >
          Add
        </ButtonSave>
      )}
    </div>
  );
};

export default ActionForm;

const ButtonDelete = styled(Button)`
  background-color: #f5222d;
  border-color: #f5222d;
  margin: 0px 5px;

  :hover {
    background-color: #ee636a;
    border-color: #ee636a;
  }

  :active,
  :focus {
    background-color: #ee636a;
    border-color: #ee636a;
  }
`;

const ButtonSave = styled(Button)`
  margin: 0px 5px;
`;
