import { productSchema } from "@/schemas/product";
import { z } from "zod";

export const FakeDB = {
  listProducts: () => {
    return localStorage.getItem("products")
      ? JSON.parse(localStorage.getItem("products")!)
      : [];
  },
  addProduct: (product: z.infer<typeof productSchema>) => {
    const products = FakeDB.listProducts();
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
    return products.length - 1;
  },
  editProduct: (
    idx: number,
    product: Partial<z.infer<typeof productSchema>>
  ) => {
    const products = FakeDB.listProducts();
    const oldProduct = products[idx];
    products[idx] = { ...oldProduct, ...product };
    localStorage.setItem("products", JSON.stringify(products));
    return products[idx];
  },
  getProduct: (idx: number) => {
    console.log(FakeDB.listProducts());
    console.log(idx);
    return FakeDB.listProducts()[idx];
  },
};
