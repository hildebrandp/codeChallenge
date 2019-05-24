# codeChallenge

Script that finds the shortest Path between two Nodes in a Graph. To run this Script you need to install npm packages:
```
npm install
```

# Usage

To find the shortest path between Erde and b3-r7-r4nd7 and the default Graph
```
npm run start
```
Runs: "tsc && node app.js calculateShortestPath -s Erde -d b3-r7-r4nd7 -g 1"

To find a different Path
-s node_XX choose your start Node
-d node_XX choose your destination Node
-g X choose the Graph. 0 for small Graph (10 Nodes), 1 for medium Graph (1000 Nodes) or 2 for large Graph (5000 Nodes)
```
tsc
node app.js calculateShortestPath -s node_1 -d node_999 -g 1
```
