"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth.client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export const HomeView = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // or a fallback UI if needed
  }

  return (
    <div className="flex flex-col p-4 gap-4">
      <p>Logged in as {session.user?.name ?? session.user?.email}</p>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/sign-in");
              },
            },
          })
        }
      >
        Sign out
      </Button>
    </div>
  );
};
