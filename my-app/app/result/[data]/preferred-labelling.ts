import { Edge, IdType, Node } from "react-vis-graph-wrapper";
type Label = 'green' | 'red' | 'grey';
type Labelling = Map<IdType,Label>
let candidateLabellings: Labelling[] = [];

export function preferredLabelling(nodes: Node[], edges: Edge[]): Node[]{
    let newNodes:Node[] = nodes;
    candidateLabellings = [];
    let labelling: Labelling = new Map<IdType,Label>()
    for (const x of nodes){
        if(x.id){
            labelling.set(x.id, 'green');
        }
    }
    findLabellings(labelling, edges);
    console.log(candidateLabellings);
    return (newNodes.map((node)=>{
        let newNode:Node = {};
        if (node.id){
            newNode = {id: node.id, label: node.label, title: node.title, color: candidateLabellings[candidateLabellings.length-1].get(node.id)};
        }
        return(newNode);
    }));
}

function getInNodes(L: Labelling):Set<IdType>{
    let set = new Set<IdType>();
    L.forEach((label,nodeID)=>{
        if(label == 'green'){
            set.add(nodeID);
        }
    })
    return set;
}

function getUnNodes(L: Labelling):Set<IdType>{
    let set = new Set<IdType>();
    L.forEach((label,nodeID)=>{
        if(label == 'grey'){
            set.add(nodeID);
        }
    })
    return set;
}

function getOutNodes(L: Labelling):IdType[]{
    let set:IdType[] = [];
    L.forEach((label,nodeID)=>{
        if(label == 'red'){
            set.push(nodeID);
        }
    })
    return set;
}

function isInSubsetOfAnother(inNodes: Set<IdType>): boolean {
    for (const candidate of candidateLabellings) {
        if (isSubset(inNodes, getInNodes(candidate))) {
            return true;
        }
    }
    return false;
}

function isSubset(subset: Set<IdType>, set: Set<IdType>): boolean {
    subset.forEach((elem) =>  {
        if (!set.has(elem)) {
            return false;
        }
    })
    return true;
}

function findLabellings(L: Labelling, E:Edge[]) {
    if (isInSubsetOfAnother(getInNodes(L))) {
        return;
    }
    if (!hasIllegallyInNodes(L, E)) {
        candidateLabellings = candidateLabellings.filter(
            (candidate) => !isSubset(getInNodes(candidate), getInNodes(L))
        );
        console.log(L)
        candidateLabellings.push(L);
        return;
    }else {
        const superNodes = getSuperIllegallyInArg(L,E)
        if (superNodes.length) {
            const superI = superNodes[0]
            findLabellings(transitionStep(L,  superI, E), E);
        } else {
            for (const x of getIllegallyInNodes(L, E)) {
                const update = transitionStep(L, x, E);
                findLabellings(update, E);
            }
        }
    }

}

function copyLabelling(oldL: Labelling): Labelling {
  const copy:Labelling = new Map<IdType, Label>();
  oldL.forEach((label, nodeId) => {
    copy.set(nodeId, label);
  })
  return copy;
}

function hasIllegallyInNodes(L: Labelling, edges: Edge[]): boolean {
    for (const x of edges){
        if (x.from && x.to && L.get(x.to) == 'green' && L.get(x.from) == 'green'){
            return true;
        }
    }
    return false;
}


function hasSuperIllegallyInArg(L: Labelling, edges: Edge[]): boolean {
    for (const x of edges){
        if (x.to && L.get(x.to) == 'green' && !isLegallyIn(x.to, L, edges)){
            if(x.from && ( L.get(x.from) == 'green' && (isLegallyIn(x.from, L, edges)))){
                return true;
            }else if(x.from && L.get(x.from) == 'grey'){
                return true;
            }
        }
    }
    return false;
}

function isLegallyIn(nodeID: IdType, L: Labelling, edges: Edge[]){
    for (const x of edges) {
        if (x.to == nodeID){
            if (x.from && L.get(x.from) == 'green') {
                return false;
            }
        }
    }
    return true;
}

function isLegallyOut(nodeID: IdType, L: Labelling, edges: Edge[]){
    for (const x of edges) {
        if (x.to == nodeID){
            if (x.from && L.get(x.from) == 'green') {
                return true;
            }
        }
    }
    return false;
}

