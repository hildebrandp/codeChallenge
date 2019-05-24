
/**
* Developed by Pascal Hildebrand
* hildebrand.p@outlook.de
*
* Algorithm for calculating the shortest path between two nodes in a Graph
*/
const program = require('commander');
const fs = require('fs');
let jsonFile;
let nodeStart: number = -1;
let nodeDestination: number = -1;
let pathNodes: Array<number> = [];
let pathDistance: number = -1;
let distanceToNode: Array<number> = [];
let edgesArray: Array<Array<edges>> = [];
let startTime: number;

interface edges {
    cost: number,
    source: number,
    target: number,
}
interface nodes {
    label: string
}

/*******************************************************************************
* Calculate shortest Path between two Nodes
******************************************************************************/

/**
* Test is Nodes from Input exist in Array
* Create two Arrays for calculating shortest Path
* @param startNode Start Node
* @param endNode Destination Node
* @param graph Graph Number
*/
const testInput = function (startNode: string, endNode: string, graph: number): void {
    if (graph === 0) {
        jsonFile = fs.readFileSync('./graphs/lessnodes.json');
    } else if (graph === 1) {
        jsonFile = fs.readFileSync('./graphs/nodes.json');
    } else {
        jsonFile = fs.readFileSync('./graphs/morenodes.json');
    }

    let nodeArray = JSON.parse(jsonFile).nodes;
    let allEdges = JSON.parse(jsonFile).edges;

    let findStart: boolean = false;
    let findEnd: boolean = false;

    let countNodes: number = 0;
    let countEdges: number = 0;

    startTime = Date.now();

    /**
    * Check if startNode and endNode are in the Nodes Array
    * distanceToNode Array that holds the total distance from startNode to every other Node
    * edgesArray Array which holds for every Node all connected edges
    */
    nodeArray.forEach(function (node: any) {
        if (node.label === startNode) {
            findStart = true;
        }
        if (node.label === endNode) {
            findEnd = true;
        }
        distanceToNode.push(0);
        edgesArray.push([]);
        countNodes++;
    });

    /**
    * Add every Egde to both Connected Nodes in Array
    */
    allEdges.forEach(function (edge: edges) {
        edgesArray[edge.source].push(edge);
        edgesArray[edge.target].push(edge);
        countEdges++;
    });

    if (!findStart || !findEnd) {
        console.log(`Could not find start or destination Node. Programm exits!`);
        process.exit(-1);
    } else {
        console.log(`Found ${countNodes} Nodes and ${countEdges} Edges in Graph: ${graph}`);
        console.log(`Start calculating shortest Path`);
    }
};

/**
* Method that starts calculating the shortest path and prints the results
* @param node_Start Start Node
* @param node_End Destination Node
* @param graph Graph Number
*/
const shortestPath = function (node_Start: string, node_End: string, graph: number) {
    let startNode: string;
    let endNode: string;
    if (graph === 2) {
        startNode = node_Start === 'Erde' ? 'node_2061' : node_Start;
        endNode = node_End === 'b3-r7-r4nd7' ? 'node_4123' : node_End;
    } else {
        startNode = node_Start === 'Erde' ? 'node_18' : node_Start;
        endNode = node_End === 'b3-r7-r4nd7' ? 'node_246' : node_End;
    }
    nodeStart = +startNode.split('_')[1];
    nodeDestination = +endNode.split('_')[1];
    /**
    * Start calculating the shortest path from nodeStart to endNode
    */
    calculateDistance(nodeStart, nodeStart, [], 0);
    /**
    * Print the results
    */
    console.log(`==========================================================================`);
    if (pathDistance !== -1) {
        console.log(`Found Shortest Path from Node ${nodeStart} to Node ${nodeDestination}`);
        console.log(`Shortest Path: ${pathNodes.toString()}`);
        console.log(`Path Distance: ${pathDistance}`);
        console.log(`Time: ${Date.now() - startTime}`);
    } else {
        console.log(`No Path Found from Node ${nodeStart} to Node ${nodeDestination}`);
        console.log(`Time: ${Date.now() - startTime} ms`);
    }
    console.log(`==========================================================================`);
};

