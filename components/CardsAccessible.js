import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
import Typography from '@material-ui/core/Typography';

import jsonData from './json/jsonData.json';

import '../app.css';

// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    content: `item ${k}`
  }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

class CardsAccessible extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: getItems(10),
      inputValue: '',
      initialData: [],
      cardData: [],
      loadingState: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
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

    // this.refs.searchText.addEventListener("keyup", () => {
    //   console.log("key pressed");
    //   this.setState({ loadingState: false })
    // });

    // this.refs.iScroll.addEventListener("scroll", () => {
    //   if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >= this.refs.iScroll.scrollHeight - 20) {
    //     this.loadMoreCards();
    //   }
    // });

  }
  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {this.state.items.map((data, i) => (
                <Draggable key={`item-${i}`} draggableId={`item-${i}`} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <List                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      
                       key={i} className="listStyle" style={{ paddingLeft: '2vh', paddingRight: '2vh' }}  >
                <ListItem className="innerListStyle" style={{ outlineColor: '#293e40', padding: '0px' }} onDragOver={(e) => this.onDragOver(e, i)}
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
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default CardsAccessible;