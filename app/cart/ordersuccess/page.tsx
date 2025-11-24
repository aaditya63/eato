import React, { Suspense } from "react";
import OrderSuccess from "./OrderSuccess";

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderSuccess />
      </Suspense>
    </div>
  );
}
