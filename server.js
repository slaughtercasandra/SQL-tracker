const pool = require('./pool.js');
const inquirer = require('inquirer');
let client;

const connectToDb = async () => {
    try {
        client = await pool.connect();
        console.log("Connected to the database");
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
}

connectToDb();

async function viewAllRoles() {
    try {
        const res = await client.query(
            `SELECT role.id, role.title, role.salary, department.name AS department
            FROM role
            JOIN department ON role.department_id = department.id`
        );
        console.table(res.rows);
    } catch (error) {
        console.error("Error viewing roles:", error);
    }
}

async function viewAllEmployees() {
    try {
        const res = await client.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, manager.first_name AS manager
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id
            LEFT JOIN employee manager ON employee.manager_id = manager.id`
        );
        console.table(res.rows);
    } catch (error) {
        console.error("Error viewing employees:", error);
    }
}

async function viewAllDepartments() {
    try {
        const res = await client.query('SELECT * FROM department');
        console.table(res.rows);
    } catch (error) {
        console.error("Error viewing departments:", error);
    }
}

async function addDepartmentPrompt() {
    try {
        const { departmentName } = await inquirer.prompt({
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:'
        });
        await addDepartment(departmentName);
        console.log('Department added successfully!');
    } catch (error) {
        console.error("Error adding department:", error);
    }
}
async function addRole(title, salary, departmentId) {
    try {
        const res = await client.query(
            'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)',
            [title, salary, departmentId]
        );
        console.log('Role added successfully!');
    } catch (error) {
        console.error("Error adding role:", error);
    }
}

async function addRolePrompt() {
    try {
        const { title, salary, departmentId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:'
            },
            {
                type: 'input',
                name: 'departmentId',
                message: 'Enter the department ID for the role:'
            }
        ]);
        await addRole(title, salary, departmentId);
        console.log('Role added successfully!');
    } catch (error) {
        console.error("Error adding role:", error);
    }
}

async function addEmployee(firstName, lastName, roleId, managerId) {
    try {
        const res = await client.query(
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)',
            [firstName, lastName, roleId, managerId]
        );
        console.log('Employee added successfully!');
    } catch (error) {
        console.error("Error adding employee:", error);
    }
}

async function addEmployeePrompt() {
    try {
        const { firstName, lastName, roleId, managerId } = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: 'Enter the first name of the employee:'
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'Enter the last name of the employee:'
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'Enter the role ID for the employee:'
            },
            {
                type: 'input',
                name: 'managerId',
                message: 'Enter the manager ID for the employee:'
            }
        ]);
        await addEmployee(firstName, lastName, roleId, managerId);
        console.log('Employee added successfully!');
    } catch (error) {
        console.error("Error adding employee:", error);
    }
}

async function updateEmployeeRolePrompt() {
    try {
        const employees = await client.query('SELECT id, first_name, last_name FROM employee');
        const employeeChoices = employees.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id
        }));

        const { employeeId, roleId } = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Select the employee to update:',
                choices: employeeChoices
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'Enter the new role ID:'
            }
        ]);

        await updateEmployeeRole(employeeId, roleId);
        console.log('Employee role updated successfully!');
    } catch (error) {
        console.error("Error updating employee role:", error);
    }
}

async function updateEmployeeRole(employeeId, roleId) {
    try {
        await client.query(
            'UPDATE employee SET role_id = $1 WHERE id = $2',
            [roleId, employeeId]
        );
    } catch (error) {
        console.error("Error updating employee role:", error);
    }
}

async function startApplication() {
    try {
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
    } catch (error) {
        console.error("An unexpected error occurred:", error);
    }
}

startApplication();
