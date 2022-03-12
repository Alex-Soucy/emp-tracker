const inquirer = require('inquirer');
const db = require('./db/connection');
const deptArray = [];
const roleArray = [];
const empArray = [];
const mgrArray =[];

// Array of questions for the user to go through to track/change employees
const promptQuestions = [
    {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: 
        ["View all Departments", "View all Roles", "View all Employees", "Add a Role", "Add a Department", "Add an Employee","Update an Employee Role"]
    },
    {
        type: "input",
        name: "roleAssigned",
        message: "What is the role of the employee?",
        when: (answers) => answers.choices === "Add a Role",  
    },
    {
        type: "input",
        name: "roleSalary",
        message: "What is the salary of the employee?",
        validate: (valSalary) => 
        {
            if (isNaN(valSalary)) 
            {
              return "Please enter a valid salary";
            }
            return true;
        },
        when: (answers) => answers.choices === "Add a Role",  
    },
    {
        type: "list",
        name: "deptName",
        message: "What is the department does the employee belong in?",
        when: (answers) => answers.choices === 'Add a Role',
        choices: deptArray,  
    },
    {
        type: "input",
        name: "newDeptName",
        message: "Add a new department:",
        when: (answers) => answers.choices === "Add a Department",
    },
    {
        type: "input",
        name: "empFirstName",
        message: "First name of new employee:",
        when: (answers) => answers.choices === "Add an Employee", 
    },
    {
        type: "input",
        name: "empLastName",
        message: "Last name of new employee:",
        when: (answers) => answers.choices === "Add an Employee",
    },
    {
        type: "list",
        name: "newEmpTitle",
        message: "Title of new employee:",
        when: (answers) => answers.choices === "Add an Employee",
        choices: roleArray,
    },
    {
        type: "list",
        name: "newMgr",
        message: "Add a new Manager:",
        when: (answers) => answers.choices === "Add an Employee",
        choices: mgrArray,
    },
    {
        type: "list",
        name: "selectEmp",
        message: "Select which Employee you want to change:",
        when: (answers) => answers.choices === "Update an Employee Role",
        choices: empArray,  
    },
    {
        type: "list",
        name: "updateRole",
        message: "Select a new role for the employee:",
        when: (answers) => answers.choices === "Update an Employee Role",
        choices: roleArray,
    },
];

async function loadEmpList() 
{
    const query = `SELECT id, concat(first_name, \' \', last_name) as employeeName FROM employee;`;
    const [rows] = await db.execute(query);
    const empNamesArray = rows.map((row) => row.employeeName);
    empArray.push(...empNamesArray);
}

async function loadRoleList() 
{
    const [rows] = await db.execute(`SELECT title FROM role;`);
    const roleTitlesArray = rows.map((row) => row.title);
    roleArray.push(...roleTitlesArray);
}

async function loadDeptList() 
{
    const [rows] = await db.execute(`SELECT name FROM department;`);
    const deptNameArray = rows.map((row) => row.name);
    deptArray.push(...deptNameArray);
}

async function loadMgrList() 
{
    const query = `select concat(e.first_name, \' \', e.last_name) as employeeName from employee as e inner join role as r on e.role_id = r.id where r.title like '%manager'`;
    const [rows] = await db.execute(query);
    const empNamesArray = rows.map((row) => row.employeeName);
    mgrArray.push(...empNamesArray);
}

// Function to initalize the app
async function init() 
{
    try 
    {
        await loadEmpList();
        await loadRoleList();
        await loadDeptList();
        await loadMgrList();
        return inquirer.prompt(promptQuestions)
        .then(async (inputAnswer) => 
        {
            if (inputAnswer.choices === "View all Departments")
            {
                await getAllDepts();
            } 
            else if (inputAnswer.choices === "View all Roles")
            { 
                await getAllRoles();
            }
            else if (inputAnswer.choices === "View all Employees")
            { 
                await getAllEmp();
            }
            else if (inputAnswer.choices === "Add a Role")
            {
                await addRole(inputAnswer.roleAssigned, inputAnswer.roleSalary, inputAnswer.deptName);
            }
            else if (inputAnswer.choices === "Add a Department")
            {
                await addDept(inputAnswer.newDeptName);
            }
            else if (inputAnswer.choices === "Add an Employee")
            {
                await addEmployee(inputAnswer.empFirstName, inputAnswer.empLastName, inputAnswer.newEmpTitle, inputAnswer.newMgr);
            }
            else if (inputAnswer.choices === "Update an Employee Role")
            {
                await updateRole(inputAnswer.selectEmp, inputAnswer.updateRole);
            }
            db.end();
        });
    }
    catch (err){
        console.log(err);
    };
};

init();

// GET all departments from table
async function getAllDepts() 
{
    try 
    {
        const [results] = await db.execute(`SELECT * FROM department`);
        console.table(results);
    }
    catch(err) {
        console.log(err);    
    };
};

// GET all roles from table
async function getAllRoles() {
    try 
    {
        const [results] = await db.execute(`SELECT role.id, role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id=department.id;`);
        console.table(results);
    }
    catch(err) {
        console.log(err);
    };
};

async function getAllEmp() 
{
    try 
    {
        const getEmp = `SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name AS "Department Name",
        role.salary,
        CONCAT(manager.first_name, " ",manager.last_name) as "Manager Name"
        FROM employee
        JOIN role
        ON employee.role_id=role.id
        JOIN department
        ON department.id=role.department_id
        JOIN employee as Manager
        ON employee.manager_id=manager.id;`
        const [results] = await db.execute(getEmp);
        console.table(results);
    }
    catch(err) {
        console.log(err);
    };
};

