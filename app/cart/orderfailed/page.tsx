import React, { Suspense } from "react";
import OrderFailed from "./OrderFailed";

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderFailed />
      </Suspense>
    </div>
  );
}
