import { MdModeEditOutline } from "react-icons/md";
import { MdOutlineDelete } from "react-icons/md";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Alert from "react-bootstrap/Alert";

export default function GetNotes() {
  // model
  const [activefilterStatus, setActiveFilterStatus] = useState({
    all: true,
    complete: false,
    pending: false,
  });
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [inputNote, setInputNote] = useState("");
  const [inputNoteUpdate, setInputNoteUpdate] = useState("");
  const [updateActiveId, setUpdateActiveId] = useState();
  const [todoData, setTodoData] = useState([]);
  const [todoDataBackup, setTodoDataBackup] = useState([]);
  // fetch Data
  const fetchTodoListData = async () => {
    const res = await fetch("http://localhost:10000/notes");
    const data = await res.json();
    setTodoDataBackup(data);
    setTodoData(data);
  };
  // autoclose modal
  const autoCloseModel = () => {
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage("");
      setAlertStatus("");
      setAlertTitle("");
    }, 2500);
  };
  // modal message set
  const alertMessageFunc = (title, status, message) => {
    setShowAlert(true);
    setAlertMessage(message);
    setAlertStatus(status);
    setAlertTitle(title);
  };
  const submitNote = async (e) => {
    e.preventDefault();

    if (inputNote == "") {
      alertMessageFunc(
        "Empty Field Warning",
        "warning",
        "Please Enter Note Title"
      );
      autoCloseModel();
      return;
    }
    if (inputNote.length <= 3) {
      alertMessageFunc(
        "Note Title Warning",
        "warning",
        "The title must be at least 3 characters long"
      );
      autoCloseModel();
      return;
    }

    // send data
    const res = await fetch("http://localhost:10000/notes/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: inputNote }),
    });
    const data = await res.json();
    if (res.status == "400") {
      alertMessageFunc("Note Title Warning", "warning", data.message);
      autoCloseModel();
      return;
    }
    if (res.status == "409") {
      alertMessageFunc("Todo List Error", "danger", data.message);
      autoCloseModel();
      return;
    }
    alertMessageFunc("Success", "success", "TodoList Successfully created");
    autoCloseModel();
    fetchTodoListData();
    setInputNote("");
  };

  // getting new data
  useEffect(() => {
    fetchTodoListData();
  }, []);

  // delete notes
  const deleteNotes = async (id) => {
    try {
      const response = await fetch(`http://localhost:10000/notes/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // You may need to include additional headers like Authorization if needed
        },
      });
      let message = await response.json();
      if (!response.ok) {
        throw new Error("Failed to delete user");
      }
      if (response.status == "400") {
        alertMessageFunc("Empty Field Warning", "warning", message.message);
        autoCloseModel();
        return;
      }

      alertMessageFunc("Success", "success", message.message);
      autoCloseModel();
      fetchTodoListData();
      setInputNote("");
      setActiveFilterStatus({ all: true, complete: false, pending: false });
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  // edit notes

  const editData = (id, value) => {
    handleShow();
    setUpdateActiveId(id);
    setInputNoteUpdate(value);
  };

  // UpdateTodoData
  const UpdateTodoData = async (e) => {
    e.preventDefault();
    if (updateActiveId == undefined) {
      handleClose();

      alertMessageFunc("Provide Id To Update", "danger", "Please Retry Again");
      autoCloseModel();
      return;
    }
    if (inputNoteUpdate == "") {
      handleClose();

      alertMessageFunc(
        "Empty Field Warning",
        "warning",
        "Please Enter Note Title"
      );
      autoCloseModel();
      return;
    }
    if (inputNoteUpdate.length <= 3) {
      handleClose();

      alertMessageFunc(
        "Note Title Warning",
        "warning",
        "The title must be at least 3 characters long"
      );
      autoCloseModel();
      return;
    }

    // send data
    const res = await fetch("http://localhost:10000/notes/patch", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: inputNoteUpdate, id: updateActiveId }),
    });
    const data = await res.json();
    if (res.status == "400") {
      handleClose();

      alertMessageFunc("Bad Request", "warning", data.message);
      autoCloseModel();
      return;
    }
    if (res.status == "409") {
      handleClose();
      alertMessageFunc("Todo List Error", "danger", data.message);
      autoCloseModel();
      return;
    }
    alertMessageFunc("Success", "success", "TodoList Successfully created");
    autoCloseModel();
    fetchTodoListData();
    setInputNote("");
    setActiveFilterStatus({ all: true, complete: false, pending: false });
    handleClose();
    setUpdateActiveId("");
  };

  // updateStatus
  const updateStatus = async (id, message) => {
    if (id == undefined) {
      alertMessageFunc("Provide Id To Update", "danger", "Please Retry Again");
      autoCloseModel();
      return;
    }

    // send data
    const res = await fetch("http://localhost:10000/notes/patch/status", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, status: message }),
    });
    const data = await res.json();
    if (res.status == "400") {
      alertMessageFunc("Bad Request", "warning", data.message);
      autoCloseModel();
      return;
    }
    if (res.status == "409") {
      alertMessageFunc("Todo List Error", "danger", data.message);
      autoCloseModel();
      return;
    }
    alertMessageFunc(
      "Success",
      "success",
      "TodoList State Successfully Updated"
    );
    autoCloseModel();
    fetchTodoListData();
    setActiveFilterStatus({ all: true, complete: false, pending: false });
  };

  // filterData
  const filterData = (filter) => {
    let copyData = structuredClone(todoDataBackup);
    if (filter == "all") {
      setTodoData(todoDataBackup);
      setActiveFilterStatus({ all: true, complete: false, pending: false });
    }
    if (filter == "complete") {
      const filterData = copyData.filter((item) => item.status == "complete");
      setActiveFilterStatus({ all: false, complete: true, pending: false });
      setTodoData(filterData);
    }
    if (filter == "pending") {
      const filerData = copyData.filter((item) => item.status == "pending");
      setTodoData(filerData);
      setActiveFilterStatus({ all: false, complete: false, pending: true });
    }
  };
  return (
    <>
      {/* pop up alert */}
      {showAlert && (
        <>
          {" "}
          <Alert
            className="fixed-top w-100 h-2 "
            variant={alertStatus}
            onClose={() => setShow(false)}
            dismissible
          >
            <Alert.Heading>{alertTitle}</Alert.Heading>
            <p>{alertMessage}</p>
          </Alert>
        </>
      )}

      <div className="insertNote">
        {/* insert data form*/}
        <div className="insertDataForm">
          <form onSubmit={submitNote}>
            <li>
              <input
                type="text"
                placeholder="Insert Note Title"
                value={inputNote}
                onChange={(e) => setInputNote(e.target.value)}
                required
              />
              <button type="submit" title="Insert">
                +
              </button>
            </li>
          </form>
        </div>
      </div>

      {/* filter Menu */}
      <div className="filerNotes">
        <li
          className={activefilterStatus.all ? "activeFilter" : ""}
          onClick={() => filterData("all")}
        >
          All
        </li>
        <li
          className={activefilterStatus.complete ? "activeFilter" : ""}
          onClick={() => filterData("complete")}
        >
          Completed
        </li>
        <li
          className={activefilterStatus.pending ? "activeFilter" : ""}
          onClick={() => filterData("pending")}
        >
          Pending
        </li>
      </div>
      {/* list */}
      <div className="listShow">
        {todoData.length != 0 && (
          <>
            {todoData.map((item) => {
              return (
                <li key={item._id}>
                  <div className="checkbox">
                    {item.status == "pending" ? (
                      <input
                        type="checkbox"
                        onClick={() => updateStatus(item._id, "complete")}
                      />
                    ) : (
                      <input
                        type="checkbox"
                        onClick={() => updateStatus(item._id, "pending")}
                        defaultChecked
                      />
                    )}
                  </div>
                  <div className="noteTitle">{item.title}</div>
                  <div
                    className="editBtn"
                    title="Edit"
                    onClick={() => editData(item._id, item.title)}
                  >
                    <MdModeEditOutline />
                  </div>
                  <div
                    className="deleteBtn"
                    title="Delete"
                    onClick={() => deleteNotes(item._id)}
                  >
                    <MdOutlineDelete />
                  </div>
                </li>
              );
            })}
          </>
        )}
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="insertNote">
            <div className="insertDataForm">
              <li>
                <input
                  type="text"
                  value={inputNoteUpdate}
                  onChange={(e) => setInputNoteUpdate(e.target.value)}
                />
              </li>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={UpdateTodoData}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
