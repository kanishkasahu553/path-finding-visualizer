import React, { Component } from 'react';
import './node.css';

export default class Node extends Component {
  render() {
    const {
      col,
      isFinish,
      isStart,
      isWall,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      row,
    } = this.props;

    const extraClassName = `${isStart ? 'node-start' : ''} ${isFinish ? 'node-finish' : ''} ${isWall ? 'node-wall' : ''}`.trim();

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      >
        ({`${row},${col}`})
      </div>
    );
  }
}
