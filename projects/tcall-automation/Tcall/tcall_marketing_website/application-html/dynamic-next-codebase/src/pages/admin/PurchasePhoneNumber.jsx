import { useState } from "react";

import { Link } from "react-router-dom";
import usaIcon from "../../assets/images/icons/usa.png"; // Import USA icon
import { useGetPurchasedPhoneNumberQuery } from "../../hooks/api/useGetPurchasedPhoneNumberQuery";
import PurchasedPhoneSearchInput from "../../components/admin/PurchasedPhoneSearchInput";
import BackButton from "../../components/shared/BackButton";
import PurchasedPhoneFilterBy from "../../components/admin/PurchasedPhoneFilterBy";
import PurchasedPhoneList from "../../components/admin/PurchasedPhoneList";
import Pagination from "../../components/shared/Pagination";
import { DEFAULT_PAGE_SIZE } from "../../lib/constants";

const PurchasedPhoneNumbers = () => {
  const [searchParams, setSearchParams] = useState({
    search: "",
    is_active: "",
    page: 1,
  });
  const {
    data: response,
    isPending,
    isError,
  } = useGetPurchasedPhoneNumberQuery(searchParams);

  const handleSearchChange = (search) => {
    setSearchParams((prev) => ({ ...prev, search }));
  };
  const handleFilterChange = (value) => {
    setSearchParams((prev) => ({ ...prev, is_active: value }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <BackButton />
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Purchased Phone Numbers</h2>
      </div>
      <div className="o-dasboard__rightbody o-dasboard__countwrapper o-dasboard__countwrapper--number flex-body">
        <div className="o-dasboard__purchaselist o-dasboard__purchaselist--number">
          <div className="o-dasboard__listwrapper">
            <div className="o-dasboard__listfilter o-dasboard__listfilter--number">
              <PurchasedPhoneSearchInput
                value={searchParams.search}
                onChange={handleSearchChange}
              />
              <PurchasedPhoneFilterBy
                value={searchParams.is_active}
                onChange={handleFilterChange}
              />
            </div>

            <PurchasedPhoneList
              searchParams={searchParams}
              response={response}
              isPending={isPending}
            />
          </div>
          {!isPending && !isError && response?.data?.length > 0 && (
            <Pagination
              currentPage={searchParams.page}
              totalPages={Math.ceil(response?.count / DEFAULT_PAGE_SIZE)}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasedPhoneNumbers;
