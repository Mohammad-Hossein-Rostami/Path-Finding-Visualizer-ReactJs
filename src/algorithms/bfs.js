
export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);
    
    while (!!unvisitedNodes.length) {
      sortNodesByDistance(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();

      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      
      closestNode.isVisited = true;
      
      visitedNodesInOrder.push(closestNode);
      
      if (closestNode === finishNode) return visitedNodesInOrder ;
      
      updateUnvisitedNeighbors(closestNode, grid);

      
    }
  }
  
  function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
  function updateUnvisitedNeighbors(node, grid) {
    
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        
      neighbor.distance = node.distance + 1;
      
      neighbor.previousNode = node;

    }
    
  }


  
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    if (node.row > 0) neighbors.push(grid[node.row - 1][node.col]);
    if (node.row < grid.length - 1) neighbors.push(grid[node.row + 1][node.col]);
    if (node.col > 0) neighbors.push(grid[node.row][node.col - 1]);
    if (node.col < grid[0].length - 1) neighbors.push(grid[node.row][node.col + 1]);

    return neighbors.filter(neighbor => !neighbor.isVisited );
  }
  
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    
    return nodes;
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function bfsGetNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      
      currentNode = currentNode.previousNode;
      
    }
    
    return nodesInShortestPathOrder;
  }
