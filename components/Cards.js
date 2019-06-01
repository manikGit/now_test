import React, { Component } from 'react';
import { render } from 'react-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'; import axios from 'axios';

import '../app.css';

import jsonData from './json/jsonData.json';

const SortableItem = SortableElement(({ data, i }) =>
  <List key={i} className="listStyle" style={{ paddingLeft: '2vh', paddingRight: '2vh' }}  >
    <ListItem className="innerListStyle" style={{ outlineColor: '#293e40', padding: '0px' }} tabIndex="0" onDragOver={(e) => this.onDragOver(e, i)}
    >
      <Card draggable
        onDragStart={e => this.onDragStart(e, i)}
        onDragEnd={e => this.onDragEnd(e)}
      >
        <CardHeader
          avatar={
            <Avatar alt={data.name} src={data.photo} />
          }
          title={data.name + " " + data.surname}
          subheader={data.email}
        >
        </CardHeader>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            Gender: {data.gender}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Age: {data.age}
          </Typography>
        </CardContent>
      </Card>
    </ListItem>
  </List>
);

const SortableList = SortableContainer(({ items }) => {
  return (


    <ul style={{ paddingLeft: "0px" }}>
      {items.map((value, index) => (
        <li>
          <SortableItem key={"key: " + index} index={index} data={value} />
        </li>
      ))}
    </ul>

  );
});

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
    // JSON.stringify(data).toLowerCase().indexOf(inputVal.toLowerCase())
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
          <SortableList items={this.state.items} onSortEnd={this.onSortEnd} />
        </div>
      </div>
    )
      ;
  }
}

export default SortableComponent;
