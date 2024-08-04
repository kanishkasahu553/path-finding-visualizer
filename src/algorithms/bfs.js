// BFS Algorithm
export function bfs(grid, startNode, finishNode) {
    const visitedNodesInOrder = [];
    const queue = [startNode];
    startNode.distance = 0;
  
    while (queue.length > 0) {
      const currentNode = queue.shift();
  
      if (currentNode.isWall) continue;
      if (currentNode.isVisited) continue;
  
      currentNode.isVisited = true;
      visitedNodesInOrder.push(currentNode);
  
      if (currentNode === finishNode) return visitedNodesInOrder;
  
      const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
      for (const neighbor of unvisitedNeighbors) {
        if (!neighbor.isVisited) {
          neighbor.distance = currentNode.distance + 1;
          neighbor.previousNode = currentNode;
          queue.push(neighbor);
        }
      }
    }
  
    return visitedNodesInOrder;
  }
  
  // Get unvisited neighbors
  function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const { col, row } = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
  }
  
  // Get all nodes
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  
  // Get nodes in shortest path order
  export function getNodesInShortestPathOrderBFS(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }
  