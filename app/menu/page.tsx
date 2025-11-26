import { Suspense } from "react";
import Menu from "./menu";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Menu/>
    </Suspense>
  );
}
