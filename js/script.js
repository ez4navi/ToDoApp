const section = document.querySelector("body > main > section"),
  input = document.querySelector("body > main > section > input"),
  toDoListVar = [], createToDoList = document.createElement('ul');
  let newToDo = '', toDoList, idCounter = 0;


function clearInput() {
    input.value = '';
}

function insertToDo() {
    $('ul').append($('<li class="list-item">'));
    $('li:last').append('<div class="todo">');
    $('div:last').append('<div class="checkbox-label">' + '<label class="value">' + input.value +
      '</label></div>' + '<button class="cross"></button>');
    $('.value:last').before(function () {
        return $('<div class="checkbox"></div>').click(function () {
            $(this).toggleClass('checked');
            $(this).next().toggleClass('checked');
        });
    });
    $('.list-item').hover(function () {
       $(this).find('.cross').css('visibility','visible');
    }, function () {
       $(this).find('.cross').css('visibility','hidden');
    });
    $('.cross').click(function () {
        $(this).closest('.list-item').remove();
    })
}

section.addEventListener('keypress', function (e) {
    if (e.which === 13 && input.value.length > 0 && input.value.trim()) {
        toDoListVar.push(input.value);
        if(!$('#mainSection').children('#toDoList').length > 0) {
            section.appendChild(createToDoList);
            createToDoList.setAttribute('id','toDoList');
            toDoList = document.querySelector("#toDoList");
            insertToDo();
            clearInput();
        } else {
            insertToDo();
            clearInput();
        }
    }
});