/**
* Recursive function that calculates the shortest path between nodeStart and nodeDestination
* @param currentNode The current Node that should be checked
* @param lastNode The last checked Node
* @param visitedNodes Array with all previous checked Nodes
* @param visitedCost total distance from nodeStart to currentNode
*/
const calculateDistance = function (currentNode: number, lastNode: number, visitedNodes: Array<number>, visitedCost: number): edges | false {
    let newVisitedNodes: Array<number> = [];
    for (let i = 0; i < visitedNodes.length; i++) {
        newVisitedNodes.push(visitedNodes[i]);
    }

    newVisitedNodes.push(currentNode);

    for (let i = 0; i < edgesArray[currentNode].length; i++) {
        if (!(edgesArray[currentNode][i].source === currentNode && edgesArray[currentNode][i].target === lastNode) ||
            !(edgesArray[currentNode][i].target === currentNode && edgesArray[currentNode][i].source === lastNode)) {

            let nextNode: number = edgesArray[currentNode][i].source === currentNode ? edgesArray[currentNode][i].target : edgesArray[currentNode][i].source;

            if (nextNode === nodeDestination) {
                return edgesArray[currentNode][i];
            } else if (newVisitedNodes.indexOf(nextNode) === -1 && edgesArray[currentNode].length >= 1) {
                let result: edges | false = false;

                if (distanceToNode[nextNode] === 0 || distanceToNode[nextNode] > visitedCost + edgesArray[currentNode][i].cost) {
                    distanceToNode[nextNode] = visitedCost + edgesArray[currentNode][i].cost;
                    result = calculateDistance(nextNode, currentNode, newVisitedNodes, visitedCost + edgesArray[currentNode][i].cost);

                    if (result) {
                        let tmpVisitedNodes: Array<number> = JSON.parse(JSON.stringify(newVisitedNodes));
                        tmpVisitedNodes.push(nextNode, nodeDestination);
                        foundNewPath(tmpVisitedNodes, (visitedCost + edgesArray[currentNode][i].cost + result.cost));
                    }
                }
            }
        }
    }

    return false;
};

/*******************************************************************************
* Helper Functions
******************************************************************************/

/**
* Method that checks if found Path is shorter than the last found path
* If new path is shorter then overwrite old path
* @param newPathNodes Array with all visited Nodes from nodeStart to nodeDestination
* @param newPathDistance Total distance from nodeStart to nodeDestination
*/
const foundNewPath = function (newPathNodes: Array<number>, newPathDistance: number): void {
    if (pathDistance === -1 || newPathDistance < pathDistance) {
        pathNodes = newPathNodes;
        pathDistance = newPathDistance;
    } else if (newPathDistance === pathDistance) {
        if (pathNodes.length < newPathNodes.length) {
            pathNodes = newPathNodes;
            pathDistance = newPathDistance;
        }
    }
    //console.log(`Found Path ${pathNodes.toString()}, Distance ${pathDistance}`);
};

/*******************************************************************************
* CLI Arguments and Options logic
******************************************************************************/
program
    .option('-s, --start <start>', 'Input start Node')
    .option('-d, --destination <destination>', 'Input Destination Node')
    .option('-g, --graph <graph>', 'Input Graph: 1 for Normal Graph, 2 for Big Graph');
program
    .command('calculateShortestPath')
    .description('Script that calculates the shortest Path between two Nodes. Usage: node calculateShortestPath.js -s node_42 -d node_1337 -g 1')
    .action(() => {
        const start_Node: string = program.start;
        const end_Node: string = program.destination;

        if (program.graph !== '0' && program.graph !== '1' && program.graph !== '2') {
            console.log(`The Graph ${program.graph} does not exists. Prgramm exits. Use 0 for small Graph, 1 for given Grah and 2 for large Graph.`);
            process.exit(-1);
        }

        const graphNumber: number = +program.graph;
        console.log(`Calculating the shortest Path between start Node: ${start_Node} and destination Node: ${end_Node}`);
        testInput(start_Node, end_Node, graphNumber);
        shortestPath(start_Node, end_Node, graphNumber);
    });
program.parse(process.argv);