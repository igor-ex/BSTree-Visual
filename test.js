
describe('BSTree', function () {

    let tree;

    beforeEach(function () {
        tree = new BSTree();
    });
    
    it(`should have root object and it has to be set to null`, function () {
        assert.isNull(tree.root);
    });
    
    it('should have several specific methods', function () {
        assert.isFunction(tree.insert);
        assert.isFunction(tree.find);
        assert.isFunction(tree.remove);
        assert.isFunction(tree.toString);
        assert.isFunction(tree.toArray);
        assert.isFunction(tree.empty);
        assert.isFunction(tree.toLinkedList);
    })
});

describe('Entry', function () {

    it('should have several properties', function () {
        const entry = new Entry('test');

        assert.isNull(entry.parent);
        assert.isNull(entry.left);
        assert.isNull(entry.right);
        assert.strictEqual(entry.val, 'test');
    });
});


describe('BSTree.insert', function () {
    let tree;

    beforeEach(function () {
        tree = new BSTree();
    });

    it('should insert one entry', function () {
        tree.insert(5);
        const root = tree.root;
        assert.instanceOf(root, Entry);
        assert.strictEqual(root.val, 5);
        assert.isNull(root.left);
        assert.isNull(root.right);
        assert.isNull(root.parent);
    });

    it('should insert 2 entries', function () {
        tree.insert(5);
        tree.insert(10);
        const root = tree.root;

        assert.instanceOf(root, Entry);
        assert.strictEqual(root.val, 5);
        assert.isNull(root.left);
        assert.instanceOf(root.right, Entry);
        assert.isNull(root.parent);

        //second entry
        const entry2 = root.right;
        assert.strictEqual(entry2.val, 10);
        assert.isNull(entry2.left);
        assert.isNull(entry2.right);
        assert.strictEqual(entry2.parent, root);
    });

    it('should insert 2 entries', function () {
        tree.insert(5);
        tree.insert(5);
        const root = tree.root;

        assert.instanceOf(root, Entry);
        assert.strictEqual(root.val, 5);
        assert.isNull(root.left);
        assert.instanceOf(root.right, Entry);
        assert.isNull(root.parent);

        //second entry
        const entry2 = root.right;
        assert.strictEqual(entry2.val, 5);
        assert.isNull(entry2.left);
        assert.isNull(entry2.right);
        assert.strictEqual(entry2.parent, root);
    });

    it('should insert 2 entries', function () {
        tree.insert(5);
        tree.insert(3);
        const root = tree.root;

        assert.instanceOf(root, Entry);
        assert.strictEqual(root.val, 5);
        assert.isNull(root.right);
        assert.instanceOf(root.left, Entry);
        assert.isNull(root.parent);

        //second entry
        const entry2 = root.left;
        assert.strictEqual(entry2.val, 3);
        assert.isNull(entry2.left);
        assert.isNull(entry2.right);
        assert.strictEqual(entry2.parent, root);
    });



    it('should insert 3 entries', function () {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        const root = tree.root;

        assert.instanceOf(root, Entry);
        assert.strictEqual(root.val, 5);
        assert.instanceOf(root.left, Entry);
        assert.instanceOf(root.right, Entry);
        assert.isNull(root.parent);

        //second entry
        const entry2 = root.left;
        assert.strictEqual(entry2.val, 3);
        assert.isNull(entry2.left);
        assert.isNull(entry2.right);
        assert.strictEqual(entry2.parent, root);

        //third entry
        const entry3 = root.right;
        assert.strictEqual(entry3.val, 7);
        assert.isNull(entry3.left);
        assert.isNull(entry3.right);
        assert.strictEqual(entry3.parent, root);

    });

    it('should insert 4 entries', function () {
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(5);
        const root = tree.root;

        assert.instanceOf(root, Entry);
        assert.strictEqual(root.val, 5);
        assert.instanceOf(root.left, Entry);
        assert.instanceOf(root.right, Entry);
        assert.isNull(root.parent);

        //second entry
        const entry2 = root.left;
        assert.strictEqual(entry2.val, 3);
        assert.isNull(entry2.left);
        assert.isNull(entry2.right);
        assert.strictEqual(entry2.parent, root);

        //third entry
        const entry3 = root.right;
        assert.strictEqual(entry3.val, 7);
        assert.instanceOf(entry3.left, Entry);
        assert.isNull(entry3.right);
        assert.strictEqual(entry3.parent, root);

        //fourth entry
        const entry4 = entry3.left;
        assert.strictEqual(entry4.val, 5);
        assert.isNull(entry4.left);
        assert.isNull(entry4.right);
        assert.strictEqual(entry4.parent, entry3);
    })
});

describe('BSTree.find', function () {
    let tree;

    beforeEach(function () {
        tree = new BSTree();
        tree.insert(5);
        tree.insert(3);
        tree.insert(7);
        tree.insert(5);
        tree.insert(6);
    });

    it('should return 5', function () {
        const act = tree.find(5);
        const exp = tree.root;
        assert.strictEqual(act, exp);
    });

    it('should return 3', function () {
        const act = tree.find(3);
        const exp = tree.root.left;
        assert.strictEqual(act, exp);
    });


    it('should return 6', function () {
        const act = tree.find(6);
        const exp = tree.root.right.left.right;
        assert.strictEqual(act, exp);
    })
});

