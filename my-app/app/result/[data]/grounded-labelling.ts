import error from "next/error";
import { Edge, IdType, Node } from "react-vis-graph-wrapper";

export function groundedLabelling(nodes: Node[], edges: Edge[]){
    let newNodes = nodes;
    let dic: { [id: IdType] : string } = {}

    nodes.forEach(node => {
        if (node.id){
            dic[node.id] = 'grey'
        }
    });

    while (nodes.length > 0){
        const size = nodes.length
        nodes.forEach(node => {
            let inParent = false;
            let undecidedParent = false;
            edges.forEach(edge => {
                if (edge.to == node.id && edge.from && dic[edge.from] == 'green'){
                    inParent = true;
                } else if (edge.to == node.id && edge.from && dic[edge.from] == 'grey'){
                    undecidedParent = true;
                }
            });
            if (node.id && !inParent && !undecidedParent){
                dic[node.id] = 'green'
                nodes.filter((e) => {e != node})
            }
            else if (node.id && inParent){
                dic[node.id] = 'red';
                nodes.filter((e) => {e != node})
            }
        });
        if(size == nodes.length){
            break
        }
    }

    return (newNodes.map((node)=>{
        let newNode:Node = {}
        if (node.id){
            newNode = {id: node.id, label: node.label, title: node.title, color: dic[node.id]}
        }
        console.log(newNode)
        return(newNode)
    }))
}