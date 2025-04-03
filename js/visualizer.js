function visualizeTree(segmentTree) {
    const svg = d3.select("#treeContainer");
    svg.selectAll("*").remove();

    const nodes = [];
    const links = [];

    const maxDepth = Math.ceil(Math.log2(segmentTree.n)) + 1;
    const baseOffset = 50;

    function addNode(index, depth, xPos) {
        // Only add those nodes that are marked as visited, as explained in segmentTree.js line 11.
        if (index >= segmentTree.tree.length || !segmentTree.tree[index] || !segmentTree.tree[index].mark)
            return;

        const yPos = depth * 100 + 150;
        nodes.push({
            id: index,
            value: segmentTree.tree[index].value,
            left: segmentTree.tree[index].left,
            right: segmentTree.tree[index].right,
            x: xPos,
            y: yPos
        });

        const leftChild = 2 * index + 1;
        const rightChild = 2 * index + 2;
        const offset = baseOffset * (1.5 ** (maxDepth - 1.9 * depth));

        if (leftChild < segmentTree.tree.length && segmentTree.tree[leftChild] && segmentTree.tree[leftChild].mark) {
            links.push({ source: index, target: leftChild });
            addNode(leftChild, depth + 1, xPos - offset);
        }

        if (rightChild < segmentTree.tree.length && segmentTree.tree[rightChild] && segmentTree.tree[rightChild].mark) {
            links.push({ source: index, target: rightChild });
            addNode(rightChild, depth + 1, xPos + offset);
        }
    }

    addNode(0, 0, window.innerWidth / 2 - 230);

    links.forEach(link => {
        const sourceNode = nodes.find(n => n.id === link.source);
        const targetNode = nodes.find(n => n.id === link.target);
        svg.append("line")
            .attr("x1", sourceNode.x)
            .attr("y1", sourceNode.y)
            .attr("x2", targetNode.x)
            .attr("y2", targetNode.y)
            .attr("stroke", "white")
            .attr("stroke-width", 2);
    });

    nodes.forEach(node => {
        svg.append("rect")
            .attr("x", node.x - 35)
            .attr("y", node.y - 25)
            .attr("width", 70)
            .attr("height", 50)
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("fill", "#1e90ff")
            .attr("stroke", "white");

        svg.append("text")
            .attr("x", node.x)
            .attr("y", node.y - 5)
            .attr("text-anchor", "middle")
            .text(`${node.value}`);

        svg.append("text")
            .attr("x", node.x)
            .attr("y", node.y + 15)
            .attr("text-anchor", "middle")
            .text(`[${node.left}, ${node.right}]`);
    });
}
