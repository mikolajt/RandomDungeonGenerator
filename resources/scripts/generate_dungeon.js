import { triangle, edge, vertex, triangulate } from './triangulation.js';

let canvas = document.getElementById("dungeon-canvas"),
    ctx = canvas.getContext("2d"),
    cells = [],
    cell_id_counter = 0,
    triangles = [],
    graph = [],
    edges = [];
const radius = canvas.width/4;
const number_of_cells = 50;
const max_cell_size = 100;
const min_cell_size = 50;

function Cell(x, y, width, height) {
    this.cell_id = -1;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isRoom = false;

    this.generateId = () => {
        if(this.isRoom == true) {
            this.cell_id = cell_id_counter++;
        }
    }
}

generateCells();
separateCells();
chooseRooms(1.5);
createTriangles();
edges = getEdges();
graph = minSpanningTree();
additionalEdges(0.1);
draw();

function draw() {
    function drawGrid(grid_size) {
        ctx.strokeStyle = "grey";
        for(let i=0; i<=grid_size; i++) {
        ctx.moveTo(0, canvas.width/grid_size*i);
        ctx.lineTo(canvas.width, canvas.width/grid_size * i);
        ctx.stroke();
    
        ctx.moveTo(canvas.height / grid_size * i, 0);
        ctx.lineTo(canvas.height / grid_size * i, canvas.height);
        ctx.stroke();
        }
    }

    //drawGrid(20);
    //ctx.beginPath();
    //ctx.arc(canvas.width/2, canvas.height/2, radius, 0, 2*Math.PI);
    //ctx.stroke();

    for(let i = 0; i < number_of_cells; i++)
    {
        if (cells[i].isRoom) {
            ctx.fillStyle = "red";
        }
        else {
            ctx.fillStyle = "black";
        }
        ctx.strokeStyle = "red";
        ctx.strokeRect(cells[i].x - cells[i].width/2, cells[i].y - cells[i].height/2, cells[i].width, cells[i].height);
        ctx.fillRect(cells[i].x - cells[i].width/2, cells[i].y - cells[i].height/2, cells[i].width, cells[i].height);
        console.log(cells[i].x + "," + cells[i].y + "," + cells[i].width + "," + cells[i].height + "," + cells[i].cell_id);
    }

    /*if(triangles != null) {
        triangles.forEach(triangle => {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.moveTo(triangle.v0.x, triangle.v0.y);
        ctx.lineTo(triangle.v1.x, triangle.v1.y);
        ctx.lineTo(triangle.v2.x, triangle.v2.y);
        ctx.lineTo(triangle.v0.x, triangle.v0.y);
        ctx.closePath();
        ctx.stroke();
    })*/

    if(graph != null) {
        graph.forEach(edge => {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.moveTo(edge.v0.x, edge.v0.y);
        ctx.lineTo(edge.v1.x, edge.v1.y);
        ctx.closePath();
        ctx.stroke();
    })
    }
}

function RandomPointInCircle(radius) {
    //from https://stackoverflow.com/questions/5837572/generate-a-random-point-within-a-circle-uniformly

    let t = 2 * Math.PI * Math.random();
    let u = Math.random() + Math.random();
    let r;

    if(u > 1) {
        r = 2 - u;
    }
    else {
        r = u;
    }
    
    return [radius * r * Math.cos(t), radius * r * Math.sin(t)];
}

function generateCells() {
    for(let i = 0; i < number_of_cells; i++) {
        let point = RandomPointInCircle(radius);
        let pointX = point[0];
        let pointY = point[1];

        cells.push(new Cell(canvas.width/2 + pointX, canvas.height/2 + pointY, Math.floor(Math.random() * (max_cell_size + 1 - min_cell_size)) + min_cell_size, Math.floor(Math.random() * (max_cell_size + 1 - min_cell_size)) + min_cell_size));
    }
}

