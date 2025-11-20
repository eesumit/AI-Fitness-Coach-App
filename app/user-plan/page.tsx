import { Suspense } from "react";
import UserPlanPage from "./UserPlanPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <UserPlanPage />
    </Suspense>
  );
}
