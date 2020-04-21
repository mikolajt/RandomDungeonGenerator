var canvas = document.getElementById("dungeon-canvas");
var ctx = canvas.getContext("2d");

ctx.strokeStyle ="grey";

for(i=0; i<=10; i++)
{
    ctx.moveTo(0, 20*i);
    ctx.lineTo(canvas.width, 20*i);
    ctx.stroke();

    ctx.moveTo(20*i, 0);
    ctx.lineTo(20*i, canvas.height);
    ctx.stroke();
}
 
for(i=0; i<=10; i++)
{
    for(j=0; j<=10; j++)
    {
        if(Math.floor(Math.random() * 2) == 0)
        {
            ctx.fillRect(20*i, 20*j, 20, 20);
        }
    }
}