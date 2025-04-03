class SegmentTree {
    constructor(arr, operation) {
        this.arr = arr;
        this.n = arr.length;
        this.operation = operation;
        this.tree = new Array(4 * this.n).fill(null).map(() => ({
            value: this.defaultValue(),
            left: null,
            right: null,
            /*
                We use an extra variable to print only those nodes that contain a valid data/value.
                Although we allocate a tree size of 4 * n, only 2 * n - 1 nodes are actually useful.
            */
            mark: false,
        }));
        this.buildTree(0, 0, this.n - 1);
    }

    applyOperation(a, b) {
        switch (this.operation) {
            case "sum": return a + b;
            case "min": return Math.min(a, b);
            case "max": return Math.max(a, b);
            case "or": return a | b;
            case "and": return a & b;
            case "xor": return a ^ b;
            default: return a + b;
        }
    }

    defaultValue() {
        switch (this.operation) {
            case "sum": return 0;
            case "min": return Infinity;
            case "max": return -Infinity;
            case "or": return 0;
            case "and": return ~0;
            case "xor": return 0;
            default: return 0;
        }
    }

    buildTree(node, start, end) {

        if (start === end) {
            this.tree[node] = {
                value: this.arr[start],
                left: start,
                right: end,
                mark: true
            };
            return this.tree[node];
        }

        const mid = Math.floor((start + end) / 2);
        const leftChild = this.buildTree(2 * node + 1, start, mid);
        const rightChild = this.buildTree(2 * node + 2, mid + 1, end);

        this.tree[node] = {
            value: this.applyOperation(leftChild.value, rightChild.value),
            left: start,
            right: end,
            mark: true
        };
        return this.tree[node];
    }

    query(node, start, end, left, right) {
        if (right < start || left > end)
            return this.defaultValue();
        if (left <= start && end <= right)
            return this.tree[node].value;

        const mid = Math.floor((start + end) / 2);
        const leftQuery = this.query(2 * node + 1, start, mid, left, right);
        const rightQuery = this.query(2 * node + 2, mid + 1, end, left, right);

        return this.applyOperation(leftQuery, rightQuery);
    }

    update(node, start, end, index, value) {
        if (start === end) {
            this.arr[index] = value;
            this.tree[node].value = value;
            return;
        }

        const mid = Math.floor((start + end) / 2);
        if (index <= mid)
            this.update(2 * node + 1, start, mid, index, value);
        else
            this.update(2 * node + 2, mid + 1, end, index, value);

        this.tree[node].value = this.applyOperation(
            this.tree[2 * node + 1].value,
            this.tree[2 * node + 2].value
        );
    }
}

let segmentTree = null;

function createSegmentTree() {
    const input = document.getElementById("arrayInput").value;
    const operation = document.getElementById("operation").value;

    if (!input.trim()) {
        alert("Please enter an array!");
        return;
    }

    const inputArray = input.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num));

    if (inputArray.length === 0 || inputArray.length > 8) {
        alert("Invalid input. Please enter up to 8 numbers separated by commas.");
        return;
    }

    segmentTree = new SegmentTree(inputArray, operation);
    visualizeTree(segmentTree);
}

function querySegmentTree() {
    if (!segmentTree) {
        alert("Build the segment tree first!");
        return;
    }

    const left = parseInt(prompt("Enter left index:"));
    const right = parseInt(prompt("Enter right index:"));

    if (isNaN(left) || isNaN(right) || left < 0 || right >= segmentTree.n || left > right) {
        alert("Invalid query range!");
        return;
    }

    const result = segmentTree.query(0, 0, segmentTree.n - 1, left, right);
    alert(`Result in range [${left}, ${right}] = ${result}`);
}

function updateSegmentTree() {
    if (!segmentTree) {
        alert("Build the segment tree first!");
        return;
    }

    const index = parseInt(prompt("Enter index to update:"));
    const value = parseInt(prompt("Enter new value:"));

    if (isNaN(index) || isNaN(value) || index < 0 || index >= segmentTree.n) {
        alert("Invalid update operation!");
        return;
    }

    segmentTree.update(0, 0, segmentTree.n - 1, index, value);
    visualizeTree(segmentTree);
}
