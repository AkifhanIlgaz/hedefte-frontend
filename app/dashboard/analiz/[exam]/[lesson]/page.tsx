import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ lesson: string; exam: string }>;
}) {
  const x = use(params);
  console.log(x);
}
