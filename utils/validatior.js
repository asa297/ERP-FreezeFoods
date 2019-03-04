import * as Yup from "yup";
export const ItemCategoryFormSchema = Yup.object().shape({
  name: Yup.string().required("Required")
});
