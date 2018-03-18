import React, { Component } from "react";
import { Button } from "../Button";
import "./DisplayTable.css";
import PropTypes from 'prop-types';
import { SORTS } from "../../constants";
import classNames from "classnames";

const Sort = ({ sortKey, onSetSort, children, activeSortKey }) => {
  const clsName = classNames("button-inline",
    { "button-active": sortKey && activeSortKey === sortKey });
  return (
    <Button
      onClick={() => onSetSort(sortKey)}
      clsName={clsName}
    >
      {children}
    </Button>
  )
}
class Table extends Component {
  /*用接收的属性初始化 */
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false
    };

    this.onSetSort = this.onSetSort.bind(this);
  }

  onSetSort(sortKey) {
    const isSortReverse = sortKey === this.state.sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse});
  }

  render() {
    const {
      list,
      onDismiss
    } = this.props;

    const {
      sortKey,
      isSortReverse
    }=this.state;

    const sortedList=SORTS[sortKey](list);
    const reversedSortedList = isSortReverse ? sortedList.reverse() : sortedList;

    return (<div className="table">
      <div className="table-header">
        <span className="largeColumn">
          <Sort
            sortKey={"TITLE"}
            onSetSort={this.onSetSort}
            activeSortKey={sortKey}>
            Title
      </Sort>
        </span>

        <span className="middleColumn">
          <Sort
            sortKey={"AUTHOR"}
            onSetSort={this.onSetSort}
            activeSortKey={sortKey}>
            Author
      </Sort>
        </span>

        <span className="smallColumn">
          <Sort
            sortKey={"COMMENTS"}
            onSetSort={this.onSetSort}
            activeSortKey={sortKey}>
            comments
      </Sort>
        </span>

        <span className="smallColumn">
          <Sort
            sortKey={"POINTS"}
            onSetSort={this.onSetSort}
            activeSortKey={sortKey}>
            Points
      </Sort>
        </span>

        <span className="smallColumn">
          <Sort>
            Archive
      </Sort>
        </span>

      </div>

      {reversedSortedList.map(item =>
        <div key={item.objectID} className="table-row">
          <span className="largeColumn">
            <a href={item.url}>{item.title}</a>
          </span>
          <span className="middleColumn">{item.author}</span>
          <span className="smallColumn">{item.num_comments}</span>
          <span className="smallColumn">{item.points}</span>
          <span className="smallColumn">
            <Button onClick={() => onDismiss(item.objectID)}
              className="button-inline">
              Dismiss
                </Button>
          </span>
        </div>
      )
      }
    </div>
    )
  }
}

Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number,
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};

export default Table;