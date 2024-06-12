import { TransactionPane } from "./TransactionPane";
import { TransactionsComponent } from "./types";

export const Transactions: TransactionsComponent = ({ transactions, onApprovalToggle }) => {
  if (transactions === null) {
    return <div className="RampLoading--container">Loading...</div>;
  }

  return (
    <div data-testid="transaction-container">
      {transactions.map((transaction) => (
        <TransactionPane
          key={transaction.id}
          transaction={transaction}
          onApprovalToggle={onApprovalToggle}
        />
      ))}
    </div>
  );
};
