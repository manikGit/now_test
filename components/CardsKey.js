import React, { Component } from 'react';
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

class CardsKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: '',
      initialData: [],
      cardData: [],
      loadingState: false
    };
    this.handleChange.bind(this)
  }

  handleChange = (event) => {
    let inputVal = event.target.value;
    this.setState({ inputValue: inputVal });
    let cardData = this.state.initialData;
    inputVal = inputVal.toLowerCase();
    console.log("inputVal " + inputVal);
    // console.log("cardData " + JSON.stringify(cardData).toLowerCase());
    let filteredData = cardData.filter((data) => {
      return ((JSON.stringify(data.name).indexOf(inputVal) > -1) || (JSON.stringify(data.surname).indexOf(inputVal) > -1)
        || (JSON.stringify(data.email).indexOf(inputVal) > -1) || (JSON.stringify(data.gender).indexOf(inputVal) > -1)
        || (JSON.stringify(data.age).indexOf(inputVal) > -1))
    })
    // JSON.stringify(data).toLowerCase().indexOf(inputVal.toLowerCase())
    console.log("filteredData data ready");
    this.setState({ cardData: filteredData })

    if (inputVal == "") {
      this.setState({ cardData: this.state.initialData })
    }
  }
  loadMoreCards() {
    if (this.state.loadingState) {
      return;
    }
    if (this.state.cardData.length == 0) {
      return;
    }
    let cardShowNum = this.state.cardShowNum;
    this.setState({ loadingState: true });
    console.log("total cards: " + this.state.cardData.length)
    setTimeout(() => {
      axios.get('https://uinames.com/api/?amount=10&region=germany&ext')
        .then((response) => {
          let data = response.data;
          console.log("loadMoreCards called ")
          this.setState({ initialData: data, cardData: [...this.state.cardData, ...data], loadingState: false })
        }).catch((err) => {
          //uiname.com Resource Limit Reached
          console.log("Loading from local json");
          let user10data = jsonData.slice(0, 10)
          this.setState({ initialData: user10data, cardData: [...this.state.cardData, ...user10data], loadingState: false })
        });
    }, 500);
  }

  componentDidMount() {
    console.log("componentDidMount called ");

    axios.get('https://uinames.com/api/?amount=10&region=germany&ext')
      .then((response) => {
        let data = response.data;
        console.log("data loaded from  https://uinames.com");
        this.setState({ initialData: data, cardData: data })
      })
      .catch((error) => {
        console.log("erro " + error.message);
        //uiname.com Resource Limit Reached
        console.log("Loading from local json")
        let user10data = jsonData.slice(0, 10)
        this.setState({ initialData: user10data, cardData: [...this.state.cardData, ...user10data], loadingState: false })
      });

    this.refs.searchText.addEventListener("keyup", (event) => {
      console.log("key pressed");
      this.setState({ loadingState: false })
    });

    this.refs.iScroll.addEventListener("scroll", () => {
      if (this.refs.iScroll.scrollTop + this.refs.iScroll.clientHeight >= this.refs.iScroll.scrollHeight - 20) {
        this.loadMoreCards();
      }
    });
    document.addEventListener("keydown", function (e) {
      console.log("Key1: " + (e.target));
      var li = e.target || e.srcElement;
      var objFocus;
      if (e.keyCode == 32) {
        e.preventDefault();
        // e.target.style.ariaGrabbed = true;
        // e.dataTransfer.dropEffect='move';
        e.target.setAttribute('aria-grabbed', 'true');
        e.target.setAttribute('aria-dropeffect', 'move');
        e.target.setAttribute('tabindex', '0');
      } else if (e.keyCode == 38) {
        console.log("Key 38: " + (e.target));
        objFocus = li.nextSibling;
        if (!objFocus) {
          objFocus = li.previousSibling;
        }
        li.className = '';
        objFocus.focus();
        // objFocus.className = 'focus';
      }

    });
  }
  onDragStart = (e, index) => {
    this.draggedItem = this.state.cardData[index];
    this.indexDrag = index;
    e.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', this.draggedItem)
    console.log("ondragstart");
    //  event.target.style.visibility = 'hidden'; 
    // event.target.style.display = 'block'; 
    // event.target.style.cursor= 'grab'; 
  }
  onDragOver = (event, index) => {
    console.log("onDragOver");
    const draggedOverItem = this.state.cardData[index];
    if (this.draggedItem === draggedOverItem) {
      return;
    }
    if (event.preventDefault) {
      event.preventDefault();
    }
    event.dataTransfer.dropEffect = 'move';
    // event.target.style.transform = 'translate3d(0px,-' + event.target.height + ',0px)';
    // event.target.style.transitionDuration = '300ms';
    // event.target.style.cursor = 'pointer'; 
    let items = this.state.cardData.filter(item => item !== this.draggedItem);
    items.splice(index, 0, this.draggedItem);
    this.setState({ cardData: items });

  }
  onDragEnd = (event) => {
    // event.target.style.cursor = 'normal'; 
    this.draggedIdx = null;
  }

  render() {

    return (
      <React.Fragment>
        <header className="headerStyle">
          <section className="sectionHeader">
          </section>
          <section className="searchBoxDiv">
            <input
              id="searchBox"
              label="Search..."
              placeholder="Type here to search"
              ref="searchText"

              // className={classes.textField}
              margin="normal"
              value={this.state.inputValue}
              onChange={this.handleChange}
              tabIndex="0"

            />
          </section>
        </header>
        <body>
          <div ref="iScroll" className="divStyle" >
          <ul className="listStyle" style={{ paddingLeft: '2vh', paddingRight: '2vh' }}>
            {this.state.cardData.map((data, i) => {
              return <li style={{ outlineColor: '#293e40', padding: '0px', listStyle: 'none', marginTop: '10px' }}
              className="innerListStyle" 
              tabIndex="0" onDragOver={(e) => this.onDragOver(e, i)}
            //       aria-dropeffect="move"
              >
              <Card
                    draggable="true"
                    onDragStart={e => this.onDragStart(e, i)}
                    onDragEnd={e => this.onDragEnd(e)}
                    aria-grabbed="false"
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
              
              </li>

            }
            )
            }
            
            </ul>
          </div>
        </body>
      </React.Fragment>
    )
  }
}

export default CardsKey;



            //   return <List key={i} className="listStyle" style={{ paddingLeft: '2vh', paddingRight: '2vh' }}  >
            //     <ListItem className="innerListStyle" style={{ outlineColor: '#293e40', padding: '0px' }} tabIndex="0" onDragOver={(e) => this.onDragOver(e, i)}
            //       aria-dropeffect="move"
            //     >
            //       <Card
            //         draggable="true"
            //         onDragStart={e => this.onDragStart(e, i)}
            //         onDragEnd={e => this.onDragEnd(e)}
            //         aria-grabbed="false"
            //       >
            //         <CardHeader
            //           avatar={
            //             <Avatar alt={data.name} src={data.photo} />
            //           }
            //           title={data.name + " " + data.surname}
            //           subheader={data.email}
            //         >
            //         </CardHeader>
            //         <CardContent>
            //           <Typography variant="body2" color="textSecondary" component="p">
            //             Gender: {data.gender}
            //           </Typography>
            //           <Typography variant="body2" color="textSecondary" component="p">
            //             Age: {data.age}
            //           </Typography>
            //         </CardContent>
            //       </Card>
            //     </ListItem>
            //   </List>