function separateCells() {
    function Vector(x, y) {
        this.x = x;
        this.y = y;

        this.normalize = function(x) {
            let length = Math.hypot(this.x, this.y);
            this.x = this.x/length * x;
            this.y = this.y/length * x;
        }
    }
    
    function cellSeparationVector(currentCell) {
        function calculateDistance(cell1, cell2) {
            return [cell1.x - cell2.x, cell1.y - cell2.y];
        }
        let v = new Vector(0, 0);
        let neighborCount = 0;
        let distance;
        let isNeighbor;
        cells.forEach(cell => {
            if(currentCell != cell) {
                distance = calculateDistance(currentCell, cell);
                isNeighbor = false;
                if(Math.abs(distance[0]) <= currentCell.width/2 + cell.width/2) {
                    v.x += cell.x - currentCell.x;
                    isNeighbor = true;
                }
                if(Math.abs(distance[1]) <= currentCell.height/2 + cell.height/2) {
                    v.y += cell.y - currentCell.y;
                    isNeighbor = true;
                }
                if(isNeighbor) {
                    neighborCount++;
                }
            }
        });
        if(neighborCount == 0) {
            return v;
        }
        else {
            v.x *= -1;
            v.y *= -1;
            v.x /= neighborCount;
            v.y /= neighborCount;
            v.normalize(3);
            return v;
        }
    }

    let separatedCounter;
    for(let i=0; i<100; i++)
    {
        separatedCounter = 0;
        cells.forEach(cell => {
            let vector = cellSeparationVector(cell);
            if(vector.x == 0 && vector.y == 0) {
                separatedCounter++;
            }
            else {
                cell.x += vector.x;
                cell.y += vector.y; 
            }
        });
        if (separatedCounter >= cells.length) {
            break;
        }
    }
}   

function chooseRooms(room_size) {
    for(let i = 0; i < cells.length; i++) {
        if (cells[i].width >= room_size * min_cell_size && cells[i].height >= room_size * min_cell_size) {
            cells[i].isRoom = true;
            cells[i].generateId();
        }
    }
}

function createTriangles() {
    let vertexes = [];
    cells.forEach(cell => {
        if(cell.isRoom) {
            vertexes.push(cell);
        }
        triangles = triangulate(vertexes);
    })
}

function getEdges() {
    let edges = [];

    triangles.forEach(triangle => {
        edges.push(...triangle.triangleToEdges());
    })

    return edges;
}

function minSpanningTree() {
    function subset(parent) {
        this.parent = parent;
        this.root = 0;
    }

    function find(subsets, i) {
        if (subsets[i].parent != i) {
            subsets[i].parent = find(subsets, subsets[i].parent)
        }
        return subsets[i].parent;
    }

    function union(subsets, x, y) {

        let xroot = find(subsets, x),
            yroot = find(subsets, y);

        if(subsets[xroot].rank < subsets[yroot.rank]) {
            subsets[xroot].parent = yroot;
        }
        else if(subsets[xroot].rank > subsets[yroot].rank) {
            subsets[yroot].parent = xroot;
        }
        else {
            subsets[yroot].parent = xroot;
            subsets[xroot].rank++;
        }

    }

    let rooms_count = cells.reduce(function(n, cell){
            return n + (cell.isRoom);
        }, 0),
        spanningTree = [],
        index1 = 0,
        index2 = 0,
        x,
        y,
        subsets = [],
        next_edge = new edge();
    
    for(let i = 0; i<rooms_count; i++) {
        subsets[i] = new subset(i);
    }

    edges.sort(function(a, b){
        return a.weight() - b.weight();
    })

    while(index1 < rooms_count - 1) {

        next_edge = edges[index2++];
        x = find(subsets, next_edge.v0.cell_id);
        y = find(subsets, next_edge.v1.cell_id);

        if (x != y) {
            spanningTree[index1++] = next_edge;
            union(subsets, x, y);
        }

    }
    return spanningTree;
}

function additionalEdges(percent) {
    let additionalEdgesNumber = Math.round(edges.length * percent),
        random;

    for(let i = 0; i < additionalEdgesNumber; i++) {
        random = Math.floor(Math.random() * edges.length);

        if(graph.includes(edges[random])) {
            i--;
            continue;
        }
        else {
            graph.push(edges[random]);
        }
    }
}

function makeHallways() {
    
}