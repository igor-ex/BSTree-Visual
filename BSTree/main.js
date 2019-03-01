// function drawElement (e, coords, counter) {
//     var el = document.createElement('div');
//     el.classList.add('node');
//     el.innerText = e.val;
//     el.style.top = 50 * counter + 'px';
//     var cont = document.getElementById('mainField');
//     cont.appendChild(el);
//     return el;
// }

function drawElement (e, shiftX, shiftY) {
    let resultShiftX = 50 * shiftX;
    let resultShiftY = 50 * shiftY;
    let newNode = document.createElement("div");
    newNode.setAttribute("class", "node");
    newNode.style.top = 50 + resultShiftY + 'px';
    newNode.style.left = 200 + resultShiftX + 'px';
    console.log(resultShiftX);
    console.log(resultShiftY);
    newNode.innerText = e.val;
    document.getElementById("mainField").appendChild(newNode);
    return newNode;
}

function redrawElement (element, shiftX, shiftY) {
    let resultShiftX = 50 * shiftX;
    let resultShiftY = 50 * shiftY;
    element.style.top = 50 + resultShiftY + 'px';
    element.style.left = 200 + resultShiftX + 'px';
}

function redrawRecursively (e, shiftX, shiftY) {
    e.shiftX = shiftX;
    e.shiftY = shiftY;
    redrawElement(e.element, e.shiftX, e.shiftY);
    if (e.left !== null) {
        redrawRecursively(e.left, e.shiftX - 1, e.shiftY + 1);
    }
    if (e.right !== null) {
        redrawRecursively(e.right, e.shiftX + 1, e.shiftY + 1);
    }
}

function flash (e,  callback) {
    e.classList.add('red');
    setTimeout(function () {
        e.classList.remove('red');
        arguments.length > 1 && typeof callback === 'function' ? callback() : void 0;
    }, 2000);
}

function eraseElement (el) {
    el.remove();
}
function eraseTree () {
    document.getElementById("mainField").innerHTML = '';
}

function BSTree() {
    this.root = null;
}

BSTree.prototype.insert = function (val) {
    if (this.root === null) {
        this.root = new Entry(val, null);
        var coords = void 0; //найти координаты
        this.root.element = drawElement(this.root, 0, 0);
        this.root.shiftX = 0;
        this.root.shiftY = 0;
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
            this.left.shiftX = this.shiftX - 1;
            this.left.shiftY = this.shiftY + 1;
            this.left.element = drawElement(this.left, this.left.shiftX, this.left.shiftY);
            flash(this.left.element);
        } else {
            this.left.insert(val, counter);
        }
    } else {
        if (this.right === null) {
            this.right = new Entry(val, this);
            this.right.shiftX = this.shiftX + 1;
            this.right.shiftY = this.shiftY + 1;
            this.right.element = drawElement(this.right, this.right.shiftX, this.right.shiftY);
            flash(this.right.element);
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
            flash(this.element, function () {
                eraseElement(this.element);
            });
        } else {
            eraseElement(this.element);
        }

        const newThis = this.right.getMin();
        newThis.right = this.right.remove(newThis.val);
        //придумать откуда взять координаты, от родителя или сохраненные для this
        newThis.shiftX = this.shiftX;
        newThis.shiftY = this.shiftY;
        newThis.element = drawElement(newThis, this.shiftX, this.shiftY);
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
                flash(this.element, function () {
                    eraseElement(this.element);
                });
        } else {
            eraseElement(this.element);
        }
        if (this.left !== null) {
            redrawRecursively(this.left, this.shiftX, this.shiftY);
            return this.left;
        } else if (this.right !== null) {
            redrawRecursively(this.right, this.shiftX, this.shiftY);
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

var tree;
;(function () {
    tree = new BSTree;
    function insert() {
        var input = document.getElementById('inputValue');
        if (input.value === '') {
            return;
        }
        tree.insert(parseInt(input.value));
        input.value = '';
    }
    document.getElementById('inputButton').addEventListener('click', insert);
    document.getElementById('inputValue').addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            insert();
        }
    });

    function remove () {
        var input = document.getElementById('removeValue');
        if (input.value === '') {
            return;
        }
        tree.remove(parseInt(input.value));
        input.value = '';
    }
    document.getElementById('removeButton').addEventListener('click', remove);
    document.getElementById('removeValue').addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            remove();
        }
    });

}());