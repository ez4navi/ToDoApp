const section = document.querySelector("#mainSection"),
  input = document.querySelector("#new-todo"),
  createToDoList = document.createElement('ul'),
  $checkAllMark = $('#mainSection > label'),
  $toggleAll = $('#toggle-all');
  let toDoListArr = [], tab;

function clearInput() {
    input.value = '';
}

function resetAllToDo() {
    $('#toDoList').children().remove();
    toDoListArr.forEach((element)=> {
        insertToDo(element);
    });
    checkFooter();
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
    if (toDoListArr.every(item => item.split(':').pop() === 'true')) {
        $toggleAll.prop('checked', true);
    } else {
        $toggleAll.prop('checked', false);
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

function updateFooter() {
    $('.footer').remove();
    checkFooter();
}

function updateToDoCounter() {
    if (toDoListArr.filter(item => item.split(':').pop() === 'false').length === 1) {
        $('.todo-counter').text( `1 item left`);
    } else {
        $('.todo-counter').text(`${toDoListArr.filter(item =>
          item.split(':').pop() === 'false').length} items left`);
    }
}

function checkAvailabilityToDo() {
    if (localStorage.memory.length === 2) {
        hideCheckAllMark();
        $toggleAll.prop('checked', false);
        $('.footer').remove();
    }
}

function showActiveToDo() {
    $('.checkbox.checked')
      .closest('.list-item')
      .css('display','none');
}

function showCompletedToDo() {
    $('.checkbox').not('.checked')
      .closest('.list-item')
      .css('display','none');
}

function checkFooter() {
    if (toDoListArr.length >= 1) {
        $('#toDoList').append('<footer class="footer">');
        $('.footer').append('<span class="todo-counter"></span>' + '<ul class="filters"></ul>' +
          '<button class="clear-completed">Clear completed</button>');
        $('.filters').append('<li><a class="all-todo">All</a></li>'+
          '<li><a class="active-todo">Active</a></li>'+
          '<li><a class="completed-todo">Completed</a></li>');
        $('.clear-completed').click(function(){
            $('.checkbox.checked').closest('.list-item').remove();
            toDoListArr = toDoListArr.filter(item => item.split(':').pop() === 'false');
            updateToDoToLocalStorage();
            checkClearCompletedButton();
            checkAvailabilityToDo();
        });

        $('.all-todo').click(function () {
            resetAllToDo();
            setTab('all');
        });
        $('.active-todo').click(function () {
            resetAllToDo();
            showActiveToDo();
            setTab('active');
        });
        $('.completed-todo').click(function () {
            resetAllToDo();
            showCompletedToDo();
            setTab('completed');
        });
        updateToDoCounter();
        checkClearCompletedButton();
    } else {
        $('.footer').remove();
    }

}

function setTab(tabLocal) {
    switch (tabLocal) {
        case 'active': {
            $('.active-todo').addClass('selected');
            localStorage.setItem('tab','active');
            showActiveToDo();
        }
        break;
        case 'completed': {
            $('.completed-todo').addClass('selected');
            localStorage.setItem('tab','completed');
            showCompletedToDo();
        }
        break;
        default: {
            $('.all-todo').addClass('selected');
            localStorage.setItem('tab','all');
        }
    }
    tab = localStorage.getItem('tab');
}

function checkClearCompletedButton() {
    if (toDoListArr.filter(item => item.split(':').pop() === 'true').length >= 1) {
        $('.clear-completed').css('visibility','visible');
    } else {
        $('.clear-completed').css('visibility','hidden');
    }
}

function insertToDo(item) {
    $('#toDoList').append($('<li class="list-item">'));
    $('li:last').append('<div class="todo">');
    if (item) {
        $('div:last').append('<div class="checkbox-label">' + '<label class="value">' +
          item.split(':').slice(0,-1).join(':') + '</label></div>' + '<input type="text" class="edit">'
          +'<button class="cross"></button>');
    } else {
        $('div:last').append('<div class="checkbox-label">' + '<label class="value">' +
          input.value + '</label></div>' + '<input type="text" class="edit">' +
          '<button class="cross"></button>');
    }

    let $valueLast = $('.value:last'), $todoLast = $('.todo:last');
    $todoLast.dblclick(function (e) {
        if (e.offsetX >= 50) {
            $(this).children('.edit').css('visibility','visible');
            $(this).children('.edit').focus();
            $(this).children('.edit').val($(this).find('.value').text());
            $(this).children('.checkbox-label').css('display','none');
            $(this).children('.cross').css('display','none');
        }
    });
    $todoLast.keypress(function (e) {
        if (e.which === 13) {
            $(this).find('.edit').css('visibility','hidden');
        }
    });
    $todoLast.keydown(function (e) {
       if (e.which === 27) {
           $(this).find('.edit').val($(this).find('.value').text());
           $(this).find('.edit').css('visibility','hidden');
       }
    });
    $todoLast.focusout(function () {
        let i = $(this).closest('li').index();
        $(this).children('.edit').css('visibility','hidden');
        $(this).find('.value').text($(this).children('.edit').val());
        toDoListArr[i] = $(this).children('.edit').val() +
          ':' + toDoListArr[i].split(':').pop();
        $(this).children('.checkbox-label').css('display','');
        $(this).children('.cross').css('display','');
        if ($(this).find('.value').text().length === 0) {
            toDoListArr.splice($(this).closest('li').index(),1);
            $(this).closest('.list-item').remove();
            checkAvailabilityToDo();
            updateFooter();
            setTab(tab);
        }
        updateToDoToLocalStorage();
    });

    $valueLast.before($('<div class="checkbox"></div>').click(function () {
            let i = $(this).closest('li').index();
            if (toDoListArr[i].split(':').pop() === 'false') {
                if (tab === 'active') {
                    $(this).closest('li').css('display','none');
                }
                toDoListArr[i] = toDoListArr[i].replace('false','true');
                updateToDoToLocalStorage();
            } else {
                if (tab === 'completed') {
                    $(this).closest('li').css('display','none');
                }
                toDoListArr[i] = toDoListArr[i].replace('true','false');
                updateToDoToLocalStorage();
            }
            $(this).toggleClass('checked');
            $(this).next().toggleClass('checked');
            updateToDoCounter();
            checkAllCheckboxes();
            checkClearCompletedButton();
        })
    );
    if (item) {
        if (item.split(':').pop() === 'true') {
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
        checkAvailabilityToDo();
        updateFooter();
        updateToDoCounter();
        checkAllCheckboxes();
        setTab(tab);
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
            checkFooter();
        } else {
            insertToDo();
            clearInput();
            updateToDoCounter();
            updateToDoToLocalStorage();
            checkAllCheckboxes();
            updateFooter();
            setTab();
        }
        updateToDoCounter();
    }
});

$(document).ready(function(){
    if (localStorage.getItem('memory')) {
        toDoListArr = JSON.parse(localStorage.getItem('memory'));
        loadFromLocalStorage();
    }
    if (localStorage.getItem('tab')) {
        tab = localStorage.getItem('tab');
    }
    checkFooter();
    setTab(tab);
});

$toggleAll.change(function () {
    const $checkbox = $('.checkbox');
    if(this.checked) {
        toDoListArr.forEach((item,idx,array) => {
           array[idx] = item.split(':').slice(0,-1).join(':') + ':true';
        });
        $checkbox.addClass('checked');
        $checkbox.next().addClass('checked');
        if (tab === 'active') {
            $('.checked').closest('li').css('display', 'none');
        }
        if (tab === 'completed') {
            $('.checked').closest('li').css('display','');
        }
    } else {
        toDoListArr.forEach((item,idx,array) => {
            array[idx] = item.split(':').slice(0,-1).join(':') +':false';
        });
        if (tab === 'completed') {
            $('.checked').closest('li').css('display','none');
        }
        $checkbox.removeClass('checked');
        $checkbox.next().removeClass('checked');
        if (tab === 'active') {
            $('.checkbox').closest('li').css('display','');
        }
    }
    updateToDoCounter();
    updateToDoToLocalStorage();
    checkClearCompletedButton();
});



