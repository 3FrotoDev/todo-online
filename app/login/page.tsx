"use client";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { Button } from "@heroui/button";
import { title } from "@/components/ui/primitives";
import { signupWithGoogle } from "@/utils/supabase/actions";

export default function Home() {

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex gap-3">
        <form action={signupWithGoogle}>
          <Button type="submit" variant="solid">
          Please login to continue :)
          </Button>
        </form>
      </div>
    </section>
  );
}
