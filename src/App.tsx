import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { InputSelect } from "./components/InputSelect";
import { Instructions } from "./components/Instructions";
import { Transactions } from "./components/Transactions";
import { useEmployees } from "./hooks/useEmployees";
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions";
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee";
import { EMPTY_EMPLOYEE } from "./utils/constants";
import { Employee } from "./utils/types";

export function App() {
  const { data: employees, loading: employeesLoading, ...employeeUtils } = useEmployees();
  const { data: paginatedTransactions, loading: transactionsLoading, ...paginatedTransactionsUtils } = usePaginatedTransactions();
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee();
  const [isFilteredByEmployee, setIsFilteredByEmployee] = useState(false);

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  );

  const loadAllTransactions = useCallback(async (append = false) => {
    transactionsByEmployeeUtils.invalidateData();
    setIsFilteredByEmployee(false);
    await paginatedTransactionsUtils.fetchAll(append);
  }, [paginatedTransactionsUtils, transactionsByEmployeeUtils]);

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData();
      setIsFilteredByEmployee(true);
      await transactionsByEmployeeUtils.fetchById(employeeId);
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  );

  const handleApprovalToggle = useCallback((transactionId, newApprovalStatus) => {
    const transactionKey = `transaction-approval-${transactionId}`;
    sessionStorage.setItem(transactionKey, newApprovalStatus);
  }, []);

  useEffect(() => {
    if (employees === null && !employeesLoading) {
      employeeUtils.fetchAll().then(() => loadAllTransactions());
    }
  }, [employeesLoading, employees, loadAllTransactions, employeeUtils]);

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={employeesLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue && (newValue.id === null || newValue.id === '')) {
              await loadAllTransactions();
            } else {
              await loadTransactionsByEmployee(newValue.id);
            }
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} onApprovalToggle={handleApprovalToggle} />

          {!isFilteredByEmployee && paginatedTransactions?.nextPage !== null && (
            <button
              className="RampButton"
              disabled={transactionsLoading}
              onClick={async () => {
                await loadAllTransactions(true);
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  );
}
