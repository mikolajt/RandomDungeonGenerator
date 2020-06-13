export function vertex(x, y) {
    this.x = x;
    this.y = y;
}

export function edge(v0, v1) {
    this.v0 = v0;
    this.v1 = v1;

    this.weight = () => {
        return Math.hypot(this.v0.x - this.v1.x, this.v0.y - this.v1.y);
    }
}

export function triangle (v0, v1, v2) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;

    function circumscribed_circle (center, radius) {
        this.center = center;
        this.radius = radius;
    }

    this.circumscribed_circle = () => {
        //from https://web.archive.org/web/20071030134248/http://www.exaflop.org/docs/cgafaq/cga1.html#Subject%201.01:%20How%20do%20I%20rotate%20a%202D%20point

        let A = this.v1.x - this.v0.x,
            B = this.v1.y - this.v0.y,
            C = this.v2.x - this.v0.x,
            D = this.v2.y - this.v0.y,
            E = A * (this.v0.x + this.v1.x) + B * (this.v0.y + this.v1.y),
            F = C * (this.v0.x + this.v2.x) + D * (this.v0.y + this.v2.y),
            G = 2 * (A * (this.v2.y - this.v1.y) - B * (this.v2.x - this.v1.x)),
            center, radius, dx, dy;

            if(Math.abs(G) < 0.0000001) {
                let min_x = Math.min(this.v0.x, this.v1.x, this.v2.x);
                let min_y = Math.min(this.v0.y, this.v1.y, this.v2.y);
                
                center = new vertex(((min_x + Math.max(this.v0.x, this.v1.x, this.v2.x)) / 2), ((min_y + Math.max(this.v0.y, this.v1.y, this.v2.y)) / 2));
                dx = (center.x - min_x);
                dy = (center.y - min_y);
            }
            else {
                center = new vertex((D * E - B * F) / G, (A * F - C * E) / G);
                dx = center.x - this.v0.x;
                dy = center.y - this.v0.y; 
            }
            radius = Math.sqrt(dx * dx + dy * dy);
            return new circumscribed_circle(center, radius);
    }

    this.isInCircumscribedCircle = (vertex) => {
        let circle = this.circumscribed_circle(),
            distance = Math.hypot(circle.center.x - vertex.x, circle.center.y - vertex.y);

        if(distance > circle.radius) {
            return false;
        }
        else {
            return true;
        }
    } 

    this.triangleToEdges = () => {
        let edges = [];
        edges.push(new edge(this.v0, this.v1));
        edges.push(new edge(this.v0, this.v2));
        edges.push(new edge(this.v1, this.v2));
        return edges;
    }
}

export function triangulate(vertexes) {

    if(vertexes.length > 2) {
        let vertexesx = [],
            vertexesy = [];
        vertexes.forEach(vertex => {
            vertexesx.push(vertex.x);
            vertexesy.push(vertex.y);
        })

        let min_x = Math.min(...vertexesx),
            min_y = Math.min(...vertexesy),
            max_x = Math.max(...vertexesx),
            max_y = Math.max(...vertexesy),
            dx = (max_x - min_x) * 10,
            dy = (max_y - min_y) * 10,
            v0 = new vertex(min_x - dx, min_y - dy * 3),
            v1 = new vertex(min_x - dx, max_y + dy),
            v2 = new vertex(max_x + dx * 3, max_y + dy),
            super_triangle = new triangle(v0, v1, v2),
            triangles = [];

        triangles.push(super_triangle);

        vertexes.forEach(vertex => {
            triangles = addVertex(vertex, triangles);
        });

        triangles = triangles.filter(function(triangle) {
            return !(triangle.v0 == super_triangle.v0 || triangle.v0 == super_triangle.v1 || triangle.v0 == super_triangle.v2 ||  
                triangle.v1 == super_triangle.v0 || triangle.v1 == super_triangle.v1 || triangle.v1 == super_triangle.v2 || 
                triangle.v2 == super_triangle.v0 || triangle.v2 == super_triangle.v1 || triangle.v2 == super_triangle.v2);
        });

        return triangles;
    }
    return null;
}

function addVertex(vertex, triangles) {
    function removeDoubleEdges(edges) {
        let buffer,
            new_edges = [],
            unique;

            for(let i = 0; i < edges.length; i++) {
                unique = true;
                buffer = edges[i];
                for(let j = 0; j < edges.length; j++) {
                    if(i == j) {
                        continue;
                    }
                    else if ((edges[i].v0 == edges[j].v0 && edges[i].v1 == edges[j].v1) || (edges[i].v0 == edges[j].v1 && edges[i].v1 == edges[j].v0)) {
                        unique = false;
                        break;
                    }
                }
                if(unique) {
                    new_edges.push(buffer);
                }
            }

        return new_edges;
    }
    

    let edges_buffer = [];

    triangles = triangles.filter(function(triangle) {
        if (triangle.isInCircumscribedCircle(vertex)) {
            edges_buffer.push(...triangle.triangleToEdges());
            return false;
        }
        return true;
    });
    
    edges_buffer = removeDoubleEdges(edges_buffer);

    edges_buffer.forEach(edge => {
        triangles.push(new triangle(vertex, edge.v0, edge.v1));
    })

    return triangles;
}