describe('BSTree.remove', function () {
    const testData = [
        {init: [5, 3, 7, 2, 6, 8, 7, 8], rem: 5, exp: [6, 3, 2, 7, 8, 8, 7]},
        {init: [5, 2, 7], rem: 7, exp: [5, 2]},
        {init: [5, 2, 7], rem: 5, exp: [7, 2]},
        {init: [5, 2, 7], rem: 2, exp: [5, 7]},
        {init: [5, 2, 7, 1], rem: 1, exp: [5, 2, 7]},
        {init: [5, 2, 7, 2], rem: 2, exp: [5, 2, 7]},
        {init: [0], rem: 0, exp: []},
        {init: [0, 5], rem: 0, exp: [5]},
        {init: [0, 5], rem: 5, exp: [0]},
        //{init: [], rem: , exp: []},
        {init: [5, 2, 7, 8], rem: 7, exp: [5, 2, 8]},
        {init: [0, 1, 0, 2, -1, 0, 1, 3], rem: 1, exp: [0, 1, 0, 2, -1, 0, 3]},
    ];

    let tree;

    beforeEach(function () {
        tree = new BSTree;
    });

    testData.forEach(function (data) {

        const {init, rem, exp} = data;

        it('should equal', function () {
            for (let i = 0; i < init.length; i++) {
                tree.insert(init[i]);
            }

            tree.remove(rem);
            const expTree = new BSTree;
            for (let i = 0; i < exp.length; i++) {
                expTree.insert(exp[i]);
            }
            //assert.deepEqual(tree, expTree);
        });
    });


});

describe('BSTree.empty', function () {

    it('the empty tree should remain empty', function () {
        const tree = new BSTree();
        tree.empty();
        assert.isNull(tree.root);
    });

    it('should empty the tree', function () {
        const tree = new BSTree();
        tree.insert(5);
        assert.isNull(tree.root.parent);
        tree.empty();
        assert.isNull(tree.root);
    });

    it('should empty the tree', function () {
        const tree = new BSTree();
        tree.insert(5);
        tree.insert(10);
        assert.isNull(tree.root.parent);
        tree.empty();
        assert.isNull(tree.root);
    });

    it('should empty the tree', function () {
        const tree = new BSTree();
        tree.insert(5);
        tree.insert(10);
        tree.insert(-5);
        assert.isNull(tree.root.parent);
        tree.empty();
        assert.isNull(tree.root);
    })
});

describe('BSTree.toArray', function () {
    const testData = [
        {init: [], exp: []},
        {init: [0], exp: [0]},
        {init: [1, 2, 3], exp: [1, 2, 3]},
        {init: [3, 2, 1], exp: [1, 2, 3]},
        {init: [6, 1, 5, 9, 0, 3], exp: [0, 1, 3, 5, 6, 9]}
    ];

    testData.forEach(function (data) {
        const {init, exp} = data;
        const tree = new BSTree();
        for (let i = 0; i < init.length; i++) {
            tree.insert(init[i]);
        }

        it(`should return sorted array`, function () {
            const act = tree.toArray();

            assert.deepEqual(act, exp);
        });

    });
});

describe('BSTree.toString', function () {
    const testData = [
        {init: [], exp: '{}'},
        {init: [0], exp: '{0}'},
        {init: [1, 2, 3], exp: '{1, 2, 3}'},
        {init: [3, 2, 1], exp: '{1, 2, 3}'},
        {init: [6, 1, 5, 9, 0, 3], exp: '{0, 1, 3, 5, 6, 9}'}
    ];

    testData.forEach(function (data) {
        const {init, exp} = data;
        const tree = new BSTree();
        for (let i = 0; i < init.length; i++) {
            tree.insert(init[i]);
        }

        it(`should return a string`, function () {
            const act = tree.toString();

            assert.strictEqual(act, exp);
        });

    });
});

describe('BSTree.toLinkedList', function () {
    const testData = [
        {init: [], exp: []},
        {init: [0], exp: [0]},
        {init: [1, 2, 3], exp: [1, 2, 3]},
        {init: [3, 2, 1], exp: [1, 2, 3]},
        {init: [6, 1, 5, 9, 0, 3], exp: [0, 1, 3, 5, 6, 9]}
    ];

    testData.forEach(function (data) {
        const {init, exp} = data;
        const tree = new BSTree();
        for (let i = 0; i < init.length; i++) {
            tree.insert(init[i]);
        }

        it(`should return sorted LinkedList`, function () {
            const act = tree.toLinkedList();

            const expLList = new LList;
            expLList.push.apply(expLList, exp);

            assert.deepEqual(act, expLList);
        });

    });
});


describe('Entry.inOrder', function () {
    const testData = [
        {init: [0], exp: [0]},
        {init: [1, 2, 3], exp: [1, 2, 3]},
        {init: [3, 2, 1], exp: [1, 2, 3]},
        {init: [6, 1, 5, 9, 0, 3], exp: [0, 1, 3, 5, 6, 9]}
    ];

    testData.forEach(function (data) {
        const {init, exp} = data;
        const tree = new BSTree();
        for (let i = 0; i < init.length; i++) {
            tree.insert(init[i]);
        }
        const sorted = [];
        const func = function (val) {
            sorted.push(val);
        };
        it(`should return sorted array`, function () {
            tree.root.inOrder(func);

            assert.deepEqual(sorted, exp);
        });

    });
});