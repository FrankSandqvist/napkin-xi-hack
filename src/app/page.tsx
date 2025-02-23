"use client";

import { ProductListing } from "@/components/product-listing";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="mb-12">
        <h1 className="font-rowdies text-4xl bg-black -mx-12 text-white py-2 px-12 mb-4">
          NAPKIN
        </h1>
        <div>
          Easily automate back-of-the-napkin calculations for micro-businesses.
        </div>
      </div>
      <ProductListing />
    </div>
  );
}
