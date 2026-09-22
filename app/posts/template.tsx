import type { ReactNode } from "react";
import { PageMotion } from "@/components/PageMotion";

export default function PostsTemplate({ children }: { children: ReactNode }) {
  return <PageMotion>{children}</PageMotion>;
}
