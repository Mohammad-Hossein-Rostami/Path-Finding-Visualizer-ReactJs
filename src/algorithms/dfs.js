
export function dfs(grid, startNode, finishNode) {

    
    const visitedNodesInOrder = [];
    const unvisitedNodes = [startNode,]
    
    while (!!unvisitedNodes.length) {
      const closestNode = unvisitedNodes.pop();
      

      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      
      closestNode.isVisited = true;
      
      visitedNodesInOrder.push(closestNode);
      
      if (closestNode === finishNode) return visitedNodesInOrder;

  
      const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);

      for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = closestNode.distance + 1
        neighbor.previousNode = closestNode
        unvisitedNodes.push(neighbor);
      }
      

    }
    return visitedNodesInOrder

    
  }
  

  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    if (node.col < grid[0].length - 1) neighbors.push(grid[node.row][node.col + 1]);
    if (node.row < grid.length - 1) neighbors.push(grid[node.row + 1][node.col]);
    if (node.col > 0) neighbors.push(grid[node.row][node.col - 1]);
    if (node.row > 0) neighbors.push(grid[node.row - 1][node.col]);
    
    
    

    return neighbors.filter(neighbor => !neighbor.isVisited );
  }
  
 
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function dfsGetNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      
      currentNode = currentNode.previousNode;
      
    }
    
    return nodesInShortestPathOrder;
  }
