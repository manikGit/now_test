import React, { Component } from 'react';
import { render } from 'react-dom';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

//  onDragStart = (e, i) => {

//   }

const SortableItem = SortableElement(({ data, i,onDragStart }) =>

  // class SortableItem extends React.Component {
  //   render() {
  //     const { data, i } = this.props;
  //     return (
     
  < List key = { i } className = "listStyle" style = {{ paddingLeft: '2vh', paddingRight: '2vh' }}  >
    <ListItem className="innerListStyle" style={{ outlineColor: '#293e40', padding: '0px' }} tabIndex="0" aria-grabbed="false" aria-haspopup='true' role='listitem'
      onDragOver={(e) => this.onDragOver(e, i)}
    >
      <Card draggable
        onDragStart={e => onDragStart(e, i)}
        onDragEnd={e => this.onDragEnd(e)}
      >
        <CardHeader
          avatar={
            <Avatar alt={data.name} src={data.photo} />
          }
          title={data.name + " " + data.surname}
          subheader={data.email}  >
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
      </List >
    
//     )
//   }
// }

);

export default SortableItem;