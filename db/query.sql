
SELECT employee.id, employee.first_name, employee.last_name, z.title, department.name
AS 'department', role.salary,
CONCAT(manager.first_name, '', manager.last_name)
AS manager
FROM employee
LEFT JOIN role
ON employee.role_id = role.id
