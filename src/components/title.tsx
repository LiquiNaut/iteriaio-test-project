import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export const Title: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  return (
    <Box display="flex" alignItems="center" gap="12px">
      <img src="/favicon.ico" alt="Refine" width="24px" height="24px" />
      {!collapsed && (
        <Typography
          variant="h6"
          fontWeight="700"
          color="inherit"
          style={{ textDecoration: "none" }}
        >
          Iteria.io
        </Typography>
      )}
    </Box>
  );
};
