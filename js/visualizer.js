function visualizeTree(segmentTree, containerId) {
    const svg = d3.select(`#${containerId}`);
    svg.selectAll("*").remove();

    const width = svg.node().getBoundingClientRect().width;
    const height = svg.node().getBoundingClientRect().height;

    const horizontalPadding = 100;
    const treeLayout = d3.tree()
        .size([width - 2 * horizontalPadding, height - 100])
        .separation((a, b) => 1.5);

    const data = buildTreeStructure(0, 0, segmentTree.n - 1);
    const root = d3.hierarchy(data);
    treeLayout(root);

    const g = svg.append("g").attr("transform", `translate(${horizontalPadding}, 40)`);

    const linkGenerator = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

    g.selectAll("path")
        .data(root.links())
        .enter()
        .append("path")
        .attr("d", linkGenerator)
        .attr("stroke", "white")
        .attr("fill", "none");

    const nodeSize = 50;
    g.selectAll("rect")
        .data(root.descendants())
        .enter()
        .append("rect")
        .attr("x", d => d.x - nodeSize / 2)
        .attr("y", d => d.y - nodeSize / 2)
        .attr("width", nodeSize)
        .attr("height", nodeSize)
        .attr("fill", d => {
            const nodeIndex = d.data.nodeIndex;
            if (segmentTree.visited[nodeIndex]) {
                segmentTree.visited[nodeIndex] = false;
                return "blue";
            }
            return "#28a745";
        })
        .attr("rx", 6)
        .attr("ry", 6);

    g.selectAll(".node-value")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y - 4)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .text(d => d.data.value);

    g.selectAll(".node-range")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y + 14)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text(d => `(${d.data.start}, ${d.data.end})`);
}

function buildTreeStructure(node, start, end) {
    if (start === end) {
        return {
            value: segmentTree.tree[node].toString(),
            start,
            end,
            nodeIndex: node
        };
    }

    const mid = Math.floor((start + end) / 2);
    return {
        value: segmentTree.tree[node].toString(),
        start,
        end,
        nodeIndex: node,
        children: [
            buildTreeStructure(2 * node + 1, start, mid),
            buildTreeStructure(2 * node + 2, mid + 1, end)
        ]
    };
}

window.onload = function () {
    createSegmentTree();
};
