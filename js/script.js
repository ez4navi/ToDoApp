const section = document.querySelector("#mainSection"),
  input = document.querySelector("#new-todo"),
  createToDoList = document.createElement('ul'),
  $checkAllMark = $('#mainSection > label'),
  $toggleAll = $('#toggle-all');
  let newToDo = '', toDoList = document.querySelector("#toDoList"), counter, toDoListArr = [];

function clearInput() {
    input.value = '';
}

function showCheckAllMark() {
    $checkAllMark.css('opacity','1');
}

function hideCheckAllMark() {
    $checkAllMark.css('opacity','0');
}

function updateToDoToLocalStorage() {
    let sItem = JSON.stringify(toDoListArr);
    localStorage.setItem('memory',sItem);
}

function checkAllCheckboxes() {
    if (toDoListArr.every(item => item.split(':')[1] === 'true')) {
        $toggleAll.prop('checked', true);
    }
}

function loadFromLocalStorage() {
    section.appendChild(createToDoList);
    createToDoList.setAttribute('id','toDoList');
    toDoListArr.forEach((element)=> {
        insertToDo(element);
    });
    if (localStorage.memory.length > 2) {
        showCheckAllMark();
        checkAllCheckboxes();
    }

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

            if (toDoListArr.every(item => item.split(':')[1] === 'true')) {
                $toggleAll.prop('checked', true);
            } else {
                $toggleAll.prop('checked', false);
            }
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
        if (localStorage.memory.length === 2) {
            hideCheckAllMark();
        }
        checkAllCheckboxes();
        if (toDoListArr.length === 0) {
            $toggleAll.prop('checked', false);
        }
    });
}

section.addEventListener('keypress', function (e) {
    if (e.which === 13 && input.value.length > 0 && input.value.trim()) {
        toDoListArr.push(input.value+':false');
        showCheckAllMark();
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

$toggleAll.change(function () {
    const $checkbox = $('.checkbox');
    if(this.checked) {
        toDoListArr.forEach((item,idx,array) => {
           array[idx] = item.split(':')[0]+':true';
        });
        $checkbox.addClass('checked');
        $checkbox.next().addClass('checked');
    } else {
        toDoListArr.forEach((item,idx,array) => {
            array[idx] = item.split(':')[0]+':false';
        });
        $checkbox.removeClass('checked');
        $checkbox.next().removeClass('checked');
    }

    updateToDoToLocalStorage();
});



