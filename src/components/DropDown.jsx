import * as React from 'react';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

export default function DropDown(props) {
  return (
    <FormControl variant="standard" size="small">
        <Select
            labelId="sort-drop-down"
            id="sort-drop-down-select"
            value={props.sort}
            onChange={props.handleDropdown}
        >
            <MenuItem value={"insertionsort"}>Insertion Sort</MenuItem>
            <MenuItem value={"mergesort"}>Merge Sort</MenuItem>
            <MenuItem value={"quicksort"}>QuickSort</MenuItem>
            <MenuItem value={"bubblesort"}>Bubble Sort</MenuItem>
            <MenuItem value={"countingsort"}>Counting Sort</MenuItem>
        </Select>
      </FormControl>
      );
}


  <InputLabel id="sort-drop-down">Sorting Algorithm</InputLabel>
  
