import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { BACKGROUND_IMAGE } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const TaskComponent = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          console.log("User is not logged in");
          return;
        }

        const headers = {
          Authorization: token,
        };

        const response = await axios.get(
          "http://localhost:5000/api/tasks/get",
          { headers }
        );

        setTasks(response?.data?.task);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Task Name is required"),
    description: Yup.string().required("Task Description is required"),
    status: Yup.string().required("Task Status is required"),
  });

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
    formik.setValues({
      name: task.name,
      description: task.description,
      status: task.status,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/"); // Use navigate to redirect to the login page
  };
  const handleCreateOrUpdateTask = async (values, resetForm) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.log("User is not logged in");
        return;
      }

      const headers = {
        Authorization: token,
        "Content-Type": "application/json",
      };

      let apiUrl, method;

      if (editingTask) {
        apiUrl = `http://localhost:5000/api/tasks/update/${editingTask._id}`;
        method = "put";
      } else {
        apiUrl = "http://localhost:5000/api/tasks/create-task";
        method = "post";
      }

      const response = await axios({
        method: method,
        url: apiUrl,
        data: values,
        headers: headers,
      });

      if (editingTask) {
        const updatedTasks = tasks.map((task) =>
          task._id === editingTask._id ? response?.data?.task : task
        );
        setTasks(updatedTasks);
      } else {
        setTasks([...tasks, response?.data?.task]);
      }

      setEditingTask(null);
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("Error creating/updating task:", error);
    }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        console.log("User is not logged in");
        return;
      }
      const headers = {
        Authorization: token,
      };
      const apiUrl = `http://localhost:5000/api/tasks/delete/${taskId}`;
      await axios.delete(apiUrl, { headers });
      const updatedTasks = tasks.filter((task) => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      status: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      await handleCreateOrUpdateTask(values, resetForm);
    },
  });

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${BACKGROUND_IMAGE})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
          <Button
          variant="outline-danger"
          style={{
            marginLeft: '10px', 
            animation: 'pulse 2s infinite',
          }}
          onClick={handleLogout} 
        >
          Logout
        </Button>
        <div
          className="my-4 mx-4"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "15px",
            padding: "20px",
            maxWidth: "1000px",
            width: "90%",
          }}
        >
          <Button
            variant="success"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              animation: "pulse 2s infinite",
            }}
            onClick={() => {
              setShowModal(true);
              setEditingTask(null);
              formik.resetForm();
            }}
          >
            Create Task
          </Button>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editingTask ? "Edit Task" : "Create Task"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={formik.handleSubmit}>
                <Form.Group controlId="taskName">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter task name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="error">{formik.errors.name}</div>
                  )}
                </Form.Group>
                <Form.Group controlId="taskDescription">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter task description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <div className="error">{formik.errors.description}</div>
                  )}
                </Form.Group>
                <Form.Group controlId="taskStatus" className="mb-3">
                  <Form.Label>Task Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="" label="Select a status" />
                    <option value="completed" label="Completed" />
                    <option value="pending" label="Pending" />
                    <option value="in-progress" label="In Progress" />
                  </Form.Control>
                  {formik.touched.status && formik.errors.status && (
                    <div className="error">{formik.errors.status}</div>
                  )}
                </Form.Group>
                <Button variant="primary" type="submit">
                  {editingTask ? "Save Changes" : "Create"}
                </Button>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

          <Table striped bordered hover variant="light">
            <thead>
              <tr>
                <th style={{ width: "20%" }}>Task Name</th>
                <th style={{ width: "40%" }}>Task Description</th>
                <th style={{ width: "20%" }}>Task Status</th>
                <th style={{ width: "20%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.name}</td>
                  <td>
                    <div
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "8px",
                        padding: "10px",
                      }}
                    >
                      {task.description}
                    </div>
                  </td>
                  <td>{task.status}</td>
                  <td>
                    <Button variant="info" onClick={() => handleEditTask(task)}>
                      Edit
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteTask(task._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};
export default TaskComponent;
