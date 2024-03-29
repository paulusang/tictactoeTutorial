import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button className={"square "+(props.anyWinner?"squareWinner":null)} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                anyWinner={this.props.winningSquares.includes(i)}
                key={"square "+i}
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }
    createDiv =() => {
        let div=[]
        for (let i=0;i<3;i++) {
            let squares=[]
            for (let j=0;j<3;j++){
                squares.push(
                    this.renderSquare(i*3+j)
                    )
            }
            div.push(<div>{squares}</div>)
        }
        return div
     }

    render() {
        return (
            <div>
                {this.createDiv()}
            </div>
        );
    }
}
class Game  extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            history: [{
                squares: Array(9).fill(null)
            }],
            locations: Array(9).fill(null),
            stepNumber: 0,
            xIsNext: true,
            isDescending: true,
            anyWinner: null,
            allFilled: null,
         };
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            allFilled: (step < 9)?false:true,
        });
    }
    handleClick(i){
        const history=this.state.history.slice(0, this.state.stepNumber + 1);
        const current=history[history.length-1];
        const squares = current.squares.slice();
        const locs = this.state.locations;
        const winner = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        locs[this.state.stepNumber]=i;
        this.setState({
            history: history.concat([{
            squares: squares
        }]),
        locations: locs,
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        anyWinner: calculateWinner(squares),
        allFilled: checkIfSquaresFilled(squares),
    });
    }
    sortHistory() {
        this.setState({
            isDescending: !this.state.isDescending
        });
    }

    render() {
        const history=this.state.history;
        const current=history[this.state.stepNumber];
        const winner=calculateWinner(current.squares);
         
        const moves = history.map((step,move) => {
            const desc = move ?
              'Go to move #' +move+ '. Location:'+calculateLocation(this.state.locations[move-1]) :
              'Go to game start';
            
              return (
                  <li key={move} id={move}>
                      <button onClick={() => this.jumpTo(move)}>
                      {move === this.state.stepNumber?<b>{desc}</b>:desc}
                      </button>
                  </li>
              );
        });

        let status;
        if (winner) {
            status='Winner: ' + winner.player;
        } else {
            if (this.state.allFilled) {
                status='Game Over! Draw';
            } else {
                status='Next player: ' + (this.state.xIsNext ? 'X':'O');
            }
        }

        return (
            <div className='game'>
                <div className="game-board">
                    <Board 
                        winningSquares={winner?winner.line:[]}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{this.state.isDescending?moves:moves.reverse()}</ol>
                    <button onClick={()=>this.sortHistory()}>
                        Sort by: {this.state.isDescending?"Descending" : "Ascending"}
                    </button>
                </div>
            </div>
        )
    }
}
function checkIfSquaresFilled(squares) {
    let allFilled = true;
    for (let i=0;i<squares.length;i++) {
        if (!squares[i]) {
            allFilled=false;
            i=squares.length;
        }
    }
    return allFilled;
}
function calculateLocation(squareIndex) {
    const col=(squareIndex % 3) + 1;
    const row=Math.floor(squareIndex/3)+1;
    return ('('+col+','+row+')') 
}
function calculateWinner(squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for (let i=0; i<lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {player:squares[a], line: [a,b,c]};
        }
    }
    return null;
}
// =========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
)