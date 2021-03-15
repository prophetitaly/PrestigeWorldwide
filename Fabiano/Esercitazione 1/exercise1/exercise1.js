const dayjs = require('dayjs');

function Task(id, descr, urgent = false, private = true, deadline)  {
    this.id = id;
    this.descr = descr;
    this.urgent = urgent;
    this.private = private;
    this.deadline = undefined || dayjs(deadline);
    this.toString = () => { 
        return `Id: ${this.id}, Descr: ${this.descr}, Urgent: ${this.urgent}, Private: ${this.private}, Deadline: ${this.deadline}`;
       };
}

function TaskList(){
    this.tasks = [];
    this.add = (x) => {this.tasks.push(x)};
    this.sortAndPrint = () => {
        this.tasks.sort((a,b) => {if(a.deadline.isBefore(b.deadline)) return -1;
                                  else return 1;});
        this.print();
    };
    this.filterAndPrint = () => {
        let filtered = this.tasks.filter((e) => {return !e.urgent})
        filtered.forEach(e => console.log(e.toString()));
    };
    this.print = () => {this.tasks.forEach(e => console.log(e.toString()))};
}





let taskListP= new TaskList();
taskListP.add(new Task(2, 'prova2', false, true, '2020-12-13'));
taskListP.add(new Task(1, 'prova', false, true, '2020-12-12'));
taskListP.add(new Task(3, 'prova3', true, false, '2020-12-14'));

console.log('Sort and print');
taskListP.sortAndPrint();
console.log('Filter and print');
taskListP.filterAndPrint();
