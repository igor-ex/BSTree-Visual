
//запускаем работу html-формы
;(function () {
    var tree = new BSTree;


    function feedValue (val, callback) {
        if (val === '') {
            return;
        } else if (isNaN(val)) {
            callback(val);
        } else {
            callback(+ val);
        }
    }

    function insert() {
        var input = document.getElementById('inputValue');
        feedValue(input.value, tree.insert.bind(tree));
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
        feedValue(input.value, tree.remove.bind(tree));
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
        feedValue(input.value, tree.find.bind(tree));
        input.value = '';
    }
    document.getElementById('findButton').addEventListener('click', find);
    document.getElementById('findValue').addEventListener('keyup', function (e) {
        if (e.keyCode === 13) {
            find();
        }
    });
    document.getElementById('empty').addEventListener('click', function () {
        tree.empty();
    });
    document.getElementById('toArray').addEventListener('click', function(){
        document.getElementById('output').innerHTML = '['+ tree.toArray() +']';
    });
    document.getElementById('toString').addEventListener('click', function(){
        document.getElementById('output').innerHTML = tree.toString();
    });

}());

