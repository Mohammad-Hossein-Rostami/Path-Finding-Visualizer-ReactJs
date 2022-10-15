
export function Astar(grid, startNode, finishNode) {

    startNode.hn_score = 0;
    startNode.fn_score = 0;
    const visitedNodesInOrder = [];
    const unvisitedNodes = getAllNodes(grid);
    
    while (!!unvisitedNodes.length) {
      sortNodesByFn(unvisitedNodes);
      const closestNode = unvisitedNodes.shift();

      // If we encounter a wall, we skip it.
      if (closestNode.isWall) continue;
      // If the closest node is at a distance of infinity,
      // we must be trapped and should therefore stop.
      if (closestNode.distance === Infinity) return visitedNodesInOrder;
      
      closestNode.isVisited = true;
      
      visitedNodesInOrder.push(closestNode);
      
      if (closestNode === finishNode) return visitedNodesInOrder ;
      
      updateUnvisitedNeighbors(closestNode, grid, finishNode);

      
    }
    return visitedNodesInOrder;

  }
  
  function sortNodesByFn(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.fn_score - nodeB.fn_score);
  }

  function heuristic(node, finishNode) {

    const hn_score = Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col)

    return hn_score
  }
  
  function updateUnvisitedNeighbors(node, grid, finishNode) {
    
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      
      const hn_score = heuristic(neighbor, finishNode);
      neighbor.distance = node.distance + 1;
      neighbor.hn_score = hn_score;
      neighbor.fn_score = neighbor.distance + hn_score;
      
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
  export function AstarGetNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      
      currentNode = currentNode.previousNode;
      
    }
    
    return nodesInShortestPathOrder;
  }
