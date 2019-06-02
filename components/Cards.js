import React, { Component } from 'react';
import { render } from 'react-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import axios from 'axios';
import SortableList from './sorting/SortableList'
import '../app.css';
import jsonData from './json/jsonData.json';

class SortableComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      items: [],
      cardData: [],
      loadingState: false
    };
    this.handleChange.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount called ");

    axios.get('https://uinames.com/api/?amount=10&region=germany&ext')
      .then((response) => {
        let data = response.data;
        console.log("data loaded from  https://uinames.com");
        this.setState({ initialData: data, items: data })
      })
      .catch((error) => {
        console.log("erro " + error.message);
        //uiname.com Resource Limit Reached
        console.log("Loading from local json")
        let user10data = jsonData.slice(0, 10)
        this.setState({ initialData: user10data, items: [...this.state.items, ...user10data], loadingState: false })
      });

    this.refs.searchText.addEventListener("keyup", () => {
      console.log("key pressed");
      this.setState({ loadingState: false })
    });

    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >= this.refs.iScroll.scrollHeight - 20) {
        this.loadMoreCards();
      }
    });
    // document.addEventListener('click', this.handleOutsideClick, false);

    // this.refs.iScroll.addEventListener('click', (e) => {
    //   console.log("clicked" + JSON.stringify(e))
    // });
  }
    handleOutsideClick(e) {
      // ignore clicks on the component itself
      console.log("e.target: "+e.target)

    }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }));
  };

  handleChange = (event) => {
    let inputVal = event.target.value;
    this.setState({ inputValue: inputVal });
    let items = this.state.initialData;
    inputVal = inputVal.toLowerCase();
    console.log("inputVal " + inputVal);
    // console.log("items " + JSON.stringify(items).toLowerCase());
    let filteredData = items.filter((data) => {
      return ((JSON.stringify(data.name).indexOf(inputVal) > -1) || (JSON.stringify(data.surname).indexOf(inputVal) > -1)
        || (JSON.stringify(data.email).indexOf(inputVal) > -1) || (JSON.stringify(data.gender).indexOf(inputVal) > -1)
        || (JSON.stringify(data.age).indexOf(inputVal) > -1))
    })
    console.log("filteredData data ready");
    this.setState({ items: filteredData })
    if (inputVal == "") {
      this.setState({ items: this.state.initialData })
    }
  }

  loadMoreCards() {
    if (this.state.loadingState || this.state.inputValue != "") {
      return;
    }
    if (this.state.items.length < 10) {
      return;
    }
    let cardShowNum = this.state.cardShowNum;
    this.setState({ loadingState: true });
    console.log("total cards: " + this.state.items.length)
    setTimeout(() => {
      axios.get('https://uinames.com/api/?amount=10&region=germany&ext')
        .then((response) => {
          let data = response.data;
          console.log("loadMoreCards called ")
          this.setState({ initialData: data, items: [...this.state.items, ...data], loadingState: false })
        }).catch((err) => {
          //uiname.com Resource Limit Reached
          console.log("Loading from local json");
          let user10data = jsonData.slice(0, 10)
          this.setState({ initialData: user10data, items: [...this.state.items, ...user10data], loadingState: false })
        });
    }, 500);
  }

  onDragStart = (e, i) => {
    console.lo("Item dragged");
  }


  render() {
    return (
      <div>
        <header className="headerStyle">
          <section className="sectionHeader">
          </section>
          <section className="searchBoxDiv">
            <label aria-label="Search" style={{ color: 'white' }}>Search: </label>
            <input
              aria-label="Search"
              id="searchBox"
              placeholder="Type here to search"
              ref="searchText"
              margin="normal"
              value={this.state.inputValue}
              onChange={this.handleChange}
              tabIndex="0"
              name="search"

            />
          </section>
        </header>
        <div ref="iScroll" className="divStyle">
          <SortableList items={this.state.items} onDragStart={this.onDragStart} onSortEnd={this.onSortEnd} />
        </div>
      </div>
    )
      ;
  }
}

export default SortableComponent;
