
const taskForm = document.querySelector('.form');
const taskLine = document.querySelector('.taskLine');
const taskSubmit = document.querySelector('.taskSubmit');


//如何添加回车触发
taskForm.addEventListener('click', creatTask);

//HTML的body
var mybody = document.getElementsByTagName("body").item(0);
//待办的div
var myTodo = mybody.getElementsByClassName("todoForm").item(0);
//已完成的div
var myDone = mybody.getElementsByClassName("doneForm").item(0);
//任务细节的div
var myDetails = mybody.getElementsByClassName("details").item(0);

let taskIdCounter = 1;
const mapDup2Ori = new Map();
let hideDetailsFlag = true;

//创建任务，初始为待办任务
function creatTask() {
    //获取taskLine的任务名
    // 如何用优雅的办法获得taskLine中的文本数据？
    var myTextInput = mybody.getElementsByClassName("taskLine").item(0);
    var theText = myTextInput.value;
    //将TaskLine的内容清空
    resetTaskLine();
    //如果TaskLine的内容为空，则不添加空的任务
    if (!theText) {
        this.preventDefault();
    }
    //创建Task的div块，包含一个checkbox和一个button
    var newTaskDiv = document.createElement("div");
    newTaskDiv.setAttribute("id", taskIdCounter++);
    //创建checkbox，用于标记Task是否完成
    var newTaskCheckbox = document.createElement("input");
    newTaskCheckbox.setAttribute("type", "checkbox");
    newTaskCheckbox.setAttribute("class", "taskStatus");
    //为checkbox添加监听事件，标记其完成情况
    newTaskCheckbox.addEventListener("click", markAsCompleted);
    //创建button，其value存储任务名
    var newTaskButton = document.createElement("input");
    newTaskButton.setAttribute("type", "button");
    newTaskButton.setAttribute("class", "taskName");
    //为button添加监听事件，展示Task的详细细节
    newTaskButton.addEventListener("click", showDetails);
    //对button定义任务名
    newTaskButton.value = theText;
    //按顺序构建DOM树
    newTaskDiv.appendChild(newTaskCheckbox);
    newTaskDiv.appendChild(newTaskButton);
    myTodo.appendChild(newTaskDiv);
}

//响应checkbox的click事件，对任务完成情况进行标记并分类
function markAsCompleted() {
    // console.log(this.checked);
    //this是button元素，this的父元素是该任务的div块
    var parent = this.parentElement;
    //根据this.checked，判断任务是否完成
    if (this.checked) {
        //从待办移除节点，再加入到已完成，并且刷新细节
        myTodo.removeChild(parent);
        myDone.appendChild(parent);
        // console.log(myDone);
        var curTaskCheckbox = parent.querySelector(".taskStatus");
        // showDetails.call(curTaskCheckbox, null);
        updateDetails(curTaskCheckbox);
    } else {
        myDone.removeChild(parent);
        myTodo.appendChild(parent);
        // console.log(myTodo);
        var curTaskCheckbox = parent.querySelector(".taskStatus");
        // showDetails.call(curTaskCheckbox ,null);
        updateDetails(curTaskCheckbox);
    }
}

//清空taskLine
function resetTaskLine() {
    const resetParas = document.querySelector('.taskLine');
    resetParas.value = '';
}

//展示任务细节
function showDetails() {
    hideDetailsFlag = false;
    updateDetails(this);
}

//刷新展示的任务细节
function updateDetails(obj) {
    //刷新
    closeDetails();

    //是否隐藏，设置div的display属性
    if (hideDetailsFlag) {
        myDetails.style.display = "none";
    } else {
        myDetails.style.display = "block";
    }

    
    //创建任务副本，并映射到母本
    var parent = obj.parentElement;
    var cloneParent = parent.cloneNode(true);
    // console.log(cloneParent);
    mapDup2Ori.set(cloneParent, parent);
    
    //配置副本，添加text类型的input维护任务名
    var dupTaskNode = cloneParent;
    var dupTaskCheckbox = dupTaskNode.querySelector('.taskStatus');
    var dupTaskButton = dupTaskNode.querySelector('.taskName');
    var dupTaskText = document.createElement("input");
    dupTaskText.setAttribute("type", "text");
    dupTaskText.setAttribute("class", "taskNameText");
    dupTaskText.value = dupTaskButton.value;
    dupTaskButton.remove();
    dupTaskNode.appendChild(dupTaskText);

    dupTaskCheckbox.addEventListener("click", updateStatus);
    dupTaskText.addEventListener("change", updateName);

    
    // var detailsTitle = document.createElement("h1");
    // newTextNode = document.createTextNode("任务详细信息");
    // detailsTitle.appendChild(newTextNode);

    var hideButton = document.createElement("input");
    hideButton.setAttribute("type", "button");
    hideButton.setAttribute("class", "hideButton");
    hideButton.value = "隐藏";
    hideButton.addEventListener("click", hideDetails);

    var deleteButton = document.createElement("input");
    deleteButton.setAttribute("type", "button");
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.value = "删除任务";
    deleteButton.addEventListener("click", deleteTask);

    // myDetails.appendChild(detailsTitle);
    dupTaskNode.appendChild(hideButton);
    dupTaskNode.appendChild(deleteButton);
    myDetails.appendChild(dupTaskNode);
}


//更新副本的完成情况，同时更新母本
function updateStatus() {
    var dupTaskNode = this.parentElement;
    var oriTaskNode = mapDup2Ori.get(dupTaskNode);
    var oriTaskCheckbox = oriTaskNode.querySelector(".taskStatus");
    oriTaskCheckbox.checked = this.checked;
    // console.log(this.checked);
    // console.log(oriTaskCheckbox.checked);
    var event = new Event('click');
    oriTaskCheckbox.dispatchEvent(event);
}

//更新副本的任务名，同时更新母本
function updateName() {
    var dupTaskNode = this.parentElement;
    var oriTaskNode = mapDup2Ori.get(dupTaskNode);
    var oriTaskButton = oriTaskNode.querySelector(".taskName");
    oriTaskButton.value = this.value;
}

//隐藏任务细节
function hideDetails() {
    hideDetailsFlag = true;
    // closeDetails();
    myDetails.style.display = "none";
}

//删除任务, 同步删除母本
function deleteTask() {
    var curTaskNode = this.parentElement;
    var oriTaskNode = mapDup2Ori.get(curTaskNode);

    result = window.confirm(`将永久删除${curTaskNode.querySelector('.taskNameText').value}`);
    if (!result) {
        this.preventDefault();
    }
    curTaskNode.remove();
    oriTaskNode.remove();
    hideDetails();
}

function closeDetails() {
    // myDetails.style.display = "none";
    var detailsTaskNode = myDetails.getElementsByTagName('div').item(0);
    if (detailsTaskNode) {
        myDetails.removeChild(detailsTaskNode);
    }
}