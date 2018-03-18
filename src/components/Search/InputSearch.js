import React,{Component} from "react";
class Search extends Component {
  componentDidMount() {
    this.input.focus();
  }

  render() {
    const { searchTerm, onChange, children, onSubmit } = this.props;

    return (
      <form onSubmit={onSubmit}>
        <input type="text"
          onChange={onChange}
          value={searchTerm}
          ref={(node)=>{this.input=node;}}
        />
        <button type="submit">
          {children}
        </button>
      </form>
    )
  }
}
  
export default Search;