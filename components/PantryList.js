import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { TextField, Button, Box, Typography } from "@mui/material";
import PantryItem from "./PantryItem";

export default function PantryList({ onItemSelect }) {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "pantry"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setItems(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleGetRecipes = async () => {
    try {
      const itemNames = filteredItems.map((item) => item.name);
      const response = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: itemNames }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to fetch recipes:", error);
        return;
      }

      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleDelete = async (item) => {
    await deleteDoc(doc(db, "pantry", item.id));
  };

  return (
    <Box>
      <TextField
        label="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box>
        {filteredItems.map((item) => (
          <PantryItem
            key={item.id}
            item={item}
            onItemSelect={onItemSelect}
            onDelete={handleDelete}
          />
        ))}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleGetRecipes}>
          Get Recipes
        </Button>
      </Box>
      {recipes?.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Recipes:</Typography>
          <ul>
            {recipes.map((recipe, index) => (
              <li key={index}>{recipe}</li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  );
}
