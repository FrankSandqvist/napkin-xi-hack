"use client";

import { ProductListing } from "@/components/product-listing";
import { Github, Youtube } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="mb-12">
        <div className="flex flex-row items-center bg-black -mx-6 lg:-mx-12 text-white py-2 px-12 mb-4 gap-4">
          <h1 className="font-rowdies text-4xl">NAPKIN</h1>
          <div className="flex-grow" />
          <Link href="https://github.com/FrankSandqvist/napkin-xi-hack">
            <Github />
          </Link>
          <Link href="https://www.youtube.com/watch?v=-gqruCLoMS4">
            <Youtube />
          </Link>
        </div>
        <div>
          Hey! 👋 You can try calling in as a customer, edit a product, or create a
          new one.
        </div>
      </div>
      <ProductListing />
    </div>
  );
}
