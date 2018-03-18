import React, { Component } from 'react';
import logo from './logo.svg';
import './index.css';
import fetch from 'isomorphic-fetch';

import {
  DEFAULT_QUERY,
  DEFAULT_HPP,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  PARAM_PAGE,
  PARAM_HPP,
} from '../../constants';

import {
  Button
} from '../Button';

import {
  Search
} from "../Search"

import {
  Table
} from "../Table"

const Loading = () => <div style={{ textAlign: "center" }}>Loading...</div>;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component {...rest} />
/**高阶组件解决条件渲染问题 根据传入的参数决定渲染Loading组件还是渲染Button组件 */
const ButtonWithLoading = withLoading(Button);

const updateSearchTopStories = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
  const mergedHits = [...oldHits, ...hits];

  return {
    results: {
      ...results,
      [searchKey]: { hits: mergedHits, page }
    },
    isLoading: false

  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: "",
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false
    }

    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onChange = this.onChange.bind(this);
    this.setState = this.setState.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
  }

  /***生命周期方法 在组件挂载以及render函数第一次执行之后 用于异步获取数据 */
  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    /*大多数浏览器支持的原生 fetch API 来执行对 API 的异步请求 返回一个Promise对象
    create-react-app 中的配置保证了它被所有浏览器支持
    串联Promise*/
    this.setState({ isLoading: true });
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => {
        this.setSearchTopStories(result);
      })
      .catch(e => this.setState({ error: e }));
  }

  isSearchResultExists(searchKey) {
    return this.state.results[searchKey];
  }

  onChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  onDismiss(id) {
    const { searchKey } = this.state;
    const isNotID = item => item.objectID !== id;
    const updatedList = this.state.results[searchKey].hits.filter(isNotID);
    /*使用ES7的对象的扩展运算符进行对象的hits属性改变，其他属性不变 */
    this.setState({
      results: {
        ...this.state.results,
        [searchKey]: {
          hits: updatedList
        }
      }
    });
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (!this.isSearchResultExists(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    this.setState(updateSearchTopStories(hits, page));
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
      sortKey
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onChange}
            onSubmit={this.onSearchSubmit}
          >
            search
        </Search>
        </div>
        {error ?
          <div className="interactions">
            <p>There is something wrong.</p>
          </div>
          : <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <ButtonWithLoading
          isLoading={isLoading}
          className="button-block"
          onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}>
          More
        </ButtonWithLoading>

      </div >

    )
  }
}
/*** functional stateless components 函数式无状态组件***/

export default App;
