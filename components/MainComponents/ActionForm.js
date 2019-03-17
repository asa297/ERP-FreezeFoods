import { Button, Modal } from "antd";
import React, { useState } from "react";
import styled from "styled-components";

const confirm = Modal.confirm;

const ActionForm = ({
  onSubmit,
  formId,
  loading = false,
  OnDelete,
  DisabledSave = false
}) => {
  const submit = async () => {
    onSubmit();
  };

  const Delete = async () => {
    confirm({
      title: "ยืนยันการลบ",
      content: "",
      onOk() {
        OnDelete();
      },
      onCancel() {
        return false;
      }
    });
  };

  return (
    <div>
      {formId ? (
        <div>
          {!DisabledSave ? (
            <ButtonSave
              type="primary"
              icon="save"
              loading={loading}
              disabled={loading}
              onClick={() => submit()}
            >
              บันทึก
            </ButtonSave>
          ) : null}

          <ButtonDelete
            type="primary"
            icon="delete"
            loading={loading}
            disabled={loading}
            onClick={() => Delete()}
          >
            ลบ
          </ButtonDelete>
        </div>
      ) : (
        <ButtonSave
          type="primary"
          icon="snippets"
          loading={loading}
          disabled={loading}
          onClick={() => submit()}
        >
          สร้าง
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
