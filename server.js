const mysql = require('mysql2');
const inquirer = require('inquirer');
const fs = require('fs');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'employees_db'
  },
  console.log(`Connected to employees_db.`)
);

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("connected to MySql");
});

returnStart();

const inquireRole = [
  'Enter the role of the employee.',
  'Enter the salary of said employee.',
  'Enter the department of said employee.'
];

const inquireEmployeeInfo = [
  'Enter the employees first name.',
  'Enter the employees last name.',
  'Enter the role of the employee.',
  'Enter the managers name for said employee.'
];

const inquireRoleUpdate = [
  'Select which employee you would like to update.',
  'Select a role that applies to said employee.'
];

function returnStart() {
  inquirer.prompt([
    {
      type: 'list',
      message: 'What action would you like to perform?',
      name: 'startMenu',
      choices:
        [
          'Display departments',
          'Display roles',
          'Display employees',
          'Create department',
          'Create role',
          'Create a new employee',
          'Update employee information'
        ],
    }
  ])
    .then(response => {
      console.log(response);
      switch (response.startMenu) {
        case 'Display departments':
          displayDepartments();
          break;
        case 'Display roles':
          displayRoles();
          break;
        case 'Display employees':
          viewEmployees();
          break;
        case 'Create department':
          createDepartment();
          break;
        case 'Create role':
          createRole();
          break;
        case 'Create a new employee':
          createEmployee();
          break;
        case 'Update employee information':
          updateEmployee();
          break;
      }
    })
};

function displayDepartments() {
  const query = 'SELECT * FROM department';
  db.query(query, (err, results) => {
    if (err)
      throw err;
    console.log('\n');
    console.table(results);

    inquirer.prompt([
      {
        type: 'input',
        name: 'Return',
        message: 'Press enter to return to the start menu'
      }
    ]).then(() => {
      returnStart();
    })
  });
};

function displayRoles() {
  const query = 'SELECT * FROM role';
  db.query(query, (err, results) => {
    if (err)
      throw err;

    console.log('\n');
    console.table(results);

    inquirer.prompt([
      {
        type: 'input',
        name: 'Return',
        message: 'Press enter to return to the start menu'
      }
    ]).then(() => {
      returnStart();
    })
  });
};

function viewEmployees() {
  const query = 'SELECT * FROM employee';
  db.query(query, (err, results) => {
    if (err)
      throw err;

    console.log('\n');
    console.table(results);

    inquirer.prompt([
      {
        type: 'input',
        name: 'Return',
        message: 'Press enter to return to the start menu'
      }
    ]).then(() => {
      returnStart();
    })
  });
};

function createDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department being created.',
    }
  ]).then(response => {
    const query = `INSERT INTO department (name)
    VALUES (?)`;
    db.query(query, [response.departmentName], (err, results) => {
      if (err)
        throw err;

      console.log(`${response.departmentName} department has been created.`);

      inquirer.prompt([
        {
          type: 'input',
          name: 'Return',
          message: 'Press enter to return to the start menu'
        }
      ]).then(() => {
        returnStart();
      });
    });
  });
};

function createRole() {
  db.query('SELECT id, name FROM department', (err, departments) => {
    if (err)
      throw err;

    const deptChoices = departments.map(dept => ({
      name: dept.name,
      value: dept.id,
    }));

    inquirer.prompt([
      {
        type: 'input',
        name: 'roleName',
        message: inquireRole[0],
      },
      {
        type: 'input',
        name: 'roleSalary',
        message: inquireRole[1],
      },
      {
        type: 'list',
        name: 'roleDept',
        message: inquireRole[2],
        choices: deptChoices
      },
    ]).then(response => {
      const query = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
      db.query(query, [response.roleName, response.roleSalary, response.roleDept], (err, results) => {
        if (err)
          throw err;

        console.log(`${response.roleName} has been added to ${response.roleDept}.`);

        inquirer.prompt([
          {
            type: 'input',
            name: 'Return',
            message: 'Press enter to return to the start menu'
          }
        ]).then(() => {
          returnStart();
        });
      });
    });
  });
};

function createEmployee() {
  db.query('SELECT id, title FROM role', (err, roles) => {
    if (err) throw err;

    const roleChoices = roles.map(role => ({
      name: role.title,
      value: role.id,
    }));

    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee WHERE manager_id IS NULL', (err, managers) => {
      if (err) throw err;

      const managerChoices = managers.map(manager => ({
        name: manager.name,
        value: manager.id,
      })).concat([{ name: 'No Manager', value: null }]);

      inquirer.prompt([
        {
          type: 'input',
          name: 'firstName',
          message: inquireEmployeeInfo[0],
        },
        {
          type: 'input',
          name: 'lastName',
          message: inquireEmployeeInfo[1],
        },
        {
          type: 'list',
          name: 'roleId',
          message: inquireEmployeeInfo[2],
          choices: roleChoices,
        },
        {
          type: 'list',
          name: 'managerId',
          message: inquireEmployeeInfo[3],
          choices: managerChoices,
        },
      ]).then(responses => {
        const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
        db.query(query, [responses.firstName, responses.lastName, responses.roleId, responses.managerId], (err, results) => {
          if (err) throw err;

          console.log('Employee added successfully.');

          inquirer.prompt([
            {
              type: 'input',
              name: 'Return',
              message: 'Press enter to return to the start menu'
            }
          ]).then(() => {
            returnStart();
          });
        });
      });
    });
  });
}


function updateEmployee() {
  db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', (err, employees) => {
    if (err) throw err;

    const employeeValues = employees.map(employee => ({
      name: employee.name,
      value: employee.id,
    }));

    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: inquireRoleUpdate[0],
        choices: employeeValues,
      }
    ]).then(employeeResponse => {
      db.query('SELECT id, title FROM role', (err, roles) => {
        if (err) throw err;

        const roleChoices = roles.map(role => ({
          name: role.title,
          value: role.id,
        }));

        inquirer.prompt([
          {
            type: 'list',
            name: 'roleId',
            message: inquireRoleUpdate[1],
            choices: roleChoices,
          }
        ]).then(roleResponse => {
          const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
          db.query(updateQuery, [roleResponse.roleId, employeeResponse.employeeId], (err, results) => {
            if (err) throw err;

            console.log('Employee role updated successfully.');

            inquirer.prompt([
              {
                type: 'input',
                name: 'Return',
                message: 'Press enter to return to the start menu'
              }
            ]).then(() => {
              returnStart();
            });
          });
        });
      });
    });
  });
}