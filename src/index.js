import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';


   
    function Square(props) {
      return (
        <button className="square" onClick={props.onClick} style={{fontWeight: `${props.hl}`}}>
          {props.value}
        </button>
      );
    }
  
  
  class Board extends React.Component {
    

    renderSquare(i) {
      const high= (i===this.props.list[0]||i===this.props.list[1]||i===this.props.list[2])?'bold':'normal'
      return (<Square hl={high} value={this.props.squares[i]} onClick={()=>this.props.onClick(i)} />);
    }
  
    render() {
      const num1=[0,3,6];

      const rept=num1.map((ele1)=>{
        const kept=num1.map((ele,index)=>{
          return this.renderSquare(index+ele1);
        })
        return(
          <div className="board-row">
            {kept}
          </div>
        )
      })
      return (
        <div className='board-total'>
          {rept}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
        super(props)
        this.state={
          history:[
            { 
              squares : Array(9).fill(null),
              row : 0,
              col : 0,
            }
          ],
          stepNumber: 0,
          xIsNext: true,
        }
    }
    handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber+1)
      const current = history[history.length-1]
      const squares = current.squares.slice()
      const row=Math.floor(i/3)
      const col=(i%3)
      const lines=calculateWinner(squares)
      if(lines[3]||squares[i]){
        return
      }
      squares[i]=this.state.xIsNext?'X':'O'
      this.setState({
        history: history.concat([{
          squares: squares,
          row: row,
          col: col,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      })
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext : (step%2)===0
    })
  }
    render() {
      const history = this.state.history
      const current = history[this.state.stepNumber]
      const winner = calculateWinner(current.squares)

      const moves = history.map((step,move)=>{
        const desc = move? 'Go to move # ' + move + ` | pos: (${step.row},${step.col})` : 'Go to game start'
        const fw=(this.state.stepNumber===move)?'bold':'normal'
        return(
          <li key={move}>
            <button className='move-button' style={{fontWeight: `${fw}`}}
              onClick={()=> this.jumpTo(move)}>{desc}</button>
          </li>
        )
      })
      let status;
      if(winner[3]){
        status='Winner: '+winner[3]
      }else if(this.state.stepNumber<9){
        status = 'Next player: '+ (this.state.xIsNext?'X':'O')
      }else{
        status= 'Draw!'
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              onClick={(i)=> this.handleClick(i)} list={winner}/>
          </div>
          <div className="game-info">
            <div className='status-game'>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2, 0],
      [3, 4, 5, 0],
      [6, 7, 8, 0],
      [0, 3, 6, 0],
      [1, 4, 7, 0],
      [2, 5, 8, 0],
      [0, 4, 8, 0],
      [2, 4, 6, 0],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        lines[i][3]=squares[a]
        return lines[i];
      }
    }
    lines[0]=[-1,-1,-1,0]
    return lines[0];
  }
  