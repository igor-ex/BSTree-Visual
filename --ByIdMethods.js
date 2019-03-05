

function drawElementById(e, shiftX, shiftY) {
    let resultShiftX = 50 * shiftX;
    let resultShiftY = 50 * shiftY;
    let newNode = document.createElement("div");
    newNode.setAttribute("class", "node");
    newNode.style.top = 50 + resultShiftY + 'px';
    newNode.style.left = 200 + resultShiftX + 'px';
    newNode.innerText = e.val;
    lastId++;
    newNode.id = 'el' + lastId;
    document.getElementById("mainField").appendChild(newNode);
    return lastId;
}

function redrawElementById(id, shiftX, shiftY) {
    let resultShiftX = 50 * shiftX;
    let resultShiftY = 50 * shiftY;
    var element = document.getElementById('el' + id);
    element.style.top = 50 + resultShiftY + 'px';
    element.style.left = 200 + resultShiftX + 'px';
}

function redrawRecursivelyById(e, shiftX, shiftY) {
    e.shiftX = shiftX;
    e.shiftY = shiftY;
    redrawElementById(e.id, e.shiftX, e.shiftY);
    if (e.left !== null) {
        redrawRecursivelyById(e.left, e.shiftX - 1, e.shiftY + 1);
    }
    if (e.right !== null) {
        redrawRecursivelyById(e.right, e.shiftX + 1, e.shiftY + 1);
    }
}

function flashById(id, callback) {
    var e = document.getElementById('el' + id);
    e.classList.add('red');
    setTimeout(function () {
        e.classList.remove('red');
        typeof callback === 'function' ? callback() : void 0;
    }, FLASH_TIME);
}

function eraseElementById(id) {
    var el = document.getElementById('el' + id);
    el.remove();
}

BSTree.prototype.insertById = function (val) {
    if (this.root === null) {
        this.root = new Entry(val, null);
        this.root.id = drawElementById(this.root, 0, 0);
        this.root.shiftX = 0;
        this.root.shiftY = 0;
        flashById(this.root.id);
    } else {
        this.root.insertById(val);
    }
};

BSTree.prototype.removeById = function (val) {
    if (this.root === null) {
        return;
    }
    const tree = this.root.removeById(val, true);
    this.root = tree;
    if (tree !== null) {
        tree.parent = null;
    }
};

Entry.prototype.insertById = function (val) {
    if (val < this.val) {
        if (this.left === null) {
            this.left = new Entry(val, this);
            this.left.shiftX = this.shiftX - 1;
            this.left.shiftY = this.shiftY + 1;
            this.left.id = drawElementById(this.left, this.left.shiftX, this.left.shiftY);
            flashById(this.left.id);
        } else {
            this.left.insert(val);
        }
    } else {
        if (this.right === null) {
            this.right = new Entry(val, this);
            this.right.shiftX = this.shiftX + 1;
            this.right.shiftY = this.shiftY + 1;
            this.right.id = drawElementById(this.right, this.right.shiftX, this.right.shiftY);
            flashById(this.right.id);
        } else {
            this.right.insertById(val);
        }
    }
};

Entry.prototype.removeById = function (val, flashFlag) {
    if (val < this.val) {
        if (this.left !== null) {
            this.left = this.left.removeById(val, flashFlag);
            if (this.left !== null) {
                this.left.parent = this;
            }
        }
    } else if (val > this.val) {
        if (this.right !== null) {
            this.right = this.right.removeById(val, flashFlag);
            if (this.right !== null) {
                this.right.parent = this;
            }
        }
    } else if (this.left !== null && this.right !== null) {
        if (flashFlag) {
            flashById(this.id, function () {
                eraseElementById(this.id);
            });
        } else {
            eraseElementById(this.id);
        }

        const newThis = this.right.getMin();
        newThis.right = this.right.removeById(newThis.val);
        //придумать откуда взять координаты, от родителя или сохраненные для this
        newThis.shiftX = this.shiftX;
        newThis.shiftY = this.shiftY;
        newThis.id = drawElementById(newThis, this.shiftX, this.shiftY);
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
            var _this = this;
            flashById(this.id, function () {
                console.log(this.id);
                eraseElementById(_this.id);
            });
            // var _this = this;
            // ;(function () {
            //     eraseElementById(_this.id);
            // })();
        } else {
            eraseElementById(this.id);
        }
        if (this.left !== null) {
            redrawRecursivelyById(this.left, this.shiftX, this.shiftY);
            return this.left;
        } else if (this.right !== null) {
            redrawRecursivelyById(this.right, this.shiftX, this.shiftY);
            return this.right;
        } else {
            return null;
        }
    }
    return this;
};