var canvas = document.getElementById("dungeon-canvas");
var ctx = canvas.getContext("2d");
var radius = canvas.width/4;
var number_of_cells = 50;
var max_cell_size = 20;
var min_cell_size = 10;
var cells = [];
generateCells();
draw();

function draw()
{
    //ctx.beginPath();
    //ctx.arc(canvas.width/2, canvas.height/2, radius, 0, 2*Math.PI);
    //ctx.stroke();

    for(i = 0; i < number_of_cells; i++)
    {
        ctx.fillRect(cells[i][0], cells[i][1], cells[i][2], cells[i][3]);
        console.log(cells[i][0] + "," + cells[i][1] + "," + cells[i][2] + "," + cells[i][3]);
    }
}

function RandomPointInCircle(radius)
{
    let t = 2 * Math.PI * Math.random();
    let u = Math.random() + Math.random();
    let r;

    if(u > 1)
    {
        r = 2 - u;
    }
    else
    {
        r = u;
    }
    
    return [radius * r * Math.cos(t), radius * r * Math.sin(t)];
}

function drawPointInCircle()
{
    let point = RandomPointInCircle(radius);
    let pointX = point[0];
    let pointY = point[1];

    ctx.fillRect(canvas.width/2 + pointX, canvas.height/2 + pointY, 1, 1);
}

function generateCells()
{
    for(i = 0; i < number_of_cells; i++)
    {
        let point = RandomPointInCircle(radius);
        let pointX = point[0];
        let pointY = point[1];

        cells.push([canvas.width/2 + pointX, canvas.height/2 + pointY, Math.floor(Math.random() * (max_cell_size + 1 - min_cell_size)) + min_cell_size, Math.floor(Math.random() * (max_cell_size + 1 - min_cell_size)) + min_cell_size]);
    }
}

/*ctx.fillRect(0, 0, canvas.width, canvas.height)
ctx.strokeStyle ="grey";
var map = new Array(100);
map.fill(0);
var turns = 10;
var maxLength = 5;
var decision = 0;
var actualPosition = Math.floor(Math.random() * 100);

decisionLoop:
while(turns>0)
{
    switch(Math.floor(Math.random() * 4))
    {
        case 0:
            decision -= 10;
            break;
        case 1:
            decision += 10;
            break;
        case 2:
            decision += 1;
            break;
        case 3:
            decision -= 1;
            break;
        default:
            break;
    }
    for(i = 0; i<maxLength; i++)
    {
        if(map[actualPosition + decision] == 1 || (actualPosition + decision) < 0 || (actualPosition + decision) > 99)
        {
            continue decisionLoop;
        }
        else
        {
            actualPosition = actualPosition + decision;
            map[actualPosition] = 1;
        }
    }
    turns--; 
}


ctx.fillStyle = "white"
for(i=0; i<100; i++)
{
    if(map[i]==1)
    {
        ctx.fillRect((i % 10) * 20, ((i - (i % 10))/10) * 20, 20, 20); 
    }
}
/*

/*var actualPositionX = Math.floor(Math.random() * 10);
var actualPositionY = Math.floor(Math.random() * 10);
var positionsHistory = [[actualPositionX, actualPositionY]]; 
ctx.fillStyle = "white";
for(i=0; i<30; i++)
{
    switch(Math.floor(Math.random() * 4))
    {
        case 0:
            actualPositionX += 1;
            break;
        case 1:
            actualPositionY -= 1;
            break;
        case 2:
            actualPositionX -= 1;
            break;
        case 3:
            actualPositionY += 1;
            break;
        default:
            break;
    }
    if(actualPositionX < 0 || actualPositionX >= 10 || actualPositionY < 0 || actualPositionY >= 10 || positionsHistory.includes([actualPositionX, actualPositionY]))
    {
        i--;
    }
    else
    {
        positionsHistory.push([actualPositionX, actualPositionY]);
        ctx.fillRect(actualPositionX * 20, actualPositionY * 20, 20, 20);
    } 
}*/

/*for(i=0; i<=10; i++)
{
    ctx.moveTo(0, 20*i);
    ctx.lineTo(canvas.width, 20*i);
    ctx.stroke();

    ctx.moveTo(20*i, 0);
    ctx.lineTo(20*i, canvas.height);
    ctx.stroke();
}*/