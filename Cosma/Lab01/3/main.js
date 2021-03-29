"use strict";

const sqlite = require('sqlite3');
const dayjs=require('dayjs');


function Task(id, description, urgent=false, private_=true, deadline=undefined) {
    this.id = id;
    this.description = description;
    this.urgent = urgent;
    this.private_ = private_;
    this.deadline = deadline;

    this.toString = () => {
        let str = "Id: " + this.id + ", Description: " + this.description + ", Urgent: " + this.urgent + 
        ", Private: " + this.private_ + ", Deadline: ";
        if (this.deadline !== undefined)
            str += this.deadline.format('MMMM D, YYYY h:mm A');
        else 
            str += 'Undefined deadline';
        return str;
    };

    this.getDeadline = () => deadline;
}

function TaskList() {
    this.tasks = [];

    this.addTask = (task) => this.tasks.push(task);
    this.toString = () => {
        return this.tasks.map(task => task.toString()).join("\n");
    };
    this.sortAndPrint = () => {
        this.tasks = this.tasks.sort((a, b) => { 
            if (a.getDeadline() === undefined) { 
                return +1; 
            } else if (b.getDeadline() === undefined) {
                return -1; 
            } else {
                if (a.getDeadline().isBefore(b)) return 1;
                else return -1;
            }
        });

        console.log("****** Tasks sorted by deadline (most recent first): ******");
        console.log(this.toString());
    }

    this.filterAndPrint = () => {
        console.log("****** Tasks filtered, only (urgent == true): ******");
        console.log(this.tasks.filter(task => task.urgent).map(t => t.toString()).join("\n"));
    }
}

function main() {
    const db = new sqlite.Database('tasks.db', (err) => {
        if (err) throw err;
    });

    const tl = new TaskList();

    db.all('SELECT * FROM tasks;', (err, rows) => {
        if (err)
            throw err;

        for (const row of rows) {
            tl.addTask(new Task(row.id, row.description, row.urgent, row.private, 
                (row.deadline === null ? undefined : dayjs(row.deadline))));
        }

        tl.sortAndPrint();
        tl.filterAndPrint();
    });

    const filter_day = dayjs('2021-03-09');
    const p = new Promise((resolve, reject) => {
        db.all("SELECT * FROM tasks WHERE datetime(deadline) > datetime(?)",
            [filter_day.format()],
            (err, rows) => {
                if (err) reject(err);

                const filtered_tl = new TaskList();
                for (const row of rows) {
                    filtered_tl.addTask(new Task(row.id, row.description, row.urgent, row.private, 
                        (row.deadline === null ? undefined : dayjs(row.deadline))));
                }

                resolve(filtered_tl);
            })
    });

    p.then(list => {
        console.log(`****** Tasks only after ${filter_day.format("YYYY-MM-DD")}: ******`)
        console.log(list.toString());
    });

    const word = "day";
    db.all("SELECT * FROM tasks WHERE description LIKE '%' || ? || '%'", 
        [word],
        (err, rows) => {
            if (err) throw err;

            const filtered_tl = new TaskList();
            for (const row of rows) {
                filtered_tl.addTask(new Task(row.id, row.description, row.urgent, row.private, 
                    (row.deadline === null ? undefined : dayjs(row.deadline))));
            }

            console.log(`****** Tasks only containing ${word}: ******`)
            console.log(filtered_tl.toString());
    });


}

main()