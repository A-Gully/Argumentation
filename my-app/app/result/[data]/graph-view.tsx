"use client";

import React from "react";
import VisGraph, { Edge, Node } from "react-vis-graph-wrapper";
import { GraphData } from "./page";
import { groundedLabelling } from "./grounded-labelling";

type Props = {
  data: GraphData;
  grounded: boolean;
};

const GraphView = (props: Props) => {
  console.log(props.grounded);
  let graph = {
    nodes: props.data.nodes,
    edges: props.data.edges,
  };
  if (props.grounded == true) {
    console.log(groundedLabelling(props.data.nodes, props.data.edges));
    graph = {
      nodes: groundedLabelling(props.data.nodes, props.data.edges),
      edges: props.data.edges,
    };
  }

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
      smooth: true,
    },
    height: "800px",
  };

  return <VisGraph options={options} graph={graph} />;
};
export default GraphView;
