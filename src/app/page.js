'use client'

import { useEffect, useState } from 'react'
import './global.css'

export default function Home() {
  const boardSize = 3
  const initBoard = []
  for (let i = 0; i < boardSize; i++) {
    initBoard.push(Array(boardSize).fill(''))
  }
  const [board, setBoard] = useState(initBoard)

  const initCellClass = []
  for (let i = 0; i < boardSize; i++) {
    initCellClass.push(Array(boardSize).fill('normal-cell'))
  }
  const [cellClass, setCellClass] = useState(initCellClass)

  const [isGameOver, setIsGameOver] = useState(false)
  const [winner, setWinner] = useState(undefined)
  
  const numPlayers = 2
  const initPlayerNames = []
  for (let i = 0; i < numPlayers; i++) {
    initPlayerNames.push(`Player ${i + 1}`)
  }
  const [playerNames, setPlayerNames] = useState(initPlayerNames)
  const updatePlayerName = (index, name) => {
    const newNames = structuredClone(playerNames)
    newNames[index] = name
    setPlayerNames(newNames)
  }

  const [playerInTurn, setTurn] = useState(0)
  const upadateTurn = () => {
    setTurn((playerInTurn + 1) % numPlayers)
  }
  const symbol = {
    0: 'x',
    1: 'o',
    2: 'v'
  }

  const fillCell = (rowInd, colInd) => {
    if (isGameOver || board[rowInd][colInd] !== '') {
      return
    }

    const newBoard = structuredClone(board)
    newBoard[rowInd][colInd] = playerInTurn
    setBoard(newBoard)

    upadateTurn()
  }

  useEffect(() => {
    const winner = checkGameOver()
    if (winner !== undefined) {
      setIsGameOver(true)
      setWinner(winner)
    }
  }, [board])

  const WINNING_LINES = Object.freeze({
    ROW: Symbol("row"),
    COLUMN: Symbol("column"),
    TOP_LEFT_DIAGONAL: Symbol("top-left-diagonal"),
    TOP_RIGHT_DIAGONAL: Symbol("top-right-diagonal")
  });

  const resetGame = () => {
    setBoard(initBoard)
    setCellClass(initCellClass)
    setIsGameOver(false)
    setWinner(undefined)
    setTurn(0)
  }

  const checkGameOver = () => {
    // Check rows, columns, and diagonals for a win

    // Check cols
    for (let col = 0; col < boardSize; col++) {
      let initSym = board[0][col]
      if (initSym === '') {
        continue // Skip empty columns
      }
      for (let row = 1; row < boardSize; row++) {
        if (board[row][col] !== initSym) {
          break
        }
        if (row === (boardSize - 1)) {
          highlightWinningCells(WINNING_LINES.COLUMN, col)
          return initSym // Win found in column
        }
      }
    }

    // Check rows
    for (let row = 0; row < boardSize; row++) {
      let initSym = board[row][0]
      if (initSym === '') {
        continue // Skip empty rows
      }
      for (let col = 1; col < boardSize; col++) {
        if (board[row][col] !== initSym) {
          break
        }
        if (col === (boardSize - 1)) {
          highlightWinningCells(WINNING_LINES.ROW, row)
          return initSym // Win found in row
        }
      }
    }

    // Check diagonals

    // top-left to bottom-right diagonal
    let initSym = board[0][0]
    if (initSym !== '') {
      for (let row = 1; row < boardSize; row++) {
        if (board[row][row] !== initSym) {
          break
        }
        if (row === (boardSize - 1)) {
          highlightWinningCells(WINNING_LINES.TOP_LEFT_DIAGONAL, undefined)
          return initSym // Win found in diagonal
        }
      }
    }

    // top-right to bottom-left diagonal
    initSym = board[0][boardSize - 1]
    if (initSym !== '') {
      for (let row = 1; row < boardSize; row++) {
        if (board[row][boardSize - row - 1] !== initSym) {
          break
        }
        if (row === (boardSize - 1)) {
          highlightWinningCells(WINNING_LINES.TOP_RIGHT_DIAGONAL, undefined)
          return initSym // Win found in diagonal
        }
      }
    }

    // Check for a draw
    let emptyCellFound = false
    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        if (board[row][col] === '') {
          emptyCellFound = true // Game is still ongoing
          break
        }
      }
      if (emptyCellFound) {
        break
      }
    }
    if (!emptyCellFound) {
      return numPlayers // Game is a draw
    }
  }

  const highlightWinningCells = (line, ind) => {
    const newCellClass = structuredClone(initCellClass)
    // Highlight winning cells

    switch (line) {
      case WINNING_LINES.ROW:
        for (let col = 0; col < boardSize; col++) {
          newCellClass[ind][col] = 'highlighted-cell'
        }
        break;
      case WINNING_LINES.COLUMN:
        for (let row = 0; row < boardSize; row++) {
          newCellClass[row][ind] = 'highlighted-cell'
        }
        break;
      case WINNING_LINES.TOP_LEFT_DIAGONAL:
        for (let i = 0; i < boardSize; i++) {
          newCellClass[i][i] = 'highlighted-cell'
        }
        break;
      case WINNING_LINES.TOP_RIGHT_DIAGONAL:
        for (let i = 0; i < boardSize; i++) {
          newCellClass[i][boardSize - i - 1] = 'highlighted-cell'
        }
        break;
      default:
        console.error('Invalid winning line type');
        return;
    }
    setCellClass(newCellClass);
  }

  return (
    <div>
      <h1>Tic Tac Toe</h1>

      <table>
        <tbody>
          {
            board.map((row, rowInd) => {
              return <tr key={rowInd}>
                {
                  row.map((cell, colInd) => {
                    return <td key={colInd}>
                      <button
                        onClick={() => fillCell(rowInd, colInd)}
                        className={cellClass[rowInd][colInd]}
                        id="cell-button"
                      >
                        {symbol[cell]}
                      </button>
                    </td>
                  })
                }
              </tr>
            })
          }
        </tbody>
      </table>

      {
        !isGameOver && playerNames[playerInTurn] !== '' && <h3>{playerNames[playerInTurn]}'s turn</h3>
      }

      <div>
        <h2>Enter player names</h2>
        {
          playerNames.map((_, i) => {
            return <div key={i}>
              <div className='player-name-input'>
                <label>Player {i + 1} ({symbol[i]}):</label>
                <input
                  type="text"
                  value={playerNames[i]}
                  onChange={(e) => updatePlayerName(i, e.target.value)}
                />
              </div>
              <br />
            </div>

          })
        }
      </div>

      {
        isGameOver && (winner < numPlayers) && <h1>{playerNames[winner]} won!</h1>
      }

      {
        isGameOver && (winner === numPlayers) && <h1>It's a draw!</h1>
      }

      <button onClick={resetGame} id='rematch-button'>Rematch</button>

    </div>
  )
}
