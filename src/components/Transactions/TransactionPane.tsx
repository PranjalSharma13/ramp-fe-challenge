import { useState, useEffect } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";

export const TransactionPane: TransactionPaneComponent = ({ transaction, onApprovalToggle }) => {
  const [approved, setApproved] = useState(() => {
    const storedValue = sessionStorage.getItem(`transaction-approval-${transaction.id}`);
    return storedValue !== null ? JSON.parse(storedValue) : transaction.approved;
  });

  const handleChange = (newValue) => {
    setApproved(newValue);
    onApprovalToggle(transaction.id, newValue);
  };

  return (
    <div className="RampPane">
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant}</p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        onChange={handleChange}
      />
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