function isLegallyUn(nodeID: IdType, L: Labelling, edges: Edge[]){
    for (const x of edges) {
        if (x.to == nodeID){
            if (x.from && L.get(x.from) == 'grey') {
                return true;
            }
        }
    }
    return false;
}


function getSuperIllegallyInArg(L: Labelling, edges: Edge[]): IdType[] {
    let superIllegalIn:IdType[] = []
    const nodes = getIllegallyInNodes(L, edges);
    for (const node of nodes){
        for(const edge of edges){
            if(edge.to == node){
                if(edge.from && isLegallyIn(edge.from, L, edges)){
                    superIllegalIn.push(node);
                    break;
                }
                if(edge.from && isLegallyUn(edge.from, L, edges)){
                    superIllegalIn.push(node);
                    break;
                }
            }
        }
    }
    superIllegalIn = superIllegalIn.filter((item,
        index) => superIllegalIn.indexOf(item) === index);
    for (const x of superIllegalIn){
        console.log(x+":"+L.get(x))
    }
    console.log("/super illegal IN/")
    return superIllegalIn;
}

function transitionStep(old: Labelling, x: IdType, edges:Edge[]): Labelling {
    const L = copyLabelling(old)
    L.set(x, 'red');
    const children = getOutChildren(L, x, edges);
    const check = [x, ...children]
    
    console.log(check)
    for (const nodeToCheck of check){
        if (!isLegallyOut(nodeToCheck, L, edges)){
            console.log('changed '+nodeToCheck+' to grey')
            L.set(x, 'grey');
        }
    }
    return L;
}

function getOutChildren(L:Labelling, x:IdType, edges:Edge[]): IdType[]{
    let children:IdType[] = [];
    for (const edge of edges){
        if (edge.to && edge.from == x && L.get(edge.to) == 'red'){
            children.push(edge.to);
        }
    }
    return children;
}

function getIllegallyInNodes(L: Labelling, edges: Edge[]): IdType[] {
    let illegalNodes:IdType[] = [];
    for (const x of edges){
        if (x.from && x.to && L.get(x.to) == 'green' && L.get(x.from) == 'green'){
            illegalNodes.push(x.to);
        }
    }
    illegalNodes = illegalNodes.filter((item,
        index) => illegalNodes.indexOf(item) == index);
    for (const x of illegalNodes){
        console.log(x+":"+L.get(x))
    }
    console.log("/illegal IN/")
    return illegalNodes;
}

function getIllegallyOutNodes(L: Labelling, edges: Edge[]): IdType[] {
    let illegalNodes:IdType[] = [];
    const illegalOut = getOutNodes(L);
    
    for (const node of illegalOut) {
        if(!isLegallyOut(node, L, edges)){
            illegalNodes.push(node);
        }
    }
    illegalNodes = illegalNodes.filter((item,
        index) => illegalNodes.indexOf(item) == index);
    for (const x of illegalNodes){
        console.log(x+":"+L.get(x))
    }
    console.log("/illegal OUT/")
    return illegalNodes;
}
function getIllegallyUnNodes(L: Labelling, edges: Edge[]): IdType[] {
    let illegalNodes:IdType[] = [];
    for (const x of edges) {
        if(x.to && L.get(x.to) == 'grey'){
            let isIllegal = false;
            let undecParent = false;
            for(const y of edges){
                if(x.to == y.to && y.from && L.get(y.from) == 'green'){
                    isIllegal = true;
                }
                if(x.to == y.to && y.from && L.get(y.from) == 'grey'){
                    undecParent = true;
                }
            }
            if (isIllegal || !undecParent){
                illegalNodes.push(x.to)
            }
        }
    }
    illegalNodes = illegalNodes.filter((item,
        index) => illegalNodes.indexOf(item) == index);
    for (const x of illegalNodes){
        console.log(x+":"+L.get(x))
    }
    console.log("/illegal UN/")
    return illegalNodes;
}
// // Example usage
// const args = new Set<Argument>(["A", "B", "C"]);
// const attacks: Relation[] = [["A", "B"], ["B", "C"]];
// const af = new ArgumentationFramework(args, attacks);

// // Assuming all-in labelling for initialization
// let initialLabelling: Labelling = {
//     inArgs: new Set(args),
//     outArgs: new Set(),
//     undecidedArgs: new Set(),
// };

// findLabellings(initialLabelling);
// console.log(candidateLabellings);
