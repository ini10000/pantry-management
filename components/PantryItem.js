// components/PantryItem.js
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";

export default function PantryItem({ item, onItemSelect, onDelete }) {
  return (
    <Card sx={{ display: "flex", my: 2 }}>
      {item.image && (
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image={item.image}
          alt={item.name}
        />
      )}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent>
          <Typography component="div" variant="h5">
            {item.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            Quantity: {item.quantity}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <Button onClick={() => onItemSelect(item)}>Edit</Button>
          <Button onClick={() => onDelete(item)} color="secondary">
            Delete
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
