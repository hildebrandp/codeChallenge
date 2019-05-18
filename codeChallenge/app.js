/**
 *  Developed by Pascal Hildebrand
 *  hildebrand.p@outlook.de
 *
 * Algorithm for calculating the shortest path between two nodes
 */
const program = require('commander');
const fs = require('fs');
const jsonFile = fs.readFileSync('./nodes.json');
let nodeStart = -1;
let nodeDestination = -1;
const allEdges = JSON.parse(jsonFile).edges;
let foundPaths = 0;
let pathNodes = [];
let pathDistance = -1;
let distanceToNode = [];
let edgesArray = [];
let startTime = null;
/*******************************************************************************
 * Calculate shortest Path between two Nodes
 ******************************************************************************/
/**
 * Test is Nodes from Input exist in Array
 * Create two Arrays for calculating shortest Path
 * @param startNode Start Node
 * @param endNode Destination Node
 */
const testInput = function (startNode, endNode) {
    let jsonNodes = JSON.parse(jsonFile);
    let nodeArray = jsonNodes.nodes;
    let findStart = false;
    let findEnd = false;
    startTime = Date.now();
    /**
     * Check if startNode and endNode are in the Nodes Array
     * distanceToNode Array that holds the total distance from startNode to every other Node
     * edgesArray Array which holds for every Node all connected edges
     */
    nodeArray.forEach(function (node) {
        if (node.label === startNode) {
            findStart = true;
        }
        if (node.label === endNode) {
            findEnd = true;
        }
        distanceToNode.push(0);
        edgesArray.push([]);
    });
    /**
     * Add every Egde to both Connected Nodes in Array
     */
    allEdges.forEach(function (edge) {
        edgesArray[edge.source].push(edge);
        edgesArray[edge.target].push(edge);
    });
    if (!findStart || !findEnd) {
        console.log(`Could not find start or destination Node. Programm exits!`);
        process.exit(-1);
    }
    else {
        console.log(`Start calculating shortest Path`);
    }
};
/**
 * Method that starts calculating the shortest path and prints the results
 * @param node_Start Start Node
 * @param node_End Destination Node
 */
const shortestPath = function (node_Start, node_End) {
    let startNode = node_Start === 'Erde' ? 'node_18' : node_Start;
    let endNode = node_End === 'b3-r7-r4nd7' ? 'node_246' : node_End;
    nodeStart = +startNode.split('_')[1];
    nodeDestination = +endNode.split('_')[1];
    /**
     * Start calculating the shortest path from nodeStart to endNode
     */
    calculateDistance(nodeStart, -1, [], 0);
    /**
     * Print the results
     */
    console.log(`==========================================================================`);
    if (pathDistance !== -1) {
        console.log(`Found Path from Node ${nodeStart} to Node ${nodeDestination}`);
        console.log(`Shortest Path: ${pathNodes.toString()}`);
        console.log(`Path Distance: ${pathDistance}`);
        console.log(`Time: ${Date.now() - startTime}`);
    }
    else {
        console.log(`No Path Found from Node ${nodeStart} to Node ${nodeDestination}`);
        console.log(`Time: ${Date.now() - startTime}`);
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
const calculateDistance = function (currentNode, lastNode, visitedNodes, visitedCost) {
    let newVisitedNodes = JSON.parse(JSON.stringify(visitedNodes));
    let destinationEdge = checkIfDesinationNodeIsInArray(edgesArray[currentNode]);
    newVisitedNodes.push(currentNode);
    if (destinationEdge !== null) {
        return destinationEdge;
    }
    else if (lastNode !== -1 && edgesArray[currentNode].length === 1) {
        return false;
    }
    else {
        edgesArray[currentNode].forEach(function (edge) {
            if (!(edge.source === currentNode && edge.target === lastNode) ||
                !(edge.target === currentNode && edge.source === lastNode)) {
                let nextNode = edge.source === currentNode ? edge.target : edge.source;
                if (newVisitedNodes.indexOf(nextNode) === -1) {
                    let result = false;
                    if (distanceToNode[nextNode] === 0 || distanceToNode[nextNode] > visitedCost + edge.cost) {
                        distanceToNode[nextNode] = visitedCost + edge.cost;
                        result = calculateDistance(nextNode, currentNode, newVisitedNodes, visitedCost + edge.cost);
                        if (result) {
                            let tmpVisitedNodes = Object.assign([], newVisitedNodes);
                            tmpVisitedNodes.push(nextNode, nodeDestination);
                            foundNewPath(tmpVisitedNodes, (visitedCost + edge.cost + result.cost));
                        }
                    }
                }
            }
        });
    }
};
/*******************************************************************************
 * Helper Functions
 ******************************************************************************/
/**
 * Method that checks if one of the Edges from "edgesArray" lead to the nodeDestination
 * Returns the edge that is connected to nodeDestination or null if none of the edges is connected to nodeDestination
 * @param edgesArray Array with all Edges from one Node
 */
const checkIfDesinationNodeIsInArray = function (edgesArray) {
    let destinationEdges = null;
    edgesArray.forEach(function (edge) {
        if (edge.source === nodeDestination || edge.target === nodeDestination) {
            destinationEdges = edge;
        }
    });
    return destinationEdges;
};
/**
 * Method that checks if found Path is shorter than the last found path
 * If new path is shorter then overwrite old path
 * @param newPathNodes Array with all visited Nodes from nodeStart to nodeDestination
 * @param newPathDistance Total distance from nodeStart to nodeDestination
 */
const foundNewPath = function (newPathNodes, newPathDistance) {
    if (pathDistance === -1 || newPathDistance < pathDistance) {
        pathNodes = newPathNodes;
        pathDistance = newPathDistance;
    }
    else if (newPathDistance === pathDistance) {
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
    .option('-d, --destination  <destination>', 'Input Destination Node');
program
    .command('calculateShortestPath')
    .description('Script that calculates the shortest Path between two Nodes. Usage: node calculateShortestPath.js -s node_42 -d node_1337')
    .action(() => {
    const start_Node = program.start;
    const end_Node = program.destination;
    console.log(`Calculating the shortest Path between start Node: ${start_Node} and destination Node: ${end_Node}`);
    testInput(start_Node, end_Node);
    shortestPath(start_Node, end_Node);
});
program.parse(process.argv);
//# sourceMappingURL=app.js.map