"use client";

import { useRouter } from "next/router";
import GraphView from "./graph-view";
import { Node, Edge } from "react-vis-graph-wrapper";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export type GraphData = {
  nodes: Node[];
  edges: Edge[];
};
export default function Page({ params }: { params: { data: string } }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.get("grounded");
  console.log(search);
  let grounded = false;
  if (search == "true") {
    grounded = true;
  }
  let mod: GraphData = {
    nodes: [],
    edges: [],
  };
  const str = decodeURIComponent(params.data);
  mod = JSON.parse(str);
  console.log(mod);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Argument Labelling</h1>
      <Link href={"/result/" + str + "?grounded=true"}>Grounded</Link>
      <div>
        <GraphView data={mod} grounded={grounded} />
      </div>
    </main>
  );
}
