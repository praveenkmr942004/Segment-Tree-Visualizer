class SegmentTree {
    constructor(arr) {
        this.arr = arr;
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(null);
        this.buildTree(0, 0, this.n - 1);
    }

    buildTree(node, start, end) {
        if (start === end) {
            this.tree[node] = { sum: this.arr[start], left: start, right: end };
            return this.tree[node];
        }
        const mid = Math.floor((start + end) / 2);
        const leftChild = this.buildTree(2 * node + 1, start, mid);
        const rightChild = this.buildTree(2 * node + 2, mid + 1, end);
        this.tree[node] = {
            sum: leftChild.sum + rightChild.sum,
            left: start,
            right: end
        };
        return this.tree[node];
    }

    query(node, start, end, left, right) {
        if (right < start || left > end) return 0; // Out of range
        if (left <= start && end <= right) return this.tree[node].sum; // Fully within range
        const mid = Math.floor((start + end) / 2);
        const leftQuery = this.query(2 * node + 1, start, mid, left, right);
        const rightQuery = this.query(2 * node + 2, mid + 1, end, left, right);
        return leftQuery + rightQuery;
    }

    update(node, start, end, index, value) {
        if (start === end) {
            this.arr[index] = value;
            this.tree[node].sum = value;
            return;
        }
        const mid = Math.floor((start + end) / 2);
        if (index <= mid) {
            this.update(2 * node + 1, start, mid, index, value);
        } else {
            this.update(2 * node + 2, mid + 1, end, index, value);
        }
        this.tree[node].sum = this.tree[2 * node + 1].sum + this.tree[2 * node + 2].sum;
    }
}
