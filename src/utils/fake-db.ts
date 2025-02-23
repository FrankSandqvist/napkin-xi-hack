import { productSchema } from "@/schemas/product";
import { z } from "zod";

export const FakeDB = {
  seedDatabase: () => {
    localStorage.setItem("products", JSON.stringify(SEED));
    return SEED as z.infer<typeof productSchema>[];
  },
  listProducts: () => {
    const exists = localStorage.getItem("products");

    if (!exists) {
      return FakeDB.seedDatabase();
    }

    return JSON.parse(exists) as z.infer<typeof productSchema>[];
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
  deleteProduct: (idx: number) => {
    const products = FakeDB.listProducts();
    products.splice(idx, 1);
    localStorage.setItem("products", JSON.stringify(products));
    return products;
  },
};

const SEED = [
  {
    productName: "Pool cleaning",
    signature: [
      { prettyName: "Width of the Pool", name: "width", type: "number" },
      { prettyName: "Height of the Pool", name: "height", type: "number" },
    ],
    code: "const area = params.width * params.height;\nconst variableCost = area * 70;\nconst totalCost = variableCost + 40;\nreturn totalCost;",
    draft: false,
    explanation:
      "- The price calculation starts by determining the area of the pool, which is done by multiplying the width and height of the pool.\n- This area is then multiplied by 70 euros to calculate the variable cost, which is based on the size of the pool.\n- A fixed fee of 40 euros is added to this variable cost to get the total cost.\n- The total cost is the final price for the pool cleaning service.",
  },
  {
    productName: "Printed mugs",
    signature: [
      { prettyName: "Quantity of Mugs", name: "quantity", type: "number" },
      { prettyName: "Custom Print", name: "customPrint", type: "boolean" },
    ],
    code: "let pricePerMug = 0;\nif (params.quantity < 10) {\n    pricePerMug = 5;\n} else if (params.quantity < 50) {\n    pricePerMug = 4;\n} else if (params.quantity < 100) {\n    pricePerMug = 3.5;\n} else {\n    pricePerMug = 3;\n}\n\nif (params.customPrint) {\n    pricePerMug += 2;\n}\n\nreturn pricePerMug * params.quantity;",
    draft: false,
    explanation:
      "- The price of each mug is determined by the quantity ordered. There are different price tiers: \n  - Less than 10 mugs: 5 euros each\n  - 10 to 49 mugs: 4 euros each\n  - 50 to 99 mugs: 3.5 euros each\n  - 100 or more mugs: 3 euros each\n- If the mugs have a custom print, an additional 2 euros is added to the price of each mug.\n- The total price is calculated by multiplying the price per mug by the total quantity of mugs ordered.",
  },
  {
    productName: "Plumbing services",
    signature: [
      { prettyName: "Service Type", name: "serviceType", type: "string" },
      { prettyName: "Hours", name: "hours", type: "number" },
      { prettyName: "Reorder Materials", name: "reorder", type: "boolean" },
    ],
    code: "let total = 0;\nif (params.serviceType === 'emergency') {\n    total = params.hours * 100;\n} else if (params.serviceType === 'checkup') {\n    total = 60;\n} else {\n    total = Math.max(params.hours, 2) * 70;\n    if (params.reorder) {\n        total += 35;\n    }\n}\nreturn total;",
    draft: false,
    explanation:
      "- The function calculates the total price based on the type of service and other parameters.\n- If the service is an emergency, it charges 100 euros per hour.\n- If the service is a checkup, it charges a flat rate of 60 euros.\n- For standard services, it charges 70 euros per hour with a minimum of 2 hours.\n- If materials need to be reordered, an additional 35 euros is added to the total.",
  },
];
