document.addEventListener("DOMContentLoaded", ready);

const filters = {
  all: new Filter("all", "All", "filtersAllItem", null, null),
  important: new Filter(
    "important",
    "Important",
    "filtersImportantItem",
    null,
    null
  ),
  next7days: new Filter(
    "next7days",
    "Next 7 Days",
    "filtersNext7DaysItem",
    null,
    null
  ),
  today: new Filter("today", "Today", "filtersTodayItem", null, null),
  private: new Filter("private", "Private", "filtersPrivateItem", null, null),
};
let filterTitleMain;

function Filter(id, printableName, HTMLidentifier, HTMLElement, taskList) {
  this.id = id;
  this.printableName = printableName;
  this.HTMLidentifier = HTMLidentifier;
  this.HTMLElement = HTMLElement;
  this.taskList = taskList;
}

function ready() {
  getHTMLElements();
  registerCallbacks();
  writeTextOnPage();

  const t1 = new Task(1, "phone call", true, false, dayjs());
  const t2 = new Task(2, "labs", false, false, dayjs("2021-01-01"));
  const tu = new Task(0, "ciccio", true, true);
  const t3 = new Task(3, "prova", false, false, dayjs("2021-01-02"));

  filters.all.taskList = new TaskList();
  filters.all.taskList.addTask(t1);
  filters.all.taskList.addTask(t2);
  filters.all.taskList.addTask(tu);
  filters.all.taskList.addTask(t3);

  updateArraysAndStats();
  replaceTaskList(filters.all);
}

function getHTMLElements() {
  filterTitleMain = document.getElementById("filterTitleMain");
  activityListElement = document.getElementById("activities-list-container");
  for (filter in filters) {
    filters[filter].HTMLElement = document.getElementById(
      filters[filter].HTMLidentifier
    );
  }
}

function registerCallbacks() {
  for (filter in filters) {
    filters[filter].HTMLElement.addEventListener("click", clickOnFilter);
  }
}

function writeTextOnPage() {
  filterTitleMain.innerText = filters.all.printableName;
  for (filter in filters) {
    filters[filter].HTMLElement.childNodes[0].nodeValue =
      filters[filter].printableName;
  }
}

function clickOnFilter(element, event) {
  for (filter in filters) {
    filters[filter].HTMLElement.classList.remove("active");
  }
  for (filter in filters) {
    if (filters[filter].HTMLidentifier === element.srcElement.id) {
      filterTitleMain.innerText = filters[filter].printableName;
      replaceTaskList(filters[filter]);
      break;
    }
  }
  element.srcElement.classList.add("active");
}

function replaceTaskList(filter) {
  activityListElement.innerHTML = "";

  filter.taskList.addToHTML();
}

function updateArraysAndStats() {
  for (filter in filters) {
    filters[filter].taskList = filters.all.taskList.getCategory(
      filters[filter].id
    );
    const badge = filters[filter].HTMLElement.querySelector("span");
    badge.innerText = filters[filter].taskList.getLength();
  }
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

  this.isUrgent = () => {
    return this.urgent;
  };

  this.isPrivate = () => {
    return this.private_;
  };

  this.getDeadline = () => deadline;

  this.getDeadlineDiff = () => {
    if (this.deadline == undefined) {
      return undefined;
    }
    let day_diff;
    day_diff = this.deadline.diff(dayjs(), "day");
    return day_diff;
  };

  this.getDeadlineDiffString = () => {
    const day_diff = this.getDeadlineDiff();
    if (day_diff === undefined) {
      return "";
    }
    if (day_diff === 0) {
      day_diff_string = "Today";
    } else if (day_diff > 0) {
      day_diff_string = "in " + day_diff.toString() + " days";
    } else {
      day_diff_string = "expired since " + (-1 * day_diff).toString() + " days";
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
    const shared_icon = document.createElement("i");
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

  this.getCategory = (category) => {
    if (category === "all") {
      return this;
    } else if (category === "important") {
      const new_list = new TaskList();
      this.tasks
        .filter((task) => task.isUrgent())
        .forEach((task) => new_list.addTask(task));
      return new_list;
    } else if (category === "today") {
      const new_list = new TaskList();
      this.tasks
        .filter((task) => task.getDeadlineDiffString() === "Today")
        .forEach((task) => new_list.addTask(task));
      return new_list;
    } else if (category === "next7days") {
      const new_list = new TaskList();
      this.tasks
        .filter(
          (task) => task.getDeadlineDiff() > 0 && task.getDeadlineDiff() <= 7
        )
        .forEach((task) => new_list.addTask(task));
      return new_list;
    } else if (category === "private") {
      const new_list = new TaskList();
      this.tasks
        .filter((task) => task.isPrivate())
        .forEach((task) => new_list.addTask(task));
      return new_list;
    }
  };

  this.getLength = () => {
    return this.tasks.length;
  };
}
