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
// Create the graph data from a string of relations
export async function createGraphData(formData: FormData)  {
    const c = {relations: formData.get('relations')};
    const input = await stringToListOfTuples(c.relations);
    const stringNodes = new Set<string>();
    let dic: { [label: string] : number; } = {};
    const nodes: Node[] = []
    const edges: Edge[] = []
    let i: number = 1;
    //For each relation, add it as an edge and if there is a new node add it to the list 
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
    // Redirect to the '/result/' URL, appending the graph data (nodes and edges) as a JSON string.
    redirect("/result/".concat(`{"nodes":`,`${JSON.stringify(nodes)}`,`,"edges":`,`${JSON.stringify(edges)}`,"}"))
}

export async function createLogicGraphData(formData: FormData) {
    let nodes: Node[] = [];
    let edges = new Set<Edge>();
    const facts:string[][] = await stringToListOfTuples(formData.get('facts'))
    const rules:string[][] = await stringToListOfTuples(formData.get('rules'))
    let formalRules = new Map<string, string[]>(); // conclusion to premises
    let nodeMap = new Map<string, number>();  // node label to node id
    let negPremises = new Set<string>(); // Set of all negative premises present in the logic program
    let negConcs = new Set<string>(); // Set of all negative conclusions (...)
    let nextId = 1;
    // Initialize nodes from facts
    for (let i = 0; i < facts.length; i++) {
        nodes.push({
            id: nextId,
            label: facts[i][0],
            title: facts[i][0]
        })
        nodeMap.set(facts[i][0], nextId);
        nextId++;
    }
    //Set up a maps
    for (let j = 0; j < rules.length; j++) {
        const conclusion:string = rules[j][rules[j].length - 1];
        formalRules.set(conclusion, rules[j].slice(0,-1));
        if (conclusion.startsWith('!')) {
            negConcs.add(conclusion);
            conclusion.replace('!', '');
        }
        let checker:boolean[] = [];
        for(const p of rules[j].slice(0,-1)){
            let currentCheck = false;
            if(nodeMap.get(p) || p.startsWith('!')){
                currentCheck = true;
            }
            if (!currentCheck){
                for(const rule of rules){
                    const con = rule[rule.length-1];
                    if(p == con){
                        currentCheck = true;
                    }
                }
            }
            checker.push(currentCheck);
        }
        let count = 0;
        for(const c of checker){
            if(c){
                count++
            }
        }
        if (count == checker.length){
            nodes.push({ 
                id: nextId,
                label: conclusion,
                title: conclusion
            });
        }
        nodeMap.set(conclusion, nextId);
        nextId++;
            rules[j].slice(0, -1).forEach((premise, index) => {
                const negated = premise.startsWith('!');
                const premiseId = premise.replace('!', '');
                if (negated) {
                    negPremises.add(premiseId);
                }
            });      
    }
    //add edges between predicates (premises) and their negation
    negPremises.forEach(negPremise => {
        if (nodeMap.has(negPremise)){
            const impactMap = updateImpactMap(formalRules, negPremise)
            for(const node of nodes){
                if(node.label && impactMap.get(node.label)){
                    edges.add({ from: nodeMap.get(negPremise), to: node.id })
                }
            }
            
        }
    });
    //add edges between predicates (conclusions) and their negation
    negConcs.forEach(negConc => {
        if (nodeMap.has(negConc)){
            const impactMap = updateImpactMap(formalRules, negConc)
            for(const node of nodes){
                if(node.label && impactMap.get(node.label)){
                    edges.add({ from: nodeMap.get(negConc), to: node.id })
                }
            }
            
        }
    });
    redirect("/result/".concat(`{"nodes":`,`${JSON.stringify(nodes)}`,`,"edges":`,`${JSON.stringify(Array.from(edges))}`,"}"))
}
function updateImpactMap(rulesMap: Map<string, string[]>, negPremise: string): Map<string, boolean> {
    let impactMap = new Map<string, boolean>();

    // Initialize impactMap based on negative premise
    rulesMap.forEach((premises, conclusion)=> {
        for (const premise of premises) {
            if (premise.startsWith('!')) {
                if(premise.replace('!', '') == negPremise){
                    impactMap.set(conclusion,true);
                }
            }
        }
    })
    // Backpropagate the impact
    let changed = true;
    while (changed) {
        changed = false;

        rulesMap.forEach((premises, conclusion)=> {
            if (impactMap.get(conclusion) == undefined && premises.some(premise => impactMap.get(premise))) {
                impactMap.set(conclusion,true);
                changed = true;
            }
        })
    }

    return impactMap;
}