use employees;

INSERT INTO department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Manager', 90000, 1),
    ('Salesperson', 75000, 1),
    ('Mechanical Engineer', 80000, 2),
    ('Software Engineer', 85000, 2),
    ('Financial Analyst', 110000, 3),
    ('Accountant', 95000, 3),
    ('Lawyer', 120000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Bill', 'Brown', 1, NULL),
    ('James', 'Smith', 2, 1),
    ('Anthony', 'Lewis', 3, NULL),
    ('Jamie', 'Bell', 4, NULL),
    ('Natalia', 'Kowalski', 5, NULL),
    ('Jordan', 'Rollins', 6, 5),
    ('Noah','Hoffman', 7, NULL);