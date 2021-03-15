const dayjs = require('dayjs');
const sqlite = require('sqlite3');

function Task(id, descr, urgent = false, private = true, deadline)  {
    this.id = id;
    this.descr = descr;
    this.urgent = urgent;
    this.private = private;
    this.deadline = undefined || dayjs(deadline);
    this.toString = () => { 
        return `Id: ${this.id}, Descr: ${this.descr}, Urgent: ${this.urgent}, Private: ${this.private}, Deadline: ${this.deadline!=undefined ? this.deadline : undefined}`;
       };
}

function TaskList(){
    this.tasks = [];
    this.empty = () => {this.tasks.length=0};
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

function dbOperations () {
    const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

    this.getAll = () => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM tasks' ;
          db.all(sql, [], (err, rows) => {
            if(err)
              reject(err);
            else {  
                //console.log(rows);
                const taskTemp = rows.map(row => new Task(row.id, row.description, row.urgent, row.private, row.deadline));
                resolve(taskTemp);
            }
          });            
        });
    };

    this.addWhereDate = (givenDate) => {
        return new Promise((resolve, reject) => {
          const sql = 'SELECT * FROM tasks WHERE deadline > DATE(?)';
          db.all(sql, [dayjs(givenDate).format('YYYY-MM-DD')], function(err, rows) {
            if (err)
              reject(err); 
            else {
                //console.log(rows)
                const taskTemp = rows.map(row => new Task(row.id, row.description, row.urgent, row.private, row.deadline));
                resolve(taskTemp);
            }    
          });
        });
      };

      this.addWhereWord = async (givenWord) => {
        const res = await this.getAll();
        const filtered = res.filter((r) => {return r.descr.includes(givenWord)});
        //console.log(filtered)
        return filtered;
      };
}

const main = async () => {
    let taskListP = new TaskList();
    const dbOp = new dbOperations();
    const result = await dbOp.getAll();
    result.forEach(e => {
        taskListP.add(e);
    });
    console.log('\nLoad and print');
    taskListP.print();

    taskListP.empty();
    const result1 = await dbOp.addWhereDate('2021-03-10');
    result1.forEach(e => {
        taskListP.add(e);
    });
    console.log('\nLoad and print rows where date > 2021-03-10');
    taskListP.print();

    taskListP.empty();
    const result2 = await dbOp.addWhereWord('phone');
    result2.forEach(e => {
        taskListP.add(e);
    });
    console.log('\nLoad and print rows including word \'phone\'');
    taskListP.print();

}

main();



/* let taskListP= new TaskList();
taskListP.add(new Task(2, 'prova2', false, true, '2020-12-13'));
taskListP.add(new Task(1, 'prova', false, true, '2020-12-12'));
taskListP.add(new Task(3, 'prova3', true, false, '2020-12-14'));

console.log('Sort and print');
taskListP.sortAndPrint();
console.log('Filter and print');
taskListP.filterAndPrint(); */
