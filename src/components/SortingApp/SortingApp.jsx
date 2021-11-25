import React, { Component } from 'react'
import { Button, Slider } from '@material-ui/core';

export class SortingApp extends Component {
    state = {
        currentSize: 100,
        size: 100,
        speed: 3,
        bars: [],
        inProgess: false,
        sorted: false
    }

    
    
    componentDidMount(){
        this.generateBars();
    }

    /* GENERAL */
    generateBars() {
        if (!this.state.inProgess){
            const size = this.state.size;
            let bars = [size];
            for (let i = 0; i < size; i++){
                bars[i] = this.getRandomValue(3, 100);
            }
            this.setState({
                bars: bars,
                inProgess: false,
                sorted: false,
                currentSize: size
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
        value = Number(value) * 2 + 20;
        this.setState({
            size: value 
        });
    }

    handleSpeedChange(e, value) {
        value = 100 - Number(value);
        this.setState({
            speed: value
        });
    }

    setActive(barId) {

        let elem = document.getElementById(barId);
        elem.classList.add("bar-active")
        setTimeout(function(){
            elem.classList.remove("bar-active")
        }, 20);
    }


    /* INSERTION SORT */
    async insertionSort() {
        if (!this.state.inProgess && !this.state.sorted){
            this.setState({inProgess: true})
            let { bars } = this.state;

            for (let i = 1; i < bars.length; i++){
                let j = i;
                while (j > 0 && bars[j - 1] > bars[j]) {                
                    await this.delay(this.state.speed)
                    this.setActive("bar" + j)
                    this.setActive("bar" + (j - 1))
                    this.swap(bars, j, j-1);
                    j--;
                    this.setState(bars);
                }
            }
            this.setState({inProgess: false, sorted: true})
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
          
        let leftIndex = 0, rightIndex = 0
      
        let currentIndex = start;

        while (leftIndex < leftArrayLength && rightIndex < rightArrayLength) {
            await this.delay(this.state.speed)
            this.setState({bars: array});
            if (leftArray[leftIndex] <= rightArray[rightIndex]){
                this.setActive("bar" + currentIndex)
                array[currentIndex] = leftArray[leftIndex++]
            } else {
                this.setActive("bar" + currentIndex)
                array[currentIndex] = rightArray[rightIndex++]
            }
            currentIndex++
        }
      
        while (leftIndex < leftArrayLength) { 
            await this.delay(this.state.speed)
            this.setState({bars: array});
            this.setActive("bar" + currentIndex)
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
            let { bars } = this.state
            this.setState({
                sorted: false,
                inProgess: true
            })
            await this.quickSort(bars, 0, bars.length - 1);
            this.setState({
                inProgess: false,
                sorted: true
            })
        }
    }
    async quickSort(array, start, end){
        if (start < end){
            let index = await this.partition(array, start, end);
            await this.quickSort(array, start, index - 1)
            await this.quickSort(array, index + 1, end)
        }
    }
    async partition(array, start, end){
        const val = array[end];
        let index = start;
        for (let i = start; i < end; i++){
            await this.delay(this.state.speed)
            this.setState({bars: array});
            if (array[i] < val){
                this.setActive("bar" + i)
                this.setActive("bar" + index)
                this.swap(array, i, index)
                index++;
            }
        }
        this.swap(array, index, end);
        return index;
    }
   

    /* COMPONENT RENDERING */
    render() {
        return (
            <div>
                <div className="settings-container">
                    <p className="settings-label">Size</p>
                    <Slider className="settings-slider" onChange={(e, value) => this.handleSizeChange(e, value)} aria-labelledby="continuous-slider" defaultValue={50}></Slider>
                    <Button className="settings-btn start-btn" onClick={() => this.generateBars()}> New Array </Button>
                    <p className="settings-label">Speed</p>
                    <Slider className="settings-slider" onChange={(e, value) => this.handleSpeedChange(e, value)} aria-labelledby="continuous-slider" defaultValue={50}></Slider>
                    <Button className="settings-btn" onClick={() => this.insertionSort()}> Insertion Sort </Button>
                    <Button className="settings-btn" onClick={() => this.mergeSortStart()}> Merge Sort </Button>
                    <Button className="settings-btn" onClick={() => this.quickSortStart()}> Quick Sort </Button>
                </div> 
                
                <div className="content-container">
                    {
                        this.state.bars.map((val, index) => {
                            return <div id={ "bar" + index } className={ this.state.sorted ? "bar-finished" : "bar" } style={{height: val + '%', width: 100 / (this.state.currentSize) + '%', margin: 100 / (10 * this.state.currentSize) + '%'}}  key={ index }></div>
                        })
                    }   
                </div>
            </div> 
        )
    }
}

export default SortingApp
