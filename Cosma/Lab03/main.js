document.addEventListener("DOMContentLoaded", ready);

function ready() {
  const tl = new TaskList();

  const t1 = new Task(1, "phone call", true, false, dayjs());
  const t2 = new Task(2, "labs", false, false, dayjs("2021-01-01"));
  const tu = new Task(0, "ciccio", true, true);
  const t3 = new Task(3, "prova", false, false, dayjs("2021-01-02"));

  tl.addTask(t1);
  tl.addTask(t2);
  tl.addTask(tu);
  tl.addTask(t3);

  tl.addToHTML();
}

function Task(
  id,
  description,
  urgent = false,
  private_ = true,
  deadline = undefined
) {
  this.id = id;
  this.description = description;
  this.urgent = urgent;
  this.private_ = private_;
  this.deadline = deadline;

  this.toString = () => {
    let str =
      "Id: " +
      this.id +
      ", Description: " +
      this.description +
      ", Urgent: " +
      this.urgent +
      ", Private: " +
      this.private_ +
      ", Deadline: ";
    if (this.deadline !== undefined)
      str += this.deadline.format("MMMM D, YYYY h:mm A");
    else str += "Undefined deadline";
    return str;
  };

  this.getDeadline = () => deadline;

  this.getDeadlineDiffString = () => {
    if (this.deadline == undefined) {
      return "";
    }
    let day_diff;
    let day_diff_string;
    day_diff = this.deadline.diff(dayjs(), "day");
    if (day_diff === 0) {
      day_diff_string = "Today";
    } else if (day_diff > 0) {
      day_diff_string = "in " + day_diff.toString() + " days";
    } else {
        console.log(day_diff);
      day_diff_string = "expired since " + (-1*day_diff).toString() + " days";
    }
    return day_diff_string;
  };

  this.HTMLoutput = () => {
    const checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input", "mt-2");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("value", "");
    const descript = document.createElement("h5");
    descript.classList.add("mb-1", "ml-3");
    descript.innerText = this.description;
    if (this.urgent) descript.classList.add("text-danger");
    const form_check = document.createElement("div");
    form_check.classList.add("form-check");
    form_check.appendChild(checkbox);
    form_check.appendChild(descript);
    const shared_icon = document.createElement('i');
    shared_icon.classList.add("bi-people", "p-0", "m-0", "list-item-icon");
    const exp_date = document.createElement("small");
    exp_date.classList.add("mt-1");
    exp_date.innerText = this.getDeadlineDiffString();
    const content_div = document.createElement("div");
    content_div.classList.add("d-flex", "w-100", "justify-content-between");
    content_div.appendChild(form_check);
    if (!this.private_) content_div.appendChild(shared_icon);
    content_div.appendChild(exp_date);
    const list_item = document.createElement("a");
    list_item.classList.add("list-group-item", "list-group-item-action");
    list_item.setAttribute("href", "#");
    list_item.appendChild(content_div);
    return list_item;
  };
}

function TaskList() {
  this.tasks = [];

  this.addTask = (task) => this.tasks.push(task);
  this.toString = () => {
    return this.tasks.map((task) => task.toString()).join("\n");
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
  };

  this.filterAndPrint = () => {
    console.log("****** Tasks filtered, only (urgent == true): ******");
    console.log(
      this.tasks
        .filter((task) => task.urgent)
        .map((t) => t.toString())
        .join("\n")
    );
  };

  this.addToHTML = () => {
    const activity_list = document.getElementById("activities-list-container");
    this.tasks.forEach((task) => {
      activity_list.appendChild(task.HTMLoutput());
    });
  };
}
