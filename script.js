const inputEl = (document.getElementsByClassName('app__control__input'))[0] //создаем переменную для html элемента из index.html (поле ввода); происходит поиск и получение элемента 
//по классу, точнее элементов (происходит сохранение в виде массива), но т.к. у нас 1 элемент с таким классом, берем первый элемент [0]
const btnEl = (document.getElementsByClassName('app__control__btn'))[0]/// тоже самое но для кнопки добавления
const listEl = (document.getElementsByClassName("app__list"))[0]/// div который будет хранить в себе все таски

let counter = 1 //счетчик для задания id для каждой задачи 


function loadData() { //функция для получения данных из loсаlStorage
    const savedData = localStorage.getItem('tasks') //обращается к localStorage и пытается получить данные, сохраненные под ключом 'tasks'
    return savedData ? JSON.parse(savedData) : [] //тернарный оператор который проверяет есть ли сохраненные данные
}

const data = loadData() //содержит все таски которые были сохранены в массиве

// function init() {
//     const tmp = localStorage.getItem('data')
//     if (tmp !== null) {
//         data = JSON.parse(tmp)
//     }
//     data.forEach((item) => {
//         if (item.id > counter) {
//             counter= item.id 
//         }
//     })
//     if (counter > 1){
//         counter++
//     }
    
//     render()
// }

data.forEach((item) => {  ///перебирает каждый элемент массива data
    if (item.id >= counter) { //нужно для того чтобы были разные id,  т.е. не повторялись
        counter = item.id + 1;
    }
});


function syncData(){//функция которая сохраненяет текущее состояние данных
    localStorage.setItem('tasks', JSON.stringify(data))
    render()
}



function createTask(objectData){ ///создание таски
    const root = document.createElement('div')///строка задачи, на котором будет сам текст, чекбокс и кнопка удаления
    root.classList.add("app__list__item")//задаем ей класс

    if (objectData.isDone){//если isDone=== true, добавляем для таски новый класс, по которому потом можно правильно отобразить сделанную задачу
        root.classList.add('app__list-checkbox-done')
    }


    const chekinput = document.createElement('input')///кнопка чекбокс
    chekinput.classList.add("app__list-checkbox")
    chekinput.type = 'checkbox'//задаем тип чекбокса

    if (objectData.isDone){//если задача завершена, 
        chekinput.checked = true //ставим галочку
    }


    const txt = document.createElement('p')
    txt.classList.add("app_l_text")
    txt.innerText = objectData.text

    const btn = document.createElement('button')
    btn.classList.add("app__list__btn")

    const img = document.createElement('img')
    img.src = "vedro.png"
    img.alt = "удалить"

    btn.appendChild(img) ///типа пакет в пакете

    btn.addEventListener('click', (event)=> {
        event.stopPropagation();
        deleteById(objectData.id);
        // console.log(data);
        

    })

    root.addEventListener('click', () => changeStatus(objectData.id)); //при нажатии на задачу менятся ее статус, сделано/не сделано

    root.appendChild(chekinput)
    root.appendChild(txt)
    root.appendChild(btn)

    return root ///возвращаем готовую задачу
    
}


function changeStatus(id) { //обновляет статус задачи
    const task = data.find(item => item.id === id);

    if (task) {
        task.isDone = !task.isDone; //изменение статуса задачи (isDone) на противоположный
        syncData()
        render()
    }
}


function deleteById(id) {//функция удаления элемента из массива
    const index = data.findIndex(item => item.id === id)
    if (index !== -1) { 
        data.splice(index, 1) //Если задача найдена, она удаляется из массива
        syncData()
        render()
    }
}



btnEl.addEventListener('click', ()=>{ ///что происходит при нажатии Добавить:
    const textValue = inputEl.value///берет значение(value) из inputEl (т.е. текст из строки)
    if (textValue!=''){//если там действительно что-то написано
        data.push({
            id: counter++, 
            text: textValue,
            isDone: false
        })

    // const taskEl = createTask(textValue)///прогоняет полученный текст через нашу функцию, теперь taskEl содержит в себе одну задачу
    // listEl.appendChild(taskEl)//добавляет задачу в основной лист задач
        syncData()
        render()
        inputEl.value=''
        // render()
    }
    
})



function render(){//обновляет отображение на экране
    listEl.innerHTML=''
    for (let item of data){
        const tmpEl = createTask(item)
        // console.log(newTask);
        listEl.appendChild(tmpEl)
    }
}
render();
