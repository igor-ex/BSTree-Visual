
var BSTree, Entry;

;(function () {
    var FLASH_TIME = 2000;
    var MIDDLE;
    var SHIFT_VALUE = 35;

    function drawElement(e, shiftX, shiftY) {
        var mainField = document.getElementById("mainField");
        if (typeof MIDDLE === 'undefined') {
            MIDDLE = mainField.offsetWidth / 2;
        }
        var resultShiftX = SHIFT_VALUE * shiftX - 20;
        var resultShiftY = SHIFT_VALUE * shiftY;
        var newNode = document.createElement("div");
        newNode.setAttribute("class", "binary-tree__node");
        var top = 50 + resultShiftY;
        var left = MIDDLE + resultShiftX;
        newNode.style.top = top + 'px';
        newNode.style.left = left + 'px';
        newNode.innerText = e.val;
        mainField.appendChild(newNode);
        return newNode;
    }

    function redrawElement(element, shiftX, shiftY) {
        var resultShiftX = SHIFT_VALUE * shiftX - 20;
        var resultShiftY = SHIFT_VALUE * shiftY;
        element.style.top = 50 + resultShiftY + 'px';
        element.style.left = MIDDLE + resultShiftX + 'px';
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

    function flash(e, callback) {
        e.classList.add('binary-tree__red');
        setTimeout(function () {
            e.classList.remove('binary-tree__red');
            typeof callback === 'function' ? callback() : void 0;
        }, FLASH_TIME);
    }

    function eraseElement(el) {
        el.remove();
    }

    function eraseTree() {
        document.getElementById("mainField").innerHTML = '';
    }

    BSTree = function() {
        this.root = null;
    };

    BSTree.prototype.shift = function (gauge, side) {
        if (gauge === this.root) {
            return;
        }
        if (gauge.val < this.root.val) {
            if (!this.root.left) {
                return;
            }
            ;(function (e) {//для левой ветки дерева
                //проход по ветке в порядке возрастания
                if (e.left) {
                    arguments.callee(e.left);
                }
                if (gauge.val >= e.val) {
                    if (e === gauge) {
                        if (side === 'right') {
                            e.shiftX--;
                            redrawElement(e.element, e.shiftX, e.shiftY);
                        }
                        return;//не проверять элементы которые больше
                    } else {
                        e.shiftX--;
                        redrawElement(e.element, e.shiftX, e.shiftY);
                    }
                }
                if (e.right) {
                    arguments.callee(e.right);
                }
            })(this.root.left);
        } else {
            if (!this.root.right) {
                return;
            }
            ;(function (e) {//для правой ветки дерева
                //проход по ветке в порядке убывания
                if (e.right) {
                    arguments.callee(e.right);
                }
                if (gauge.val <= e.val) {
                    if (e === gauge) {
                        if (side === 'left') {
                            e.shiftX++;
                            redrawElement(e.element, e.shiftX, e.shiftY);
                        }
                        return;//не проверять элементы которые меньше
                    } else {
                        e.shiftX++;
                        redrawElement(e.element, e.shiftX, e.shiftY);
                    }
                }
                if (e.left) {
                    arguments.callee(e.left);
                }
            }(this.root.right));
        }
    };
    
    BSTree.prototype.recalcAndRedrawReculsively = function (val) {
        if (!this.root) {
            return;
        }
        var _this = this;
        function recalc (e, shiftX, shiftY, side) {
            e.shiftX = shiftX;
            e.shiftY = shiftY;
            _this.shift(e, side);
            redrawElement(e.element, e.shiftX, e.shiftY);
            if (e.left !== null) {
                recalc(e.left, e.shiftX - 1, e.shiftY + 1, 'left');
            }
            if (e.right !== null) {
                recalc(e.right, e.shiftX + 1, e.shiftY + 1, 'right');
            }
        }
        
        if (val >= this.root.val) {
            recalc(this.root, 0, 0, 'right');
        } else if (val < this.root.val) {
            recalc(this.root, 0, 0, 'left');
        }
    };

    BSTree.prototype.redrawTree = function () {
        if (this.root === null) {
            return;
        }
        MIDDLE = void 0;
        var mainField = document.getElementById("mainField");
        MIDDLE = mainField.offsetWidth / 2;
        redrawRecursively(this.root, 0, 0);
    };

    BSTree.prototype.insert = function (val) {
        if (this.root === null) {
            this.root = new Entry(val, null);
            this.root.tree = this;
            this.root.element = drawElement(this.root, 0, 0);
            this.root.shiftX = 0;
            this.root.shiftY = 0;
            flash(this.root.element);
        } else {
            this.root.insert(val);
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
        var tree = this.root.remove(val, true);
        this.root = tree;
        if (tree !== null) {
            tree.parent = null;
        }
        var _this = this;
        setTimeout(function () {
            _this.recalcAndRedrawReculsively(val);
        }, FLASH_TIME);
    };

    BSTree.prototype.toString = function () {
        if (this.root === null) {
            return '{}';
        }
        var arr = [];
        this.root.inOrder(function (val) {
            arr.push(val);
        });
        return '{' + arr.join(', ') + '}';
    };

    BSTree.prototype.toArray = function () {
        if (this.root === null) {
            return [];
        }
        var arr = [];
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
        var lList = new LList;
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

    Entry = function (val, parent) {
        this.tree = null;
        this.parent = typeof parent === 'undefined' ? null : parent;
        this.val = val;
        this.left = null;
        this.right = null;
        this.element = null;//ссылка на html-элемент в DOM
        this.shiftX = null;
        this.shiftY = null;
    };

    Entry.prototype.insert = function (val) {
        if (val < this.val) {
            if (this.left === null) {
                this.left = new Entry(val, this);
                this.left.tree = this.tree;
                this.left.shiftX = this.shiftX - 1;
                this.left.shiftY = this.shiftY + 1;
                this.left.element = drawElement(this.left, this.left.shiftX, this.left.shiftY);
                flash(this.left.element);
                this.tree.shift(this.left, 'left');
            } else {
                this.left.insert(val);
            }
        } else {
            if (this.right === null) {
                this.right = new Entry(val, this);
                this.right.tree = this.tree;
                this.right.shiftX = this.shiftX + 1;
                this.right.shiftY = this.shiftY + 1;
                this.right.element = drawElement(this.right, this.right.shiftX, this.right.shiftY);
                flash(this.right.element);
                this.tree.shift(this.right, 'right');
            } else {
                this.right.insert(val);
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

            var newThis = this.right.getMin();

            var removeTasks = function () {
                newThis.right = this.right.remove(newThis.val);
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
            } else {
                removeTasks();
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
                return this.left;
            } else if (this.right !== null) {
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

    Entry.prototype.inOrder = function (callback, order) {//true - обратный порядок
        //если колбэк возвращает true, проход по дереву заканчивается
        if (!order) {
            if (this.left !== null) {
                this.left.inOrder(callback);
            }
            if (callback(this.val)) {
                return;
            }
            if (this.right !== null) {
                this.right.inOrder(callback);
            }
        } else {
            if (this.right !== null) {
                this.right.inOrder(callback);
            }
            if (callback(this.val)) {
                return;
            }
            if (this.left !== null) {
                this.left.inOrder(callback);
            }
        }
    };

    Entry.prototype.getMin = function () {
        if (this.left === null) {
            return this;
        }
        return this.left.getMin();
    };

})();

