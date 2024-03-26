"use client";

import GraphView from "./graph-view";
import { Node, Edge } from "react-vis-graph-wrapper";
import { useSearchParams } from "next/navigation";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";

export type GraphData = {
  nodes: Node[];
  edges: Edge[];
};
export default function Page({ params }: { params: { data: string } }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("labelling");
  let labelling = "N";
  if (search) {
    labelling = search;
  }
  let mod: GraphData = {
    nodes: [],
    edges: [],
  };
  const str = decodeURIComponent(params.data);
  mod = JSON.parse(str);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Argument Labelling</h1>
      <Link href={"/"} className="home-button">
        <AiFillHome />
      </Link>
      <ul>
        <li>Labellings:</li>
        <li>
          <Link className="grounded" href={"/result/" + str + "?labelling=G"}>
            Grounded
          </Link>
        </li>
        <li>
          <Link className="admissable" href={"/result/" + str + "?labelling=A"}>
            Admissable
          </Link>
        </li>
        <li>
          <Link className="preferred" href={"/result/" + str + "?labelling=P"}>
            Preferred
          </Link>
        </li>
      </ul>
      <GraphView data={mod} labelling={labelling} />
    </main>
  );
}
