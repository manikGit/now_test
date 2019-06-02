import React, { Component } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import SortableItem from './SortableItem'

const SortableList = SortableContainer(({ items,onDragStart }) => {
  return (
    <ul style={{ paddingLeft: "0px" }}>
      {items.map((value, index) => (
        <li>
          <SortableItem key={"key: " + index} index={index} data={value} onDragStart={onDragStart}/>
        </li>
      ))}
    </ul>
  );
});

export default SortableList;