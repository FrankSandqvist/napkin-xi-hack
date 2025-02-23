"use client";

import { productSchema } from "@/schemas/product";
import { FakeDB } from "@/utils/fake-db";
import { ArrowRight, Plus } from "lucide-react";
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
        <div className="w-full flex flex-col items-stretch gap-4">
          <h1 className="font-rowdies text-2xl">My products</h1>
          <div className="grid grid-cols-2 gap-2 lg:-mx-12">
            {products.map((product, index) => (
              <Link
                key={index}
                className="bg-black text-white py-4 px-6 group"
                href={`/${index}`}
              >
                <div className="relative">
                  <div className="font-rowdies ">{product.productName}</div>
            {product.draft && <div className="text-sm uppercase font-semibold opacity-50">Draft</div>}
                  <ArrowRight className="absolute w-5 right-0 top-0 bottom-0 opacity-0 -translate-x-4 group-hover:translate-x-0 group-hover:opacity-100 duration-300" />
                </div>
              </Link>
            ))}
            <button
              className="bg-gradient-to-br from-black via-black to-teal-700 text-white py-4 px-6 text-start group"
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
              <div className="relative font-rowdies">
                Add a new product
                <Plus className="absolute w-5 right-0 top-0 bottom-0 opacity-50 group-hover:opacity-100 duration-300" />
              </div>
            </button>
          </div>
        </div>
      );
    }),
  {
    ssr: false,
  }
);
