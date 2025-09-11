import { useLocation, useNavigate } from "react-router-dom";
import { useBuyPlanMutation } from "../../hooks/api/useBuyPlanMutation";
import { useState } from "react";
import BackButton from "../../components/shared/BackButton";

const AddNewBalance = () => {
  const [balance, setBalance] = useState(0);
  const [balanceData, setBalanceData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { data, isPending } = state.state;

  const addBalanceMutation = useBuyPlanMutation({
    onSuccess: (data) => {
      console.log({ planResponse: data });
      //   toast.success(data.message);
      navigate("/customer/dashboard/checkout-plan", { state: data.data });
      //   reset();
      //   closeModal();
    },
  });
  const handleAddBalance = async (e) => {
    e.preventDefault();
    if (!balance) {
      setError("Enter a valid amount to proceed!");
      return false;
    }
    addBalanceMutation.mutate({
      amount: Number(balance),
      payment_type: "add_balance",
    });
  };

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <BackButton />
      <div className="o-dasboard__rightbody flex-body flex-div-start">
        <div className="o-general-dashboard__businesstab o-general-dashboard__businesstab--addbalance editformgroup">
          <div className="o-general-dashboard__headtab">
            <h2 className="o-general-dashboard__businesstitle">
              Amount Balance
            </h2>
          </div>
          <p className="o-general-dashboard__showbal">
            Your available balance:{" "}
            <span>${isPending ? "Loading..." : data?.data?.balance}</span>
          </p>
          <form>
            <div className="o-general-dashboard__businessroll">
              <label htmlFor="amountInput">
                Enter amount to add to your balance:
              </label>
              <p className="label-p">Amount</p>
              <div className="o-general-dashboard__dollersign">
                <input
                  type="text"
                  id="amountInput"
                  className="edit-field edit-field--addbalance"
                  placeholder="Enter Amount"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </div>
              {error && (
                <p className="" style={{ color: "red", fontWeight: "bold" }}>
                  {error}
                </p>
              )}
            </div>
            <button
              className="o-general-dashboard__addbalbtn"
              onClick={handleAddBalance}
            >
              {addBalanceMutation.isPending ? "Loading..." : <>ADD</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddNewBalance;
