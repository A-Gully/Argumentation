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
    let changed = true;
    while (changed){
        changed = false;
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
                const old = dic[node.id];
                dic[node.id] = 'green'
                nodes.filter((e) => {e != node})
                if(old != dic[node.id]){
                    changed = true;
                }
            }
            else if (node.id && inParent){
                const old = dic[node.id];
                dic[node.id] = 'red';
                nodes.filter((e) => {e != node})
                if(old != dic[node.id]){
                    changed = true;
                }
            }
        });
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