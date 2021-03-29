document.addEventListener('DOMContentLoaded', (event) => {

    const pageMainList = document.getElementById('displayQuery');
    const sidebarMenuList = document.getElementById('sidebarMenuList');

    //Popolo la pagina
    pageMainList.innerHTML = taskListP.getAllHTML();

    document.getElementById('sidebarMenuAll').addEventListener('click', (event) => {
        if (!document.getElementById('sidebarMenuAll').classList.contains("active")) { //solo se non è attivo quel link faccio cose
            for(var i=0; i< sidebarMenuList.children.length; i++){
                sidebarMenuList.children[i].classList.remove("active");
            };
            document.getElementById('sidebarMenuAll').classList.add("active");
            pageMainList.innerHTML = taskListP.getAllHTML();
        };
    });
    document.getElementById('sidebarMenuImp').addEventListener('click', (event) => {
        if (!document.getElementById('sidebarMenuImp').classList.contains("active")) {
            for(var i=0; i< sidebarMenuList.children.length; i++){
                sidebarMenuList.children[i].classList.remove("active");
            };
            document.getElementById('sidebarMenuImp').classList.add("active");
            pageMainList.innerHTML = taskListP.filterAndPrint((e) =>{return e.important});
        };
    });
    document.getElementById('sidebarMenuTdy').addEventListener('click', (event) => {
        if (!document.getElementById('sidebarMenuTdy').classList.contains("active")) {
            for(var i=0; i< sidebarMenuList.children.length; i++){
                sidebarMenuList.children[i].classList.remove("active");
            };
            document.getElementById('sidebarMenuTdy').classList.add("active");
            pageMainList.innerHTML = taskListP.filterAndPrint((e) =>{return e.deadline.isSame(dayjs(), 'day')});
        };
    });
    document.getElementById('sidebarMenuN7d').addEventListener('click', (event) => {
        if (!document.getElementById('sidebarMenuN7d').classList.contains("active")) {
            for(var i=0; i< sidebarMenuList.children.length; i++){
                sidebarMenuList.children[i].classList.remove("active");
            };
            document.getElementById('sidebarMenuN7d').classList.add("active");
            pageMainList.innerHTML = taskListP.filterAndPrint((e) =>{return e.deadline.isAfter(dayjs(), 'day') && e.deadline.isBefore(dayjs().add(7, 'day'), 'day')});
        };
    });
    document.getElementById('sidebarMenuPvt').addEventListener('click', (event) => {
        if (!document.getElementById('sidebarMenuPvt').classList.contains("active")) {
            for(var i=0; i< sidebarMenuList.children.length; i++){
                sidebarMenuList.children[i].classList.remove("active");
            };
            document.getElementById('sidebarMenuPvt').classList.add("active");
            pageMainList.innerHTML = taskListP.filterAndPrint((e) =>{return e.private});
        };
    });




    /*
    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let username = userForm.elements['username'].value ;
        let username2 = userForm.username.value ; // shortcut: input NAME is injected as a property of the form

        console.log(username, username2);
    });*/



});

function Task(id, descr, important = false, private = true, deadline) {
    this.id = id;
    this.descr = descr;
    this.important = important;
    this.private = private;
    this.deadline = undefined || dayjs(deadline);
    this.getCalendarDate = () => {
        return this.deadline.calendar(null, { //reference date all'inizio. Se metto null intende la data di oggi
            sameDay: '[Today at] HH:mm', // The same day ( Today at 2:30 AM )
            nextDay: '[Tomorrow at] HH:mm', // The next day ( Tomorrow at 2:30 AM )
            nextWeek: 'dddd [at] HH:mm', // The next week ( Sunday at 2:30 AM )
            lastDay: '[Yesterday at] HH:mm', // The day before ( Yesterday at 2:30 AM )
            lastWeek: '[Last] dddd [at] HH:mm', // Last week ( Last Monday at 2:30 AM )
            sameElse: 'DD/MM/YYYY [at] HH:mm' // Everything else ( 17/10/2011 )
        });
    }
    this.toString = () => {
        return `Id: ${this.id}, Descr: ${this.descr}, Deadline: ${this.deadline.isValid() ? this.getCalendarDate() : undefined}`;
    };

}

function TaskList() {
    this.tasks = [];
    this.add = (x) => { this.tasks.push(x) };
    this.sortAndPrint = () => {
        this.tasks.sort((a, b) => {
            if (a.deadline.isBefore(b.deadline)) return 1;
            else return 1;
        });
        this.print();
    };
    this.filterAndPrint = (f) => {
        let filtered = this.tasks.filter(f);
        var result = ``;
        filtered.forEach(e => {
            result += `
            <li class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="check-t${e.id}">
                <label class="custom-control-label${e.important ? " text-danger" : ""}" for="check-t${e.id}">${e.descr}</label>
                </div>${!e.private ? `<i class="bi bi-person-square"></i>` : ""}
                <small>${e.deadline.isValid() ? e.getCalendarDate() : ""}</small>
            </div>
            </li>`;
        })
        return result;
    };
    this.print = () => { this.tasks.forEach(e => console.log(e.toString())) };
    this.getAllHTML = () => {
        var result = ``;
        this.tasks.forEach(e => {
            result += `
            <li class="list-group-item">
            <div class="d-flex w-100 justify-content-between">
            <div class="custom-control custom-checkbox">
                <input type="checkbox" class="custom-control-input" id="check-t${e.id}">
                <label class="custom-control-label${e.important ? " text-danger" : ""}" for="check-t${e.id}">${e.descr}</label>
                </div>${!e.private ? `<i class="bi bi-person-square"></i>` : ""}
                <small>${e.deadline.isValid() ? e.getCalendarDate() : ""}</small>
            </div>
            </li>`;
        })
        return result;
    };
}

let taskListP = new TaskList();
taskListP.add(new Task(1, 'Complete Lab 2', false, true, 'Tuesday 2021-03-30 14:30'));
taskListP.add(new Task(2, 'Buy some groceries', false, false, '2021-03-29'));
taskListP.add(new Task(3, 'Read a good book!', true, true, ''));