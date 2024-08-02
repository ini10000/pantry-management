// pages/index.js
import { useState } from "react";
import PantryForm from "../components/PantryForm";
import PantryList from "../components/PantryList";
import { Container, Typography, Grid, Box } from "@mui/material";

export default function Home() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleComplete = () => {
    setSelectedItem(null);
  };

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Pantry Management
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <PantryForm item={selectedItem} onComplete={handleComplete} />
          </Grid>
          <Grid item xs={12} md={8}>
            <PantryList onItemSelect={setSelectedItem} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
