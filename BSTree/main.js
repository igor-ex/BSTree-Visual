
var BSTree;

;(function () {

// function drawElement (e, coords, counter) {
//     var el = document.createElement('div');
//     el.classList.add('node');
//     el.innerText = e.val;
//     el.style.top = 50 * counter + 'px';
//     var cont = document.getElementById('mainField');
//     cont.appendChild(el);
//     return el;
// }

    var lastId = 0;
    var FLASH_TIME = 2000;
    var MIDDLE;

    function drawElement(e, shiftX, shiftY) {
        var mainField = document.getElementById("mainField");
        if (typeof MIDDLE === 'undefined') {
            MIDDLE = mainField.offsetWidth / 2;
        }
        let resultShiftX = 50 * shiftX - 20;
        let resultShiftY = 50 * shiftY;
        let newNode = document.createElement("div");
        newNode.setAttribute("class", "node");
        newNode.style.top = 50 + resultShiftY + 'px';
        newNode.style.left = MIDDLE + resultShiftX + 'px';
        newNode.innerText = e.val;
        mainField.appendChild(newNode);
        return newNode;
    }

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

    function redrawElement(element, shiftX, shiftY) {
        let resultShiftX = 50 * shiftX - 20;
        let resultShiftY = 50 * shiftY;
        element.style.top = 50 + resultShiftY + 'px';
        element.style.left = MIDDLE + resultShiftX + 'px';
    }

    function redrawElementById(id, shiftX, shiftY) {
        let resultShiftX = 50 * shiftX;
        let resultShiftY = 50 * shiftY;
        var element = document.getElementById('el' + id);
        element.style.top = 50 + resultShiftY + 'px';
        element.style.left = 200 + resultShiftX + 'px';
    }

    function redrawRecursively(e, shiftX, shiftY) {
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

    function flash(e, callback) {
        e.classList.add('red');
        setTimeout(function () {
            e.classList.remove('red');
            typeof callback === 'function' ? callback() : void 0;
        }, 2000);
    }

    function flashById(id, callback) {
        var e = document.getElementById('el' + id);
        e.classList.add('red');
        setTimeout(function () {
            e.classList.remove('red');
            typeof callback === 'function' ? callback() : void 0;
        }, FLASH_TIME);
    }

    function eraseElement(el) {
        el.remove();
    }

    function eraseElementById(id) {
        var el = document.getElementById('el' + id);
        el.remove();
    }

    function eraseTree() {
        document.getElementById("mainField").innerHTML = '';
    }

    BSTree = function() {
        this.root = null;
    }

    BSTree.prototype.redrawTree = function () {
        if (this.root === null) {
            return;
        }
        MIDDLE = void 0;
        var mainField = document.getElementById("mainField");
        MIDDLE = mainField.offsetWidth / 2;
        redrawRecursively(this.root, 0, 0);
    }

    BSTree.prototype.insert = function (val) {
        if (this.root === null) {
            this.root = new Entry(val, null);
            this.root.element = drawElement(this.root, 0, 0);
            this.root.shiftX = 0;
            this.root.shiftY = 0;
            flash(this.root.element);
        } else {
            this.root.insert(val);
        }
    };

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
        this.id = null;
    }

    Entry.prototype.insert = function (val) {
        if (val < this.val) {
            if (this.left === null) {
                this.left = new Entry(val, this);
                this.left.shiftX = this.shiftX - 1;
                this.left.shiftY = this.shiftY + 1;
                this.left.element = drawElement(this.left, this.left.shiftX, this.left.shiftY);
                flash(this.left.element);
            } else {
                this.left.insert(val);
            }
        } else {
            if (this.right === null) {
                this.right = new Entry(val, this);
                this.right.shiftX = this.shiftX + 1;
                this.right.shiftY = this.shiftY + 1;
                this.right.element = drawElement(this.right, this.right.shiftX, this.right.shiftY);
                flash(this.right.element);
            } else {
                this.right.insert(val);
            }
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

    Entry.prototype.remove = function (val, flashFlag) {
        var _this = this;
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
        } else if (this.left !== null && this.right !== null) {
            if (flashFlag) {
                flash(this.element, function () {
                    eraseElement(_this.element);
                });
            } else {
                eraseElement(this.element);
            }

            const newThis = this.right.getMin();

            var removeTasks = function () {
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
            }.bind(this);

            if (flashFlag) {
                setTimeout(removeTasks, FLASH_TIME);
            }
            return newThis;

        } else {
            if (flashFlag) {
                flash(this.element, function () {
                    eraseElement(_this.element);
                })
            } else {
                eraseElement(this.element);
            }
            if (this.left !== null) {
                if (flashFlag) {
                    setTimeout(function () {
                        redrawRecursively(_this.left, _this.shiftX, _this.shiftY);
                    }, FLASH_TIME)
                } else {
                    redrawRecursively(this.left, this.shiftX, this.shiftY);
                }
                return this.left;
            } else if (this.right !== null) {
                if (flashFlag) {
                    setTimeout(function () {
                        redrawRecursively(_this.right, _this.shiftX, _this.shiftY);
                    }, FLASH_TIME);
                } else {
                    redrawRecursively(this.right, this.shiftX, this.shiftY);
                }
                return this.right;
            } else {
                return null;
            }
        }
        return this;
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

    Entry.prototype.find = function (val) {
        if (this.val === val) {
            flash(this.element);
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

})();

var tree;
;(function () {
    tree = new BSTree;

    addEventListener('resize', function () {
        tree.redrawTree();
    });

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

    function find () {
        var input = document.getElementById('findValue');
        if (input.value === '') {
            return;
        }
        tree.find(parseInt(input.value));
        input.value = '';
    }
    document.getElementById('findButton').addEventListener('click', remove);
    document.getElementById('findValue').addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            find();
        }
    });

}());