
import React from "react";
import { Outlet } from "react-router-dom";
import MessagesLayout from "./MessagesLayout";

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-4rem)]">
      <MessagesLayout />
    </div>
  );
}
