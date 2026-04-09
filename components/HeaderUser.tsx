"use client";

import { UserButton } from "@stackframe/stack";

export default function HeaderUser() {
  return (
    <div className="flex items-center gap-3">
      <UserButton showUserInfo={true} />
    </div>
  );
}
