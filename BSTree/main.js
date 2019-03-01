function drawElement (e, coords, counter) {
    var el = document.createElement('div');
    el.classList.add('node');
    el.innerText = e.val;
    el.style.top = 50 * counter + 'px';
    var cont = document.getElementById('mainField');
    cont.appendChild(el);
    return el;
}
function redrawElement () {}
function getCoords () {}
function redrawRecursively () {}
function flash () {}
function eraseElement (el) {
    el.remove();
}
function eraseTree () {}

function BSTree() {
    this.root = null;
}

BSTree.prototype.insert = function (val) {
    if (this.root === null) {
        this.root = new Entry(val, null);
        var coords = void 0; //найти координаты
        this.root.element = drawElement(this.root, coords, 1);
        flash(this.root.element);
    } else {
        this.root.insert(val, 2);
    }
};

BSTree.prototype.find = function (val) {
    if (this.root === null) {
        return null;
    } else {
        return this.root.find(val);
    }
};

BSTree.prototype.remove = function (val) {
    if (this.root === null) {
        return;
    }
    const tree = this.root.remove(val, true);
    this.root = tree;
    if (tree !== null) {
        tree.parent = null;
    }
};

BSTree.prototype.toString = function () {
    if (this.root === null) {
        return '{}';
    }
    const arr = [];
    this.root.inOrder(function (val) {
        arr.push(val);
    });
    return '{' + arr.join(', ') + '}';
};

BSTree.prototype.toArray = function () {
    if (this.root === null) {
        return [];
    }
    const arr = [];
    this.root.inOrder(function (val) {
        arr.push(val);
    });
    return arr;
};

BSTree.prototype.empty = function () {
    if (this.root !== null) {
        this.root.parent = null;
        this.root = null;
        eraseTree();
    }
};

BSTree.prototype.toLinkedList = function () {
    const lList = new LList;
    if (this.root === null) {
        return lList;
    }
    this.root.inOrder(function (val) {
        lList.push(val);
    });
    return lList;
};

BSTree.prototype.inOrder = function (callback) {
    if (this.root === null) {
        return null;
    } else {
        return this.root.inOrder(callback);
    }
};

function Entry(val, parent) {
    this.parent = typeof parent === 'undefined' ? null : parent;
    this.val = val;
    this.left = null;
    this.right = null;
    this.element = null;//ссылка на html-элемент в DOM
    this.shiftX = null;
    this.shiftY = null;
}

Entry.prototype.insert = function (val, counter) {
    counter++;
    if (val < this.val) {
        if (this.left === null) {
            this.left = new Entry(val, this);
            this.left.element = drawElement(this.left, getCoords(this, 'left'), counter);
            flash(this.element);
        } else {
            this.left.insert(val, counter);
        }
    } else {
        if (this.right === null) {
            this.right = new Entry(val, this);
            this.right.element = drawElement(this.right, getCoords(this, 'right'), counter);
            flash(this.element);
        } else {
            this.right.insert(val, counter);
        }
    }
};

Entry.prototype.remove = function (val, flashFlag) {
    if (val < this.val) {
        if (this.left !== null) {
            this.left = this.left.remove(val, flashFlag);
            if (this.left !== null) {
                this.left.parent = this;
            }
        }
    } else if (val > this.val) {
        if (this.right !== null) {
            this.right = this.right.remove(val, flashFlag);
            if (this.right !== null) {
                this.right.parent = this;
            }
        }
    } else if(this.left !== null && this.right !== null) {
        if (flashFlag) {
            flash(this);
        }
        eraseElement(this.element);
        const newThis = this.right.getMin();
        newThis.right = this.right.remove(newThis.val);
        //придумать откуда взять координаты, от родителя или сохраненные для this
        newThis.element = drawElement(newThis, getCoords(this.parent, void 0));
        if (newThis.right !== null) {
            newThis.right.parent = newThis;
        }
        newThis.left = this.left;
        if (newThis.left !== null) {
            newThis.left.parent = newThis;
        }
        return newThis;
    } else {
        if (flashFlag) {
            flash(this);
        }
        eraseElement(this.element);
        if (this.left !== null) {
            redrawRecursively(this.left, getCoords(this, 'left'));
            return this.left;
        } else if (this.right !== null) {
            redrawRecursively(this.right, getCoords(this, 'right'));
            return this.right;
        } else {
            return null;
        }
    }
    return this;
};

Entry.prototype.find = function (val) {
    if (this.val === val) {
        return this;
    }
    if (val < this.val) {
        if (this.left === null) {
            return null;
        } else {
            return this.left.find(val);
        }
    } else {
        if (this.right === null) {
            return null;
        } else {
            return this.right.find(val);
        }
    }
};

Entry.prototype.inOrder = function (callback) {
    if (this.left !== null) {
        this.left.inOrder(callback);
    }
    callback(this.val);
    if (this.right !== null) {
        this.right.inOrder(callback);
    }
};

Entry.prototype.getMin = function () {
    if (this.left === null) {
        return this;
    }
    return this.left.getMin();
};

var a = new BSTree;
a.insert(1);
a.insert(2);