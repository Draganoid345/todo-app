import React from "react";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const Todo = ({ title, date, id, deleteTodo }) => {
  return (
    <div className="border-2 border-black rounded-lg m-4">
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => deleteTodo(id)}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemText primary={title} secondary={date} />
      </ListItem>
    </div>
  );
};

export default Todo;
