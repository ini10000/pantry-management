import { useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  TextField,
  Button,
  IconButton,
  Box,
  CircularProgress,
} from "@mui/material";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

export default function PantryForm({ item, onComplete }) {
  const [name, setName] = useState(item ? item.name : "");
  const [quantity, setQuantity] = useState(item ? item.quantity : "");
  const [image, setImage] = useState(item ? item.image : null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");

        const response = await fetch("/api/classify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageFile: { name: file.name, data: base64String },
          }),
        });

        const result = await response.json();
        setImage(result.imageUrl);
        if (result.classification && result.classification.length > 0) {
          setName(result.classification[0].description); // Assuming the most relevant label is the first one
        }
        setLoading(false);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name, quantity, image };
    if (item) {
      await updateDoc(doc(db, "pantry", item.id), data);
    } else {
      await addDoc(collection(db, "pantry"), data);
    }
    onComplete();
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "pantry", item.id));
    onComplete();
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        label="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <IconButton color="primary" component="label">
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
        />
        <CameraAltIcon />
      </IconButton>
      {loading && <CircularProgress />}
      {image && <img src={image} alt="Pantry item" width="100" />}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button type="submit" variant="contained" color="primary">
          {item ? "Update" : "Add"} Item
        </Button>
        {item && (
          <Button variant="contained" color="secondary" onClick={handleDelete}>
            Delete Item
          </Button>
        )}
      </Box>
    </Box>
  );
}
