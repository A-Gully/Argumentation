"use client";

import React from "react";
import VisGraph, { Edge, Node } from "react-vis-graph-wrapper";
import { GraphData } from "./page";
import { groundedLabelling } from "./grounded-labelling";
import { admissableLabelling } from "./admissable-labelling";
import { preferredLabelling } from "./preferred-labelling";

type Props = {
  data: GraphData;
  labelling: string;
};

const GraphView = (props: Props) => {
  let graph = {
    nodes: props.data.nodes,
    edges: props.data.edges,
  };
  if (props.labelling == "G") {
    graph = {
      nodes: groundedLabelling(props.data.nodes, props.data.edges),
      edges: props.data.edges,
    };
  } else if (props.labelling == "A") {
    graph = {
      nodes: admissableLabelling(props.data.nodes, props.data.edges),
      edges: props.data.edges,
    };
  } else if (props.labelling == "P") {
    graph = {
      nodes: preferredLabelling(props.data.nodes, props.data.edges),
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
    height: "500px",
  };

  return <VisGraph className="graph" options={options} graph={graph} />;
};
export default GraphView;
