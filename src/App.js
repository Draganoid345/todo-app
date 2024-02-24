import React from "react";
import dayjs from "dayjs";
import { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { gapi, loadClientAuth2 } from "gapi-script";

import Todo from "./components/Todo";

function App() {
  // Google Calendar API setup
  // const apiKey = "AIzaSyBzgcteXgcKhURZdNrxAthvR4l2StpuWr8";
  // const clientId =
  //   "872773488451-qd12dcbe7u1akbdcv1hfs75rbtq8bado.apps.googleusercontent.com";
  // const discoveryDocs =
  //   "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  // const scopes = "https://www.googleapis.com/auth/calendar.events";
  // const calendarID = "dragos.rusnac@gmail.com";

  // const [events, setEvents] = useState([]);

  // const getEvents = (calendarID, apiKey) => {
  //   function initiate() {
  //     gapi.client
  //       .init({
  //         apiKey: apiKey,
  //         discoveryDocs: [discoveryDocs],
  //       })
  //       .then(function () {
  //         return gapi.client.request({
  //           path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events`,
  //         });
  //       })
  //       .then(
  //         (response) => {
  //           let events = response.result.items;
  //           setEvents(events);
  //         },
  //         function (err) {
  //           return [false, err];
  //         }
  //       );
  //   }
  //   gapi.load("client", initiate);
  // };

  // useEffect(() => {
  //   const events = getEvents(calendarID, apiKey);
  //   setEvents(events);
  //   console.log("Events: ", events);
  // }, []);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
    setItemDateTime(dayjs());
  };
  const handleClose = () => setOpen(false);

  // Handle switch
  const [isGoogleCalendar, setIsGoogleCalendar] = useState(false);
  const handleSwitchChange = (event) => {
    setIsGoogleCalendar(event.target.checked);
    console.log("Google Calendar: ", event.target.checked);
  };

  const [itemDateTime, setItemDateTime] = useState(dayjs());
  const [itemTitle, setItemTitle] = useState("");

  const handleItemTitleChange = (event) => {
    setItemTitle(event.target.value);
  };

  // Read todos from firestore
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const q = query(collection(db, "todo-app"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const title = data.title;
        const date = data.date.toDate().toString();
        todosArray.push({ title: title, date: date, id: doc.id });
      });
      setTodos(todosArray);
    });
    return () => unsubscribe();
  }, []);

  // Delete todo from firestore
  const deleteTodo = async (id) => {
    console.log("Deleting todo with id: ", id);
    // Delete from firestore
    await deleteDoc(doc(db, "todo-app", id));
  };

  // Add todo to firestore
  const hanldeAddItem = async () => {
    console.log(itemTitle, itemDateTime);
    if (itemTitle === "") {
      alert("Title cannot be empty");
      return;
    }
    await addDoc(collection(db, "todo-app"), {
      title: itemTitle,
      date: Timestamp.fromDate(itemDateTime.toDate()),
    });

    // Cleanup
    setItemTitle("");
    setItemDateTime(dayjs());
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="h-screen w-screen p-4">
        <header className="flex justify-center items-center h-1/6 text-4xl font-bold">
          Todo App
        </header>
        <div className="flex justify-center items-center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleOpen}
          >
            Add Item
          </Button>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add Item</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id="title"
              variant="outlined"
              label="Title"
              type="text"
              margin="dense"
              fullWidth
              onChange={handleItemTitleChange}
            />
            <DateTimePicker
              fullWidth
              margin="dense"
              defaultValue={dayjs()}
              onChange={(newValue) => setItemDateTime(newValue)}
            />
            <div className="m-4 justify-center items-center">
              Add to Google Calendar
              <Switch onChange={handleSwitchChange} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={hanldeAddItem} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        <div className="flex justify-center items-center">
          <List sx={{ width: "100%", maxWidth: 500 }}>
            {todos.map((todo, index) => (
              <Todo
                key={index}
                title={todo.title}
                date={todo.date}
                id={todo.id}
                deleteTodo={deleteTodo}
              />
            ))}
          </List>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default App;
