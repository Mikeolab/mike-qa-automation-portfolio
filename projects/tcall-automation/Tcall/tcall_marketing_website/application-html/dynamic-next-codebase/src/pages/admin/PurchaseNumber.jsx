import { useState } from "react";

import countPurchaseImage from "../../assets/images/count-purchase.svg"; // Import purchase count image
import countPhoneImage from "../../assets/images/count-phone.svg"; // Import count phone image
import { useGetAdminPurchaseNumberQuery } from "../../hooks/api/useGetAdminPurchaseNumberQuery";
import SearchInput from "../../components/admin/SearchInput";
import BackButton from "../../components/shared/BackButton";
import { regions } from "../../lib/regions";
import PurchaseNumberList from "./PurchaseNumberList";
import { Link } from "react-router-dom";
import { DEFAULT_PAGE_SIZE } from "../../lib/constants";
import Pagination from "../../components/shared/Pagination";

const PurchaseNumbers = () => {
  const [searchParams, setSearchParams] = useState({
    contains: "",
    iso_country_code: "",
    area_code: "",
    page: 1,
  });
  const {
    data: response,
    isPending,
    isError,
  } = useGetAdminPurchaseNumberQuery(searchParams);

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearchChange = (name, search) => {
    setSearchParams((prev) => ({ ...prev, [name]: search }));
  };
  const handleFilterChange = (e) => {
    setSearchParams((prev) => ({ ...prev, iso_country_code: e.target.value }));
  };

  return (
    <div className="o-dasboard__rightbar o-dasboard__rightbar--doctordash">
      <BackButton />
      <div className="o-dasboard__rightheading">
        <h2 className="o-dasboard__title">Purchase numbers</h2>
      </div>
      {/* <pre>{JSON.stringify(response?.data, null, 2)}</pre> */}

      <div className="o-dasboard__rightbody o-dasboard__countwrapper flex-body">
        <div className="o-dasboard__purchaselist">
          <p className="o-dasboard__purtoptext">
            Select and purchase phone numbers for AI-powered automated calling
            services, including lead generation and customer support.
          </p>
          <div className="o-dasboard__listwrapper">
            <div className="o-dasboard__listfilter">
              <div className="input-groups">
                <SearchInput
                  name="contains"
                  value={searchParams.contains}
                  onChange={handleSearchChange}
                  title={"Number"}
                />
                {/* <input type="text" className="input-field" /> */}
              </div>
              <div className="input-groups">
                <SearchInput
                  name="area_code"
                  value={searchParams.area_code}
                  onChange={handleSearchChange}
                  title={"Area"}
                />

                {/* <input type="text" className="input-field" /> */}
              </div>
              <div className="input-groups">
                <label>Search by Region</label>
                <select
                  className="input-field input-field--select"
                  onChange={handleFilterChange}
                >
                  <option value="">Select Region</option>
                  {Object.keys(regions).map((item) => {
                    return (
                      <option key={regions[item]} value={regions[item]}>
                        {item}
                      </option>
                    );
                  })}
                  {/* <option>France</option>
                  <option>Germany</option> */}
                </select>
              </div>
            </div>
            <PurchaseNumberList
              response={response}
              isError={isError}
              isPending={isPending}
              searchParams={searchParams}
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
        <div className="o-dasboard__purchasenumber">
          <Link
            to="/admin/dashboard/dashboard-purchase-phone-number"
            className="perchasecount"
          >
            <img src={countPurchaseImage} alt="count purchase" />
            <span className="countnumber">
              {response?.purchase_number_count}
            </span>
            <p>Purchased numbers</p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              xxxxx
              <path
                d="M5 12H19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 5L19 12L12 19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <img src={countPhoneImage} alt="count phone" />
        </div>
      </div>
    </div>
  );
};

export default PurchaseNumbers;
