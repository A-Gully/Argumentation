import { Edge, IdType, Node } from "react-vis-graph-wrapper";

type Label = 'green' | 'red' | 'grey';

export interface Labelling {
    [id: IdType] : Label
}
//checks if a node is legally in
export function isLegallyIn(L: Labelling, nodeID: IdType, edges: Edge[]): boolean {
    for (const x of edges) {
        if (x.to == nodeID){
            if (x.from && L[x.from] == 'green') {
                return false;
            }
        }
    }
    return true;
}
//checks if a node is legally out
export function isLegallyOut(L: Labelling, nodeID: IdType, edges: Edge[]): boolean {
    for (const x of edges) {
        if (x.to == nodeID){
            if (x.from && L[x.from] == 'green') {
                return true;
            }
        }
    }
    return false;
}
//performs transition step
export function transitionStep(L: Labelling, nodeID: IdType, edges: Edge[]): Labelling {
    //label the node out
    let newLabelling: Labelling = { ...L };
    if (nodeID){
        newLabelling[nodeID] = 'red';
    }
    //then check for illegally out arguments and change them to grey
    for (const x of edges) {
        if (x.from == nodeID || x.to == nodeID) {
            if (x.from && newLabelling[x.from] == 'red' && !isLegallyOut(newLabelling, x.from, edges)) {
                newLabelling[x.from] = 'grey';
            }
            if (x.to && newLabelling[x.to] == 'red' && !isLegallyOut(newLabelling, x.to, edges)) {
                newLabelling[x.to] = 'grey';
            }
        }
    }
    return newLabelling;
}

export function admissibleLabelling(nodes: Node[], edges: Edge[]){
    let newNodes = nodes;
    let labelling: Labelling = {};
    for (const node of nodes) {
        if(node.id){
            labelling[node.id] = 'green';
        }
    }
    //does not terminate until no more illegall IN and OUT nodes
    let terminated = false;
    while (!terminated) {
        let foundIllegallyIn: IdType | null = null;
        for (const node of nodes) {
            if (node.id && labelling[node.id] === 'green' && !isLegallyIn(labelling, node.id, edges)) {
                foundIllegallyIn = node.id;
                break;
            }
        }
        if (foundIllegallyIn === null) {
            terminated = true;
        } else {
            labelling = transitionStep(labelling, foundIllegallyIn, edges);
        }
    }
    //returns node array with colour attribute
    return (newNodes.map((node)=>{
        let newNode:Node = {}
        if (node.id){
            newNode = {id: node.id, label: node.label, title: node.title, color: labelling[node.id]}
        }
        console.log(newNode)
        return(newNode)
    }));
}

