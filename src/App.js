import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/matchers';
import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displaystate: "0",
      formulastate: "",
    }
    this.handleClick = this.handleClick.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleZero = this.handleZero.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
  }

  componentDidMount () {
    document.addEventListener("click", this.handleClick);
  }
  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick);
  }

  handleClear() {
    this.setState ({
      displaystate: "0",
      formulastate: "",
      result: false,
    })
  }

  handleNumbers(btn) {
    const operators = /(\+|\-|X|\/)/;
    if ((this.state.displaystate === "0" 
        && (this.state.formulastate === "" || this.state.formulastate === "0")) || this.state.displaystate === "NAN" || this.state.result){
      this.setState({
        displaystate: btn.target.innerHTML,
        formulastate: btn.target.innerHTML,
        result: false
      })
    } else if (this.state.displaystate === "0" 
      && (this.state.formulastate[this.state.formulastate.length-1] === "0")){
        this.setState({
          displaystate: btn.target.innerHTML,
          formulastate: this.state.formulastate.substring(0, this.state.formulastate.length-1) + btn.target.innerHTML
        })
      } else if(operators.test(this.state.displaystate)) {
        this.setState({
          displaystate: btn.target.innerHTML,
          formulastate: this.state.formulastate + btn.target.innerHTML
        })
      } else {
        this.setState({
          displaystate: this.state.displaystate + btn.target.innerHTML,
          formulastate: this.state.formulastate + btn.target.innerHTML
        })
      }
    }
  

  handleZero() {
    const operators = /(\+|\-|X|\/)/;
    if (this.state.displaystate !== "0"
       && !operators.test(this.state.displaystate) && !this.state.result){
      this.setState({
        displaystate: this.state.displaystate + "0",
        formulastate: this.state.formulastate + "0"
      })
    } else if (this.state.displaystate === "0" 
              && (this.state.formulastate === "" 
              || this.state.formulastate[this.state.formulastate.length-1]!=="0") && !this.state.result){
                this.setState({
                  formulastate: this.state.formulastate + "0"
                })
   }
      else if (operators.test(this.state.displaystate)){
        this.setState({
          displaystate: "0",
          formulastate: this.state.formulastate + "0",
          result: false
        })
      } else if (this.state.result){
        this.setState({
          displaystate: "0",
          formulastate: "0",
          result: false
        })
      }
  }

  handleOperators(btn) {
    const operators = /(\+|\-|X|\/)/;
    const numberswithzero = /[0-9]/;
    if (this.state.formulastate !== "" 
        && numberswithzero.test(this.state.formulastate[this.state.formulastate.length-1]) && !this.state.result){
        this.setState({
          formulastate: this.state.formulastate + btn.target.innerHTML,
          displaystate: btn.target.innerHTML
        })
      } else if (operators.test(this.state.formulastate[this.state.formulastate.length-2])
                && operators.test(this.state.formulastate[this.state.formulastate.length-1]) && !this.state.result) {
                  this.setState({
                    formulastate: this.state.formulastate.substring(0, this.state.formulastate.length-2) + btn.target.innerHTML,
                    displaystate: btn.target.innerHTML
                  })
      } else if (numberswithzero.test(this.state.formulastate[this.state.formulastate.length-2])
                && operators.test(this.state.formulastate[this.state.formulastate.length-1])
                && btn.target.innerHTML == "-" && !this.state.result){
                  this.setState({
                    formulastate: this.state.formulastate + btn.target.innerHTML,
                    displaystate: btn.target.innerHTML
                  })
      } else if (numberswithzero.test(this.state.formulastate[this.state.formulastate.length-2])
                  && operators.test(this.state.formulastate[this.state.formulastate.length-1])
                  && btn.target.innerHTML != "-" && !this.state.result){
                    this.setState({
                      formulastate: this.state.formulastate.substring(0, this.state.formulastate.length-1) + btn.target.innerHTML,
                      displaystate: btn.target.innerHTML
                    })
      } else if (this.state.result){
        this.setState({
          formulastate: this.state.displaystate + btn.target.innerHTML,
          displaystate: btn.target.innerHTML,
          result: false
        })
      }
  }

  handleDecimal() {
    const dec = /\./g;
    if (!dec.test(this.state.displaystate) && this.state.formulastate !=="" && !this.state.result){
      this.setState ({
        displaystate: this.state.displaystate + ".",
        formulastate: this.state.formulastate + "."
      })
    } else if(!dec.test(this.state.displaystate) && this.state.formulastate == "" && !this.state.result){
      this.setState ({
        displaystate: this.state.displaystate + ".",
        formulastate: this.state.formulastate + "0."
      })
    } else if(this.state.result){
      this.setState ({
        displaystate: "0.",
        formulastate: "0.",
        result: false
      })
    }
  }

  handleEquals() {
    let formula = this.state.formulastate;
    let formulaarr = [];
    let numbersarr = [];
    let operatorsarr = [];
    const operators = /(\+|\-|X|\/)/;
    if (formula === ""){
      this.setState ({
        displaystate: "NAN",
        formulastate: "=NAN",
        result: true
      })
    } else if (!operators.test(formula)){
      this.setState({
        displaystate: formula,
        formulastate: this.state.formulastate + "=" + formula,
        result: true
      })
    } else if (!operators.test(formula[formula.length-1])){
        formulaarr = formula.split(operators);
        for (let i = 0; i<formulaarr.length; i++){
          if (formulaarr[i] == ""){
            formulaarr[i] = formulaarr[i+1] + formulaarr[i+2];
            let arr1 = formulaarr.slice(0, i+1);
            let arr2 = formulaarr.slice(i+3);
            formulaarr = arr1.concat(arr2);
          }
        }
        for (let i = 0; i<formulaarr.length; i++){
          let value = 0;
          if (formulaarr[i]==="X" || formulaarr[i]==="/"){
            let arr1 = formulaarr.slice(0, i-1);
            let arr2 = formulaarr.slice(i+2);
            if(formulaarr[i]==="X"){
              value = parseFloat(formulaarr[i-1]) * parseFloat(formulaarr[i+1]);
              arr1.push(value);
              formulaarr = arr1.concat(arr2);
            } else {
              value = parseFloat(formulaarr[i-1]) / parseFloat(formulaarr[i+1]);
              arr1.push(value);
              formulaarr = arr1.concat(arr2);
            }
            i = i-1;
          }
        }
        for (let i = 0; i<formulaarr.length; i++){
          let value = 0;
          if (formulaarr[i]==="+" || formulaarr[i]==="-"){
            let arr1 = formulaarr.slice(0, i-1);
            let arr2 = formulaarr.slice(i+2);
            if(formulaarr[i]==="+"){
              value = parseFloat(formulaarr[i-1]) + parseFloat(formulaarr[i+1]);
              arr1.push(value);
              formulaarr = arr1.concat(arr2);
            } else {
              value = parseFloat(formulaarr[i-1]) - parseFloat(formulaarr[i+1]);
              arr1.push(value);
              formulaarr = arr1.concat(arr2);
            }
            i = i-1;
          }
        }
      this.setState({
        displaystate: Math.round(formulaarr[0]*10000)/10000,
        formulastate: this.state.formulastate + "=" + Math.round(formulaarr[0]*10000)/10000,
        result: true
      })
    } 

  }

  handleClick(e) { 
    const acstring = "AC";
    const equalstring = "=";
    const operators = /(\+|\-|X|\/)/;
    const zero = "0";
    const numbers = /[1-9]/;
    const dec = ".";
    if (e.target.matches("button")){
      if (e.target.innerHTML === acstring){
        this.handleClear();
      } else if (numbers.test(e.target.innerHTML)){
        this.handleNumbers(e);
      } else if (e.target.innerHTML === zero){
        this.handleZero();
      } else if (operators.test(e.target.innerHTML)){
        this.handleOperators(e);
      } else if (e.target.innerHTML === dec){
        this.handleDecimal();
      } else if (e.target.innerHTML === equalstring){
        this.handleEquals();
      }
    }
  }

  render() {

    return (
      <div id="calc">
      <div id="formuladisplay">{this.state.formulastate}</div>
      <div id="display">{this.state.displaystate}</div>
      <Buttons />
      </div>
    )
  }
}

class Buttons extends React.Component {
  render () {
    return (
      <div id="buttons">
      <button id="clear" className="btn">AC</button>
      <button id="divide" className="btn">/</button>
      <button id="multiply" className="btn">X</button>
      
      <button id="nine" className="btn">9</button>
      <button id="eight" className="btn">8</button>
      <button id="seven" className="btn">7</button>
      <button id="add" className="btn">+</button>

      <button id="six" className="btn">6</button>
      <button id="five" className="btn">5</button>
      <button id="four" className="btn">4</button>
      <button id="subtract" className="btn">-</button>

      <button id="three" className="btn">3</button>
      <button id="two" className="btn">2</button>
      <button id="one" className="btn">1</button>
      
      <button id="zero" className="btn">0</button>
      <button id="decimal" className="btn">.</button>
      <button id="equals" className="btn">=</button>
      </div>
      )
  }
}


export default App;


