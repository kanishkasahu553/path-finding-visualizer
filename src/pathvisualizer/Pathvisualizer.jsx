import React, { Component } from "react";
import Node from "./node/Node";
import {
  dijkstra,
  getNodesInShortestPathOrderDijkstra,
} from "../algorithms/dijkstra";
import { dfs, getNodesInShortestPathOrderDFS } from "../algorithms/dfs";
import { bfs, getNodesInShortestPathOrderBFS } from "../algorithms/bfs";
import "./pathvisualizer.css";

export default class PathVisualizer extends Component {
  constructor() {
    super();
    this.initialGrid = [];
    this.state = {
      grid: [],
      mouseIsPressed: false,
      START_NODE_ROW: 0,
      START_NODE_COL: 0,
      FINISH_NODE_ROW: 5,
      FINISH_NODE_COL: 5,
      algorithm1: null,
      algorithm2: null,
    };
  }

  componentDidMount() {
    const grid = this.getInitialGrid();
    this.initialGrid = grid;
    this.setState({ grid });
  }

  getInitialGrid = () => {
    const grid = [];
    for (let row = 0; row < 18; row++) {
      const currentRow = [];
      for (let col = 0; col < 24; col++) {
        currentRow.push(this.createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  };

  createNode = (col, row) => {
    const { START_NODE_ROW, START_NODE_COL, FINISH_NODE_ROW, FINISH_NODE_COL } =
      this.state;
    return {
      col,
      row,
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  handleMouseDown = (row, col) => {
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  };

  handleMouseEnter = (row, col) => {
    if (!this.state.mouseIsPressed) return;
    const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  };

  handleMouseUp = () => {
    this.setState({ mouseIsPressed: false });
  };

  getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    if (row === this.state.START_NODE_ROW && col === this.state.START_NODE_COL)
      return newGrid;
    if (
      row === this.state.FINISH_NODE_ROW &&
      col === this.state.FINISH_NODE_COL
    )
      return newGrid;
    newGrid[row][col] = newNode;
    return newGrid;
  };

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  }

  visualizeAlgorithm = () => {
    const {
      grid,
      START_NODE_ROW,
      START_NODE_COL,
      FINISH_NODE_ROW,
      FINISH_NODE_COL,
      algorithm1,
      algorithm2,
    } = this.state;
    if (!algorithm1 || !algorithm2) {
      alert("Please select an algorithm");
      return;
    }
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = algorithm1(grid, startNode, finishNode);
    const nodesInShortestPathOrder = algorithm2(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  setStartNodeRow = (event) => {
    this.setState(
      {
        START_NODE_ROW: parseInt(
          event.target.value < 0 ? 0 : event.target.value
        ),
      },
      this.updateGrid
    );
  };

  setStartNodeCol = (event) => {
    this.setState(
      {
        START_NODE_COL: parseInt(
          event.target.value < 0 ? 0 : event.target.value
        ),
      },
      this.updateGrid
    );
  };

  setFinishNodeRow = (event) => {
    this.setState(
      {
        FINISH_NODE_ROW: parseInt(
          event.target.value < 0 ? 0 : event.target.value
        ),
      },
      this.updateGrid
    );
  };

  setFinishNodeCol = (event) => {
    this.setState(
      {
        FINISH_NODE_COL: parseInt(
          event.target.value < 0 ? 0 : event.target.value
        ),
      },
      this.updateGrid
    );
  };

  updateGrid = () => {
    const newGrid = this.getInitialGrid();
    this.setState({ grid: newGrid });
  };

  resetGrid = () => {
    this.resetGridWithAnimationRemoval();
  };

  resetGridWithAnimationRemoval = () => {
    const grid = this.getInitialGrid();
    this.setState({ grid });

    for (let row = 0; row < 18; row++) {
      for (let col = 0; col < 24; col++) {
        const node = grid[row][col];
        if (!node.isStart && !node.isFinish) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node";
        }
      }
    }
  };

  selectAlgorithm = (algorithm) => {
    if (algorithm === "dijkstra") {
      this.setState({
        algorithm1: dijkstra,
        algorithm2: getNodesInShortestPathOrderDijkstra,
      });
    } else if (algorithm === "dfs") {
      this.setState({
        algorithm1: dfs,
        algorithm2: getNodesInShortestPathOrderDFS,
      });
    } else if (algorithm === "bfs") {
      this.setState({
        algorithm1: bfs,
        algorithm2: getNodesInShortestPathOrderBFS,
      });
    }
  };

  render() {
    const {
      grid,
      mouseIsPressed,
      START_NODE_ROW,
      START_NODE_COL,
      FINISH_NODE_ROW,
      FINISH_NODE_COL,
    } = this.state;

    return (
      <>
        <div className="header">
          <h4 className="heading">PathFinding Visualizer</h4>
          <div className="selectionSection">
            <div className="selectComponents">
              <div className="dropdown">
                <p
                  className="dropdown-toggle"
                  style={{ cursor: "pointer" }}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {this.state.algorithm1 === null
                    ? "Select Algorithm"
                    : this.state.algorithm1.name}
                </p>

                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => this.selectAlgorithm("dijkstra")}
                    >
                      Dijkstra Algorithm
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => this.selectAlgorithm("dfs")}
                    >
                      DFS
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={() => this.selectAlgorithm("bfs")}
                    >
                      BFS
                    </a>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <p
                  className="dropdown-toggle"
                  style={{ cursor: "pointer" }}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Starting Node
                </p>
                <ul className="dropdown-menu ">
                  <li>
                    <input
                      className="inputBox"
                      type="number"
                      onChange={this.setStartNodeRow}
                      placeholder="Enter row"
                    />
                  </li>
                  <li>
                    <input
                      className="inputBox"
                      type="number"
                      onChange={this.setStartNodeCol}
                      placeholder="Enter col"
                    />
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <p
                  className="dropdown-toggle"
                  style={{ cursor: "pointer" }}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Targeting Node
                </p>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li>
                    <input
                      className="inputBox"
                      type="number"
                      onChange={this.setFinishNodeRow}
                      placeholder="Enter target node row"
                    />
                  </li>
                  <li>
                    <input
                      className="inputBox"
                      type="number"
                      onChange={this.setFinishNodeCol}
                      placeholder="Enter target node col"
                    />
                  </li>
                </ul>
              </div>

              <p
                style={{ cursor: "pointer" }}
                onClick={this.visualizeAlgorithm}
              >
                Find Path
              </p>
              <p style={{ cursor: "pointer" }} onClick={this.resetGrid}>
                Reset grid
              </p>
            </div>
          </div>
        </div>
        <p>To Change the algorithm and find path first reset the grid.</p>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}
