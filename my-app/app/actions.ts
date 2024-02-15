"use server";

import { redirect } from "next/navigation";
import { Edge, Node } from "react-vis-graph-wrapper";

export async function stringToListOfTuples(str:any) {
    // Remove surrounding parentheses and split the string into individual tuples
    const tuplesStr = str.slice(1, -1).split('),(');
    
    // Initialize an array to store the tuples
    const tuplesArray = [];

    // Iterate over each tuple string
    for (const tupleStr of tuplesStr) {
        // Split the tuple string into individual values
        const values = tupleStr.split(',');
        
        // Convert values into tuples and push them into the array
        tuplesArray.push(values);
    }

    return tuplesArray;
}

export async function createGraphData(formData: FormData)  {
    console.log(formData);
    const c = {relations: formData.get('relations')};
    const input = await stringToListOfTuples(c.relations);
    const stringNodes = new Set<string>();
    let dic: { [label: string] : number; } = {};
    const nodes: Node[] = []
    const edges: Edge[] = []
    let i: number = 1;
    for (const rel of input) {
        for (const x of rel) {
            let size = stringNodes.size
            stringNodes.add(x)
            if (stringNodes.size > size){
                nodes.push({
                    id: i,
                    label: x.toString(),
                    title: x
                });
                dic[x] = i;
                i++;
            }
        }
        edges.push({
        from: dic[rel[0]],
        to: dic[rel[1]]
        })
    }
    console.log(JSON.stringify({nodes: nodes, edges: edges}))
    redirect("/result/".concat(`{"nodes":`,`${JSON.stringify(nodes)}`,`,"edges":`,`${JSON.stringify(edges)}`,"}"))
}