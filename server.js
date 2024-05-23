const pool = require('./pool.js');
const inquirer = require('inquirer');
let client 
const connectToDb = async () => {
    client = await pool.connect();
}
connectToDb();



//const { getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./databaseFunctions');

async function startApplication() {
    console.log("Welcome to your Employee Management System!");
    while (true) {
        const { action } = await inquirer.prompt({
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
        });

        switch (action) {
            case 'View all departments':
                await viewAllDepartments();
                break;
            case 'View all roles':
                await viewAllRoles();
                break;
            case 'View all employees':
                await viewAllEmployees();
                break;
            case 'Add a department':
                await addDepartmentPrompt();
                break;
            case 'Add a role':
                await addRolePrompt();
                break;
            case 'Add an employee':
                await addEmployeePrompt();
                break;
            case 'Update an employee role':
                await updateEmployeeRolePrompt();
                break;
            case 'Exit':
                console.log('Exiting application.');
                return;
        }
    }
}


async function viewAllDepartments() {
    const res = await client.query('SELECT * FROM department');
    console.table(res.rows);
    //const departments = await getAllDepartments();
    // Display formatted table of department names and ids
}

async function viewAllRoles() {
    const roles = await getAllRoles();
    // Display formatted table of roles
}

// async function viewAllEmployees() {
//     const employees = await getAllEmployees();
//     // Display formatted table of employee data
// }

async function addDepartmentPrompt() {
    const { departmentName } = await inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter the name of the department:'
    });
    await addDepartment(departmentName);
    console.log('Department added successfully!');
}

async function addRolePrompt() {
    // Prompt for role details and add to database
}

async function addEmployeePrompt() {
    // Prompt for employee details and add to database
}

async function updateEmployeeRolePrompt() {
    // Prompt to select an employee and update their role
}

startApplication();
