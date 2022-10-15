import React, {useState, useEffect} from 'react';
import './PathfindingVisualizer.css';
import {Astar, AstarGetNodesInShortestPathOrder} from '../algorithms/Astar';
import {greedy, greedyGetNodesInShortestPathOrder} from '../algorithms/greedy';
import {dfs, dfsGetNodesInShortestPathOrder} from '../algorithms/dfs';
import {bfs, bfsGetNodesInShortestPathOrder} from '../algorithms/bfs';



export const PathfindingVisualizer = () => {
    
    const [grid, setGrid] = useState([])
    const [mouseIsPressed, setMouseIsPressed] = useState(false)
    const [haveStart, setHaveStart] = useState(false)
    const [haveFinish, setHaveFinish] = useState(false)
    const [startPos, setStartPos] = useState({})
    const [finishPos, setFinishPos] = useState({})
    const [selectedAlgo, setSelectedAlgo] = useState("Astar")
    const [searched, setSearched] = useState(0)
    const [path, setPath] = useState(0)
    const [walls, setWalls] = useState(0)
    

        useEffect(() => {
        const grid = getInitialGrid();
        setGrid(grid);
      }, [])
    
      function handleMouseDown(row, col) {

        

        if (!haveStart) {
          const newGrid = setStart(grid, row, col);
          setHaveStart(true);
          setGrid(newGrid)
          setStartPos({r:row, c:col})
          
      } 
      
      if (!haveFinish && haveStart) {
          const newGrid = setFinish(grid, row, col);
          setHaveFinish(true);
          setGrid(newGrid)
          setFinishPos({r:row, c:col})
          
      } 

       

        if (haveStart && haveFinish && !grid[row][col].isStart && !grid[row][col].isFinish) {
            const newGrid = getNewGridWithWallToggled(grid, row, col);
            setGrid(newGrid)
            setMouseIsPressed(true)
        }
        
      }
    
      function handleMouseEnter(row, col) {
        if (!mouseIsPressed) return;
        const newGrid = getNewGridWithWallToggled(grid, row, col);
        setGrid(newGrid);
      }
    
      function handleMouseUp() {
        setMouseIsPressed(false);
      }
    
      function animate(visitedNodesInOrder, nodesInShortestPathOrder) {

       

        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            if (!node.isFinish && !node.isStart) {
            document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
            }
          }, 10 * i);
        }
      }
    
      function animateShortestPath(nodesInShortestPathOrder) {

        

        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];

            if (!node.isFinish && !node.isStart) {
              document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
            }
            
          }, 50 * i);
        }

        if (nodesInShortestPathOrder.length <= 1 ) {
          window.alert("مسیر پیدا نشد")
        }
        
      }
    
      function visualize() {

        if (!haveFinish || !haveStart) {
          window.alert("لطفا نقطه شروع و هدف را تعیین کنید")
        }

        const nodes = document.getElementsByClassName("node")

        if (window.innerWidth <= 1000) {
        const rows = document.getElementsByClassName("row")
        for (const row of rows) { 

          const cssObj = window.getComputedStyle(row, null);
          let display = cssObj.getPropertyValue("display");

          if (display === "none") {
            const num = row.getAttribute('id').match(/\d+/)[0]
              
            for (const n of grid[num]) { 
              
                  n.isWall = true;
            } 

          }

        } 
      }
      if (window.innerWidth <= 1000) {
        const nodes = document.getElementsByClassName("node")
        for (const node of nodes) { 

          const cssObj = window.getComputedStyle(node, null);
          let display = cssObj.getPropertyValue("display");

          if (display === "none") {
          
            const row = node.getAttribute('id').match(/\d+/g).map(Number)[0]
            const col = node.getAttribute('id').match(/\d+/g).map(Number)[1]
            
            
            grid[row][col].isWall = true;
            

          }

        } 
      }
        for (const node of nodes) {
            const c = node.className

            if (c !== "node node-wall") {
              node.className = "node"
            }
            
        }
        
        for (const row of grid) {
          for (const node of row) {
            node.isVisited = false;
            node.distance = Infinity;
            node.fn_score = Infinity;
            node.hn_score = Infinity;
            
          }
        }
        
        const startNode = grid[startPos.r][startPos.c];
        const finishNode = grid[finishPos.r][finishPos.c];

        startNode.distance = 0;
        startNode.fn_score = 0;
       

        document.getElementById(`node-${startPos.r}-${startPos.c}`).className = 'node node-start';
        document.getElementById(`node-${finishPos.r}-${finishPos.c}`).className = 'node node-finish';

        if (selectedAlgo === "Astar") {
          const visitedNodesInOrder = Astar(grid, startNode, finishNode);
          const nodesInShortestPathOrder = AstarGetNodesInShortestPathOrder(finishNode);
          setPath(nodesInShortestPathOrder.length)
          setSearched(visitedNodesInOrder.length)
          animate(visitedNodesInOrder, nodesInShortestPathOrder);
        }

        if (selectedAlgo === "BFS") {
          const visitedNodesInOrder = bfs(grid, startNode, finishNode);
          const nodesInShortestPathOrder = bfsGetNodesInShortestPathOrder(finishNode);
          setPath(nodesInShortestPathOrder.length)
          setSearched(visitedNodesInOrder.length)
          animate(visitedNodesInOrder, nodesInShortestPathOrder);
        }

        if (selectedAlgo === "DFS") {
          const visitedNodesInOrder = dfs(grid, startNode, finishNode);
          const nodesInShortestPathOrder = dfsGetNodesInShortestPathOrder(finishNode);
          setPath(nodesInShortestPathOrder.length)
          setSearched(visitedNodesInOrder.length)
          animate(visitedNodesInOrder, nodesInShortestPathOrder);
        }

        if (selectedAlgo === "Greedy") {
          const visitedNodesInOrder = greedy(grid, startNode, finishNode);
          const nodesInShortestPathOrder = greedyGetNodesInShortestPathOrder(finishNode);

          setPath(nodesInShortestPathOrder.length)
          setSearched(visitedNodesInOrder.length)
          animate(visitedNodesInOrder, nodesInShortestPathOrder);
        }

        if (selectedAlgo === "all") {
          

          const greedyVisitedNodesInOrder = greedy(grid, startNode, finishNode);
          const greedyNodesInShortestPathOrder = greedyGetNodesInShortestPathOrder(finishNode);


          animateShortestPath(greedyNodesInShortestPathOrder)
          tempReset(grid)

          const dfsVisitedNodesInOrder = dfs(grid, startNode, finishNode);
          const dfsNodesInShortestPathOrder = dfsGetNodesInShortestPathOrder(finishNode);

          animateShortestPath(dfsNodesInShortestPathOrder)
          tempReset(grid)

          const bfsVisitedNodesInOrder = bfs(grid, startNode, finishNode);
          const bfsNodesInShortestPathOrder = bfsGetNodesInShortestPathOrder(finishNode);

          animateShortestPath(bfsNodesInShortestPathOrder)
          tempReset(grid)

          const AstarVisitedNodesInOrder = Astar(grid, startNode, finishNode);
          const AstarNodesInShortestPathOrder = AstarGetNodesInShortestPathOrder(finishNode);

          

          animateShortestPath(AstarNodesInShortestPathOrder)
          tempReset(grid)
        }
        
        
        
 
      }
    
    
    function reset() {
        const grid = getInitialGrid();

        setGrid(grid)
        setHaveStart(false)
        setHaveFinish(false)
        setWalls(0)
        setPath(0)
        setSearched(0)
        const nodes = document.getElementsByClassName("node")
        for (const node of nodes) {
            node.className = "node"
        }

      }

      function tempReset(grid) {
        
        for (const r of grid){
          for (const n of r) {
            if (n.isVisited) {
              n.isVisited = false
              if (!n.isStart){
                n.distance = Infinity
                
              }
              n.fn_score = Infinity
              n.hn_score = Infinity
            }
          }
        }

        setGrid(grid)
        setPath(0)
        setSearched(0)
        const nodes = document.getElementsByClassName("node-visited")
        for (const node of nodes) {
            node.className = "node"
        }

      }


      const getInitialGrid = () => {
        const grid = [];
        for (let row = 0; row < 20; row++) {
          const currentRow = [];
          for (let col = 0; col < 50; col++) {
            currentRow.push(createNode(col, row));
          }
          grid.push(currentRow);
        }
        return grid;
      };
      
      const createNode = (col, row) => {
        return {
          col,
          row,
          isStart: row === startPos.r && col === startPos.c,
          isFinish: row === finishPos.r && col === finishPos.c,
          distance: Infinity,
          fn_score: Infinity,
          hn_score: Infinity,
          isVisited: false,
          isWall: false,
          previousNode: null,
        };
      };
      
      const setStart = (grid, row, col) => {
          const newGrid = grid.slice();
          const node = newGrid[row][col];
      
          
            const newNode = {
                ...node,
                isStart: !node.isStart,
                
            };
            newGrid[row][col] = newNode;
            return newGrid;
           
          
      };
      
      
      const setFinish = (grid, row, col) => {
          const newGrid = grid.slice();
          const node = newGrid[row][col];
          
              const newNode = {
                  ...node,
                  isFinish: !node.isFinish,
                };
                newGrid[row][col] = newNode;
                return newGrid;
          
      };
      
      
      const getNewGridWithWallToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
          ...node,
          isWall: !node.isWall,
        };
        newGrid[row][col] = newNode;
        setWalls(newNode.isWall ? walls + 1 : walls - 1)
        return newGrid;
      };

      

  return (
    <>

        <nav>
            <div className="right"><ul>
                    <li>
                      <select onChange={(e)=> setSelectedAlgo(e.target.value)}>
                        <option value="Astar">انتخاب الگوریتم ( کلیک کنید ) </option>
                        <option value="Astar">Astar Search Algorithm</option>
                        <option value="BFS">breadth First Search Algorithm</option>
                        <option value="DFS">Depth First Search Algorithm</option>
                        <option value="Greedy">Greedy Search Algorithm</option>
                        <option value="all">اجرای همه ی الگوریتم ها باهم</option>
                      </select>
                    </li>
                </ul></div>
            <div className="center">
                <ul>
                    <li><button className="start-algorithm" onClick={() => visualize()}>اجرای الگوریتم <b style={{"color":"red"}}>{selectedAlgo}</b></button></li>
                    <li><button className="reset" onClick={() => reset()}>پاک کردن صفحه</button></li>
                </ul>
            </div>
            <div className="left"><ul>
                    <li>تصویر ساز الگوریتم</li>
                </ul></div>
        </nav>
        
        <div className="guid-nav">
            
            <ul>
                    <li id="guid-1"><div className="wall"></div> مانع</li>
                    <li id="guid-2"><div className="path"></div> مسیر  پیدا شده</li>
                    <li id="guid-3"><div className="searched"></div> جستجو شده</li>
                    <li id="guid-4"><div className="goal"></div>  هدف</li>
                    <li id="guid-5"> <div className="start"></div>  نقطه شروع</li>
            </ul>
        </div>

        <div className="count">
          <h4>دیوار ها : {walls}</h4>
          <h4>جستجو شده : {searched}</h4>
          <h4>کوتاه ترین مسیر : {path}</h4>

        </div>

        <div className="pick-algorithm">
            <select onChange={(e)=> setSelectedAlgo(e.target.value)}>
                <option value="Astar">انتخاب الگوریتم ( کلیک کنید ) </option>
                <option value="Astar">Astar Search Algorithm</option>
                <option value="BFS">breadth First Search Algorithm</option>
                <option value="DFS">Depth First Search Algorithm</option>
                <option value="Greedy">Greedy Search Algorithm</option>
                <option value="all">اجرای همه ی الگوریتم ها باهم</option>
            </select>
        </div>
            
        <div className="container">
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} id={"row-" + rowIdx} className="row">
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  const extraClassName = isFinish
                    ? 'node-finish'
                    : isStart
                    ? 'node-start'
                    : isWall
                    ? 'node-wall'
                    : '';
                  return (
                    <div
                        key={nodeIdx}
                        id={`node-${row}-${col}`}
                        className={`node ${extraClassName}`}
                        onMouseDown={() => handleMouseDown(row, col)}
                        onMouseEnter={() => handleMouseEnter(row, col)}
                        onMouseUp={() => handleMouseUp()}>

                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        </div>
      </>
  )
}
