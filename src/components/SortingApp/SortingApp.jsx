import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Form, FormGroup, Label, Button, CustomInput } from 'reactstrap';

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

    handleSizeChange(e) {
        const { target } = e;
        const { name } = target
        const value = Number(target.value) * 2 + 10;
        console.log(value);
        this.setState({
            [ name ]: value
        });
    }
    handleSpeedChange(e) {
        const { target } = e;
        const { name } = target
        const value = 100 - Number(target.value);
        console.log(value)
        this.setState({
            [ name ]: value
        });
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
                    var swap = bars[j];
                    bars[j] = bars[j - 1];
                    bars[j - 1] = swap;
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
                array[currentIndex] = leftArray[leftIndex++]
            } else {
                array[currentIndex] = rightArray[rightIndex++]
            }
            currentIndex++
        }
      
        while (leftIndex < leftArrayLength) { 
            await this.delay(this.state.speed)
            this.setState({bars: array});
            array[currentIndex++] = leftArray[leftIndex++];
        }
      
        while (rightIndex < rightArrayLength) { 
            await this.delay(this.state.speed)
            this.setState({bars: array});
            array[currentIndex++] = rightArray[rightIndex++];
        }

        
    }


    /* QUICKSORT */
    async quickSortStart(){
        let { bars } = this.state
        await this.quickSort(bars, 0, bars.length - 1);
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
                    <Form className="settings-form" onSubmit={ (e) => this.submitForm(e) } >
                        <FormGroup>
                            <Label for="sizeSlider">Size</Label>
                            <CustomInput style={{color: '#f1f1f1'}} type="range" id="sizeSlider" className="settings-slider" name="size" onChange={ (e) => this.handleSizeChange(e) }/>
                        </FormGroup>
                        <Button className="settings-btn start-btn">New Array</Button>
                        <FormGroup>
                            <Label for="speedSlider">Speed</Label>
                            <CustomInput type="range" id="speedSlider" className="settings-slider" name="speed" onChange={ (e) => this.handleSpeedChange(e) }/>
                        </FormGroup>
                    </Form>
                    <Button className="settings-btn" onClick={() => this.insertionSort()}> Insertion Sort </Button>
                    <Button className="settings-btn" onClick={() => this.mergeSortStart()}> Merge Sort </Button>
                    <Button className="settings-btn" onClick={() => this.quickSortStart()}> Quick Sort </Button>
                </div> 
                
                <div className="content-container">
                    {
                        this.state.bars.map((val, index) => {
                            return <div className="bar" style={{height: val + '%', width: 100 / (this.state.currentSize) + '%', margin: 100 / (10 * this.state.currentSize) + '%'}}  key={ index }></div>
                        })
                    }   
                </div>
            </div> 
 
        )
    }
}

export default SortingApp
