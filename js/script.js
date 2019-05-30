const section = document.querySelector("body > main > section"),
  input = document.querySelector("body > main > section > input"),
  createToDoList = document.createElement('ul');
  let newToDo = '', toDoList = document.querySelector("#toDoList"), counter = 0, toDoListArr = [];
  var $valueClass = $('.value:last');

function clearInput() {
    input.value = '';
}

function updateToDoToLocalStorage() {
    let sItem = JSON.stringify(toDoListArr);
    localStorage.setItem('memory',sItem);
}

function insertToDo(item) {
    $('ul').append($('<li class="list-item">'));
    $('li:last').append('<div class="todo">');
    if (item) {
        $('div:last').append('<div class="checkbox-label">' + '<label class="value">' +
          item.split(':')[0] + '</label></div>' + '<button class="cross"></button>');
    } else {
        $('div:last').append('<div class="checkbox-label">' + '<label class="value">' + input.value +
          '</label></div>' + '<button class="cross"></button>');
    }

    let $valueLast = $('.value:last');

    $valueLast.before(function () {
        return $('<div class="checkbox"></div>').click(function () {
            let i = $(this).closest('li').index();
            if (toDoListArr[i].split(':')[1] === 'false') {
                toDoListArr[i] = toDoListArr[i].replace('false','true');
                updateToDoToLocalStorage();
            } else {
                toDoListArr[i] = toDoListArr[i].replace('true','false');
                updateToDoToLocalStorage();
            }
            $(this).toggleClass('checked');
            $(this).next().toggleClass('checked');
        });
    });
    if (item) {
        if (item.split(':')[1] === 'true') {
            $('.checkbox:last').toggleClass('checked');
            $valueLast.toggleClass('checked');
        }
    }
    $('.list-item').hover(function () {
       $(this).find('.cross').css('visibility','visible');
    }, function () {
       $(this).find('.cross').css('visibility','hidden');
    });
    $('.cross:last').click(function () {
        toDoListArr.splice($(this).closest('li').index(),1);
        $(this).closest('.list-item').remove();
        updateToDoToLocalStorage();
    });
}

section.addEventListener('keypress', function (e) {
    if (e.which === 13 && input.value.length > 0 && input.value.trim()) {
        toDoListArr.push(input.value+':false');
        if(!$('#mainSection').children('#toDoList').length > 0) {
            section.appendChild(createToDoList);
            createToDoList.setAttribute('id','toDoList');
            insertToDo();
            clearInput();
            updateToDoToLocalStorage();
        } else {
            insertToDo();
            clearInput();
            updateToDoToLocalStorage();
        }
    }
});

$(document).ready(function(){
    if (localStorage.getItem('memory')) {
        toDoListArr = JSON.parse(localStorage.getItem('memory'));
        loadFromLocalStorage();
    }
});


function loadFromLocalStorage() {
    section.appendChild(createToDoList);
    createToDoList.setAttribute('id','toDoList');
    toDoListArr.forEach((element)=> {
        insertToDo(element);
    })
}

