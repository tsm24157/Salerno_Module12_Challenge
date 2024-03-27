USE employees_db;

INSERT INTO department (name)
VALUES
        ("register"),
        ("pharmacy"),
        ("managerial");

INSERT INTO role (title, salary, department_id)
VALUES
        ("clerk", 10000, 1),
        ("pharmacist", 20000, 2),
        ("owner", 30000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
        ("Symere", "Woods", 1, NULL),
        ("Scott", "Paulie", 2, NULL),
        ("Arthur", "Morgan", 3, 1);
