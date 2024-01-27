import React, { Component } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import { Box, Modal, Button, Slider } from '@mui/material';
import DropDown from './DropDown';

export class SortingApp extends Component {
    constructor() {
        super();

        this.minBar = 3;
        this.maxBar = 80;
        this.state = {
            currentSize: 50,
            size: 50,
            speed: 3,
            bars: [],
            inProgess: false,
            sorted: false,
            width: window.innerWidth,
            settings: false,
            sort: "insertionsort",
        }
    }

    
    handleResize = () => {
        this.setState({
            width: window.innerWidth,
        });
    }
    componentDidMount(){
        this.generateBars();
        window.addEventListener('resize', this.handleResize);
    }

    /* GENERAL */
    generateBars() {
        if (!this.state.inProgess){
            const size = this.state.size;
            let bars = [size];
            for (let i = 0; i < size; i++){
                bars[i] = this.getRandomValue(this.minBar, this.maxBar);
            }
            this.setState({
                bars: bars,
                inProgess: false,
                sorted: false,
                currentSize: size,
            });
        }
    }

    getRandomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    delay(amount) {
        return new Promise((resolve) => {
          setTimeout(resolve, amount);
        });
    }

    swap(array, a, b){
        let temp = array[a];
        array[a] = array[b];
        array[b] = temp;
    }


    submitForm(e) {
        e.preventDefault();
        this.generateBars();
    }

    handleSizeChange(e, value) {
        value = Number(value) + 10;
        this.setState({
            size: value,
        });
    }

    handleSpeedChange(e, value) {
        value = 100 - Number(value);
        this.setState({
            speed: value,
        });
    }

    setActive(barId) {

        let elem = document.getElementById(barId);
        elem.classList.add("bar-active");
        setTimeout(function(){
            elem.classList.remove("bar-active");
        }, 20);
    }
    /* COUNTING SORT */
    async countingSort() {
        if (!this.state.inProgess && !this.state.sorted){
            this.setState({inProgess: true});
            let { bars } = this.state;
            let counts = Array(this.maxBar).fill(0);
            for (let i = 0; i < bars.length; i++) {
                await this.delay(this.state.speed);
                this.setActive("bar" + i);
                counts[bars[i]] += 1;
            }
            
            let newBars = Array(bars.length).fill(0);
            let idx = 0;
            for (let i = 0; i < counts.length; i++) {
                for (let j = 0; j < counts[i]; j++) {
                    this.setActive("bar" + idx);
                    newBars[idx++] = i;
                    await this.delay(this.state.speed)
                    this.setState({
                        bars: newBars,
                    });
                }
            }
            this.setState({inProgess: false, sorted: true});
        } 
    }

    /* INSERTION SORT */
    async insertionSort() {
        if (!this.state.inProgess && !this.state.sorted){
            this.setState({inProgess: true});
            let { bars } = this.state;

            for (let i = 1; i < bars.length; i++){
                let j = i;
                while (j > 0 && bars[j - 1] > bars[j]) {                
                    await this.delay(this.state.speed);
                    this.setActive("bar" + j);
                    this.setActive("bar" + (j - 1));
                    this.swap(bars, j, j-1);
                    j--;
                    this.setState(bars);
                }
            }
            this.setState({inProgess: false, sorted: true});
        } 
    }

    /* BUBBLESORT */
    async bubbleSort() {
        if (!this.state.inProgess && !this.state.sorted){
            this.setState({inProgess: true});

            let swaps = true;
            let { bars } = this.state;

            while (swaps) {
                swaps = false;
                for (let i = 1; i < bars.length; i++) {
                    if (bars[i] < bars[i - 1]) {
                        await this.delay(this.state.speed);
                        this.setActive("bar" + i);
                        this.setActive("bar" + (i - 1));
                        this.swap(bars, i, i-1);
                        this.setState(bars);
                        swaps = true;
                    }
                }
            }
        
        this.setState({inProgess: false, sorted: true});
        }
    }

    /* MERGESORT */
    async mergeSortStart(){
        if (!this.state.inProgess && !this.state.sorted){
            this.setState({inProgess: true})
            let { bars } = this.state
            await this.mergeSort(bars, 0, bars.length - 1);
            this.setState({inProgess: false, sorted: true})
        }
    }

    async mergeSort(array, start, end) {
        if (start < end) {
            let middle = Math.floor((start + end) / 2)
            await this.mergeSort(array, start, middle)
            await this.mergeSort(array, middle + 1, end)  
            
            await this.merge(array, start, middle, end)
        }
    }
      
