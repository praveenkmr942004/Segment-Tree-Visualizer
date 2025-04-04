class SegmentTree {
    constructor(arr, operation) {
        this.arr = arr;
        this.n = arr.length;
        this.operation = operation;
        this.tree = new Array(4 * this.n).fill(null);
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

    buildTree(node, start, end) {
        if (start === end) {
            this.tree[node] = this.arr[start];
            return;
        }

        const mid = Math.floor((start + end) / 2);
        this.buildTree(2 * node + 1, start, mid);
        this.buildTree(2 * node + 2, mid + 1, end);

        this.tree[node] = this.applyOperation(this.tree[2 * node + 1], this.tree[2 * node + 2]);
    }

    update(index, value) {
        this._updateTree(0, 0, this.n - 1, index, value);
    }

    _updateTree(node, start, end, index, value) {
        if (start === end) {
            this.arr[index] = value;
            this.tree[node] = value;
            return;
        }

        const mid = Math.floor((start + end) / 2);
        if (index <= mid)
            this._updateTree(2 * node + 1, start, mid, index, value);
        else
            this._updateTree(2 * node + 2, mid + 1, end, index, value);

        this.tree[node] = this.applyOperation(this.tree[2 * node + 1], this.tree[2 * node + 2]);
    }

    query(left, right) {
        return this._queryTree(0, 0, this.n - 1, left, right);
    }

    _queryTree(node, start, end, left, right) {
        if (right < start || left > end)
            return this._getNeutralValue();

        if (left <= start && end <= right)
            return this.tree[node];

        const mid = Math.floor((start + end) / 2);
        const leftResult = this._queryTree(2 * node + 1, start, mid, left, right);
        const rightResult = this._queryTree(2 * node + 2, mid + 1, end, left, right);

        return this.applyOperation(leftResult, rightResult);
    }

    _getNeutralValue() {
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
}

let segmentTree = null;

function createSegmentTree() {
    const input = document.getElementById("arrayInput").value;
    const operation = document.getElementById("operation").value;
    const inputArray = input.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num));

    if (inputArray.length === 0 || inputArray.length > 16) {
        alert("Invalid input. Please enter up to 16 numbers.");
        return;
    }

    segmentTree = new SegmentTree(inputArray, operation);
    visualizeTree(segmentTree, "treeContainer");
}

function querySegmentTree() {
    if (!segmentTree) {
        alert("Please build the segment tree first!");
        return;
    }

    const left = parseInt(prompt("Enter left index:"));
    const right = parseInt(prompt("Enter right index:"));

    if (isNaN(left) || isNaN(right) || left < 0 || right >= segmentTree.n || left > right) {
        alert("Invalid range. Please enter valid indices.");
        return;
    }

    const result = segmentTree.query(left, right);
    alert(`Query Result: ${result}`);
}

function updateSegmentTree() {
    if (!segmentTree) {
        alert("Please build the segment tree first!");
        return;
    }

    const index = parseInt(prompt("Enter index to update:"));
    const newValue = parseInt(prompt("Enter new value:"));

    if (isNaN(index) || isNaN(newValue) || index < 0 || index >= segmentTree.n) {
        alert("Invalid input. Please enter valid values.");
        return;
    }

    segmentTree.update(index, newValue);
    visualizeTree(segmentTree, "treeContainer");
}
