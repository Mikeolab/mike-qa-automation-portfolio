import { Link, useNavigate } from "react-router-dom";
import CustomerSupportBack from "../../assets/images/cusomer-support-back.svg";
import AddBusinessForm from "../../components/customer/AddBusinessForm";
import { useGetBusinessDetailsQuery } from "../../hooks/api/useGetBusinessDetailsQuery";
import { useLayoutEffect } from "react";

const AddBusinessPage = () => {
  const navigate = useNavigate();
  const { data: businessDetails, isPending } = useGetBusinessDetailsQuery();
  console.log({ businessDetails });

  useLayoutEffect(() => {
    // Added business details, But still not approved by admin
    if (businessDetails && businessDetails?.data) {
      navigate("/customer/dashboard/approval-pending");
    }
  }, [businessDetails]);
  if (isPending) {
    return <p className="text-2xl text-center">Loading...</p>;
  }
  return (
    <div className="o-dasboard__rightbar o-general-dashboard">
      <div className="o-dasboard__rightbody flex-body flex-div-ends">
        <img
          src={CustomerSupportBack}
          alt="Customar Support backend"
          className="o-dasboard__pointimage"
        />

        <div className="o-general-dashboard__formwrapper">
          <p className="o-general-dashboard__formtittle text-2xl">
            Please fill up the detail
          </p>
          <AddBusinessForm />
        </div>
      </div>
    </div>
  );
};

export default AddBusinessPage;
