import Image from "next/image";
import { AdminConversation } from "./admin-conversation";
import { ClientConversation } from "./client-conversation";

export default function Home() {
  return (
    <div className="absolute left-0 top-0 bottom-0 right-0">
      <div className="absolute right-1/2 top-0 bottom-0 left-0 bg-slate-800">
        <h2>Back-office view</h2>
        <AdminConversation />
      </div>
      <div className="absolute right-0 top-0 bottom-0 left-1/2 bg-slate-200">
        <h2>Customer view (website)</h2>
        <ClientConversation />
      </div>
      <div className="absolute bottom-0 w-full flex flex-col items-center">
        <div className="bg-white p-6">NAPKIN</div>
      </div>
    </div>
  );
}