    async merge(array, start, middle, end) { 
        let leftArrayLength = middle - start + 1
        let rightArrayLength = end - middle
      
        let leftArray = []
        let rightArray = []
      
        for (let i = 0; i < leftArrayLength; i++){
            leftArray[i] = array[start + i]
        }
          
        for (let i = 0; i < rightArrayLength; i++){
            rightArray[i] = array[middle + 1 + i]
        }
          
        let leftIndex = 0, rightIndex = 0;
      
        let currentIndex = start;

        while (leftIndex < leftArrayLength && rightIndex < rightArrayLength) {
            await this.delay(this.state.speed)
            this.setState({bars: array});
            if (leftArray[leftIndex] <= rightArray[rightIndex]){
                this.setActive("bar" + currentIndex);
                array[currentIndex] = leftArray[leftIndex++];
            } else {
                this.setActive("bar" + currentIndex);
                array[currentIndex] = rightArray[rightIndex++];
            }
            currentIndex++
        }
      
        while (leftIndex < leftArrayLength) { 
            await this.delay(this.state.speed)
            this.setState({bars: array});
            this.setActive("bar" + currentIndex);
            array[currentIndex++] = leftArray[leftIndex++];
        }
      
        while (rightIndex < rightArrayLength) { 
            await this.delay(this.state.speed)
            this.setState({bars: array});
            this.setActive("bar" + currentIndex)
            array[currentIndex++] = rightArray[rightIndex++];
        }

        
    }
    

    /* QUICKSORT */
    async quickSortStart(){
        if (!this.state.inProgess && !this.state.sorted){
            let { bars } = this.state;
            this.setState({
                sorted: false,
                inProgess: true,
            });
            await this.quickSort(bars, 0, bars.length - 1);
            this.setState({
                inProgess: false,
                sorted: true,
            });
        }
    }
    async quickSort(array, start, end){
        if (start < end){
            let index = await this.partition(array, start, end);
            await this.quickSort(array, start, index - 1);
            await this.quickSort(array, index + 1, end);
        }
    }
    async partition(array, start, end){
        const val = array[end];
        let index = start;
        for (let i = start; i < end; i++){
            await this.delay(this.state.speed);
            this.setState({bars: array});
            if (array[i] < val){
                this.setActive("bar" + i);
                this.setActive("bar" + index);
                this.swap(array, i, index);
                index++;
            }
        }
        this.swap(array, index, end);
        return index;
    }

    sort = () => {
        if (this.state.sort === "insertionsort") {
            this.insertionSort();
        } else if (this.state.sort === "mergesort") {
            this.mergeSortStart();
        } else if (this.state.sort === "quicksort") {
            this.quickSortStart();
        } else if (this.state.sort === "bubblesort") {
            this.bubbleSort();
        } else if (this.state.sort === "countingsort") {
            this.countingSort();
        }
    }
    handleDropdown = (event) => {
        this.setState({
            sort: event.target.value,
        });
        
    }
    toggleSettings = () => {
        this.setState({
            settings: !this.state.settings,
        });
    };

    /* COMPONENT RENDERING */
    render() {
        return (
            <div>
                <div className="menu-container">
                    { this.state.width > 767 ? 
                        <div className='settings-container'>
                            <DropDown sort={this.state.sort} handleDropdown={this.handleDropdown}/>
                            <p className="settings-label">Size</p>
                            <Slider className="settings-slider" onChange={(e, value) => this.handleSizeChange(e, value)} aria-labelledby="continuous-slider" defaultValue={50}></Slider>
                            
                            <p className="settings-label">Speed</p>
                            <Slider className="settings-slider" onChange={(e, value) => this.handleSpeedChange(e, value)} aria-labelledby="continuous-slider" defaultValue={50}></Slider>
                        </div> :
                        <div className='settings-container'>
                            <SettingsIcon onClick={this.toggleSettings}/>
                            <Modal
                                open={this.state.settings}
                                onClose={this.toggleSettings}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box className="settings-popup">
                                    <div>
                                        <p className="settings-label">Size</p>
                                        <Slider className="settings-slider" onChange={(e, value) => this.handleSizeChange(e, value)} aria-labelledby="continuous-slider" defaultValue={50}></Slider>
                                    </div>
                                    <div>
                                        <p className="settings-label">Speed</p>
                                        <Slider className="settings-slider" onChange={(e, value) => this.handleSpeedChange(e, value)} aria-labelledby="continuous-slider" defaultValue={50}></Slider>
                                    </div>
                                    <DropDown sort={this.state.sort} handleDropdown={this.handleDropdown}/>
                                    <Button className="settings-btn" onClick={this.toggleSettings}> Save </Button>
                                </Box>
                            </Modal>
                        </div>
                    }

                    <Button className="settings-btn start-btn" onClick={() => this.generateBars()}> New Array </Button>
                    <Button className="settings-btn" onClick={this.sort}> { !this.state.inProgess ? "Sort!" : "Sorting.."} </Button>
                    
                </div> 
                
                <div className="content-container">
                    {
                        this.state.bars.map((val, index) => {
                            return <div id={ "bar" + index } className={ this.state.sorted ? "bar-finished" : "bar" } style={{height: val + 'vh', width: 100 / (this.state.currentSize) + '%', margin: 100 / (10 * this.state.currentSize) + '%'}}  key={ index }></div>
                        })
                    }   
                </div>
            </div> 
        )
    }
}

export default SortingApp
