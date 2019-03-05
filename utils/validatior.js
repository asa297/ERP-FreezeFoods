import * as Yup from "yup";
export const ItemCategoryFormSchema = Yup.object().shape({
  name: Yup.string().required("Required")
});

export const ItemUnitFormSchema = Yup.object().shape({
  name: Yup.string().required("Required")
});

export const ContactFormSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  org: Yup.string().required("Required")
});

export const ItemFormSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  category: Yup.object().required("Required")
});
