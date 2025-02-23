"use client";

import { productSchema } from "@/schemas/product";
import { FakeDB } from "@/utils/fake-db";
import { ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export const ProductListing = dynamic(
  () =>
    Promise.resolve(() => {
      const [products] = useState<Array<z.infer<typeof productSchema>>>(
        FakeDB.listProducts()
      );
      const router = useRouter();

      return (
        <div className="w-full flex flex-col items-stretch  gap-4">
          <h1 className="font-rowdies text-2xl">My products</h1>
          <div className="grid grid-cols-2 gap-2 -mx-12 font-rowdies">
            {products.map((product, index) => (
              <Link
                key={index}
                className="bg-black text-white p-2 group"
                href={`/${index}`}
              >
                <div className="relative">
                  {product.productName}
                  <ArrowRight className="absolute w-5 right-0 top-0 bottom-0 opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 duration-300" />
                </div>
              </Link>
            ))}
            <button
              className="bg-emerald-950 text-white p-2 text-start"
              onClick={() => {
                const idx = FakeDB.addProduct({
                  productName: "",
                  signature: [],
                  code: "",
                  draft: true,
                  explanation: "",
                });
                router.push(`/${idx}`);
              }}
            >
              Add new product
            </button>
          </div>
        </div>
      );
    }),
  {
    ssr: false,
  }
);
