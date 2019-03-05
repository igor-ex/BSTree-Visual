
var LList;

;(function () {

    LList = function LList() {
        this.root = null;
        this.last = null;
        this.length = 0;
    };

    function Entry(val) {
        this.val = val;
        this.prev = null;
        this.next = null;
    }

    LList.prototype.push = function (val) {
        if (!arguments.length) {
            return this.length;
        }

        var pushSingle = function (val) {
            var e = new Entry(val);
            if (this.last) {
                this.last.next = e;
                e.prev = this.last;
            } else {
                this.root = e;
            }
            this.last = e;
            this.length++;
            return this.length;
        }.bind(this);

        for (var i = 0; i < arguments.length; i++) {
            pushSingle(arguments[i]);
        }
        return this.length;
    };

    LList.prototype.unshift = function (val) {
        if (!arguments.length) {
            return this.length;
        }

        var unshiftSingle = function (val) {
            var e = new Entry(val);
            if (this.root) {
                this.root.prev = e;
                e.next = this.root;
            } else {
                this.last = e;
            }
            this.root = e;
            this.length++;
            return this.length;
        }.bind(this);

        for (var i = arguments.length - 1; i >= 0; i--) {
            unshiftSingle(arguments[i])
        }
        return this.length;
    };

    LList.prototype.pop = function () {
        if (!this.last) {
            return;
        }
        const e = this.last;
        const currentLast = e.prev;
        if (currentLast) {
            this.last = currentLast;
            currentLast.next = null;
        } else {
            this.last = null;
            this.root = null
        }
        this.length--;
        return e.val;
    };

    LList.prototype.shift = function () {
        if (!this.root) {
            return;
        }
        const e = this.root;
        const newRoot = e.next;
        if (newRoot) {
            this.root = newRoot;
            newRoot.prev = null;
        } else {
            this.root = null;
            this.last = null;
        }
        this.length--;
        return e.val;
    };

    LList.prototype.isArray = function () {
        let cur = this;
        while (cur = cur.__proto__) {
            if (cur === Array.prototype) {
                return true;
            }
        }
        return false;
    };

    LList.prototype.some = function (func) {
        if (!this.length) {
            return false;
        }
        let current = this.root;
        do {
            if (func(current.val) === true) {
                return true;
            }
        } while (current = current.next);
        return false;
    };

    LList.prototype.every = function (func) {
        if (!this.length) {
            return false;
        }
        let current = this.root;
        do {
            if (func(current.val) === false) {
                return false;
            }
        } while (current = current.next);
        return true;
    };

    LList.prototype.remove = function (ind) {
        if (ind > this.length - 1) {
            return void 0;
        }
        let current = this.root;
        for (let i = 0; i < ind; i++) {
            current = current.next;
        }
        const prev = current.prev;
        const next = current.next;
        if (prev) {
            if (next) {
                prev.next = next;
            } else {
                prev.next = null;
            }
        } else {
            if (next) {
                this.root = next;
            } else {
                this.root = null;
            }
        }
        if (next) {
            if (prev) {
                next.prev = prev;
            } else {
                next.prev = null;
            }
        } else {
            if (prev) {
                this.last = prev;
            } else {
                this.last = null;
            }
        }

        this.length--;
        return current.val;
    };

    LList.prototype.splice = function () {//возвращает n-ный элемент начиная с элемента startEntry (считая с 0)
        function getEntry(startEntry, targetIndex) {
            if (startEntry === null) {
                return null;
            }
            let index = 0;
            let cur = startEntry;
            do {
                if (index === targetIndex) {
                    return cur;
                }
                index++;
            } while (cur = cur.next);
            return null;
        }

        const startIndex = arguments[0];
        const delNumber = arguments[1];
        const insertStatus = arguments.length > 2;//будет ли осуществляться вставка

        const removed = new LList;

        let headLink, tailLink;

        //если что-то нужно удалять
        if (typeof startIndex !== 'undefined' && this.length && startIndex < this.length && delNumber !== 0) {//если надо что-то удалять

            //найти элемент, с которого начать удаление
            const startEntry = getEntry(this.root, startIndex);

            //определить докуда шагать
            let delNumber = arguments[1];//количество удаляемых элементов
            if (typeof delNumber === 'undefined') {
                delNumber = 1;
            } else if (delNumber > this.length - startIndex) {//количество удаленышей может превышать длину массива
                delNumber = this.length - startIndex;
            }

            //прошагать до конца диапазона удаления и найти последний удаляемый элемент
            const stopEntry = getEntry(startEntry, delNumber - 1);

            //получить ссылки на элементы для последующей вставки или сшивки
            headLink = startEntry.prev;
            tailLink = stopEntry.next;

            //отщепить удаленный диапазон окончательно
            startEntry.prev = null;
            stopEntry.next = null;
            removed.root = startEntry;
            removed.last = stopEntry;
            removed.length = delNumber;

            //сшить разрыв, если ничего не надо вставлять
            if (!insertStatus) {

                if (headLink === null) {//надо позаботиться о root
                    this.root = tailLink;
                    if (tailLink !== null) {
                        tailLink.prev = null;
                    }
                } else {
                    headLink.next = tailLink;
                }
                if (tailLink === null) {//позаботиться о last
                    this.last = headLink;
                    if (headLink !== null) {
                        headLink.next = null;
                    }
                } else {
                    tailLink.prev = headLink;
                }
            }

            this.length -= delNumber;
        }

        //начать добавлять новые элементы в место разрыва если они есть и если есть разрыв
        if (insertStatus) {
            if (typeof headLink === 'undefined') {//если мы ничего не удаляли, то мы не знаем куда добавлять. определяем
                if (startIndex !== 0) {
                    if (startIndex >= this.length - 1) {//если начало вставки в конце или за списком
                        headLink = this.last;
                    } else {
                        headLink = getEntry(this.root, startIndex);
                    }
                } else {
                    headLink = null;
                }
                tailLink = headLink !== null ? headLink.next : this.root;
            }

            //добавляем элементы

            //добавляем первый
            const first = new Entry(arguments[2]);
            if (headLink === null) {
                this.root = first;
            } else {
                headLink.next = first;
                first.prev = headLink;
            }
            this.length++;

            //добавляем остальные
            let cur = first;
            let prev;
            for (let i = 3; i < arguments.length; i++) {
                prev = cur;
                cur = new Entry(arguments[i]);
                prev.next = cur;
                cur.prev = prev;
                this.length++;
            }

            //заботимся о последнем
            if (tailLink === null) {
                this.last = cur;
            } else {
                tailLink.prev = cur;
                cur.next = tailLink;
            }
        }

        if (!insertStatus && typeof headLink !== 'undefined') {
            //сшить разрыв если ничего не добавлялось но удаление осуществлялось
            if (headLink === null) {
                this.root = tailLink;
            }

            if (tailLink === null) {
                this.last = headLink;
            }

            if (headLink !== null) {
                headLink.next = tailLink;
            }
            if (tailLink !== null) {
                tailLink.prev = headLink;
            }


        }

        return removed;

    };

})();