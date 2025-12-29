import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField} from "@mui/material";

function SaleDialog(props) {
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="xs">
      <DialogTitle>매출 입력</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="날짜"
          fullWidth
          type="date"
          value={props.dateText}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => props.onChangeDate && props.onChangeDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="매출액"
          fullWidth
          type="number"
          value={props.amount}
          onChange={(e) => props.onChangeAmount(e.target.value)}
        />
        <TextField
          margin="dense"
          label="매출 타입"
          fullWidth
          select
          value={props.saleType}
          onChange={(e) => props.onChangeSaleType(e.target.value)}
        >
          <MenuItem value="card">카드</MenuItem>
          <MenuItem value="cash">현금</MenuItem>
          <MenuItem value="online">온라인</MenuItem>
          <MenuItem value="etc">기타</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>취소</Button>
        <Button variant="contained" onClick={props.onSave}>
          저장
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SaleDialog;