"use strict";

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

const tl = new TaskList();

const t1 = new Task(1, "phone call", true, false, dayjs());
const t2 = new Task(2, "labs", false, false, dayjs('2021-01-01'));
const tu = new Task(0, "ciccio", true, true);
const t3 = new Task(3, "prova", false, false, dayjs('2021-01-02'));

tl.addTask(t1);
tl.addTask(t2);
tl.addTask(tu);
tl.addTask(t3);

tl.sortAndPrint();
tl.filterAndPrint();

